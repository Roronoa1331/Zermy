import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "line_items"],
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error fetching checkout session:", error)
    return NextResponse.json(
      { error: "Failed to fetch checkout session" },
      { status: 500 }
    )
  }
} 