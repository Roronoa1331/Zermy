'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  modelUrl?: string;
  hasAR: boolean;
  features: string[];
  createdAt: string;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (!response.ok) {
          router.push('/auth');
          return;
        }
        
        if (data.role !== 'seller') {
          setIsSeller(false);
          setError('Bu səhifə yalnız satıcılar üçün mövcuddur');
        } else {
          setIsSeller(true);
          fetchProducts();
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/seller/products');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Məhsulları yükləmək mümkün olmadı');
      }
      
      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Məhsulları yükləmək mümkün olmadı');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bu məhsulu silmək istədiyinizə əminsiniz?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Məhsulu silmək mümkün olmadı');
      }
      
      setProducts(products.filter(product => product.id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Məhsulu silmək mümkün olmadı');
    }
  };

  if (loading) {
    return (
      <div className="container py-16">
        <div className="text-center">Yüklənir...</div>
      </div>
    );
  }

  if (!isSeller) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Satıcı Paneli</h1>
            <p className="text-xl text-muted-foreground">
              {error || 'Bu səhifə yalnız satıcılar üçün mövcuddur'}
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/products">Məhsullara qayıt</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Satıcı Paneli</h1>
        <Button asChild>
          <Link href="/seller/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Məhsul
          </Link>
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-medium">Hələ heç bir məhsulunuz yoxdur</h2>
              <p className="text-muted-foreground">
                Yeni məhsul əlavə etmək üçün "Yeni Məhsul" düyməsini istifadə edin
              </p>
              <Button asChild>
                <Link href="/seller/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Məhsul
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="pb-2">
                <div className="aspect-square overflow-hidden rounded-md mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                <CardDescription>{product.price.toFixed(2)} AZN</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/seller/products/${product.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Düzəlt
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 