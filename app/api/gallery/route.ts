import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const gallery = await sql`
      SELECT * FROM gallery 
      ORDER BY created_at DESC
    `
    // Ensure we always return an array
    return NextResponse.json(Array.isArray(gallery) ? gallery : [])
  } catch (error) {
    console.error("Error fetching gallery:", error)
    // Return empty array instead of error object to prevent frontend issues
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const { image_data, image_type, title, description } = await request.json()

    const result = await sql`
      INSERT INTO gallery (image_data, image_type, title, description)
      VALUES (${image_data}, ${image_type}, ${title}, ${description})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}
