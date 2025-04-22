import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import Link from "next/link"
import { FloatingContact } from "@/components/floating-contact"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Portfolio - Abdee Raja Alfarizi",
  description: "Personal portfolio website of a Universitas Siliwangi student",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-white/50">
              <div className="container flex h-16 items-center">
                <Link href="/" className="font-bold">
                  Portfolio
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                  <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
                    Home
                  </Link>
                  <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
                    About
                  </Link>
                  <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
                    Contact
                  </Link>
                  <Link href="/admin" className="text-sm font-medium hover:underline underline-offset-4">
                    Admin
                  </Link>
                </nav>
              </div>
            </header>
            {children}
            <FloatingContact />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
