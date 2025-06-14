import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // For now, just return mock data since we don't have a Cart model yet
    return NextResponse.json({
      items: [
        {
          id: 'product-1',
          name: 'Eco-Friendly Plant Pot',
          price: 24.99,
          quantity: 2,
          image: '/images/products/pot.jpg',
        },
        {
          id: 'product-2',
          name: 'Organic Plant Food',
          price: 12.99,
          quantity: 1,
          image: '/images/products/food.jpg',
        },
      ],
    })

    // Once you have cart functionality:
    /*
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: true
      }
    });
    
    const items = cartItems.map(item => ({
      id: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));
    
    return NextResponse.json({ items });
    */
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}