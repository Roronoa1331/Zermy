import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export const runtime = 'nodejs';

// Get all products for the current seller
export async function GET() {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'İstifadəçi avtorizasiya olmayıb' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'İstifadəçi tapılmadı' },
        { status: 404 }
      );
    }

    if (user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Bu əməliyyat yalnız satıcılar üçün mövcuddur' },
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error in /api/seller/products GET:', error);
    return NextResponse.json(
      { error: 'Server xətası' },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'İstifadəçi avtorizasiya olmayıb' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'İstifadəçi tapılmadı' },
        { status: 404 }
      );
    }

    if (user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Bu əməliyyat yalnız satıcılar üçün mövcuddur' },
        { status: 403 }
      );
    }

    const { name, description, price, image, modelUrl, hasAR, features } = await request.json();

    // Validate input
    if (!name || !description || !price || !image) {
      return NextResponse.json(
        { error: 'Bütün tələb olunan sahələr doldurulmalıdır' },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image,
        modelUrl: modelUrl || null,
        hasAR: hasAR || false,
        features: features || [],
        sellerId: user.id,
      },
    });

    return NextResponse.json({
      product,
      message: 'Məhsul uğurla əlavə edildi'
    });
  } catch (error) {
    console.error('Error in /api/seller/products POST:', error);
    return NextResponse.json(
      { error: 'Server xətası' },
      { status: 500 }
    );
  }
} 