"use client"

import Image from "next/image"
import { useState } from "react"

interface ImageDisplayProps {
  imageData: string
  imageType: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  onLoad?: () => void
}

export function ImageDisplay({ imageData, imageType, alt, width, height, className, fill, onLoad }: ImageDisplayProps) {
  const [error, setError] = useState(false)

  if (!imageData || error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
    )
  }

  const imageSrc = `data:${imageType};base64,${imageData}`

  if (fill) {
    return (
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        fill
        className={className}
        onError={() => setError(true)}
        onLoad={onLoad}
      />
    )
  }

  return (
    <Image
      src={imageSrc || "/placeholder.svg"}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      onError={() => setError(true)}
      onLoad={onLoad}
    />
  )
}
