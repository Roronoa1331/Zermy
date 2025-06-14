import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'İstifadəçi avtorizasiya olmayıb' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string };
    
    const { name, email, currentPassword, newPassword } = await request.json();

    // Get the user
    const user = await (prisma as any).user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'İstifadəçi tapılmadı' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await (prisma as any).user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Bu email artıq istifadə olunur' },
          { status: 400 }
        );
      }
    }

    // If password change is requested
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Cari şifrə yanlışdır' },
          { status: 401 }
        );
      }

      // Hash new password
      const hashedPassword = await hash(newPassword, 12);

      // Update user with new password
      const updatedUser = await (prisma as any).user.update({
        where: { id: decoded.id },
        data: {
          name,
          email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return NextResponse.json({ user: updatedUser });
    } else {
      // Update user without changing password
      const updatedUser = await (prisma as any).user.update({
        where: { id: decoded.id },
        data: {
          name,
          email
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return NextResponse.json({ user: updatedUser });
    }
  } catch (error) {
    console.error('Error in /api/auth/update-profile:', error);
    return NextResponse.json(
      { error: 'Server xətası' },
      { status: 500 }
    );
  }
}