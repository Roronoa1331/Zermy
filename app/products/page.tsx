"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
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
}

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
        
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Məhsulları yükləmək mümkün olmadı');
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

  if (error) {
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
                {product.features.slice(0, 2).map((feature, index) => (
                  <span key={index} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    {feature}
                  </span>
                ))}
                {product.features.length > 2 && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    +{product.features.length - 2} daha
                  </span>
                )}
              </div>
              
              <div className="mt-6 flex items-center gap-2">
                <Button asChild className="w-full">
                  <Link href={`/products/${product.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ətraflı
                  </Link>
                </Button>
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