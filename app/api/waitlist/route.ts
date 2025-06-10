import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, surname, email, phone } = await req.json();

    if (!name || !surname || !email || !phone) {
      return NextResponse.json(
        { error: "Bütün sahələr doldurulmalıdır" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.waitlist.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email artıq qeydiyyatdan keçirilib" },
        { status: 400 }
      );
    }

    // Create new waitlist entry
    await prisma.waitlist.create({
      data: {
        name,
        surname,
        email,
        phone
      }
    });

    // Get the total count
    const count = await prisma.waitlist.count();

    return NextResponse.json(
      { success: true, count },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return NextResponse.json(
      { error: "Qeydiyyat prosesində xəta baş verdi" },
      { status: 500 }
    );
  } finally {
    // Disconnect from the database to prevent connection pooling issues
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const count = await prisma.waitlist.count();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    return NextResponse.json(
      { error: "Waitlist sayını əldə etmək alınmadı", count: 0 },
      { status: 200 }  // Return 200 even with error so the frontend doesn't break
    );
  } finally {
    await prisma.$disconnect();
  }
}