import { redirect } from "next/navigation"

export default function AdminPage() {
  // Redirect to the login page
  redirect("/admin/login")
}
