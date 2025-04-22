"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Save, Trash2, LogOut, Check } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { createSupabaseClient } from "@/lib/supabase"
import { getPortfolioData, updatePortfolioData, getContactMessages, markMessageAsRead } from "@/lib/actions"
import type { PortfolioData, SkillItem, ProjectItem, SocialLink, GraphicDesignItem } from "@/lib/types"

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [contactMessages, setContactMessages] = useState<any[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  // Cek autentikasi pada component mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseClient()
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/admin/login")
        return
      }

      fetchPortfolioData()
      fetchContactMessages()
    }

    checkAuth()
  }, [router])

  const fetchPortfolioData = async () => {
    try {
      const data = await getPortfolioData()
      setPortfolioData(data)
    } catch (error) {
      console.error("Error fetching portfolio data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch portfolio data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchContactMessages = async () => {
    setIsLoadingMessages(true)
    try {
      const messages = await getContactMessages()
      setContactMessages(messages)
    } catch (error) {
      console.error("Error fetching contact messages:", error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseClient()
      await supabase.auth.signOut()
      router.push("/admin/login")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handleSaveAll = async () => {
    if (!portfolioData) return

    setIsLoading(true)
    try {
      const result = await updatePortfolioData(portfolioData)

      if (result.success) {
        toast({
          title: "Changes saved",
          description: "Your portfolio has been updated successfully",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const result = await markMessageAsRead(messageId)

      if (result.success) {
        // Update local state
        setContactMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)),
        )

        toast({
          title: "Message updated",
          description: "Message marked as read",
        })
      }
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  // Profile section handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!portfolioData) return

    setPortfolioData({
      ...portfolioData,
      [e.target.id]: e.target.value,
    })
  }

  // About section handlers
  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!portfolioData) return

    setPortfolioData({
      ...portfolioData,
      [e.target.id]: e.target.value,
    })
  }

  // Skills section handlers
  const handleSkillChange = (index: number, field: string, value: string | number) => {
    if (!portfolioData) return

    const updatedSkills = [...portfolioData.skills]
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: field === "level" ? Number(value) : value,
    }
    setPortfolioData({
      ...portfolioData,
      skills: updatedSkills,
    })
  }

  const handleAddSkill = () => {
    if (!portfolioData) return

    const newSkill: SkillItem = { name: "New Skill", level: 50 }
    setPortfolioData({
      ...portfolioData,
      skills: [...portfolioData.skills, newSkill],
    })
  }

  const handleRemoveSkill = (index: number) => {
    if (!portfolioData) return

    const updatedSkills = [...portfolioData.skills]
    updatedSkills.splice(index, 1)
    setPortfolioData({
      ...portfolioData,
      skills: updatedSkills,
    })
  }

  // Projects section handlers
  const handleProjectChange = (index: number, field: string, value: string) => {
    if (!portfolioData) return

    const updatedProjects = [...portfolioData.projects]
    if (field === "technologies") {
      updatedProjects[index] = {
        ...updatedProjects[index],
        technologies: value.split(",").map((tech) => tech.trim()),
      }
    } else {
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value,
      }
    }
    setPortfolioData({
      ...portfolioData,
      projects: updatedProjects,
    })
  }

  const handleAddProject = () => {
    if (!portfolioData) return

    const newProject: ProjectItem = {
      title: "New Project",
      description: "Project description",
      image: "/placeholder.svg?height=225&width=400",
      technologies: ["Technology"],
      demoUrl: "#",
      githubUrl: "#",
    }

    setPortfolioData({
      ...portfolioData,
      projects: [...portfolioData.projects, newProject],
    })
  }

  const handleRemoveProject = (index: number) => {
    if (!portfolioData) return

    const updatedProjects = [...portfolioData.projects]
    updatedProjects.splice(index, 1)
    setPortfolioData({
      ...portfolioData,
      projects: updatedProjects,
    })
  }

  // Graphic Designs section handlers
  const handleDesignChange = (index: number, field: string, value: string) => {
    if (!portfolioData) return

    const updatedDesigns = [...portfolioData.graphicDesigns]
    if (field === "tools") {
      updatedDesigns[index] = {
        ...updatedDesigns[index],
        tools: value.split(",").map((tool) => tool.trim()),
      }
    } else {
      updatedDesigns[index] = {
        ...updatedDesigns[index],
        [field]: value,
      }
    }
    setPortfolioData({
      ...portfolioData,
      graphicDesigns: updatedDesigns,
    })
  }

  const handleAddDesign = () => {
    if (!portfolioData) return

    const newDesign: GraphicDesignItem = {
      title: "New Design",
      description: "Design description",
      image: "/placeholder.svg?height=400&width=400",
      category: "Digital Design",
      tools: ["Adobe Photoshop"],
      date: new Date().toISOString().split("T")[0],
    }

    setPortfolioData({
      ...portfolioData,
      graphicDesigns: [...portfolioData.graphicDesigns, newDesign],
    })
  }

  const handleRemoveDesign = (index: number) => {
    if (!portfolioData) return

    const updatedDesigns = [...portfolioData.graphicDesigns]
    updatedDesigns.splice(index, 1)
    setPortfolioData({
      ...portfolioData,
      graphicDesigns: updatedDesigns,
    })
  }

  // Social links handlers
  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    if (!portfolioData) return

    const updatedLinks = [...portfolioData.socialLinks]
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value,
    }
    setPortfolioData({
      ...portfolioData,
      socialLinks: updatedLinks,
    })
  }

  const handleAddSocialLink = () => {
    if (!portfolioData) return

    const newLink: SocialLink = { name: "New Platform", url: "#" }
    setPortfolioData({
      ...portfolioData,
      socialLinks: [...portfolioData.socialLinks, newLink],
    })
  }

  const handleRemoveSocialLink = (index: number) => {
    if (!portfolioData) return

    const updatedLinks = [...portfolioData.socialLinks]
    updatedLinks.splice(index, 1)
    setPortfolioData({
      ...portfolioData,
      socialLinks: updatedLinks,
    })
  }

  // Image upload handlers
  const handleProfileImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const result = await response.json()

      if (result.success && portfolioData) {
        setPortfolioData({
          ...portfolioData,
          profileImage: result.filepath,
        })

        toast({
          title: "Image uploaded",
          description: "Profile image uploaded successfully",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload profile image",
        variant: "destructive",
      })
    }
  }

  const handleProjectImageUpload = async (file: File, index: number) => {
    if (!portfolioData) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const result = await response.json()

      if (result.success) {
        const updatedProjects = [...portfolioData.projects]
        updatedProjects[index] = {
          ...updatedProjects[index],
          image: result.filepath,
        }

        setPortfolioData({
          ...portfolioData,
          projects: updatedProjects,
        })

        toast({
          title: "Image uploaded",
          description: "Project image uploaded successfully",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload project image",
        variant: "destructive",
      })
    }
  }

  const handleDesignImageUpload = async (file: File, index: number) => {
    if (!portfolioData) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const result = await response.json()

      if (result.success) {
        const updatedDesigns = [...portfolioData.graphicDesigns]
        updatedDesigns[index] = {
          ...updatedDesigns[index],
          image: result.filepath,
        }

        setPortfolioData({
          ...portfolioData,
          graphicDesigns: updatedDesigns,
        })

        toast({
          title: "Image uploaded",
          description: "Design image uploaded successfully",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload design image",
        variant: "destructive",
      })
    }
  }

  if (!portfolioData) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your portfolio data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio content</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSaveAll}
            disabled={isLoading}
            className="transition-all duration-300 hover:scale-[1.02]"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save All Changes"}
          </Button>
          <Button variant="outline" onClick={handleLogout} className="transition-all duration-300 hover:scale-[1.02]">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger
            value="profile"
            className="transition-all duration-300 data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="transition-all duration-300 data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="transition-all duration-300 data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
          >
            Skills
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="transition-all duration-300 data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="designs"
            className="transition-all duration-300 data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
          >
            Designs
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="transition-all duration-300 data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
          >
            Contact
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="transition-all duration-300 data-[state=active]:bg-zinc-900 data-[state=active]:text-white"
          >
            Messages
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 py-4">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 transition-all duration-500 hover:shadow-md">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your basic profile information displayed on the landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={portfolioData.name}
                  onChange={handleProfileChange}
                  className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={portfolioData.tagline}
                  onChange={handleProfileChange}
                  className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile-image">Profile Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-muted">
                    <img
                      src={portfolioData.profileImage || "/placeholder.svg?height=96&width=96"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <FileUpload onUpload={handleProfileImageUpload} label="Upload New Image" />
                </div>
              </div>
              <Button className="transition-all duration-300 hover:scale-[1.02]" onClick={handleSaveAll}>
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-4 py-4">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 transition-all duration-500 hover:shadow-md">
            <CardHeader>
              <CardTitle>About Information</CardTitle>
              <CardDescription>Update your about section information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="about">About Text</Label>
                <Textarea
                  id="about"
                  rows={5}
                  value={portfolioData.about}
                  onChange={handleAboutChange}
                  className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  value={portfolioData.university}
                  onChange={handleAboutChange}
                  className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="developerInfo">Developer Info</Label>
                <Input
                  id="developerInfo"
                  value={portfolioData.developerInfo}
                  onChange={handleAboutChange}
                  className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="resumeUrl">Resume URL</Label>
                <Input
                  id="resumeUrl"
                  value={portfolioData.resumeUrl}
                  onChange={handleAboutChange}
                  className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                />
              </div>
              <Button className="transition-all duration-300 hover:scale-[1.02]" onClick={handleSaveAll}>
                Save About Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4 py-4">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 transition-all duration-500 hover:shadow-md">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Manage your skills and proficiency levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.skills.map((skill, index) => (
                  <div key={index} className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Input
                        value={skill.name}
                        onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                        className="w-2/3 bg-white/50 transition-all duration-300 focus:bg-white/80"
                        placeholder="Skill name"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={skill.level}
                          onChange={(e) => handleSkillChange(index, "level", e.target.value)}
                          min="0"
                          max="100"
                          className="w-20 bg-white/50 transition-all duration-300 focus:bg-white/80"
                        />
                        <span>%</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-red-500 transition-all duration-300 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="mt-4 transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleAddSkill}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Skill
                </Button>
              </div>
              <Button className="mt-6 transition-all duration-300 hover:scale-[1.02]" onClick={handleSaveAll}>
                Save Skills
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4 py-4">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 transition-all duration-500 hover:shadow-md">
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage your portfolio projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {portfolioData.projects.map((project, index) => (
                  <Card
                    key={index}
                    className="backdrop-blur-sm bg-white/5 border-white/10 transition-all duration-500 hover:shadow-md"
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProject(index)}
                          className="text-red-500 transition-all duration-300 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                        <Input
                          id={`project-title-${index}`}
                          value={project.title}
                          onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                          className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`project-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`project-desc-${index}`}
                          value={project.description}
                          onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                          className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`project-image-${index}`}>Project Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-36 overflow-hidden rounded-md bg-muted">
                            <img
                              src={project.image || "/placeholder.svg?height=80&width=144"}
                              alt="Project"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <FileUpload
                            onUpload={(file) => handleProjectImageUpload(file, index)}
                            label="Upload New Image"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`project-tech-${index}`}>Technologies</Label>
                        <Input
                          id={`project-tech-${index}`}
                          value={project.technologies.join(", ")}
                          onChange={(e) => handleProjectChange(index, "technologies", e.target.value)}
                          className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`project-demo-${index}`}>Demo URL</Label>
                          <Input
                            id={`project-demo-${index}`}
                            value={project.demoUrl}
                            onChange={(e) => handleProjectChange(index, "demoUrl", e.target.value)}
                            className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`project-github-${index}`}>GitHub URL</Label>
                          <Input
                            id={`project-github-${index}`}
                            value={project.githubUrl}
                            onChange={(e) => handleProjectChange(index, "githubUrl", e.target.value)}
                            className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleAddProject}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              </div>
              <Button className="mt-6 transition-all duration-300 hover:scale-[1.02]" onClick={handleSaveAll}>
                Save Projects
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Graphic Designs Tab */}
        <TabsContent value="designs" className="space-y-4 py-4">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 transition-all duration-500 hover:shadow-md">
            <CardHeader>
              <CardTitle>Graphic Designs</CardTitle>
              <CardDescription>Manage your graphic design portfolio items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {portfolioData.graphicDesigns.map((design, index) => (
                  <Card
                    key={index}
                    className="backdrop-blur-sm bg-white/5 border-white/10 transition-all duration-500 hover:shadow-md"
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{design.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDesign(index)}
                          className="text-red-500 transition-all duration-300 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`design-title-${index}`}>Design Title</Label>
                        <Input
                          id={`design-title-${index}`}
                          value={design.title}
                          onChange={(e) => handleDesignChange(index, "title", e.target.value)}
                          className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`design-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`design-desc-${index}`}
                          value={design.description}
                          onChange={(e) => handleDesignChange(index, "description", e.target.value)}
                          className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`design-image-${index}`}>Design Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-24 w-24 overflow-hidden rounded-md bg-muted">
                            <img
                              src={design.image || "/placeholder.svg?height=96&width=96"}
                              alt="Design"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <FileUpload
                            onUpload={(file) => handleDesignImageUpload(file, index)}
                            label="Upload New Image"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`design-category-${index}`}>Category</Label>
                        <Input
                          id={`design-category-${index}`}
                          value={design.category}
                          onChange={(e) => handleDesignChange(index, "category", e.target.value)}
                          className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`design-tools-${index}`}>Tools Used</Label>
                        <Input
                          id={`design-tools-${index}`}
                          value={design.tools.join(", ")}
                          onChange={(e) => handleDesignChange(index, "tools", e.target.value)}
                          className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`design-client-${index}`}>Client (Optional)</Label>
                          <Input
                            id={`design-client-${index}`}
                            value={design.client || ""}
                            onChange={(e) => handleDesignChange(index, "client", e.target.value)}
                            className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`design-date-${index}`}>Date</Label>
                          <Input
                            id={`design-date-${index}`}
                            type="date"
                            value={design.date.split("T")[0]}
                            onChange={(e) => handleDesignChange(index, "date", e.target.value)}
                            className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleAddDesign}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Design
                </Button>
              </div>
              <Button className="mt-6 transition-all duration-300 hover:scale-[1.02]" onClick={handleSaveAll}>
                Save Designs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4 py-4">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 transition-all duration-500 hover:shadow-md">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details and social media links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={portfolioData.email}
                  onChange={handleProfileChange}
                  className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={portfolioData.github}
                  onChange={handleProfileChange}
                  className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Links</h3>
                {portfolioData.socialLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`social-name-${index}`}>Platform</Label>
                      <Input
                        id={`social-name-${index}`}
                        value={link.name}
                        onChange={(e) => handleSocialLinkChange(index, "name", e.target.value)}
                        className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                      />
                    </div>
                    <div className="grid gap-2 relative">
                      <Label htmlFor={`social-url-${index}`}>URL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`social-url-${index}`}
                          value={link.url}
                          onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                          className="bg-white/50 transition-all duration-300 focus:bg-white/80"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSocialLink(index)}
                          className="text-red-500 transition-all duration-300 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleAddSocialLink}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Social Link
                </Button>
              </div>
              <Button className="transition-all duration-300 hover:scale-[1.02]" onClick={handleSaveAll}>
                Save Contact Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4 py-4">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 transition-all duration-500 hover:shadow-md">
            <CardHeader>
              <CardTitle>Contact Form Messages</CardTitle>
              <CardDescription>View messages submitted through your contact form</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMessages ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading messages...</p>
                </div>
              ) : contactMessages.length > 0 ? (
                <div className="space-y-4">
                  {contactMessages.map((message, index) => (
                    <Card
                      key={index}
                      className={`backdrop-blur-sm ${message.read ? "bg-white/5" : "bg-white/10"} border-white/10`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{message.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.created_at).toLocaleString()}
                            </span>
                            {!message.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsRead(message.id)}
                                className="h-7 px-2"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{message.email}</p>
                        <p className="text-sm">{message.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
