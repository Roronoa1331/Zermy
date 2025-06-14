"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function Nav() {
  const [cartCount, setCartCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const updateCartCount = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const cartItems = await response.json()
        const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartCount(totalItems)
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error)
    }
  }

  useEffect(() => {
    // Load initial cart count
    updateCartCount()

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount()
    }

    // Add event listener for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    // Poll for cart updates every 5 seconds as fallback
    const interval = setInterval(updateCartCount, 5000)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      clearInterval(interval)
    }
  }, [])

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            Zermy
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              Məhsullar
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary">
              Kateqoriyalar
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              Haqqımızda
            </Link>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary">
              Əlaqə
            </Link>
            <Link href="/seller" className="text-sm font-medium hover:text-primary">
              Satıcı
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:bg-accent rounded-full">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth buttons */}
          <Link href="/auth">
            <Button variant="outline" size="sm">
              Daxil ol
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-2">
            <Link 
              href="/products" 
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Məhsullar
            </Link>
            <Link 
              href="/categories" 
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Kateqoriyalar
            </Link>
            <Link 
              href="/about" 
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Haqqımızda
            </Link>
            <Link 
              href="/contacts" 
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Əlaqə
            </Link>
            <Link 
              href="/seller" 
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Satıcı
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}