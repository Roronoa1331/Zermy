"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Redirect if not logged in
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/checkout");
      return;
    }
    
    // Fetch cart items
    const fetchCart = async () => {
      try {
        // Mock cart data for now since cart API might not exist
        const mockCartItems: CartItem[] = [
          {
            id: "1",
            name: "Sample Product",
            price: 25.99,
            quantity: 1,
            image: "/placeholder.jpg"
          }
        ];
        setCartItems(mockCartItems);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Could not load your cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (status === "authenticated") {
      fetchCart();
    } else if (status === "loading") {
      // Still checking session
      return;
    } else {
      setLoading(false);
    }
  }, [status, router, mounted]);
  
  // Don't render anything until mounted (prevents SSR issues)
  if (!mounted) {
    return <div className="container py-16 text-center">Loading...</div>;
  }
  
  // Handle loading state
  if (loading || status === "loading") {
    return <div className="container py-16 text-center">Loading checkout information...</div>;
  }
  
  if (error) {
    return (
      <div className="container py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    );
  }
  
  if (!cartItems.length) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    );
  }
  
  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10; // Example shipping cost
  const total = subtotal + shipping;
  
  // Handle checkout
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Could not load Stripe");
      
      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });
      
      const sessionData = await response.json();
      
      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionData.id,
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Payment could not be processed. Please try again.");
    }
  };
  
  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your items before checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <div className="flex justify-between pt-2">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Enter your shipping and payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleCheckout} 
                type="button"
              >
                Proceed to Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}