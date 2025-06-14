"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface Category {
  id: string
  name: string
  description?: string
  image?: string
  productCount?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Mock categories for now since we don't have the API yet
        const mockCategories: Category[] = [
          {
            id: "1",
            name: "Çanta",
            description: "Eko-dostu və davamlı çantalar",
            image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
            productCount: 15
          },
          {
            id: "2", 
            name: "Bitkilər",
            description: "Təbii və süni bitkilər",
            image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
            productCount: 8
          },
          {
            id: "3",
            name: "Ev Aksesuarları", 
            description: "Yaşıl həyat üçün aksesuarlar",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
            productCount: 12
          },
          {
            id: "4",
            name: "Bağçılıq",
            description: "Bağçılıq alətləri və materialları",
            image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
            productCount: 6
          }
        ]
        setCategories(mockCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Kateqoriyalar yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Kateqoriyalar</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Yaşıl həyat üçün müxtəlif məhsul kateqoriyalarını kəşf edin
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.name.toLowerCase()}`}>
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="p-0">
                  {category.image && (
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <Badge variant="secondary">
                        {category.productCount} məhsul
                      </Badge>
                    </div>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
