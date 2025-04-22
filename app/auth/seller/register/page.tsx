'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Package } from 'lucide-react';

export default function SellerRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    if (data.password !== data.confirmPassword) {
      setError('Şifrələr uyğun gəlmir');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/seller/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: 'seller',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Qeydiyyat zamanı xəta baş verdi');
      }

      // Redirect to seller dashboard after successful registration
      router.push('/seller');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Qeydiyyat zamanı xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <Package className="w-12 h-12 mx-auto text-primary" />
            <CardTitle className="text-2xl">Satıcı Qeydiyyatı</CardTitle>
            <CardDescription>
              Məhsullarınızı satmaq üçün qeydiyyatdan keçin
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
                <Label htmlFor="name">Ad və Soyad</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ad və soyadınızı daxil edin"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email ünvanınızı daxil edin"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Şifrə</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Şifrənizi daxil edin"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifrəni təsdiqlə</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Şifrənizi təkrar daxil edin"
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Qeydiyyat...' : 'Qeydiyyatdan keç'}
              </Button>
              
              <div className="text-sm text-center text-muted-foreground">
                Artıq hesabınız var?{' '}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Daxil olun
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 