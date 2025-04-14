import { NextResponse } from 'next/server'

// In-memory storage for cart data (replace with database in production)
let cartData: any[] = []

export async function GET() {
  return NextResponse.json(cartData)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, action, quantity } = body

    // Find the product in the cart
    const existingItem = cartData.find(item => item.id === productId)

    if (action === 'add') {
      if (existingItem) {
        // Update quantity if item exists
        cartData = cartData.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Add new item to cart with quantity 1
        //cartData.push({ id: productId, quantity: 1 }) code was like that previous
        cartData.push({ id: productId, quantity: 0 })
      }
    } else if (action === 'remove') {
      // Remove item from cart
      cartData = cartData.filter(item => item.id !== productId)
    } else if (action === 'update') {
      if (existingItem) {
        // Update item quantity
        cartData = cartData.map(item => 
          item.id === productId 
            ? { ...item, quantity }
            : item
        )
      }
    }

    return NextResponse.json(cartData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
} 