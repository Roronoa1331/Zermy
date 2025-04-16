"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Script from "next/script"
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// Define WebXR types
declare global {
  interface Window {
    XR: any;
  }
}

interface XRSession extends EventTarget {
  end(): Promise<void>;
  requestReferenceSpace(referenceSpaceType: string): Promise<any>;
  requestHitTestSource(options: { space: any }): Promise<any>;
  renderState: {
    hitTestResults: Array<{
      getPose(referenceSpace: any): {
        transform: {
          position: { x: number; y: number; z: number };
        };
      } | null;
    }>;
  };
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
}

// Product data (same as in products page)
const products = [
  {
    id: 1,
    name: "Çanta 🟢",
    price: 50.00,
    image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
    description: "Eko-dostu materiallardan hazırlanmış, davamlı və şık çanta. Gündəlik istifadə üçün ideal.",
    // Using the existing base_basic_shaded.gltf file
    modelUrl: "/models/products/base_basic_shaded.gltf",
  },
  {
    id: 2,
    name: "Xalça",
    price: 300.00,
    image: "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/cde13f96-75ba-4b9f-87c5-1257b41cbfef._SL480_.jpg",
    description: "Əl toxunması, təbii yun xalça. Ənənəvi naxışlar və yüksək keyfiyyətli material.",
    // Using the existing base_basic_shaded.gltf file
    modelUrl: "/models/products/base_basic_shaded.gltf",
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
  const [arSupported, setArSupported] = useState<boolean | null>(null)
  const [modelLoading, setModelLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const controllerRef = useRef<any>(null)
  const sessionRef = useRef<XRSession | null>(null)

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
    
    // Check if WebXR is supported
    const checkARSupport = async () => {
      try {
        if ('xr' in navigator) {
          const isSupported = await (navigator as any).xr.isSessionSupported('immersive-ar')
          setArSupported(isSupported)
        } else {
          setArSupported(false)
        }
      } catch (error) {
        console.error('Error checking AR support:', error)
        setArSupported(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkARSupport()
  }, [params.id])

  useEffect(() => {
    if (!arSupported || !canvasRef.current || !product) return

    // Initialize Three.js
    const initThreeJS = async () => {
      try {
        // Create scene
        const scene = new THREE.Scene()
        sceneRef.current = scene
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        cameraRef.current = camera
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ 
          canvas: canvasRef.current as HTMLCanvasElement,
          antialias: true,
          alpha: true
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.xr.enabled = true
        rendererRef.current = renderer
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(0, 1, 1)
        scene.add(directionalLight)
        
        // Load 3D model
        const loader = new GLTFLoader()
        console.log('Attempting to load model from:', product.modelUrl)
        setModelLoading(true)
        setLoadingProgress(0)
        
        loader.load(
          product.modelUrl,
          (gltf: { scene: THREE.Object3D }) => {
            console.log('Model loaded successfully:', product.modelUrl)
            const model = gltf.scene
            model.scale.set(0.5, 0.5, 0.5)
            model.position.set(0, 0, -1)
            scene.add(model)
            modelRef.current = model
            console.log('Model added to scene:', model)
            setModelLoading(false)
          },
          (progress) => {
            const percent = (progress.loaded / progress.total * 100).toFixed(2)
            console.log(`Loading progress: ${percent}% (${progress.loaded}/${progress.total} bytes)`)
            setLoadingProgress(Number(percent))
          },
          (error: unknown) => {
            console.error('Error loading model:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.error('Detailed error:', errorMessage)
            setError('3D model yüklənərkən xəta baş verdi: ' + errorMessage)
            setModelLoading(false)
            
            // Try to load a fallback model if available
            if (product.modelUrl !== '/models/products/base_basic_shaded.gltf') {
              console.log('Attempting to load fallback model')
              setModelLoading(true)
              setLoadingProgress(0)
              loader.load(
                '/models/products/base_basic_shaded.gltf',
                (gltf: { scene: THREE.Object3D }) => {
                  console.log('Fallback model loaded successfully')
                  const model = gltf.scene
                  model.scale.set(0.5, 0.5, 0.5)
                  model.position.set(0, 0, -1)
                  scene.add(model)
                  modelRef.current = model
                  setModelLoading(false)
                },
                (progress) => {
                  const percent = (progress.loaded / progress.total * 100).toFixed(2)
                  setLoadingProgress(Number(percent))
                },
                (fallbackError: unknown) => {
                  console.error('Error loading fallback model:', fallbackError)
                  setModelLoading(false)
                }
              )
            }
          }
        )
        
        // Handle window resize
        const handleResize = () => {
          if (cameraRef.current && rendererRef.current) {
            cameraRef.current.aspect = window.innerWidth / window.innerHeight
            cameraRef.current.updateProjectionMatrix()
            rendererRef.current.setSize(window.innerWidth, window.innerHeight)
          }
        }
        
        window.addEventListener('resize', handleResize)
        
        // Animation loop
        const animate = () => {
          if (modelRef.current) {
            modelRef.current.rotation.y += 0.01
          }
          
          renderer.render(scene, camera)
          requestAnimationFrame(animate)
        }
        
        animate()
        
        // Start AR session
        const startAR = async () => {
          try {
            const session = await (navigator as any).xr.requestSession('immersive-ar', {
              requiredFeatures: ['hit-test'],
              optionalFeatures: ['dom-overlay'],
              domOverlay: { root: document.body }
            })
            
            sessionRef.current = session
            
            // Set up AR session
            renderer.xr.setReferenceSpaceType('local')
            
            // Create AR button
            const arButton = document.createElement('button')
            arButton.textContent = 'AR-da bax'
            arButton.style.position = 'fixed'
            arButton.style.bottom = '20px'
            arButton.style.left = '50%'
            arButton.style.transform = 'translateX(-50%)'
            arButton.style.padding = '12px 24px'
            arButton.style.border = 'none'
            arButton.style.borderRadius = '4px'
            arButton.style.backgroundColor = '#0070f3'
            arButton.style.color = 'white'
            arButton.style.fontSize = '16px'
            arButton.style.cursor = 'pointer'
            arButton.style.zIndex = '1000'
            
            arButton.addEventListener('click', async () => {
              if (sessionRef.current) {
                await sessionRef.current.end()
                sessionRef.current = null
              } else {
                await startAR()
              }
            })
            
            document.body.appendChild(arButton)
            
            // Set up hit testing
            const viewerSpace = await session.requestReferenceSpace('viewer')
            const hitTestSource = await session.requestHitTestSource({ space: viewerSpace })
            
            // Handle frame updates
            session.addEventListener('select', () => {
              if (modelRef.current) {
                // Place model at hit test location
                const hitTestResults = session.renderState.hitTestResults
                if (hitTestResults.length > 0) {
                  const hit = hitTestResults[0]
                  const pose = hit.getPose(renderer.xr.getReferenceSpace())
                  
                  if (pose) {
                    modelRef.current.position.set(
                      pose.transform.position.x,
                      pose.transform.position.y,
                      pose.transform.position.z
                    )
                    modelRef.current.visible = true
                  }
                }
              }
            })
            
            // Clean up when session ends
            session.addEventListener('end', () => {
              sessionRef.current = null
              if (arButton) {
                document.body.removeChild(arButton)
              }
            })
            
            // Start the AR session
            await renderer.xr.setSession(session)
          } catch (error) {
            console.error('Error starting AR session:', error)
            setError('AR sessiyası başladıla bilmədi')
          }
        }
        
        // Start AR when ready
        startAR()
        
        return () => {
          window.removeEventListener('resize', handleResize)
          if (sessionRef.current) {
            sessionRef.current.end()
          }
        }
      } catch (error) {
        console.error('Error initializing Three.js:', error)
        setError('Three.js başladıla bilmədi')
      }
    }
    
    initThreeJS()
  }, [arSupported, product])

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

  if (arSupported === false) {
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
    <>
      <Script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js" strategy="beforeInteractive" />
      
      <div className="fixed top-4 left-4 z-10">
        <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm">
          <Link href={`/ar/${product.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri qayıt
          </Link>
        </Button>
      </div>
      
      <div className="fixed inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      
      {modelLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg z-20 text-center">
          <p className="mb-2">3D model yüklənir...</p>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm">{loadingProgress.toFixed(0)}%</p>
        </div>
      )}
      
      <div className="fixed bottom-4 left-0 right-0 text-center z-10">
        <p className="bg-white/80 backdrop-blur-sm p-2 rounded-lg inline-block">
          AR-da məhsulu görmək üçün ekranı boş bir səthə yönləndirin və toxunun
        </p>
      </div>
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