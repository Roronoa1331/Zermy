import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google";
import "./globals.css"
import { Navigation } from "@/components/navigation"
import Script from "next/script"
import AuthProvider from "@/components/providers/session-provider";

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
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
        <Script 
          src="https://scripts.simpleanalyticscdn.com/latest.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}