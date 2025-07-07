import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

export interface Message {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export interface GalleryItem {
  id: string
  image_data: string
  image_type: string
  title: string
  description: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  repo_url: string
  demo_url: string
  tech_stack: string[]
  image_data: string
  image_type: string
  created_at: string
}
