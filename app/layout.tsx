import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google";
import "./globals.css"
import { Navigation } from "@/components/navigation";
import AuthProvider from "@/components/providers/session-provider";

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
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}