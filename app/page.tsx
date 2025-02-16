import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Products } from "@/components/products"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Products />
    </main>
  )
}

