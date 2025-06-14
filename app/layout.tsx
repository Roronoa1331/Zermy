import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google";
import "./globals.css"
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zermy - Eko-dostu məhsullar",
  description: "Təbiət dostu məhsullar və dayanıqlı həyat üçün",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}