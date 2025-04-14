"use client"

import Link from "next/link"
import { ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

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
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

