"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Head from "next/head"
import Script from "next/script"

// Declare model-viewer element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src: string;
        alt: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'ios-src'?: string;
        onLoad?: () => void;
        onError?: (error: any) => void;
      }, HTMLElement>;
    }
  }
}

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
  const [arSupported, setArSupported] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const modelViewerRef = useRef<any>(null)

  // Check if AR is supported
  useEffect(() => {
    const checkARSupport = () => {
      // Check if the device is mobile - improved detection
      const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Check if WebXR is supported
      const hasWebXR = 'xr' in navigator;
      
      // Check if model-viewer is supported
      const hasModelViewer = 'model-viewer' in document.createElement('model-viewer');
      
      console.log('AR support check:', { isMobile, hasWebXR, hasModelViewer });
      
      // Set AR as supported if on mobile
      // We'll assume AR is supported on mobile devices even if model-viewer isn't detected yet
      // This is because the model-viewer script might not be loaded when this check runs
      setArSupported(isMobile);
      setIsLoading(false);
    };

    // Run the check after a short delay to ensure the model-viewer script has loaded
    const timer = setTimeout(() => {
      checkARSupport();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
  }, [params.id]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modelViewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle model loading
  const handleModelLoad = () => {
    console.log('Model loaded successfully');
    setIsLoading(false);
    
    // Add event listener to the model-viewer element to handle AR button clicks
    if (modelViewerRef.current) {
      const modelViewer = modelViewerRef.current;
      
      // Add a custom event listener for AR button clicks
      modelViewer.addEventListener('ar-status', (event: any) => {
        console.log('AR status changed:', event.detail.status);
        
        if (event.detail.status === 'session-started') {
          console.log('AR session started successfully');
          // Hide UI elements when AR is active
          document.querySelectorAll('.fixed').forEach(el => {
            (el as HTMLElement).style.display = 'none';
          });
        } else if (event.detail.status === 'session-ended') {
          console.log('AR session ended');
          // Show UI elements when AR is inactive
          document.querySelectorAll('.fixed').forEach(el => {
            (el as HTMLElement).style.display = '';
          });
        }
      });
      
      // Add a custom event listener for AR button clicks
      modelViewer.addEventListener('ar-button-click', () => {
        console.log('AR button clicked');
        // Request camera permissions explicitly
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            console.log('Camera permission granted');
            // Stop the stream immediately - we just needed permission
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(err => {
            console.error('Camera permission denied:', err);
            alert('Kamera icazəsi verilmədi. AR funksiyası üçün kamera icazəsi lazımdır.');
          });
      });
    }
  };

  // Handle model error
  const handleModelError = (error: any) => {
    console.error('Error loading model:', error);
    setError('Model yüklənərkən xəta baş verdi');
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">AR yüklənir...</h1>
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
      
      <Script 
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" 
        strategy="beforeInteractive"
      />
      
      <div className="fixed top-4 left-4 z-10">
        <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm">
          <Link href={`/ar/${product.id}`}>
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
      
      <div className="fixed inset-0 z-0">
        <model-viewer
          ref={modelViewerRef}
          src={product.modelUrl}
          alt={product.name}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          interaction-prompt="auto"
          interaction-prompt-style="basic"
          interaction-prompt-threshold="0"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ecf0f3',
            borderRadius: '15px',
          }}
          onLoad={handleModelLoad}
          onError={handleModelError}
        >
          <button slot="ar-button" className="arbutton">
            AR-da bax
          </button>
        </model-viewer>
      </div>
      
      <div className="fixed bottom-4 left-0 right-0 text-center z-10">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg inline-block">
          <p className="mb-2">AR-da məhsulu görmək üçün ekranı boş bir səthə yönləndirin və toxunun</p>
          <div className="text-sm text-gray-600 mb-2">
            <p>3D modeli idarə etmək üçün:</p>
            <ul className="list-disc list-inside">
              <li>Fırlatmaq üçün: Sürüşdürün</li>
              <li>Yaxınlaşdırmaq üçün: İki barmaqla sıxın</li>
              <li>Avtomatik fırlatma üçün: Yuxarıdakı düyməni istifadə edin</li>
            </ul>
          </div>
          <div className="text-sm text-blue-600 font-medium mb-2">
            <p>AR rejimində məhsulu yerləşdirmək üçün:</p>
            <ol className="list-decimal list-inside">
              <li>"AR-da bax" düyməsinə toxunun</li>
              <li>Kameranı boş bir səthə yönləndirin</li>
              <li>Ekrana toxunun - məhsul səthə yerləşdiriləcək</li>
              <li>Məhsulu hərəkət etdirmək üçün onu sürüşdürün</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ARViewerPage() {
  return (
    <ARViewerContent />
  )
} 