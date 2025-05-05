import { NextResponse } from 'next/server'

// In-memory storage for cart data (replace with database in production)
let cartData: { id: number; quantity: number }[] = []

export async function GET() {
  try {
    return NextResponse.json(cartData)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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

    return NextResponse.json(cartData)
  } catch (error) {
    console.error('Cart error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
} 