import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// In-memory storage for cart data (replace with database in production)
let cartData: { id: number; quantity: number }[] = []

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get product details for items in cart
    const items = await Promise.all(
      cartData.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.id.toString() },
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        })

        if (!product) {
          return null
        }

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
        }
      })
    )

    // Filter out any null items (products that no longer exist)
    const validItems = items.filter((item): item is NonNullable<typeof item> => item !== null)

    return NextResponse.json({ items: validItems })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, action, quantity } = body

    // Validate request body
    if (productId === undefined || productId === null) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Convert productId to number if it's a string
    const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId
    if (isNaN(productIdNum)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Find the product in the cart
    const existingItemIndex = cartData.findIndex(item => item.id === productIdNum)

    if (action === 'add') {
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cartData[existingItemIndex].quantity += 1
      } else {
        // Add new item to cart with quantity 1
        cartData.push({ id: productIdNum, quantity: 1 })
      }
    } else if (action === 'remove') {
      if (existingItemIndex !== -1) {
        // Remove item from cart
        cartData = cartData.filter(item => item.id !== productIdNum)
      }
    } else if (action === 'update') {
      if (!quantity || typeof quantity !== 'number' || quantity < 1) {
        return NextResponse.json(
          { error: 'Valid quantity is required for update action' },
          { status: 400 }
        )
      }
      if (existingItemIndex !== -1) {
        // Update item quantity
        cartData[existingItemIndex].quantity = quantity
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action specified' },
        { status: 400 }
      )
    }

    // Get updated cart with product details
    const items = await Promise.all(
      cartData.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.id.toString() },
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        })

        if (!product) {
          return null
        }

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
        }
      })
    )

    // Filter out any null items (products that no longer exist)
    const validItems = items.filter((item): item is NonNullable<typeof item> => item !== null)

    return NextResponse.json({ items: validItems })
  } catch (error) {
    console.error('Cart error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
} 