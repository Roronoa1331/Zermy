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

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get total stores
    const totalStores = await prisma.store.count({
      where: {
        isActive: true,
      },
    });

    // Get total orders
    const totalOrders = await prisma.order.count({
      where: {
        status: {
          in: ['DELIVERED', 'SHIPPED'],
        },
      },
    });

    // Get total revenue
    const revenueData = await prisma.orderItem.aggregate({
      where: {
        status: {
          in: ['DELIVERED', 'SHIPPED'],
        },
      },
      _sum: {
        unitPrice: true,
      },
    });

    return NextResponse.json({
      totalUsers,
      totalStores,
      totalOrders,
      totalRevenue: revenueData._sum.unitPrice || 0,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 