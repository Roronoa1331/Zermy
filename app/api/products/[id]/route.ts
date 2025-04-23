import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define the Çanta product
const CANTA_PRODUCT = {
  id: "canta-fallback",
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // If the ID is canta-fallback, return the fallback product
    if (params.id === 'canta-fallback') {
      return NextResponse.json({ product: CANTA_PRODUCT });
    }

    // Check if Çanta is requested by name
    if (params.id.toLowerCase().includes('çanta')) {
      // Try to find Çanta in the database
      const cantaProduct = await prisma.product.findFirst({
        where: {
          name: {
            contains: 'Çanta',
            mode: 'insensitive'
          }
        }
      });

      if (cantaProduct) {
        return NextResponse.json({ product: cantaProduct });
      }

      // If not found, return the fallback product
      return NextResponse.json({ product: CANTA_PRODUCT });
    }

    // For other products, fetch from the database
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Məhsul tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Məhsulu yükləmək mümkün olmadı' },
      { status: 500 }
    );
  }
} 