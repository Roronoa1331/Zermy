import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        buyer: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get recent stores
    const recentStores = await prisma.store.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        seller: {
          select: {
            name: true,
          },
        },
      },
    });

    // Format activities
    const activities = [
      ...recentOrders.map((order) => ({
        id: order.id,
        type: 'ORDER',
        description: `New order from ${order.buyer.name || 'Anonymous'}`,
        date: order.createdAt.toISOString(),
      })),
      ...recentStores.map((store) => ({
        id: store.id,
        type: 'STORE',
        description: `New store created by ${store.seller.name || 'Anonymous'}`,
        date: store.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
     .slice(0, 10);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 