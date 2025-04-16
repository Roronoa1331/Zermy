"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Product data (same as in products page)
const products = [
  {
    id: 1,
    name: "Çanta 🟢",
    price: 50.00,
    image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
    description: "Eko-dostu materiallardan hazırlanmış, davamlı və şık çanta. Gündəlik istifadə üçün ideal.",
    modelUrl: "https://cdn.jsdelivr.net/gh/Roronoa1331/3DModel@main/base_basic_shaded.glb", // Replace with actual 3D model URL
  },
  {
    id: 2,
    name: "Xalça",
    price: 300.00,
    image: "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/cde13f96-75ba-4b9f-87c5-1257b41cbfef._SL480_.jpg",
    description: "Əl toxunması, təbii yun xalça. Ənənəvi naxışlar və yüksək keyfiyyətli material.",
    modelUrl: "https://raw.githubusercontent.com/aframevr/aframe/master/examples/boilerplate/gltf/models/gltf-model.glb", // Replace with actual 3D model URL
  },
  // Add modelUrl for other products
]

function ARContent() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [isARSupported, setIsARSupported] = useState(true)

  useEffect(() => {
    // Find the product based on the ID from the URL
    const productId = Number(params.id)
    const foundProduct = products.find(p => p.id === productId)
    setProduct(foundProduct || null)

    // Check if AR is supported in the browser
    const checkARSupport = async () => {
      try {
        // Check if WebXR is supported
        if ('xr' in navigator) {
          const isSupported = await (navigator as any).xr.isSessionSupported('immersive-ar')
          setIsARSupported(isSupported)
        } else {
          setIsARSupported(false)
        }
      } catch (error) {
        console.error('Error checking AR support:', error)
        setIsARSupported(false)
      }
    }

    checkARSupport()
  }, [params.id])

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Məhsul tapılmadı</h1>
        <Button asChild>
          <Link href="/products">Məhsullara qayıt</Link>
        </Button>
      </div>
    )
  }

  if (!isARSupported) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">AR dəstəklənmir</h1>
        <p className="mb-8">Sizin brauzeriniz AR funksiyasını dəstəkləmir. Zəhmət olmasa başqa brauzer istifadə edin.</p>
        <Button asChild>
          <Link href="/products">Məhsullara qayıt</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Məhsullara qayıt
          </Link>
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-xl mb-4">{product.price.toFixed(2)} ₼</p>
        <p className="text-gray-600 mb-6">{product.description}</p>
      </div>

      <div className="aspect-square max-w-md mx-auto mb-8">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">AR-da bax</h2>
        <p className="mb-6">
          Məhsulu AR-da görmək üçün aşağıdakı düyməyə klikləyin və kameranızı istifadə edin.
        </p>
        <Button asChild size="lg">
          <Link href={`/ar-viewer/${product.id}`}>
            AR-da bax
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function ARPage() {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Loading...</div>}>
      <ARContent />
    </Suspense>
  )
} 