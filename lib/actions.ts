"use server"

import { revalidatePath } from "next/cache"
import type { PortfolioData } from "@/lib/types"
import { createServerSupabaseClient } from "@/lib/supabase"
import nodemailer from "nodemailer"

// Fungsi untuk mendapatkan data portfolio dari Supabase
export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const supabase = createServerSupabaseClient()

    // Coba ambil data dari database, tanpa menggunakan .single()
    const { data, error } = await supabase
      .from("portfolio_data")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching portfolio data:", error)
      // Jika error, gunakan data default
      const defaultData = getDefaultPortfolioData()
      await initializePortfolioData(defaultData)
      return defaultData
    }

    // Jika tidak ada data atau array kosong
    if (!data || data.length === 0) {
      console.log("No portfolio data found, initializing with default data")
      const defaultData = getDefaultPortfolioData()
      await initializePortfolioData(defaultData)
      return defaultData
    }

    // Ambil data terbaru (indeks 0 karena sudah diurutkan berdasarkan updated_at desc)
    return data[0].data as PortfolioData
  } catch (error) {
    console.error("Error in getPortfolioData:", error)
    return getDefaultPortfolioData()
  }
}

// Fungsi untuk menginisialisasi data portfolio di database
async function initializePortfolioData(data: PortfolioData) {
  try {
    const supabase = createServerSupabaseClient()

    // Cek apakah tabel sudah ada
    const { error: tableError } = await supabase.from("portfolio_data").select("count").limit(1)

    if (tableError) {
      console.error("Error checking portfolio_data table:", tableError)
      console.log("Attempting to create initial data anyway...")
    }

    // Simpan data default ke database
    const { error } = await supabase.from("portfolio_data").insert({
      data,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error initializing portfolio data:", error)
    } else {
      console.log("Successfully initialized portfolio data")
    }
  } catch (error) {
    console.error("Error in initializePortfolioData:", error)
  }
}

// Fungsi untuk update data portfolio di Supabase
export async function updatePortfolioData(data: Partial<PortfolioData>) {
  try {
    const supabase = createServerSupabaseClient()

    // Ambil data yang ada
    const currentData = await getPortfolioData()

    // Gabungkan data yang ada dengan data baru
    const updatedData = { ...currentData, ...data }

    // Simpan ke database
    const { error } = await supabase.from("portfolio_data").insert({
      data: updatedData,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating portfolio data:", error)
      return { success: false, message: "Failed to update portfolio data" }
    }

    // Revalidate the home page to reflect the changes
    revalidatePath("/")

    return { success: true, message: "Portfolio data updated successfully" }
  } catch (error) {
    console.error("Error in updatePortfolioData:", error)
    return { success: false, message: "Failed to update portfolio data" }
  }
}

// Fungsi untuk login admin
export async function loginAdmin(credentials: { email: string; password: string }) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      console.error("Login error:", error)
      return { success: false, message: "Invalid credentials" }
    }

    // Verifikasi apakah user adalah admin
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", credentials.email)
      .single()

    if (adminError || !adminData) {
      console.error("Admin verification error:", adminError)
      return { success: false, message: "User is not an admin" }
    }

    return {
      success: true,
      message: "Login successful",
      user: {
        id: data.user?.id,
        email: data.user?.email,
        username: adminData.username,
      },
      session: data.session,
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

// Konfigurasi transporter untuk nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ale.alfarizi12@gmail.com", // Email pengirim
    pass: process.env.EMAIL_PASSWORD || "tixdee2507", // Password atau App Password
  },
})

// Fungsi untuk submit form kontak
export async function submitContactForm(data: {
  name: string
  email: string
  message: string
  recipientEmail: string
}) {
  try {
    const supabase = createServerSupabaseClient()

    // Simpan pesan ke database
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      message: data.message,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error saving contact message:", error)
      return { success: false, message: "Failed to submit contact form" }
    }

    // Kirim email notifikasi
    try {
      await transporter.sendMail({
        from: "ale.alfarizi12@gmail.com", // Email pengirim
        to: data.recipientEmail, // Email penerima
        subject: `New Contact Form Submission from ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
        `,
      })
      console.log("Email notification sent successfully")
    } catch (emailError) {
      console.error("Error sending email notification:", emailError)
      // Tetap kembalikan sukses karena pesan sudah tersimpan di database
    }

    return { success: true, message: "Contact form submitted successfully" }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, message: "Failed to submit contact form" }
  }
}

// Fungsi untuk mendapatkan pesan kontak
export async function getContactMessages() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contact messages:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error in getContactMessages:", error)
    return []
  }
}

// Fungsi untuk menandai pesan sebagai sudah dibaca
export async function markMessageAsRead(messageId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("contact_messages").update({ read: true }).eq("id", messageId)

    if (error) {
      console.error("Error marking message as read:", error)
      return { success: false, message: "Failed to mark message as read" }
    }

    return { success: true, message: "Message marked as read" }
  } catch (error) {
    console.error("Error in markMessageAsRead:", error)
    return { success: false, message: "Failed to mark message as read" }
  }
}

// Data default untuk portfolio
function getDefaultPortfolioData(): PortfolioData {
  return {
    name: "John Doe",
    tagline: "Computer Science Student at Universitas Siliwangi",
    profileImage: "/placeholder.svg?height=400&width=400",
    about:
      "I'm a passionate Computer Science student at Universitas Siliwangi with a focus on web development and UI/UX design. I love creating beautiful, functional websites and applications that solve real-world problems.",
    university: "Universitas Siliwangi, Computer Science",
    developerInfo: "Full-stack Developer specializing in React and Node.js",
    resumeUrl: "#",
    email: "ale.alfarizi12@gmail.com",
    github: "github.com/johndoe",
    skills: [
      { name: "HTML/CSS", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "React", level: 80 },
      { name: "Node.js", level: 75 },
      { name: "UI/UX Design", level: 70 },
      { name: "Python", level: 65 },
      { name: "Database", level: 60 },
      { name: "Mobile Dev", level: 50 },
    ],
    projects: [
      {
        title: "E-Learning Platform",
        description: "A platform for online learning with video courses and quizzes.",
        image: "/placeholder.svg?height=225&width=400",
        technologies: ["React", "Node.js", "MongoDB"],
        demoUrl: "#",
        githubUrl: "#",
      },
      {
        title: "Weather App",
        description: "Real-time weather application with forecast and location tracking.",
        image: "/placeholder.svg?height=225&width=400",
        technologies: ["JavaScript", "API", "CSS"],
        demoUrl: "#",
        githubUrl: "#",
      },
      {
        title: "Portfolio Website",
        description: "Personal portfolio website to showcase projects and skills.",
        image: "/placeholder.svg?height=225&width=400",
        technologies: ["Next.js", "Tailwind CSS"],
        demoUrl: "#",
        githubUrl: "#",
      },
    ],
    graphicDesigns: [
      {
        title: "Brand Identity Design",
        description: "Complete branding package including logo, color palette, and typography guidelines.",
        image: "/placeholder.svg?height=400&width=400",
        category: "Branding",
        tools: ["Adobe Illustrator", "Adobe Photoshop"],
        client: "Local Cafe",
        date: "2023-12-10",
      },
      {
        title: "Event Poster Series",
        description: "Set of promotional posters for a university music festival.",
        image: "/placeholder.svg?height=400&width=400",
        category: "Print Design",
        tools: ["Adobe Photoshop", "Adobe InDesign"],
        client: "Universitas Siliwangi",
        date: "2023-08-15",
      },
      {
        title: "Social Media Campaign",
        description: "Visual content for Instagram and Facebook promotional campaign.",
        image: "/placeholder.svg?height=400&width=400",
        category: "Digital Design",
        tools: ["Adobe Photoshop", "Figma"],
        client: "Local Business",
        date: "2024-01-20",
      },
      {
        title: "Mobile App UI Design",
        description: "User interface design for a food delivery application.",
        image: "/placeholder.svg?height=400&width=400",
        category: "UI/UX Design",
        tools: ["Figma", "Adobe XD"],
        date: "2023-11-05",
      },
    ],
    socialLinks: [
      { name: "GitHub", url: "#" },
      { name: "LinkedIn", url: "#" },
      { name: "Twitter", url: "#" },
      { name: "Instagram", url: "#" },
    ],
    messages: [],
  }
}
