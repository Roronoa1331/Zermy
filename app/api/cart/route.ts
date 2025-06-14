import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

// Product data for cart functionality
const products = [
  {
    id: 1,
    name: "Çanta 🟢",
    price: 50.00,
    image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
  },
  {
    id: 6,
    name: "Şam",
    price: 7.00,
    image: "https://cdn.shopify.com/s/files/1/2219/6397/files/Bamboo_Candle_copy_1024x1024.png?v=1698242921",
  },
  {
    id: 2,
    name: "Xalça",
    price: 300.00,
    image: "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/cde13f96-75ba-4b9f-87c5-1257b41cbfef._SL480_.jpg",
  },
  {
    id: 3,
    name: "Papaq",
    price: 30.00,
    image: "https://coalheadwear.com/cdn/shop/files/2202258_SAG_P_1.jpg?v=1726529581&width=900",
  },
  {
    id: 4,
    name: "Kepka🟢",
    price: 40.00,
    image: "https://images.squarespace-cdn.com/content/v1/55ccebf2e4b03e8de40a82ba/1675841523209-X7RJ8KEC4CVQUZ74C2RG/Topiku-10.jpg",
  },
  {
    id: 5,
    name: "Ayaqqabı 🟢",
    price: 120.00,
    image: "https://static.fibre2fashion.com/newsresource/images/249/tea_261031.jpg",
  },
  {
    id: 7,
    name: "Şampun",
    price: 34.00,
    image: "https://m.media-amazon.com/images/I/61Jcsp2JWOL.jpg",
  },
  {
    id: 8,
    name: "Çanta",
    price: 15.00,
    image: "https://lie-studio.dk/cdn/shop/files/Canvas_tote_1.jpg?v=1731332002&width=1946",
  },
  {
    id: 9,
    name: "Tumbler",
    price: 25.00,
    image: "https://jucycorporategifts.com/cdn/shop/files/GlassSipper.png?v=1706597815",
  }
]

// Simple in-memory cart storage
let cartStorage: { [userId: string]: { id: number; quantity: number }[] } = {}

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    const userId = session?.user?.id || 'anonymous'
    
    const cartItems = cartStorage[userId] || []
    
    // Return cart items with full product details
    const cartWithDetails = cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.id)
      return product ? { ...product, quantity: cartItem.quantity } : null
    }).filter(Boolean)
    
    return NextResponse.json(cartWithDetails)
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
    const session = await getServerSession()
    const userId = session?.user?.id || 'anonymous'
    
    const { productId, action, quantity } = await request.json()

    if (!cartStorage[userId]) {
      cartStorage[userId] = []
    }

    const cart = cartStorage[userId]
    const existingItemIndex = cart.findIndex(item => item.id === productId)

    switch (action) {
      case 'add':
        if (existingItemIndex >= 0) {
          cart[existingItemIndex].quantity += 1
        } else {
          cart.push({ id: productId, quantity: 1 })
        }
        break
      
      case 'update':
        if (existingItemIndex >= 0) {
          cart[existingItemIndex].quantity = quantity
        }
        break
      
      case 'remove':
        if (existingItemIndex >= 0) {
          cart.splice(existingItemIndex, 1)
        }
        break
    }

    // Return the updated cart with product details
    const cartWithDetails = cart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.id)
      return product ? { ...product, quantity: cartItem.quantity } : null
    }).filter(Boolean)

    return NextResponse.json({ success: true, cart: cartWithDetails })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}