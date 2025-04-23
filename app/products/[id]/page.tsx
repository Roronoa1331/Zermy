"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  hasAR: boolean;
}

// Define the Çanta product as a fallback
const CANTA_PRODUCT: Product = {
  id: "canta-fallback",
  name: "Çanta 🟢",
  price: 50.00,
  image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
  description: "Eko-dostu materiallardan hazırlanmış, davamlı və şık çanta. Gündəlik istifadə üçün ideal.",
  features: [
    "100% təbii material",
    "Suyadavamlı",
    "Yüngül və rahat",
    "Çoxməqsədli dizayn"
  ],
  hasAR: true
};

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // If the ID is canta-fallback, use the fallback product
        if (params.id === 'canta-fallback') {
          setProduct(CANTA_PRODUCT);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Məhsulu yükləmək mümkün olmadı')
        }
        
        setProduct(data.product)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Məhsulu yükləmək mümkün olmadı')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="container py-16">
        <div className="text-center">Yüklənir...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Məhsul tapılmadı</h1>
          <Button asChild className="mt-4">
            <Link href="/products">Məhsullara qayıt</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-semibold mt-2">{product.price.toFixed(2)} ₼</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Məhsul haqqında</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
              </div>
              
              {product.features && product.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold">Xüsusiyyətlər</h2>
                  <ul className="list-disc list-inside mt-2 space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button asChild className="w-full">
              <Link href={`/cart?add=${product.id}`}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Səbətə əlavə et
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 