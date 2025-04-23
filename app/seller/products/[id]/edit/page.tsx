'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X } from 'lucide-react';
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
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [features, setFeatures] = useState<string[]>(['']);
  const [hasAR, setHasAR] = useState(false);

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
          fetchProduct();
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        router.push('/auth');
      }
    };
    
    checkAuth();
  }, [router, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/seller/products/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Məhsulu yükləmək mümkün olmadı');
      }
      
      setProduct(data.product);
      setFeatures(data.product.features.length > 0 ? data.product.features : ['']);
      setHasAR(data.product.hasAR);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Məhsulu yükləmək mümkün olmadı');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = [...features];
      newFeatures.splice(index, 1);
      setFeatures(newFeatures);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      image: formData.get('image'),
      modelUrl: formData.get('modelUrl') || null,
      hasAR,
      features: features.filter(feature => feature.trim() !== ''),
    };

    try {
      const response = await fetch(`/api/seller/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Məhsulu yeniləmək mümkün olmadı');
      }

      router.push('/seller');
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Məhsulu yeniləmək mümkün olmadı');
    } finally {
      setSaving(false);
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
            <h1 className="text-3xl font-bold">Məhsulu Düzəlt</h1>
            <p className="text-xl text-muted-foreground">
              {error || 'Bu səhifə yalnız satıcılar üçün mövcuddur'}
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/products">
                Məhsullara qayıt
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Məhsul Tapılmadı</h1>
            <p className="text-xl text-muted-foreground">
              Axtardığınız məhsul tapılmadı və ya silinib
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/seller">
                Satıcı panelinə qayıt
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/seller">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Satıcı panelinə qayıt
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Məhsulu Düzəlt</CardTitle>
            <CardDescription>
              Məhsul məlumatlarını yeniləyin
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Məhsulun adı</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={product.name}
                  required
                  placeholder="Məhsulun adını daxil edin"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Təsvir</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={product.description}
                  required
                  placeholder="Məhsul haqqında ətraflı məlumat"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Qiymət (AZN)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product.price}
                  required
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Şəkil URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  defaultValue={product.image}
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modelUrl">3D Model URL və ya Fayl</Label>
                <div className="space-y-4">
                  <Input
                    id="modelUrl"
                    name="modelUrl"
                    type="url"
                    defaultValue={product.modelUrl || ''}
                    placeholder="https://example.com/model.glb"
                  />
                  <div className="flex items-center gap-2">
                    <Label htmlFor="modelFile" className="text-sm text-muted-foreground">və ya</Label>
                    <Input
                      id="modelFile"
                      name="modelFile"
                      type="file"
                      accept=".glb,.gltf"
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dəstəklənən formatlar: .glb, .gltf
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasAR"
                  checked={hasAR}
                  onCheckedChange={setHasAR}
                />
                <Label htmlFor="hasAR">AR dəstəyi</Label>
              </div>
              
              <div className="space-y-2">
                <Label>Xüsusiyyətlər</Label>
                {features.map((feature, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Xüsusiyyət ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFeature(index)}
                      disabled={features.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddFeature}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Xüsusiyyət əlavə et
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? 'Yenilənir...' : 'Yenilə'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 