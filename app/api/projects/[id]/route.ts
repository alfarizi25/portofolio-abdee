import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { title, description, repo_url, demo_url, tech_stack, image_data, image_type } = await request.json()

    const result = await sql`
      UPDATE projects 
      SET title = ${title}, description = ${description}, repo_url = ${repo_url}, 
          demo_url = ${demo_url}, tech_stack = ${tech_stack}, image_data = ${image_data}, image_type = ${image_type}
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM projects WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
