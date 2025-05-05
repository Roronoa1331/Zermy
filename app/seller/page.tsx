"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
}

interface RecentOrder {
  id: string
  productName: string
  customerName: string
  amount: number
  status: string
  date: string
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsResponse = await fetch("/api/seller/stats")
        const statsData = await statsResponse.json()

        if (!statsResponse.ok) {
          throw new Error(statsData.error || "Failed to fetch dashboard stats")
        }

        setStats(statsData)

        // Fetch recent orders
        const ordersResponse = await fetch("/api/seller/orders/recent")
        const ordersData = await ordersResponse.json()

        if (!ordersResponse.ok) {
          throw new Error(ordersData.error || "Failed to fetch recent orders")
        }

        setRecentOrders(ordersData.orders)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err instanceof Error ? err.message : "Məlumatları yükləmək mümkün olmadı")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mağaza Paneli</h2>
        <p className="text-muted-foreground">
          Mağazanızın statistikası və son sifarişlər
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Məhsullar
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Aktiv məhsulların sayı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sifarişlər
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Ümumi sifariş sayı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gəlir
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toFixed(2)} ₼
            </div>
            <p className="text-xs text-muted-foreground">
              Ümumi qazanc
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Müştərilər
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Unikal müştəri sayı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Son Sifarişlər</CardTitle>
          <CardDescription>
            Son 5 sifariş
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {order.productName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerName}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-medium">{order.amount.toFixed(2)} ₼</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 