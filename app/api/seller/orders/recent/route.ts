import { NextResponse } from "next/server"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

type OrderItemWithRelations = Prisma.OrderItemGetPayload<{
  include: {
    product: {
      select: {
        name: true
      }
    }
    order: {
      include: {
        buyer: {
          select: {
            name: true
          }
        }
      }
    }
  }
}>

export async function GET() {
  try {
    const headersList = headers()
    const userId = headersList.get("user-id")
    const userRole = headersList.get("user-role")

    if (!userId || userRole !== "SELLER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get recent orders
    const recentOrders = await prisma.orderItem.findMany({
      where: {
        sellerId: userId
      },
      include: {
        product: {
          select: {
            name: true
          }
        },
        order: {
          include: {
            buyer: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    })

    // Format orders for response
    const formattedOrders = recentOrders.map((item: OrderItemWithRelations) => ({
      id: item.id,
      productName: item.product.name,
      customerName: item.order.buyer.name || "Unknown Customer",
      amount: item.unitPrice * item.quantity,
      status: item.status,
      date: item.createdAt.toISOString()
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    )
  }
} 