import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ProductData {
  name: string;
  description: string;
  price: number;
  image: string;
  modelUrl?: string;
  hasAR: boolean;
  features: string[];
  sellerId?: string;
}

// Define the Çanta product as a constant to ensure it's always available
const CANTA_PRODUCT: ProductData = {
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
  ]
};

export async function GET() {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Check if Çanta exists in the database
    const cantaExists = products.some((p) => p.name.toLowerCase().includes('çanta'));
    
    // If Çanta doesn't exist, create it
    if (!cantaExists) {
      try {
        await prisma.product.create({
          data: {
            ...CANTA_PRODUCT,
            sellerId: process.env.ADMIN_USER_ID || 'admin' // Use an admin user ID
          }
        });
        
        // Fetch updated products list
        const updatedProducts = await prisma.product.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        return NextResponse.json({ products: updatedProducts });
      } catch (createError) {
        console.error('Error creating Çanta product:', createError);
        // If we can't create it, we'll still return the existing products
      }
    }

    // Return all products
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Məhsulları yükləmək mümkün olmadı' },
      { status: 500 }
    );
  }
} 