import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This should be protected with authentication in production
export async function GET() {
  try {
    const entries = await prisma.waitlist.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error fetching waitlist entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist entries" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}