import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define the Çanta product
const CANTA_PRODUCT = {
  name: "Çanta 🟢",
  price: 50.00,
  image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
  description: "Eko-dostu materiallardan hazırlanmış, davamlı və şık çanta. Gündəlik istifadə üçün ideal.",
  modelUrl: "/models/products/bag/bag.glb",
  hasAR: true,
  features: [
    "100% təbii material",
    "Suyadavamlı",
    "Yüngül və rahat",
    "Çoxməqsədli dizayn"
  ],
  sellerId: process.env.ADMIN_USER_ID || 'admin'
};

export async function GET() {
  try {
    // Check if Çanta already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          contains: 'Çanta',
          mode: 'insensitive'
        }
      }
    });

    if (existingProduct) {
      return NextResponse.json({ product: existingProduct });
    }

    // Create Çanta product if it doesn't exist
    const newProduct = await prisma.product.create({
      data: CANTA_PRODUCT
    });

    return NextResponse.json({ product: newProduct });
  } catch (error) {
    console.error('Error with Çanta product:', error);
    return NextResponse.json(
      { error: 'Məhsul yaradılması mümkün olmadı' },
      { status: 500 }
    );
  }
} 