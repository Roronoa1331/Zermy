"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, View } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  hasAR: boolean;
  arId?: number;
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
  hasAR: true,
  arId: 1
};

// Define the Şam (candle) product
const SAM_PRODUCT: Product = {
  id: "sam-fallback",
  name: "Şam",
  price: 7.00,
  image: "https://cdn.shopify.com/s/files/1/2219/6397/files/Bamboo_Candle_copy_1024x1024.png?v=1698242921",
  description: "Təbii materiallardan hazırlanmış, uzun yanma müddəti olan şam. Evinizə rahatlıq və istilik gətirir.",
  features: [
    "Təbii material",
    "Uzun yanma müddəti",
    "Ətraf mühitə dost",
    "Rahatlıq və istilik"
  ],
  hasAR: true,
  arId: 6
};

// Define the Xalça (carpet) product
const XALCA_PRODUCT: Product = {
  id: "xalca-fallback",
  name: "Xalça",
  price: 300.00,
  image: "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/cde13f96-75ba-4b9f-87c5-1257b41cbfef._SL480_.jpg",
  description: "Əl toxunması, təbii yun xalça. Ənənəvi naxışlar və yüksək keyfiyyətli material.",
  features: [
    "Əl toxunması",
    "Təbii yun",
    "Ənənəvi naxışlar",
    "Yüksək keyfiyyətli material"
  ],
  hasAR: false
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Yüklənir...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Məhsulları yükləmək mümkün olmadı');
        }
        
        // Check if Çanta exists in the products
        const hasCanta = data.products.some((p: Product) => 
          p.name.toLowerCase().includes('çanta')
        );
        
        // Check if Şam exists in the products
        const hasSam = data.products.some((p: Product) => 
          p.name.toLowerCase().includes('şam')
        );
        
        // Check if Xalça exists in the products
        const hasXalca = data.products.some((p: Product) => 
          p.name.toLowerCase().includes('xalça')
        );
        
        // If any of the fallback products don't exist, add them to the products
        let fallbackProducts = [];
        if (!hasCanta) fallbackProducts.push(CANTA_PRODUCT);
        if (!hasSam) fallbackProducts.push(SAM_PRODUCT);
        if (!hasXalca) fallbackProducts.push(XALCA_PRODUCT);
        
        setProducts([...fallbackProducts, ...data.products]);
      } catch (err) {
        console.error('Error fetching products:', err);
        // If there's an error, at least show the fallback products
        setProducts([CANTA_PRODUCT, SAM_PRODUCT, XALCA_PRODUCT]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container py-16">
        <div className="text-center">Yüklənir...</div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Xəta</h1>
            <p className="text-xl text-muted-foreground">
              {error}
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">
                Ana səhifəyə qayıt
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Məhsul Tapılmadı</h1>
            <p className="text-xl text-muted-foreground">
              Hələ heç bir məhsul mövcud deyil
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">
                Ana səhifəyə qayıt
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Məhsullarımız</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="aspect-square overflow-hidden rounded-md">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full transition-all group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-lg font-medium text-primary mt-2">{product.price.toFixed(2)} AZN</p>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {product.features?.slice(0, 2).map((feature, index) => (
                  <span key={index} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    {feature}
                  </span>
                ))}
                {product.features && product.features.length > 2 && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    +{product.features.length - 2} daha
                  </span>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link href={`/products/${product.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ətraflı
                  </Link>
                </Button>
                
                {product.hasAR && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/ar-viewer/${product.arId || 1}`}>
                      <View className="mr-2 h-4 w-4" />
                      AR-da bax <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">yeni</span>
                    </Link>
                  </Button>
                )}
                
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/cart?add=${product.id}`}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Səbətə əlavə et
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}