"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink, Github, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/lib/db"
import { ImageDisplay } from "@/components/image-display"

interface ProjectsTabProps {
  onStatsUpdate: () => void
}

export function ProjectsTab({ onStatsUpdate }: ProjectsTabProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repo_url: "",
    demo_url: "",
    tech_stack: "",
    image_data: "",
    image_type: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      const base64Data = result.split(",")[1] // Remove data:image/...;base64, prefix

      setFormData((prev) => ({
        ...prev,
        image_data: base64Data,
        image_type: file.type,
      }))
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image_data && !editingProject) {
      toast({
        title: "Image required",
        description: "Please select an image to upload.",
        variant: "destructive",
      })
      return
    }

    const projectData = {
      ...formData,
      tech_stack: formData.tech_stack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
    }

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects"
      const method = editingProject ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        await fetchProjects()
        onStatsUpdate()
        setIsDialogOpen(false)
        resetForm()
        toast({
          title: editingProject ? "Project updated" : "Project created",
          description: `The project has been successfully ${editingProject ? "updated" : "created"}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingProject ? "update" : "create"} project.`,
        variant: "destructive",
      })
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProjects((prev) => prev.filter((project) => project.id !== id))
        onStatsUpdate()
        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      repo_url: project.repo_url || "",
      demo_url: project.demo_url || "",
      tech_stack: project.tech_stack.join(", "),
      image_data: project.image_data,
      image_type: project.image_type,
    })
    setImagePreview(`data:${project.image_type};base64,${project.image_data}`)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingProject(null)
    setFormData({
      title: "",
      description: "",
      repo_url: "",
      demo_url: "",
      tech_stack: "",
      image_data: "",
      image_type: "",
    })
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="w-full h-48 bg-gray-300" />
            <CardHeader>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Projects</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Repository URL</label>
                  <Input
                    value={formData.repo_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, repo_url: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Demo URL</label>
                  <Input
                    value={formData.demo_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, demo_url: e.target.value }))}
                    placeholder="https://demo.example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
                <Input
                  required
                  value={formData.tech_stack}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tech_stack: e.target.value }))}
                  placeholder="React, Next.js, TypeScript, Tailwind CSS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Image</label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Choose Image</span>
                    </Button>
                    <span className="text-sm text-gray-500">Max 5MB, JPG/PNG/GIF</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {imagePreview && (
                    <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingProject ? "Update" : "Create"} Project</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-white/5 border-white/10">
            <div className="relative overflow-hidden">
              <ImageDisplay
                imageData={project.image_data}
                imageType={project.image_type}
                alt={project.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">{project.description}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_stack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                {project.repo_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </a>
                  </Button>
                )}
                {project.demo_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
