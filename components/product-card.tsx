import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-lg font-medium text-gray-900">{product.price.toFixed(2)} ₼</p>
        </div>
      </div>
      <Button asChild className="w-full mt-4">
        <Link href={`/cart?add=${product.id}`}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Səbətə əlavə et
        </Link>
      </Button>
    </div>
  )
} 