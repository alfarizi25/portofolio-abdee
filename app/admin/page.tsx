import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { LoginForm } from "./login-form"

export default async function AdminPage() {
  const authenticated = await isAuthenticated()

  if (authenticated) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-sky-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Login
              </span>
            </h1>
            <p className="text-gray-600">Access the admin dashboard</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
