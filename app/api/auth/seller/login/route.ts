import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email və şifrə tələb olunur' },
        { status: 400 }
      );
    }
    
    // Only allow admin123/admin123 access
    if (email !== 'admin123' || password !== 'admin123') {
      return NextResponse.json(
        { error: 'Yanlış giriş məlumatları' },
        { status: 401 }
      );
    }
    
    // Create mock admin user
    const adminUser = {
      id: 'admin-123',
      name: 'Admin',
      email: 'admin123',
      role: 'SELLER'
    };
    
    const token = sign(
      { id: adminUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    });
    
    return NextResponse.json({ user: adminUser });
  } catch (error) {
    console.error('Error in /api/auth/seller/login:', error);
    return NextResponse.json(
      { error: 'Server xətası' },
      { status: 500 }
    );
  }
}