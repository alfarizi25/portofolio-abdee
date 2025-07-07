import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { image_data, image_type, title, description } = await request.json()

    const result = await sql`
      UPDATE gallery 
      SET image_data = ${image_data}, image_type = ${image_type}, title = ${title}, description = ${description}
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating gallery item:", error)
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM gallery WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gallery item:", error)
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}
