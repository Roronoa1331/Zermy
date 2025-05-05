import { NextResponse } from "next/server"
import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(req: Request) {
  try {
    const { items, customer } = await req.json()

    // Calculate total amount
    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: "usd",
      metadata: {
        items: JSON.stringify(items),
      },
    })

    // Create customer if not exists
    let stripeCustomer
    try {
      stripeCustomer = await stripe.customers.create({
        name: customer.name,
        email: customer.email,
        address: customer.address,
      })
    } catch (error) {
      console.error("Error creating customer:", error)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      customer: stripeCustomer?.id,
      metadata: {
        items: JSON.stringify(items),
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
} 