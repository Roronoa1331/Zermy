"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

// Product data
const products = [
  {
    id: 1,
    name: "Çanta 🟢",
    price: 50.00,
    image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",
    description: "Eko-dostu materiallardan hazırlanmış, davamlı və şık çanta. Gündəlik istifadə üçün ideal.",
    features: [
      "100% təbii material",
      "Suyadavamlı",
      "Yüngül və rahat",
      "Çoxməqsədli dizayn"
    ]
  },
  {
    id: 6,
    name: "Şam",
    price: 7.00,
    image: "https://cdn.shopify.com/s/files/1/2219/6397/files/Bamboo_Candle_copy_1024x1024.png?v=1698242921",
    description: "Təbii bal mumundan hazırlanmış, ətraf mühitə zərərsiz şam. Evinizə rahatlıq gətirir.",
    features: [
      "Təbii bal mumu",
      "Uzun yanma müddəti",
      "Ətraf mühitə zərərsiz",
      "Xoş qoxu"
    ]
  },
  {
    id: 2,
    name: "Xalça",
    price: 300.00,
    image: "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/cde13f96-75ba-4b9f-87c5-1257b41cbfef._SL480_.jpg",
    description: "Əl toxunması, təbii yun xalça. Ənənəvi naxışlar və yüksək keyfiyyətli material.",
    features: [
      "Əl toxunması",
      "Təbii yun",
      "Ənənəvi naxışlar",
      "Uzunömürlü"
    ]
  },
  {
    id: 3,
    name: "Papaq",
    price: 30.00,
    image: "https://coalheadwear.com/cdn/shop/files/2202258_SAG_P_1.jpg?v=1726529581&width=900",
    description: "Təbii yundan hazırlanmış, isti və rahat papaq. Qış ayları üçün ideal.",
    features: [
      "Təbii yun",
      "İsti və rahat",
      "Müxtəlif ölçülər",
      "Yuyula bilən"
    ]
  },
  {
    id: 4,
    name: "Kepka🟢",
    price: 40.00,
    image: "https://images.squarespace-cdn.com/content/v1/55ccebf2e4b03e8de40a82ba/1675841523209-X7RJ8KEC4CVQUZ74C2RG/Topiku-10.jpg",
    description: "Eko-dostu materiallardan hazırlanmış, modern dizaynlı kepka. Gündəlik istifadə üçün ideal.",
    features: [
      "Eko-dostu material",
      "Modern dizayn",
      "Yüngül və rahat",
      "UV qoruyucu"
    ]
  },
  {
    id: 5,
    name: "Ayaqqabı 🟢",
    price: 120.00,
    image: "https://static.fibre2fashion.com/newsresource/images/249/tea_261031.jpg",
    description: "Təbii dəridən hazırlanmış, rahat və davamlı ayaqqabı. Hər gün üçün ideal.",
    features: [
      "Təbii dəri",
      "Rahat və davamlı",
      "Müxtəlif ölçülər",
      "Yüksək keyfiyyət"
    ]
  },
  {
    id: 7,
    name: "Şampun",
    price: 34.00,
    image: "https://m.media-amazon.com/images/I/61Jcsp2JWOL.jpg",
    description: "Təbii tərkibli, saçlarınız üçün qayğılı şampun. Kimyəvi maddələrdən azaddır.",
    features: [
      "Təbii tərkib",
      "Kimyəvi maddələrdən azad",
      "Saçları qoruyur",
      "Həssas dəriyə uyğun"
    ]
  },
  {
    id: 8,
    name: "Çanta",
    price: 15.00,
    image: "https://lie-studio.dk/cdn/shop/files/Canvas_tote_1.jpg?v=1731332002&width=1946",
    description: "Eko-dostu materiallardan hazırlanmış, praktik və şık çanta. Gündəlik istifadə üçün ideal.",
    features: [
      "Eko-dostu material",
      "Praktik dizayn",
      "Yüngül və rahat",
      "Çoxməqsədli"
    ]
  },
  {
    id: 9,
    name: "Tumbler",
    price: 25.00,
    image: "https://jucycorporategifts.com/cdn/shop/files/GlassSipper.png?v=1706597815",
    description: "Təbii materiallardan hazırlanmış, isti və soyuq içkilər üçün ideal tumbler.",
    features: [
      "Təbii material",
      "İsti və soyuq saxlayır",
      "Suyadavamlı",
      "Yüngül və rahat"
    ]
  }
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const [cartItems, setCartItems] = useState<typeof products>([])

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    // Handle adding items to cart
    const productId = searchParams.get('add')
    if (productId) {
      const product = products.find(p => p.id === Number(productId))
      if (product) {
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id)
          if (existingItem) {
            return prevItems
          }
          const newItems = [...prevItems, product]
          localStorage.setItem('cart', JSON.stringify(newItems))
          return newItems
        })
      }
    }
  }, [searchParams])

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Məhsullarımız</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-lg font-medium mt-2">{product.price.toFixed(2)} ₼</p>
                <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
              </div>
            </Link>
            <div className="p-4 pt-0 flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/cart?add=${product.id}`}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Səbətə əlavə et
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/ar/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  AR-da bax
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
} 