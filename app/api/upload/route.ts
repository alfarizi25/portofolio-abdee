import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
        },
        { status: 400 },
      )
    }

    // Buat Supabase client
    const supabase = createServerSupabaseClient()

    // Buat nama file unik
    const filename = `${uuidv4()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`

    // Tentukan folder berdasarkan tipe file
    const fileType = file.type.split("/")[0]
    const folder = fileType === "image" ? "images" : "files"

    // Upload file ke Supabase Storage
    const { data, error } = await supabase.storage.from("portfolio").upload(`${folder}/${filename}`, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file to Supabase:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload file to storage",
        },
        { status: 500 },
      )
    }

    // Dapatkan URL publik dari file yang diupload
    const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(`${folder}/${filename}`)

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
        message: "Failed to upload file",
      },
      { status: 500 },
    )
  }
}
