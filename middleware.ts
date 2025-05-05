import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/auth',
  '/products',
  '/api/auth/login',
  '/api/auth/register',
]

// Role-based path access
const roleBasedPaths = {
  ADMIN: ['/admin', '/api/admin'],
  SELLER: ['/seller', '/api/seller'],
  BUYER: ['/cart', '/orders', '/api/orders'],
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if path is public
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  try {
    // Verify and decode token
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      id: string
      role: 'ADMIN' | 'SELLER' | 'BUYER'
    }

    // Check role-based access
    const hasAccess = Object.entries(roleBasedPaths).some(([role, paths]) => {
      if (decoded.role === role) {
        return paths.some(p => path.startsWith(p))
      }
      return false
    })

    if (!hasAccess) {
      // If user doesn't have access, redirect to appropriate dashboard
      switch (decoded.role) {
        case 'ADMIN':
          return NextResponse.redirect(new URL('/admin', request.url))
        case 'SELLER':
          return NextResponse.redirect(new URL('/seller', request.url))
        case 'BUYER':
          return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Add user info to headers for API routes
    if (path.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('user-id', decoded.id)
      requestHeaders.set('user-role', decoded.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return NextResponse.next()
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    const response = NextResponse.redirect(new URL('/auth', request.url))
    response.cookies.delete('token')
    return response
  }
}

// Configure paths that should be checked by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 