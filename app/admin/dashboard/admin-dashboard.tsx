"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { LogOut, MessageSquare, ImageIcon, FolderOpen, Home } from "lucide-react"
import { MessagesTab } from "./messages-tab"
import { ProjectsTab } from "./projects-tab"
import { GalleryTab } from "./gallery-tab"
import Link from "next/link"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    messages: 0,
    projects: 0,
    gallery: 0,
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [messagesRes, projectsRes, galleryRes] = await Promise.all([
        fetch("/api/messages"),
        fetch("/api/projects"),
        fetch("/api/gallery"),
      ])

      const [messages, projects, gallery] = await Promise.all([
        messagesRes.json(),
        projectsRes.json(),
        galleryRes.json(),
      ])

      setStats({
        messages: messages.length,
        projects: projects.length,
        gallery: gallery.length,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of the admin dashboard.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/10 to-sky-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-gray-600 mt-2">Manage your portfolio content</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 rounded-xl"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.messages}</div>
              <p className="text-xs text-muted-foreground">Contact form submissions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.projects}</div>
              <p className="text-xs text-muted-foreground">Portfolio projects</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery</CardTitle>
              <ImageIcon className="h-4 w-4 text-sky-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-600">{stats.gallery}</div>
              <p className="text-xs text-muted-foreground">Design works</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-800">Content Management</CardTitle>
            <CardDescription>Manage your portfolio content, messages, and gallery</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="messages" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <TabsTrigger
                  value="messages"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-blue-600 rounded-lg transition-all duration-300"
                >
                  Messages
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-indigo-600 rounded-lg transition-all duration-300"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-sky-600 rounded-lg transition-all duration-300"
                >
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="messages" className="mt-6">
                <MessagesTab onStatsUpdate={fetchStats} />
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <ProjectsTab onStatsUpdate={fetchStats} />
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <GalleryTab onStatsUpdate={fetchStats} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
