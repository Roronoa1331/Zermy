import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold">Tezliklə</h1>
          <p className="text-xl text-muted-foreground">
            Sifariş funksionallığı tezliklə aktivləşdiriləcək
          </p>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/products">
              Məhsullara qayıt
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cart">
              Səbətə qayıt
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 