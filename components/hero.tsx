"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    // Fetch the waitlist count from the API
    const fetchWaitlistCount = async () => {
      try {
        const response = await fetch('/api/waitlist');
        const data = await response.json();
        
        if (response.ok) {
          // Use the actual count from database
          setCustomerCount(data.count || 0);
        }
      } catch (error) {
        console.error("Error fetching waitlist count:", error);
      }
    };

    fetchWaitlistCount();
  }, []);

  return (
    <section className="bg-primary h-screen flex items-center">
      <div className="container px-4">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-6xl font-bold tracking-tight leading-tight md:leading-normal">
              Həm təbiət, <br /> Həm pul kisəniz üçün sərfəli ticarət!🌿
            </h1>
            <div className="flex gap-6 md:gap-12">
              <div>
                <p className="text-2xl md:text-3xl font-bold">50+</p>
                <p className="text-sm md:text-base text-muted-foreground">Məhsul</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">{customerCount}+</p>
                <p className="text-sm md:text-base text-muted-foreground">Müştəri</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative max-w-full md:max-w-md">
                <Input
                  type="search"
                  placeholder="Yaşıl dünyanıza nə əlavə edək?"
                  className="pl-4 pr-10 py-4 md:py-6 text-sm md:text-base"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button 
                asChild 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 text-white py-6 px-6 font-medium shadow-md hover:shadow-lg transition-all duration-1000000 animate-pulse"
              >
                <Link href="/waitlist">
                  Gözləmə Siyahısına Qatıl!
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src="https://treedefi.com/static/media/mascotte.2927842f1f70a1efea48a0595268bff9.svg"
                alt="Plant in a pot"
                width={600}
                height={600}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


