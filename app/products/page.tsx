"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, View } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  hasAR: boolean;
  arId?: number;
}

// All available products
const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
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
  },
  {
    id: 6,
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
  },
  {
    id: 2,
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
  },
  {
    id: 3,
    name: "Papaq",
    price: 30.00,
    image: "https://coalheadwear.com/cdn/shop/files/2202258_SAG_P_1.jpg?v=1726529581&width=900",
    description: "Yüngül və rahat papaq. İsti saxlayır və şık görünür.",
    features: [
      "Yüngül material",
      "Rahat",
      "İsti saxlayır",
      "Şık dizayn"
    ],
    hasAR: false
  },
  {
    id: 4,
    name: "Kepka🟢",
    price: 40.00,
    image: "https://images.squarespace-cdn.com/content/v1/55ccebf2e4b03e8de40a82ba/1675841523209-X7RJ8KEC4CVQUZ74C2RG/Topiku-10.jpg",
    description: "Ekoloji təmiz materialdan hazırlanmış kepka.",
    features: [
      "Ekoloji təmiz",
      "Rahat",
      "Yüngül",
      "Universal ölçü"
    ],
    hasAR: false
  },
  {
    id: 5,
    name: "Ayaqqabı 🟢",
    price: 120.00,
    image: "https://static.fibre2fashion.com/newsresource/images/249/tea_261031.jpg",
    description: "Ekoloji təmiz materialdan hazırlanmış rahat ayaqqabı.",
    features: [
      "Ekoloji təmiz",
      "Rahat",
      "Davamlı",
      "Şık dizayn"
    ],
    hasAR: false
  },
  {
    id: 7,
    name: "Şampun",
    price: 34.00,
    image: "https://m.media-amazon.com/images/I/61Jcsp2JWOL.jpg",
    description: "Təbii tərkibli saç şampunu.",
    features: [
      "Təbii tərkib",
      "Saçı qidalandırır",
      "Parlaqlıq verir",
      "Uzun müddətli təsir"
    ],
    hasAR: false
  },
  {
    id: 8,
    name: "Çanta",
    price: 15.00,
    image: "https://lie-studio.dk/cdn/shop/files/Canvas_tote_1.jpg?v=1731332002&width=1946",
    description: "Gündəlik istifadə üçün rahat çanta.",
    features: [
      "Yüngül",
      "Rahat",
      "Davamlı",
      "Universal dizayn"
    ],
    hasAR: false
  },
  {
    id: 9,
    name: "Tumbler",
    price: 25.00,
    image: "https://jucycorporategifts.com/cdn/shop/files/GlassSipper.png?v=1706597815",
    description: "İçkilərinizi isti və ya soyuq saxlamaq üçün termos.",
    features: [
      "İzolasiyalı",
      "Davamlı",
      "Sızmaz",
      "Rahat istifadə"
    ],
    hasAR: false
  }
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Yüklənir...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Add to cart function
  const addToCart = async (productId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          action: 'add',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to cart');
      }

      // Redirect to cart page after successful addition
      window.location.href = '/cart';
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setError(error instanceof Error ? error.message : 'Məhsulu səbətə əlavə etmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Məhsullarımız</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_PRODUCTS.map((product) => (
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
                    <Link href={`/ar-viewer/${product.arId || product.id}`}>
                      <View className="mr-2 h-4 w-4" />
                      AR-da bax <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">yeni</span>
                    </Link>
                  </Button>
                )}
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => addToCart(product.id)}
                  disabled={isLoading}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Səbətə əlavə et
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}