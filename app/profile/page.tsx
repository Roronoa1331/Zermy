import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { az } from 'date-fns/locale';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/signin');
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string };
    
    const user = await (prisma as any).user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      redirect('/signin');
    }

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Profil</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">İstifadəçi ID</h3>
                  <p className="text-sm">{user.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Qeydiyyat tarixi</h3>
                  <p className="text-sm">{format(new Date(user.createdAt), 'dd MMMM yyyy', { locale: az })}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Son yenilənmə</h3>
                <p className="text-sm">{format(new Date(user.updatedAt), 'dd MMMM yyyy HH:mm', { locale: az })}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href="/profile/edit">Profili redaktə et</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/orders">Sifarişlərim</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    redirect('/signin');
  }
}