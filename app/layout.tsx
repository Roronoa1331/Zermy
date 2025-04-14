import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google";
import "./globals.css"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Zermy - Xəyalındakı Yaşıl Məhsulları Al!",
  description: "Find your perfect plant companion from our curated collection of natural and artificial plants.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}



import './globals.css'