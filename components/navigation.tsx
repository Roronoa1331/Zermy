import Link from "next/link"
import { ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-semibold font-montserrat">
          ZERMY
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="font-medium">
            Əsas
          </Link>
          <Link href="/products" className="text-muted-foreground">
            Məhsullar
          </Link>
          <Link href="/contacts" className="text-muted-foreground">
            Əlaqə
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

