import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email və şifrə tələb olunur' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await (prisma as any).user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'İstifadəçi artıq mövcuddur' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    // Create new user
    const newUser = await (prisma as any).user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER'
      }
    });

    const token = sign(
      { id: newUser.id },
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

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error in /api/auth/signup:', error);
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}