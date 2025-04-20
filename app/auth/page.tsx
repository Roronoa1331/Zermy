"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Define a type for our user
type User = {
  name: string;
  email: string;
  password: string;
}

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser')
    if (loggedInUser) {
      router.push('/')
    }
  }, [router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Find user with matching email and password
    const user = users.find((u: User) => u.email === email && u.password === password)
    
    if (user) {
      // Store current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user))
      setSuccess('Uğurla daxil oldunuz!')
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      setError('Email və ya şifrə yanlışdır')
    }
    
    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email-signup') as HTMLInputElement).value
    const password = (form.elements.namedItem('password-signup') as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem('password-confirm') as HTMLInputElement).value
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Şifrələr uyğun gəlmir')
      setIsLoading(false)
      return
    }
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if email already exists
    if (users.some((u: User) => u.email === email)) {
      setError('Bu email artıq istifadə olunur')
      setIsLoading(false)
      return
    }
    
    // Create new user
    const newUser: User = {
      name,
      email,
      password
    }
    
    // Add user to users array
    users.push(newUser)
    
    // Save updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(users))
    
    // Store current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    
    setSuccess('Hesabınız uğurla yaradıldı!')
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      router.push('/')
    }, 1500)
    
    setIsLoading(false)
  }

  return (
    <div className="container py-16">
      <div className="fixed top-4 left-4 z-10">
        <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri qayıt
          </Link>
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Hesabınıza daxil olun</CardTitle>
            <CardDescription className="text-center">
              Hesabınıza daxil olun və ya yeni hesab yaradın
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {success}
              </div>
            )}
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Daxil ol</TabsTrigger>
                <TabsTrigger value="signup">Qeydiyyatdan keç</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Şifrə</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Yüklənir..." : "Daxil ol"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Ad</Label>
                      <Input id="name" placeholder="Adınız" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input id="email-signup" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password-signup">Şifrə</Label>
                      <Input id="password-signup" type="password" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password-confirm">Şifrəni təsdiqləyin</Label>
                      <Input id="password-confirm" type="password" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Yüklənir..." : "Qeydiyyatdan keç"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-sm text-center text-gray-500">
              Qeydiyyatdan keçməklə, bizim <Link href="/terms" className="text-blue-500 hover:underline">İstifadə Şərtləri</Link> və <Link href="/privacy" className="text-blue-500 hover:underline">Məxfilik Siyasəti</Link> ilə razılaşırsınız.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 