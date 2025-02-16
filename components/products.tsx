import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Çanta 🟢",
    price: "₼50.00",
    image: "https://marksandspencer.com.ph/cdn/shop/files/SD_03_T09_1770_J0_X_EC_90.jpg?v=1699257084",

  },
  {
    id: 2,
    name: "Xalça",
    price: "₼300.00",
    image: "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/cde13f96-75ba-4b9f-87c5-1257b41cbfef._SL480_.jpg",
  },
  {
    id: 3,
    name: "Papaq",
    price: "₼30.00",
    image: "https://coalheadwear.com/cdn/shop/files/2202258_SAG_P_1.jpg?v=1726529581&width=900",
  },
  {
    id: 4,
    name: "Kepka🟢",
    price: "₼40.00",
    image: "https://images.squarespace-cdn.com/content/v1/55ccebf2e4b03e8de40a82ba/1675841523209-X7RJ8KEC4CVQUZ74C2RG/Topiku-10.jpg",
  },
  {
    id: 5,
    name: "Ayaqqabı 🟢",
    price: "₼120.00",
    image: "https://static.fibre2fashion.com/newsresource/images/249/tea_261031.jpg",
  },
  {
    id: 6,
    name: "Şam",
    price: "₼7.00",
    image: "https://cdn.shopify.com/s/files/1/2219/6397/files/Bamboo_Candle_copy_1024x1024.png?v=1698242921",
  }
  ,
  {
    id: 7,
    name: "Şampun",
    price: "₼34.00",
    image: "https://m.media-amazon.com/images/I/61Jcsp2JWOL.jpg",
  }
  ,
  {
    id: 8,
    name: "Çanta",
    price: "₼15.00",
    image: "https://lie-studio.dk/cdn/shop/files/Canvas_tote_1.jpg?v=1731332002&width=1946",
  }
  ,
  {
    id: 9,
    name: "Tumbler",
    price: "₼25.00",
    image: "https://jucycorporategifts.com/cdn/shop/files/GlassSipper.png?v=1706597815",
  }
]

export function Products() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Ən Çox Bəyənilən</h2>
            <p className="text-muted-foreground max-w-md">Yaşıl həyat üçün ekoloji dostu məhsulları asanlıqla alın</p>
          </div>
          <Button variant="secondary" className="group">
            See more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="mb-4 overflow-hidden rounded-lg bg-secondary aspect-square">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-muted-foreground">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

