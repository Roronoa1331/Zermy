"use client"

import Link from "next/link"
import { ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setIsLoggedIn(true)
      const user = JSON.parse(currentUser)
      setUserName(user.name)
    } else {
      setIsLoggedIn(false)
      setUserName("")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setIsLoggedIn(false)
    setUserName("")
    router.push('/')
  }

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-semibold font-montserrat">
          ZERMY
        </Link>

        <div className="flex items-center space-x-8">
          <Link 
            href="/" 
            className={`${pathname === "/" ? "font-semibold" : "text-muted-foreground"}`}
          >
            Əsas
          </Link>
          <Link 
            href="/products" 
            className={`${pathname === "/products" ? "font-semibold" : "text-muted-foreground"}`}
          >
            Məhsullar
          </Link>
          <Link 
            href="/contacts" 
            className={`${pathname === "/contacts" ? "font-semibold" : "text-muted-foreground"}`}
          >
            Əlaqə
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative p-2 hover:bg-accent rounded-full">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{userName}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="ghost" size="icon">
              <Link href="/auth">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

