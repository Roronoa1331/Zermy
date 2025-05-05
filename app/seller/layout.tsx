"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store, Package, ShoppingCart, MessageSquare, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Mağazam",
    href: "/seller",
    icon: Store
  },
  {
    name: "Məhsullar",
    href: "/seller/products",
    icon: Package
  },
  {
    name: "Sifarişlər",
    href: "/seller/orders",
    icon: ShoppingCart
  },
  {
    name: "Mesajlar",
    href: "/seller/messages",
    icon: MessageSquare
  },
  {
    name: "Tənzimləmələr",
    href: "/seller/settings",
    icon: Settings
  }
]

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-background border-r flex flex-col transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className={cn(
            "font-bold transition-all duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          )}>
            Satıcı Paneli
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn(
                  "transition-all duration-300",
                  isCollapsed ? "opacity-0 w-0" : "opacity-100"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 