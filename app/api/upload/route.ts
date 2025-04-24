import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const section = (formData.get("section") as string) || "general"

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
        },
        { status: 400 },
      )
    }

    // Log untuk debugging
    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
      section: section,
    })

    // Buat Supabase client
    const supabase = createServerSupabaseClient()

    // Buat nama file unik
    const filename = `${uuidv4()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`

    // Tentukan folder berdasarkan tipe file dan section
    const fileType = file.type.split("/")[0]
    const baseFolder = fileType === "image" ? "images" : "files"
    // Create a section-specific path
    const fullPath = `${baseFolder}/${section}/${filename}`

    // Konversi File ke ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload file ke Supabase Storage
    const { data, error } = await supabase.storage.from("portfolio").upload(fullPath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: true, // Ubah ke true untuk menimpa file yang sudah ada
    })

    if (error) {
      console.error("Error uploading file to Supabase:", error)

      // Coba pendekatan alternatif jika gagal
      try {
        console.log("Trying alternative upload approach...")

        // Coba dengan metode lain (menggunakan fetch langsung ke API Supabase)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        const uploadUrl = `${supabaseUrl}/storage/v1/object/portfolio/${encodeURIComponent(fullPath)}`

        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": file.type,
            "x-upsert": "true",
          },
          body: buffer,
        })

        if (!uploadResponse.ok) {
          throw new Error(`Alternative upload failed: ${uploadResponse.statusText}`)
        }

        console.log("Alternative upload successful")
      } catch (altError) {
        console.error("Alternative upload also failed:", altError)
        return NextResponse.json(
          {
            success: false,
            message: "Failed to upload file to storage: " + error.message,
            details: altError instanceof Error ? altError.message : String(altError),
          },
          { status: 500 },
        )
      }
    }

    // Dapatkan URL publik dari file yang diupload
    const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(fullPath)

    console.log("Upload successful, public URL:", urlData.publicUrl)

    // Return URL publik
    return NextResponse.json({
      success: true,
      filepath: urlData.publicUrl,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
