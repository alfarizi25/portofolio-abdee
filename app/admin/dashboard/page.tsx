import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { AdminDashboard } from "./admin-dashboard"

export default async function DashboardPage() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect("/admin")
  }

  return <AdminDashboard />
}
