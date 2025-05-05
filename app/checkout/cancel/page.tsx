"use client"

import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">Order Cancelled</CardTitle>
          <CardDescription>
            Your order was not completed. You can try again or return to your cart.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button onClick={() => router.push("/cart")}>
            Return to Cart
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 