"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
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
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0)
  const modelContainerRef = useRef<HTMLDivElement>(null)
  const threeContainerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const modelRef = useRef<any>(null)
  const controlsRef = useRef<any>(null)
  const animationFrameRef = useRef<number>(0)

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

  // Initialize Three.js when the model viewer is shown
  useEffect(() => {
    if (!showModel || !threeContainerRef.current) return;

    // Load Three.js scripts
    const loadThreeJS = async () => {
      try {
        // Load Three.js
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
        threeScript.async = true;
        
        // Load GLTFLoader
        const gltfLoaderScript = document.createElement('script');
        gltfLoaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js';
        gltfLoaderScript.async = true;
        
        // Load OrbitControls
        const orbitControlsScript = document.createElement('script');
        orbitControlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js';
        orbitControlsScript.async = true;
        
        // Load scripts in sequence
        await new Promise<void>((resolve) => {
          threeScript.onload = () => {
            document.head.appendChild(gltfLoaderScript);
            resolve();
          };
          document.head.appendChild(threeScript);
        });
        
        await new Promise<void>((resolve) => {
          gltfLoaderScript.onload = () => {
            document.head.appendChild(orbitControlsScript);
            resolve();
          };
        });
        
        await new Promise<void>((resolve) => {
          orbitControlsScript.onload = () => {
            resolve();
          };
        });
        
        // Initialize Three.js scene
        initThreeJS();
      } catch (err) {
        console.error("Error loading Three.js:", err);
        setError("3D model yüklənərkən xəta baş verdi");
      }
    };
    
    loadThreeJS();
    
    return () => {
      // Clean up Three.js resources
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (modelRef.current) {
        modelRef.current.traverse((object: any) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => {
                if (material.map) material.map.dispose();
                material.dispose();
              });
            } else {
              if (object.material.map) object.material.map.dispose();
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [showModel]);

  // Initialize Three.js scene
  const initThreeJS = () => {
    if (!threeContainerRef.current || !product) return;
    
    // Create scene
    const scene = new (window as any).THREE.Scene();
    scene.background = new (window as any).THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new (window as any).THREE.PerspectiveCamera(
      75,
      threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new (window as any).THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeContainerRef.current.innerHTML = '';
    threeContainerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new (window as any).THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new (window as any).THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add orbit controls
    const controls = new (window as any).THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;
    
    // Load 3D model
    const loader = new (window as any).THREE.GLTFLoader();
    
    // Add loading manager
    const manager = new (window as any).THREE.LoadingManager();
    manager.onProgress = (url: string, itemsLoaded: number, itemsTotal: number) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      setModelLoadingProgress(progress);
    };
    manager.onLoad = () => {
      setIsModelLoaded(true);
    };
    manager.onError = (url: string) => {
      console.error("Error loading model:", url);
      setError("3D model yüklənərkən xəta baş verdi");
    };
    
    loader.setManager(manager);
    
    // Load the model
    loader.load(
      product.modelUrl,
      (gltf: any) => {
        const model = gltf.scene;
        
        // Center the model
        const box = new (window as any).THREE.Box3().setFromObject(model);
        const center = box.getCenter(new (window as any).THREE.Vector3());
        model.position.sub(center);
        
        // Scale the model
        const size = box.getSize(new (window as any).THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.multiplyScalar(scale);
        
        scene.add(model);
        modelRef.current = model;
        
        // Start animation loop
        animate();
      },
      (xhr: any) => {
        // Progress
        const progress = (xhr.loaded / xhr.total) * 100;
        setModelLoadingProgress(progress);
      },
      (error: any) => {
        console.error("Error loading model:", error);
        setError("3D model yüklənərkən xəta baş verdi");
      }
    );
    
    // Handle window resize
    const handleResize = () => {
      if (!threeContainerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };
  
  // Animation loop
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current) return;
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Update controls
    controlsRef.current.update();
    
    // Auto-rotate if enabled
    if (isAutoRotating && modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
    
    // Render scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

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
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(cameraRef.current.position.z - 0.5, 1);
    }
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(cameraRef.current.position.z + 0.5, 10);
    }
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
              ref={threeContainerRef}
              className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative"
            >
              {!isModelLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                  <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${modelLoadingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600">3D model yüklənir... {Math.round(modelLoadingProgress)}%</p>
                </div>
              )}
              
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
                <li>Modeli fırlatmaq üçün: Ekrana toxunub sürüşdürün</li>
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
                <li>Modeli ətrafında fırlatmaq üçün ekrana toxunub sürüşdürün</li>
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
    </>
  )
}

export default function ARViewerPage() {
  return (
    <ARViewerContent />
  )
} 