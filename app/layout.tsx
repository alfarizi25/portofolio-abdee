import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Abdee Raja Alfarizi - Full Stack Developer & Designer",
  description:
    "Portfolio website of Abdee Raja Alfarizi, a passionate full-stack developer and UI/UX designer specializing in modern web technologies.",
  keywords: "full stack developer, UI/UX designer, React, Next.js, TypeScript, portfolio",
  authors: [{ name: "Abdee Raja Alfarizi" }],
  openGraph: {
    title: "Abdee Raja Alfarizi - Full Stack Developer & Designer",
    description: "Portfolio website showcasing projects and skills in web development and design.",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.dev'
    
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head> 
      <link rel="icon" href="/logoT.png" />
      </head>
      <body className={inter.className}>
        {children}
        <div className="fixed z-[9999]">
          <Toaster />
        </div>
      </body>
    </html>
  )
}
