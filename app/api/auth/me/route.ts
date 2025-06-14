import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token tapılmadı' }, { status: 401 });
    }

    const decoded = verify(token.value, process.env.JWT_SECRET!) as { id: string };
    
    // Return mock admin user for admin-123 id
    if (decoded.id === 'admin-123') {
      const adminUser = {
        id: 'admin-123',
        name: 'Admin',
        email: 'admin123',
        role: 'SELLER'
      };
      return NextResponse.json({ user: adminUser });
    }

    return NextResponse.json({ error: 'İstifadəçi tapılmadı' }, { status: 404 });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}