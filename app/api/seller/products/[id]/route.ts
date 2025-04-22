import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export const runtime = 'nodejs';

// Get a specific product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Məhsul tapılmadı' },
        { status: 404 }
      );
    }

    if (product.sellerId !== user.id) {
      return NextResponse.json(
        { error: 'Bu məhsula giriş icazəniz yoxdur' },
        { status: 403 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error in /api/seller/products/[id] GET:', error);
    return NextResponse.json(
      { error: 'Server xətası' },
      { status: 500 }
    );
  }
}

// Update a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Məhsul tapılmadı' },
        { status: 404 }
      );
    }

    if (product.sellerId !== user.id) {
      return NextResponse.json(
        { error: 'Bu məhsulu yeniləmək icazəniz yoxdur' },
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

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        image,
        modelUrl: modelUrl || null,
        hasAR: hasAR || false,
        features: features || [],
      },
    });

    return NextResponse.json({
      product: updatedProduct,
      message: 'Məhsul uğurla yeniləndi'
    });
  } catch (error) {
    console.error('Error in /api/seller/products/[id] PUT:', error);
    return NextResponse.json(
      { error: 'Server xətası' },
      { status: 500 }
    );
  }
}

// Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Məhsul tapılmadı' },
        { status: 404 }
      );
    }

    if (product.sellerId !== user.id) {
      return NextResponse.json(
        { error: 'Bu məhsulu silmək icazəniz yoxdur' },
        { status: 403 }
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Məhsul uğurla silindi'
    });
  } catch (error) {
    console.error('Error in /api/seller/products/[id] DELETE:', error);
    return NextResponse.json(
      { error: 'Server xətası' },
      { status: 500 }
    );
  }
} 