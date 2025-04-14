"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

// Product data
const products = [
  {
    id: 1,
    name: "Çanta 🟢",
    price: 50.00,
    image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
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
    id: 6,
    name: "Şam",
    price: 7.00,
    image: "https://cdn.shopify.com/s/files/1/2219/6397/files/Bamboo_Candle_copy_1024x1024.png?v=1698242921",
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

function CartContent() {
  const searchParams = useSearchParams()
  const [cartItems, setCartItems] = useState<Array<typeof products[0] & { quantity: number }>>([])

  // Load cart data from API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart')
        const cartData = await response.json()
        
        // Map cart data to full product information
        const itemsWithDetails = cartData.map((item: any) => {
          const product = products.find(p => p.id === item.id)
          return product ? { ...product, quantity: item.quantity } : null
        }).filter(Boolean)

        setCartItems(itemsWithDetails)
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      }
    }

    fetchCart()
  }, [])

  // Handle adding items to cart
  useEffect(() => {
    const productId = searchParams.get('add')
    if (productId) {
      const addToCart = async () => {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              productId: Number(productId), 
              action: 'add'
            })
          })
          // Refresh cart data
          const response = await fetch('/api/cart')
          const cartData = await response.json()
          const itemsWithDetails = cartData.map((item: any) => {
            const product = products.find(p => p.id === item.id)
            return product ? { ...product, quantity: item.quantity } : null
          }).filter(Boolean)
          setCartItems(itemsWithDetails)
        } catch (error) {
          console.error('Failed to add to cart:', error)
        }
      }
      addToCart()
    }
  }, [searchParams])

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, action: 'update', quantity: newQuantity })
      })
      // Refresh cart data
      const response = await fetch('/api/cart')
      const cartData = await response.json()
      const itemsWithDetails = cartData.map((item: any) => {
        const product = products.find(p => p.id === item.id)
        return product ? { ...product, quantity: item.quantity } : null
      }).filter(Boolean)
      setCartItems(itemsWithDetails)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const removeItem = async (id: number) => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, action: 'remove' })
      })
      // Refresh cart data
      const response = await fetch('/api/cart')
      const cartData = await response.json()
      const itemsWithDetails = cartData.map((item: any) => {
        const product = products.find(p => p.id === item.id)
        return product ? { ...product, quantity: item.quantity } : null
      }).filter(Boolean)
      setCartItems(itemsWithDetails)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Səbətim</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center space-y-4">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="text-xl text-muted-foreground">Səbətiniz boşdur</p>
            <Button asChild>
              <Link href="/products">Məhsullara bax</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-muted-foreground">{item.price.toFixed(2)} ₼</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button 
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button 
                      className="h-8 w-8 p-0"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Ümumi məbləğ:</span>
                <span className="text-xl font-bold">{total.toFixed(2)} ₼</span>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/checkout">
                  Sifarişi tamamla
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Loading...</div>}>
      <CartContent />
    </Suspense>
  )
} 