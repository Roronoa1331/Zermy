"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Script from "next/script"
import Head from "next/head"
// Import Three.js directly from node_modules
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Define WebXR types
declare global {
  interface Window {
    XR: any;
  }
}

// Model cache to prevent reloading the same model
const modelCache: Record<string, THREE.Object3D> = {};

// Preload models in the background
const preloadModels = () => {
  // Create a loading manager for preloading
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = (url, loaded, total) => {
    console.log(`Preloading progress: ${(loaded / total * 100).toFixed(2)}% (${loaded}/${total} bytes)`);
  };
  
  const loader = new GLTFLoader(loadingManager);
  
  // Preload all product models
  products.forEach(product => {
    if (!modelCache[product.modelUrl]) {
      console.log(`Preloading model: ${product.modelUrl}`);
      loader.load(
        product.modelUrl,
        (gltf) => {
          console.log(`Model preloaded: ${product.modelUrl}`);
          modelCache[product.modelUrl] = gltf.scene.clone();
        },
        undefined,
        (error) => {
          console.error(`Error preloading model ${product.modelUrl}:`, error);
        }
      );
    }
  });
  
  // Preload fallback model
  const fallbackModelUrl = "https://cdn.jsdelivr.net/gh/Roronoa1331/3DModel@main/base_basic_shaded.glb";
  if (!modelCache[fallbackModelUrl]) {
    console.log(`Preloading fallback model: ${fallbackModelUrl}`);
    loader.load(
      fallbackModelUrl,
      (gltf) => {
        console.log(`Fallback model preloaded: ${fallbackModelUrl}`);
        modelCache[fallbackModelUrl] = gltf.scene.clone();
      },
      undefined,
      (error) => {
        console.error(`Error preloading fallback model:`, error);
      }
    );
  }
};

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
    // Using the CDN model file
    modelUrl: "https://cdn.jsdelivr.net/gh/Roronoa1331/3DModel@main/base_basic_shaded.glb",
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
  const [arSupported, setArSupported] = useState<boolean | null>(null)
  const [modelLoading, setModelLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [threeJsInitialized, setThreeJsInitialized] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const controllerRef = useRef<any>(null)
  const sessionRef = useRef<XRSession | null>(null)

  // Initialize Three.js
  const initThreeJS = async () => {
    try {
      console.log('Initializing Three.js...')
      
      // Set Three.js as initialized immediately to hide the loading indicator
      setThreeJsInitialized(true)
      
      // Create scene
      const scene = new THREE.Scene()
      sceneRef.current = scene
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 5
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
      
      // Add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.screenSpacePanning = false
      controls.minDistance = 2
      controls.maxDistance = 10
      controls.maxPolarAngle = Math.PI / 2
      controls.autoRotate = autoRotate
      controlsRef.current = controls
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(0, 1, 1)
      scene.add(directionalLight)
      
      // Add a simple cube as a placeholder while the model loads
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(0, 0, -2)
      scene.add(cube)
      
      // Start animation loop immediately to show something to the user
      const animate = () => {
        if (controlsRef.current && !sessionRef.current) {
          controlsRef.current.update()
        }
        
        if (modelRef.current && sessionRef.current) {
          modelRef.current.visible = true
        }
        
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      
      animate()
      
      // Handle window resize
      const handleResize = () => {
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = window.innerWidth / window.innerHeight
          cameraRef.current.updateProjectionMatrix()
          rendererRef.current.setSize(window.innerWidth, window.innerHeight)
        }
      }
      
      window.addEventListener('resize', handleResize)
      
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

  // Load the 3D model separately from initialization
  const loadModel = async () => {
    if (!product || !sceneRef.current) return;
    
    try {
      console.log('Loading model:', product.modelUrl);
      setModelLoading(true);
      setLoadingProgress(0);
      
      // Create a loading manager to track progress
      const loadingManager = new THREE.LoadingManager();
      loadingManager.onProgress = (url, loaded, total) => {
        const percent = (loaded / total * 100).toFixed(2);
        setLoadingProgress(Number(percent));
      };
      
      const loader = new GLTFLoader(loadingManager);
      
      // Check if model is already in cache
      if (modelCache[product.modelUrl]) {
        console.log('Model found in cache, using cached version');
        const cachedModel = modelCache[product.modelUrl].clone();
        
        // Center the model
        const box = new THREE.Box3().setFromObject(cachedModel);
        const center = box.getCenter(new THREE.Vector3());
        cachedModel.position.sub(center);
        
        // Scale the model appropriately
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1 / maxDim;
        cachedModel.scale.multiplyScalar(scale);
        
        // Position the model in front of the camera
        cachedModel.position.set(0, 0, -1);
        
        // Make the model visible
        cachedModel.visible = true;
        
        // Remove the placeholder cube
        if (sceneRef.current) {
          const cube = sceneRef.current.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry);
          if (cube) sceneRef.current.remove(cube);
        }
        
        if (sceneRef.current) {
          sceneRef.current.add(cachedModel);
          modelRef.current = cachedModel;
        }
        
        setModelLoading(false);
      } else {
        // Load the model
        loader.load(
          product.modelUrl,
          (gltf: { scene: THREE.Object3D }) => {
            console.log('Model loaded successfully:', product.modelUrl);
            const model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            // Scale the model appropriately
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 1 / maxDim;
            model.scale.multiplyScalar(scale);
            
            // Position the model in front of the camera
            model.position.set(0, 0, -1);
            
            // Make the model visible
            model.visible = true;
            
            // Remove the placeholder cube
            if (sceneRef.current) {
              const cube = sceneRef.current.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry);
              if (cube) sceneRef.current.remove(cube);
            }
            
            // Add to cache
            modelCache[product.modelUrl] = model.clone();
            
            if (sceneRef.current) {
              sceneRef.current.add(model);
              modelRef.current = model;
            }
            
            setModelLoading(false);
          },
          (progress) => {
            const percent = (progress.loaded / progress.total * 100).toFixed(2);
            setLoadingProgress(Number(percent));
          },
          (error: unknown) => {
            console.error('Error loading model:', error);
            setModelLoading(false);
            
            // Try to load a fallback model if available
            if (product.modelUrl !== 'https://cdn.jsdelivr.net/gh/Roronoa1331/3DModel@main/base_basic_shaded.glb') {
              console.log('Attempting to load fallback model');
              setModelLoading(true);
              setLoadingProgress(0);
              
              // Check if fallback model is in cache
              if (modelCache['https://cdn.jsdelivr.net/gh/Roronoa1331/3DModel@main/base_basic_shaded.glb']) {
                console.log('Fallback model found in cache, using cached version');
                const cachedModel = modelCache['https://cdn.jsdelivr.net/gh/Roronoa1331/3DModel@main/base_basic_shaded.glb'].clone();
                cachedModel.scale.set(0.5, 0.5, 0.5);
                cachedModel.position.set(0, 0, -1);
                
                // Remove the placeholder cube
                if (sceneRef.current) {
                  const cube = sceneRef.current.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry);
                  if (cube) sceneRef.current.remove(cube);
                }
                
                if (sceneRef.current) {
                  sceneRef.current.add(cachedModel);
                  modelRef.current = cachedModel;
                }
                
                setModelLoading(false);
              } else {
                loader.load(
                  'https://cdn.jsdelivr.net/gh/Roronoa1331/3DModel@main/base_basic_shaded.glb',
                  (gltf: { scene: THREE.Object3D }) => {
                    console.log('Fallback model loaded successfully');
                    const model = gltf.scene;
                    model.scale.set(0.5, 0.5, 0.5);
                    model.position.set(0, 0, -1);
                    
                    // Remove the placeholder cube
                    if (sceneRef.current) {
                      const cube = sceneRef.current.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry);
                      if (cube) sceneRef.current.remove(cube);
                    }
                    
                    // Add to cache
                    modelCache['https://cdn.jsdelivr.net/gh/Roronoa1331/3DModel@main/base_basic_shaded.glb'] = model.clone();
                    
                    if (sceneRef.current) {
                      sceneRef.current.add(model);
                      modelRef.current = model;
                    }
                    
                    setModelLoading(false);
                  },
                  (progress) => {
                    const percent = (progress.loaded / progress.total * 100).toFixed(2);
                    setLoadingProgress(Number(percent));
                  },
                  (fallbackError: unknown) => {
                    console.error('Error loading fallback model:', fallbackError);
                    setModelLoading(false);
                  }
                );
              }
            }
          }
        );
      }
    } catch (error) {
      console.error('Error loading model:', error);
      setModelLoading(false);
    }
  };

  // Start AR session
  const startAR = async () => {
    try {
      if (!rendererRef.current) {
        return;
      }
      
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      });
      
      sessionRef.current = session;
      
      // Set up AR session
      rendererRef.current.xr.setReferenceSpaceType('local');
      
      // Set up hit testing
      const viewerSpace = await session.requestReferenceSpace('viewer');
      const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
      
      // Handle frame updates
      session.addEventListener('select', () => {
        if (modelRef.current) {
          // Place model at hit test location
          const hitTestResults = session.renderState.hitTestResults;
          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(rendererRef.current?.xr.getReferenceSpace());
            
            if (pose) {
              modelRef.current.position.set(
                pose.transform.position.x,
                pose.transform.position.y,
                pose.transform.position.z
              );
              modelRef.current.visible = true;
            }
          }
        }
      });
      
      // Clean up when session ends
      session.addEventListener('end', () => {
        sessionRef.current = null;
      });
      
      // Start the AR session
      await rendererRef.current.xr.setSession(session);
    } catch (error) {
      console.error('Error starting AR session:', error);
    }
  };

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
        setArSupported(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkARSupport()
    
    // Initialize Three.js immediately
    if (canvasRef.current) {
      initThreeJS()
      
      // Load the model immediately after initialization
      if (foundProduct) {
        loadModel()
      }
    }
  }, [params.id])

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
      <Head>
        <title>AR Viewer</title>
      </Head>
      
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
          onClick={() => {
            if (controlsRef.current) {
              setAutoRotate(!autoRotate)
              controlsRef.current.autoRotate = !autoRotate
            }
          }}
        >
          {autoRotate ? 'Avtomatik fırlatmanı dayandır' : 'Avtomatik fırlatma'}
        </Button>
        <Button 
          variant="outline" 
          className="bg-white/80 backdrop-blur-sm"
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.reset()
              if (modelRef.current) {
                modelRef.current.rotation.set(0, 0, 0)
              }
            }
          }}
        >
          Yenidən başlat
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
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      
      {!threeJsInitialized && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg z-20 text-center">
          <p className="mb-2">3D görünüş hazırlanır...</p>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: '70%' }}
            ></div>
          </div>
        </div>
      )}
      
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
          <Button 
            onClick={async () => {
              if (sessionRef.current) {
                await sessionRef.current.end();
                sessionRef.current = null;
              } else {
                await startAR();
              }
            }}
            className="mt-2"
          >
            AR-da bax
          </Button>
        </div>
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