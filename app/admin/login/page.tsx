"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { createSupabaseClient } from "@/lib/supabase"
import { loginAdmin } from "@/lib/actions"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Cek apakah user sudah login
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createSupabaseClient()
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.push("/admin/dashboard")
      }
    }

    checkSession()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await loginAdmin({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        // Simpan session di client-side
        const supabase = createSupabaseClient()
        await supabase.auth.setSession({
          access_token: result.session?.access_token || "",
          refresh_token: result.session?.refresh_token || "",
        })

        router.push("/admin/dashboard")
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        })
      } else {
        toast({
          title: "Login failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <div className="absolute inset-0 -z-10 animate-gradient-x bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 opacity-50"></div>
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/20 border-white/20 transition-all duration-500 hover:shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
                className="bg-white/50 transition-all duration-300 focus:bg-white/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                required
                className="bg-white/50 transition-all duration-300 focus:bg-white/80"
              />
            </div>
            <Button
              type="submit"
              className="w-full transition-all duration-300 hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
