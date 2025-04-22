"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  label?: string
}

export function FileUpload({ onUpload, accept = "image/*", label = "Upload" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await onUpload(file)
    } catch (error) {
      console.error("Upload error:", error)
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
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : label}
          </span>
        </Button>
      </label>
    </div>
  )
}
