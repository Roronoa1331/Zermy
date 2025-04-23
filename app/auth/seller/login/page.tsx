'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Package } from 'lucide-react';

export default function SellerLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('/api/auth/seller/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Daxil olma zamanı xəta baş verdi');
      }

      // Redirect to seller dashboard after successful login
      router.push('/seller');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Daxil olma zamanı xəta baş verdi');
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
            <CardTitle className="text-2xl">Satıcı Girişi</CardTitle>
            <CardDescription>
              Satıcı hesabınıza daxil olun
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
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Daxil olunur...' : 'Daxil ol'}
              </Button>
              
              <div className="text-sm text-center text-muted-foreground">
                Hesabınız yoxdur?{' '}
                <Link href="/auth/seller/register" className="text-primary hover:underline">
                  Qeydiyyatdan keçin
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 