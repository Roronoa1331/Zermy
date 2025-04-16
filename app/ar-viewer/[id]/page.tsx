"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Script from "next/script"

// Product data (same as in products page)
const products = [
  {
    id: 1,
    name: "Çanta 🟢",
    price: 50.00,
    image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
    description: "Eko-dostu materiallardan hazırlanmış, davamlı və şık çanta. Gündəlik istifadə üçün ideal.",
    modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb", // Replace with actual 3D model URL
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

function ARViewerContent() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Find the product based on the ID from the URL
    const productId = Number(params.id)
    const foundProduct = products.find(p => p.id === productId)
    
    if (!foundProduct) {
      setError("Məhsul tapılmadı")
      setIsLoading(false)
      return
    }
    
    setProduct(foundProduct)
    
    // Initialize AR after a short delay to ensure scripts are loaded
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">AR yüklənir...</h1>
        <p className="mb-8">Zəhmət olmasa gözləyin.</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{error || "Məhsul tapılmadı"}</h1>
        <Button asChild>
          <Link href="/products">Məhsullara qayıt</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Script src="https://aframe.io/releases/1.4.0/aframe.min.js" strategy="beforeInteractive" />
      <Script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" strategy="beforeInteractive" />
      
      <div className="fixed top-4 left-4 z-10">
        <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm">
          <Link href={`/ar/${product.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri qayıt
          </Link>
        </Button>
      </div>
      
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        renderer="logarithmicDepthBuffer: true;"
        vr-mode-ui="enabled: false"
      >
        <a-assets>
          <a-asset-item id="product-model" src={product.modelUrl}></a-asset-item>
        </a-assets>
        
        <a-marker preset="hiro">
          <a-entity
            position="0 0 0"
            rotation="-90 0 0"
            scale="0.5 0.5 0.5"
            gltf-model="#product-model"
          ></a-entity>
        </a-marker>
        
        <a-entity camera></a-entity>
      </a-scene>
    </>
  )
}

export default function ARViewerPage() {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Loading...</div>}>
      <ARViewerContent />
    </Suspense>
  )
} 