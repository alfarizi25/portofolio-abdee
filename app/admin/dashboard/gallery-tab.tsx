"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, ImageIcon, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { GalleryItem } from "@/lib/db"
import { ImageDisplay } from "@/components/image-display"

interface GalleryTabProps {
  onStatsUpdate: () => void
}

export function GalleryTab({ onStatsUpdate }: GalleryTabProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_data: "",
    image_type: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setGallery(data)
    } catch (error) {
      console.error("Error fetching gallery:", error)
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

    if (!formData.image_data && !editingItem) {
      toast({
        title: "Image required",
        description: "Please select an image to upload.",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingItem ? `/api/gallery/${editingItem.id}` : "/api/gallery"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchGallery()
        onStatsUpdate()
        setIsDialogOpen(false)
        resetForm()
        toast({
          title: editingItem ? "Gallery item updated" : "Gallery item created",
          description: `The gallery item has been successfully ${editingItem ? "updated" : "created"}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingItem ? "update" : "create"} gallery item.`,
        variant: "destructive",
      })
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setGallery((prev) => prev.filter((item) => item.id !== id))
        onStatsUpdate()
        toast({
          title: "Gallery item deleted",
          description: "The gallery item has been successfully deleted.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gallery item.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || "",
      image_data: item.image_data,
      image_type: item.image_type,
    })
    setImagePreview(`data:${item.image_type};base64,${item.image_data}`)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      title: "",
      description: "",
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
      <div className="grid md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
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
        <h3 className="text-lg font-semibold">Manage Gallery</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Gallery Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Gallery item title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Gallery item description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
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
                <Button type="submit">{editingItem ? "Update" : "Create"} Gallery Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {gallery.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">No gallery items yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <Card key={item.id} className="bg-white/5 border-white/10">
              <div className="relative overflow-hidden">
                <ImageDisplay
                  imageData={item.image_data}
                  imageType={item.image_type}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{item.description}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
