import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const headersList = headers()
    const userId = headersList.get("x-user-id")

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is a seller
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
      },
    })

    if (!user || user.role !== "SELLER") {
      return NextResponse.json({ error: "Unauthorized - Not a seller" }, { status: 401 })
    }

    // Get total products
    const totalProducts = await prisma.product.count({
      where: {
        sellerId: userId,
      },
    })

    // Get total orders
    const orderCount = await prisma.orderItem.count({
      where: {
        sellerId: userId,
      },
    })

    // Get pending orders
    const pendingCount = await prisma.orderItem.count({
      where: {
        sellerId: userId,
        status: "PENDING",
      },
    })

    // Get total revenue
    const revenueData = await prisma.orderItem.aggregate({
      where: {
        sellerId: userId,
        status: {
          in: ["DELIVERED", "SHIPPED"],
        },
      },
      _sum: {
        sellerPayout: true,
      },
    })

    return NextResponse.json({
      totalProducts,
      totalOrders: orderCount,
      pendingOrders: pendingCount,
      revenue: revenueData._sum.sellerPayout || 0,
    })
  } catch (error) {
    console.error("Error fetching seller stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 