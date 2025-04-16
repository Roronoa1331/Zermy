"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import Head from "next/head"

// Product data (same as in products page)
const products = [
  {
    id: 1,
    name: "Çanta 🟢",
    price: 50.00,
    image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
    description: "Eko-dostu materiallardan hazırlanmış, davamlı və şık çanta. Gündəlik istifadə üçün ideal.",
    // Using the local bag.glb file
    modelUrl: "/models/products/bag/bag.glb",
  },
  {
    id: 2,
    name: "Xalça",
    price: 300.00,
    image: "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/cde13f96-75ba-4b9f-87c5-1257b41cbfef._SL480_.jpg",
    description: "Əl toxunması, təbii yun xalça. Ənənəvi naxışlar və yüksək keyfiyyətli material.",
    // Using the existing model file
    modelUrl: "/models/products/carpet/model.gltf",
  },
  // To add a new product:
  // 1. Create a new directory under public/models/products/
  // 2. Add your .gltf or .glb model file
  // 3. Add a new product object here with the modelUrl pointing to your model
  // Example:
  // {
  //   id: 3,
  //   name: "New Product",
  //   price: 100.00,
  //   image: "path/to/image.jpg",
  //   description: "Product description",
  //   modelUrl: "/models/products/new-product/model.gltf",
  // },
]

function ARViewerContent() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const modelContainerRef = useRef<HTMLDivElement>(null)

  // Find the product based on the ID from the URL
  useEffect(() => {
    const productId = Number(params.id)
    const foundProduct = products.find(p => p.id === productId)
    
    if (!foundProduct) {
      setError("Məhsul tapılmadı")
      setIsLoading(false)
      return
    }
    
    setProduct(foundProduct)
    
    // Set a timeout to ensure loading state doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2 seconds max loading time
    
    return () => clearTimeout(loadingTimeout)
  }, [params.id])

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle model button click
  const handleModelButtonClick = () => {
    setShowModel(true);
  };

  // Handle instructions button click
  const handleInstructionsButtonClick = () => {
    setShowInstructions(true);
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  // Handle auto rotate toggle
  const handleAutoRotateToggle = () => {
    setIsAutoRotating(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Yüklənir...</h1>
        <p className="mb-8">Zəhmət olmasa gözləyin.</p>
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: '50%' }}
          ></div>
        </div>
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
      <Head>
        <title>3D Viewer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      
      <div className="fixed top-4 left-4 z-10">
        <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri qayıt
          </Link>
        </Button>
      </div>
      
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <Button 
          variant="outline" 
          className="bg-white/80 backdrop-blur-sm"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? 'Tam ekrandan çıx' : 'Tam ekran'}
        </Button>
      </div>
      
      <div className="fixed top-16 left-4 z-10">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="text-lg font-semibold">{product.price.toFixed(2)} ₼</p>
        </div>
      </div>
      
      <div className="fixed inset-0 z-0 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-64 object-contain mb-6"
          />
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-semibold mb-6">{product.price.toFixed(2)} ₼</p>
          
          <div className="flex flex-col gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleModelButtonClick}
            >
              3D modeli gör
            </Button>
            
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleInstructionsButtonClick}
            >
              İstifadə təlimatları
            </Button>
          </div>
        </div>
      </div>
      
      {showModel && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full max-w-4xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{product.name} - 3D Model</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowModel(false)}
              >
                Bağla
              </Button>
            </div>
            
            <div 
              ref={modelContainerRef}
              className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative"
              style={{ 
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.3s ease',
                transformOrigin: 'center center'
              }}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain"
                style={{ 
                  animation: isAutoRotating ? 'rotate 20s linear infinite' : 'none'
                }}
              />
              
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-white/80 backdrop-blur-sm"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-white/80 backdrop-blur-sm"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={`bg-white/80 backdrop-blur-sm ${isAutoRotating ? 'bg-blue-100' : ''}`}
                  onClick={handleAutoRotateToggle}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>3D modeli idarə etmək üçün:</p>
              <ul className="list-disc list-inside">
                <li>Yaxınlaşdırmaq üçün: Yuxarıdakı düymələri istifadə edin</li>
                <li>Avtomatik fırlatma üçün: Fırlatma düyməsini istifadə edin</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {showInstructions && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">İstifadə təlimatları</h2>
            
            <div className="mb-6">
              <p className="mb-2 font-medium">3D modeli görmək üçün:</p>
              <ol className="list-decimal list-inside text-left mb-4">
                <li>"3D modeli gör" düyməsinə toxunun</li>
                <li>Modeli yaxınlaşdırmaq üçün yuxarıdakı düymələri istifadə edin</li>
                <li>Modeli fırlatmaq üçün fırlatma düyməsini istifadə edin</li>
              </ol>
              
              <p className="mb-2 font-medium">Mobil cihazda görmək üçün:</p>
              <ol className="list-decimal list-inside text-left">
                <li>Mobil cihazınızda brauzeri açın</li>
                <li>Bu səhifəni açın</li>
                <li>"3D modeli gör" düyməsinə toxunun</li>
              </ol>
            </div>
            
            <Button 
              className="w-full"
              onClick={() => setShowInstructions(false)}
            >
              Bağla
            </Button>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}

export default function ARViewerPage() {
  return (
    <ARViewerContent />
  )
} 