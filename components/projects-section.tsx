"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Eye, FolderOpen, X, ZoomIn, Globe } from "lucide-react"
import type { Project } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { ImageDisplay } from "./image-display"

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setProjects(data)
      } else {
        console.error("Projects data is not an array:", data)
        setProjects([])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project)
    setImageLoaded(false)
    setImageDimensions({ width: 0, height: 0 })

    // Load image to get dimensions
    if (project.image_data) {
      const img = new Image()
      img.onload = () => {
        const maxWidth = window.innerWidth * 0.9
        const maxHeight = window.innerHeight * 0.7

        let { width, height } = img

        // Scale down if too large
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        // Minimum size
        width = Math.max(width, 500)
        height = Math.max(height, 350)

        setImageDimensions({ width, height })
      }
      img.src = `data:${project.image_type};base64,${project.image_data}`
    }
  }

  const handleClose = () => {
    setSelectedProject(null)
    setImageLoaded(false)
    setImageDimensions({ width: 0, height: 0 })
  }

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4" />
                <div className="h-4 bg-gray-300 rounded mb-2" />
                <div className="h-3 bg-gray-300 rounded mb-4" />
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-gray-300 rounded" />
                  <div className="h-6 w-20 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">A showcase of my recent work and creative solutions</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => handleProjectSelect(project)}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <div className="relative overflow-hidden">
                    <ImageDisplay
                      imageData={project.image_data}
                      imageType={project.image_type}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <ZoomIn className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.tech_stack) &&
                        project.tech_stack.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      {Array.isArray(project.tech_stack) && project.tech_stack.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tech_stack.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">No projects available</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Enhanced Project Modal with Dynamic Sizing */}
        <AnimatePresence>
          {selectedProject && (
            <Dialog open={!!selectedProject} onOpenChange={handleClose}>
              <DialogContent
                className="p-0 border-0 bg-transparent overflow-hidden max-w-none w-auto h-auto"
                style={{
                  width: imageDimensions.width ? `${imageDimensions.width + 120}px` : "auto",
                  maxWidth: "95vw",
                  maxHeight: "95vh",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  {/* Liquid Glass Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
                    {/* Animated background elements */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-indigo-400/20 to-sky-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col">
                    {/* Header */}
                    <DialogHeader className="mb-4">
                      <div className="flex items-center justify-between">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex-1 mr-4"
                        >
                          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {selectedProject.title}
                          </DialogTitle>
                          <p className="text-white/90 mt-1 text-sm">{selectedProject.description}</p>
                        </motion.div>

                        <div className="flex space-x-2">
                          {selectedProject.repo_url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full"
                              onClick={() => window.open(selectedProject.repo_url, "_blank")}
                            >
                              <Github className="h-4 w-4 text-white" />
                            </Button>
                          )}
                          {selectedProject.demo_url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full"
                              onClick={() => window.open(selectedProject.demo_url, "_blank")}
                            >
                              <Globe className="h-4 w-4 text-white" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-full"
                            onClick={handleClose}
                          >
                            <X className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    </DialogHeader>

                    {/* Project Image */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 mb-4"
                      style={{
                        width: imageDimensions.width || "auto",
                        height: imageDimensions.height || "auto",
                        minWidth: "500px",
                        minHeight: "350px",
                      }}
                    >
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                      )}

                      <ImageDisplay
                        imageData={selectedProject.image_data}
                        imageType={selectedProject.image_type}
                        alt={selectedProject.title}
                        width={imageDimensions.width || 800}
                        height={imageDimensions.height || 600}
                        className={`w-full h-full object-contain transition-opacity duration-500 ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                      />

                      {/* Image overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Technologies */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-4"
                    >
                      <h4 className="font-semibold mb-2 text-white/90 text-sm">Technologies Used</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProject.tech_stack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors text-xs text-white/90"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>

                    {/* Footer Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex justify-center space-x-3"
                    >
                      {selectedProject.repo_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white hover:text-white rounded-full px-4"
                          onClick={() => window.open(selectedProject.repo_url, "_blank")}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          View Code
                        </Button>
                      )}
                      {selectedProject.demo_url && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-4"
                          onClick={() => window.open(selectedProject.demo_url, "_blank")}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Live Demo
                        </Button>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
