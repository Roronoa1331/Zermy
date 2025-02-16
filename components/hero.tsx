import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function Hero() {
  return (
    <section className="bg-primary">
      <div className="container px-4 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Həm təbiət, <br></br> Həm cüzdan üçün sərfəli ticarət!🌿</h1>
            <div className="flex gap-12">
              <div>
                <p className="text-3xl font-bold">50+</p>
                <p className="text-muted-foreground">Məhsul</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100+</p>
                <p className="text-muted-foreground">Müştəri</p>
              </div>
            </div>
            <div className="relative max-w-md">
              <Input type="search" placeholder="Yaşıl dünyanıza nə əlavə edək?" className="pl-4 pr-10 py-6 text-base" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="relative">
          <div className="aspect-square relative overflow-hidden" >
            <Image
                src="https://treedefi.com/static/media/mascotte.2927842f1f70a1efea48a0595268bff9.svg"
                alt="Plant in a pot"
                width={600}
                height={600}
                className="object-cover"
              />
            </div>
            {/* <div className="aspect-square rounded-full bg-black relative overflow-hidden">
              <Image
                src="https://img.freepik.com/free-vector/biodegradable-recycle-leaves-sign_78370-829.jpg?semt=ais_hybrid"
                alt="Plant in a pot"
                width={800}
                height={800}
                className="object-cover"
              />
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}

