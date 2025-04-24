"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  label?: string
  section?: string // Add this new prop
}

export function FileUpload({ onUpload, accept = "image/*", label = "Upload", section = "general" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    toast({
      title: "Upload started",
      description: "Uploading your file...",
    })

    try {
      // Validasi ukuran file (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should be less than 10MB",
          variant: "destructive",
        })
        return
      }

      // Validasi tipe file untuk gambar
      if (accept.includes("image/") && !file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      await onUpload(file)
      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the input
      e.target.value = ""
    }
  }

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="sr-only"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label htmlFor="file-upload">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer transition-all duration-300 hover:scale-[1.02]"
          disabled={isUploading}
          type="button"
          asChild
        >
          <span>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {label}
              </>
            )}
          </span>
        </Button>
      </label>
    </div>
  )
}
