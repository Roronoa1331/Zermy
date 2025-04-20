"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Head from "next/head"
import Script from "next/script"

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
    hasAR: true, // This product has AR functionality
  },
  {
    id: 6,
    name: "Şam",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Təbii materiallardan hazırlanmış, uzun yanma müddəti olan şam. Evinizə rahatlıq və istilik gətirir.",
    // Using the new model file
    modelUrl: "/models/products/candle/candle.glb",
    hasAR: true, // This product has AR functionality
  },
  {
    id: 2,
    name: "Xalça",
    price: 300.00,
    image: "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/cde13f96-75ba-4b9f-87c5-1257b41cbfef._SL480_.jpg",
    description: "Əl toxunması, təbii yun xalça. Ənənəvi naxışlar və yüksək keyfiyyətli material.",
    // Using the existing model file
    modelUrl: "/models/products/carpet/model.gltf",
    hasAR: false, // This product doesn't have AR functionality
  },
  // To add a new product:
  // 1. Create a new directory under public/models/products/
  // 2. Add your .gltf or .glb model file
  // 3. Add a new product object here with the modelUrl pointing to your model
  // Example:
  // {
  //   id: 4,
  //   name: "New Product",
  //   price: 100.00,
  //   image: "path/to/image.jpg",
  //   description: "Product description",
  //   modelUrl: "/models/products/new-product/model.gltf",
  //   hasAR: false, // Set to true if this product should have AR functionality
  // },
]

// Declare model-viewer element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string;
        exposure?: string;
        'environment-image'?: string;
        style?: React.CSSProperties;
      }
    }
  }
}

function ARViewerContent() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModel, setShowModel] = useState(false)
  const [showAR, setShowAR] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
    
    // Check if device is mobile
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    setIsMobile(isMobileDevice);
    
    return () => clearTimeout(loadingTimeout)
  }, [params.id]) 

  // Handle model button click
  const handleModelButtonClick = () => {
    setShowModel(true);
  };

  // Handle AR button click
  const handleARButtonClick = () => {
    setShowAR(true);
  };

  // Handle instructions button click
  const handleInstructionsButtonClick = () => {
    setShowInstructions(true);
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
        <title>AR Viewer</title>
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
            
            {product.hasAR && (
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleARButtonClick}
              >
                AR-da bax
              </Button>
            )}
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleInstructionsButtonClick}
            >
              İstifadə təlimatları
            </Button>
          </div>
          
          {isMobile && product.hasAR && (
            <p className="mt-4 text-sm text-blue-500">
              Mobil cihazda AR istifadə etmək üçün brauzerinizə kamera icazəsi verməlisiniz.
            </p>
          )}
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
            
            <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
              <model-viewer
                src={product.modelUrl}
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="1"
                environment-image="neutral"
                style={{ width: '100%', height: '100%' }}
              ></model-viewer>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>3D modeli idarə etmək üçün:</p>
              <ul className="list-disc list-inside">
                <li>Yaxınlaşdırmaq üçün: Ekrana toxunub sürüşdürün</li>
                <li>Modeli fırlatmaq üçün: Ekrana toxunub sürüşdürün</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {showAR && product.hasAR && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">{product.name} - AR</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowAR(false)}
            >
              Bağla
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <model-viewer
              src={product.modelUrl}
              ar
              ar-modes="webxr scene-viewer quick-look"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              exposure="1"
              environment-image="neutral"
              style={{ width: '100%', height: '100%' }}
            ></model-viewer>
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
                <li>Modeli yaxınlaşdırmaq üçün ekrana toxunub sürüşdürün</li>
                <li>Modeli fırlatmaq üçün ekrana toxunub sürüşdürün</li>
              </ol>
              
              {product.hasAR && (
                <>
                  <p className="mb-2 font-medium">AR-da görmək üçün:</p>
                  <ol className="list-decimal list-inside text-left mb-4">
                    <li>"AR-da bax" düyməsinə toxunun</li>
                    <li>Brauzer kamera icazəsi istəsə, "İcazə ver" düyməsinə toxunun</li>
                    <li>Kameranı boş bir səthə yönləndirin</li>
                    <li>Ekrana toxunun - məhsul səthə yerləşdiriləcək</li>
                    <li>Məhsulu ətrafında fırlatmaq üçün ekrana toxunub sürüşdürün</li>
                  </ol>
                </>
              )}
              
              <p className="mb-2 font-medium">Mobil cihazda görmək üçün:</p>
              <ol className="list-decimal list-inside text-left">
                <li>Mobil cihazınızda brauzeri açın</li>
                <li>Bu səhifəni açın</li>
                {product.hasAR && (
                  <li>"AR-da bax" düyməsinə toxunun</li>
                )}
                {product.hasAR && (
                  <li>Brauzer kamera icazəsi istəsə, "İcazə ver" düyməsinə toxunun</li>
                )}
                {!product.hasAR && (
                  <li>"3D modeli gör" düyməsinə toxunun</li>
                )}
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
      
      <Script 
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" 
        type="module"
        strategy="lazyOnload"
      />
    </>
  )
}

export default function ARViewerPage() {
  return (
    <ARViewerContent />
  )
} 