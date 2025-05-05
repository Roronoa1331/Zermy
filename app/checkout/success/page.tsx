"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (!sessionId) {
      setError("No session ID found")
      setLoading(false)
      return
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/checkout-session?session_id=${sessionId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch order details")
        }

        setOrderDetails(data)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError(err instanceof Error ? err.message : "Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Return to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">Thank You for Your Order!</CardTitle>
          <CardDescription>
            Your order has been successfully placed and confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Order Number:</span>
              <span>{orderDetails?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(orderDetails?.created * 1000).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span>${(orderDetails?.amount_total / 100).toFixed(2)}</span>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation email to {orderDetails?.customer_details?.email}
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => router.push("/orders")}>
              View Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 