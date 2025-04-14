"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"

export function Nav() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Load cart count from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const cartItems = JSON.parse(savedCart)
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(totalItems)
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const cartItems = JSON.parse(savedCart)
        const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartCount(totalItems)
      } else {
        setCartCount(0)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            Zermy
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              Məhsullar
            </Link>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary">
              Əlaqə
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 hover:bg-accent rounded-full">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
} 