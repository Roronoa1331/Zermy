import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { type Product } from '@prisma/client';

export async function GET() {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Ensure Şam and Çanta are always included
    const essentialProducts = products.filter((p: Product) => 
      p.name.toLowerCase().includes('şam') || 
      p.name.toLowerCase().includes('çanta')
    );

    if (essentialProducts.length < 2) {
      // If essential products are missing, create them
      const missingProducts = [];
      
      if (!products.some((p: Product) => p.name.toLowerCase().includes('çanta'))) {
        missingProducts.push({
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
        });
      }
      
      if (!products.some((p: Product) => p.name.toLowerCase().includes('şam'))) {
        missingProducts.push({
          name: "Şam",
          price: 7.00,
          image: "https://cdn.shopify.com/s/files/1/2219/6397/files/Bamboo_Candle_copy_1024x1024.png?v=1698242921",
          description: "Təbii materiallardan hazırlanmış, uzun yanma müddəti olan şam. Evinizə rahatlıq və istilik gətirir.",
          modelUrl: "/models/products/candle/candle.glb",
          hasAR: true,
          features: [
            "Təbii bal mumu",
            "Uzun yanma müddəti",
            "Ətraf mühitə zərərsiz",
            "Xoş qoxu"
          ]
        });
      }

      // Add missing essential products to the database
      if (missingProducts.length > 0) {
        await prisma.product.createMany({
          data: missingProducts.map(product => ({
            ...product,
            sellerId: process.env.ADMIN_USER_ID || 'admin' // Use an admin user ID
          }))
        });

        // Fetch updated products list
        const updatedProducts = await prisma.product.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });

        return NextResponse.json({ products: updatedProducts });
      }
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Məhsulları yükləmək mümkün olmadı' },
      { status: 500 }
    );
  }
} 