import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/auth',
  '/products',
  '/api/auth/login',
  '/api/auth/register',
  '/api/cart',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get('token')

  if (!token || !token.value) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  try {
    // Verify the token
    const decoded = verify(token.value, process.env.JWT_SECRET || 'fallback-secret') as { id: string, role: string }
    
    // Check role-based access
    if (pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (pathname.startsWith('/seller') && decoded.role !== 'SELLER') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Token verification failed:', error)
    return NextResponse.redirect(new URL('/auth', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}