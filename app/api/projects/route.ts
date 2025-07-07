import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `
    // Ensure we always return an array
    return NextResponse.json(Array.isArray(projects) ? projects : [])
  } catch (error) {
    console.error("Error fetching projects:", error)
    // Return empty array instead of error object to prevent frontend issues
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, repo_url, demo_url, tech_stack, image_data, image_type } = await request.json()

    const result = await sql`
      INSERT INTO projects (title, description, repo_url, demo_url, tech_stack, image_data, image_type)
      VALUES (${title}, ${description}, ${repo_url}, ${demo_url}, ${tech_stack}, ${image_data}, ${image_type})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
