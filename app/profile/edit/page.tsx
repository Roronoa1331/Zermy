"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface User {
  id: string;
  name: string;
  email: string;
}

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/auth")
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
    }

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Profil yeniləmə xətası")
      }

      setSuccess("Profil uğurla yeniləndi")
      localStorage.setItem("user", JSON.stringify(result.user))
      setUser(result.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profil yeniləmə xətası")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profil Məlumatlarını Yenilə</CardTitle>
          <CardDescription>
            Profil məlumatlarınızı yeniləyin və ya şifrənizi dəyişin
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Ad</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Cari Şifrə</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Şifrəni dəyişmək üçün doldurun"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Şifrə</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Yeni şifrə"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/profile">
              <Button variant="outline" type="button">
                Geri
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Yenilənir..." : "Yenilə"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 