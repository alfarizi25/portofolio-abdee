"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Code, FileText, Github, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { submitContactForm } from "@/lib/actions"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import type { PortfolioData } from "@/lib/types"

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    name: "Abdee Raja Alfarizi",
    tagline: "Computer Science Student at Universitas Siliwangi",
    profileImage: "/ale1.jpg?height=400&width=400",
    about:
      "I'm a passionate Computer Science student at Universitas Siliwangi with a focus on web development and UI/UX design. I love creating beautiful, functional websites and applications that solve real-world problems.",
    university: "Universitas Siliwangi, Computer Science",
    developerInfo: "Full-stack Developer specializing in React and Node.js",
    resumeUrl: "#",
    email: "ale.alfarizi12@gmail.com",
    github: "github.com/alfarizi25",
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
  })

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")

  // Animation refs
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)
  const designsRef = useRef(null)
  const contactRef = useRef(null)

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 })
  const skillsInView = useInView(skillsRef, { once: true, amount: 0.3 })
  const projectsInView = useInView(projectsRef, { once: true, amount: 0.3 })
  const designsInView = useInView(designsRef, { once: true, amount: 0.3 })
  const contactInView = useInView(contactRef, { once: true, amount: 0.3 })

  // Parallax effect for hero section
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100])

  useEffect(() => {
    // Try to load data from localStorage first for better UX
    const savedData = localStorage.getItem("portfolioData")
    if (savedData) {
      try {
        setPortfolioData(JSON.parse(savedData))
      } catch (e) {
        console.error("Error parsing saved data:", e)
        fetchPortfolioData() // Fallback to API
      }
    } else {
      fetchPortfolioData()
    }
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch("/api/portfolio")
      if (response.ok) {
        const data = (await response.json()) as PortfolioData
        setPortfolioData(data)
      }
    } catch (error) {
      console.error("Error fetching portfolio data:", error)
    }
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.id]: e.target.value,
    })
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitContactForm({
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
        recipientEmail: "ale.alfarizi12@gmail.com",
      })

      if (result.success) {
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully!",
        })
        // Reset form
        setContactForm({
          name: "",
          email: "",
          message: "",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get unique design categories for filter
  const designCategories = ["All", ...new Set(portfolioData.graphicDesigns.map((design) => design.category))]

  // Filter designs by active category
  const filteredDesigns =
    activeCategory === "All"
      ? portfolioData.graphicDesigns
      : portfolioData.graphicDesigns.filter((design) => design.category === activeCategory)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <motion.section
        className="relative flex flex-col items-center justify-center overflow-hidden py-24 md:py-32"
        style={{ y: heroY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-100 to-zinc-50"></div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_450px]">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  {portfolioData.name}
                </h1>
                <p className="max-w-[600px] text-zinc-500 md:text-xl">{portfolioData.tagline}</p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="transition-all duration-300 hover:scale-[1.02]">
                  <Link href="#contact">
                    Contact Me <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="transition-all duration-300 hover:scale-[1.02]">
                  <Link href="#projects">View Projects</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                type: "spring",
                stiffness: 100,
              }}
            >
              <div className="relative aspect-square overflow-hidden rounded-full border-8 border-white/10 bg-white/5 backdrop-blur-sm">
                <Image
                  src={portfolioData.profileImage || "/placeholder.svg?height=400&width=400"}
                  alt={portfolioData.name}
                  width={400}
                  height={400}
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section id="about" className="w-full py-12 md:py-24 lg:py-32" ref={aboutRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={aboutInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-5xl">About Me</h2>
            <p className="max-w-[85%] leading-normal text-zinc-500 sm:text-lg sm:leading-7">{portfolioData.about}</p>
          </motion.div>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-3"
            initial={{ y: 50, opacity: 0 }}
            animate={aboutInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="transition-all duration-300"
            >
              <Card className="backdrop-blur-sm bg-white/10 border-white/20 h-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <User className="h-12 w-12 text-zinc-600 mb-4" />
                  <h3 className="text-xl font-bold">Student</h3>
                  <p className="text-sm text-zinc-500 text-center mt-2">{portfolioData.university}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="transition-all duration-300"
            >
              <Card className="backdrop-blur-sm bg-white/10 border-white/20 h-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Code className="h-12 w-12 text-zinc-600 mb-4" />
                  <h3 className="text-xl font-bold">Developer</h3>
                  <p className="text-sm text-zinc-500 text-center mt-2">{portfolioData.developerInfo}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="transition-all duration-300"
            >
              <Card className="backdrop-blur-sm bg-white/10 border-white/20 h-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <FileText className="h-12 w-12 text-zinc-600 mb-4" />
                  <h3 className="text-xl font-bold">Resume</h3>
                  <p className="text-sm text-zinc-500 text-center mt-2">Download my resume to learn more</p>
                  <Button variant="outline" size="sm" className="mt-4 transition-all duration-300 hover:scale-[1.02]">
                    <Link href={portfolioData.resumeUrl || "#"}>Download CV</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section id="skills" className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50" ref={skillsRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={skillsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-5xl">Skills</h2>
            <p className="max-w-[85%] leading-normal text-zinc-500 sm:text-lg sm:leading-7">
              Technologies and tools I work with
            </p>
          </motion.div>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-4"
            initial={{ y: 50, opacity: 0 }}
            animate={skillsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {portfolioData.skills.map((skill, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="backdrop-blur-sm bg-white/30 border-white/20 h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="text-xl font-bold">{skill.name}</div>
                    <div className="mt-2 h-2 w-full rounded-full bg-zinc-200">
                      <motion.div
                        className="h-2 rounded-full bg-zinc-800"
                        initial={{ width: 0 }}
                        animate={skillsInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5 + 0.1 * index }}
                      ></motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section id="projects" className="w-full py-12 md:py-24 lg:py-32" ref={projectsRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={projectsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-5xl">Projects</h2>
            <p className="max-w-[85%] leading-normal text-zinc-500 sm:text-lg sm:leading-7">
              Check out some of my recent work
            </p>
          </motion.div>
          <motion.div
            className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ y: 50, opacity: 0 }}
            animate={projectsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {portfolioData.projects.map((project, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="transition-all duration-300"
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/10 border-white/20 h-full">
                  <div className="aspect-video w-full overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg?height=225&width=400"}
                      alt={project.title}
                      width={400}
                      height={225}
                      className="object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="text-sm text-zinc-500 mt-2">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-zinc-100"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      {project.demoUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="transition-all duration-300 hover:scale-[1.02]"
                        >
                          <Link href={project.demoUrl}>Live Demo</Link>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="transition-all duration-300 hover:scale-[1.02]"
                        >
                          <Link href={project.githubUrl}>
                            <Github className="mr-2 h-4 w-4" />
                            Code
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Graphic Design Portfolio Section */}
      <motion.section id="designs" className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50" ref={designsRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={designsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-5xl">
              Graphic Design
            </h2>
            <p className="max-w-[85%] leading-normal text-zinc-500 sm:text-lg sm:leading-7">
              Showcasing my creative design work and visual storytelling
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={designsInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {designCategories.map((category, index) => (
              <Button
                key={index}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="transition-all duration-300 hover:scale-[1.02]"
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Design Grid */}
          <motion.div
            className="mx-auto mt-12 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ y: 50, opacity: 0 }}
            animate={designsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredDesigns.map((design, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={designsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="transition-all duration-300"
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/10 border-white/20 h-full">
                  <div className="aspect-square w-full overflow-hidden">
                    <Image
                      src={design.image || "/placeholder.svg?height=400&width=400"}
                      alt={design.title}
                      width={400}
                      height={400}
                      className="object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{design.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold">
                        {design.category}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-2">{design.description}</p>

                    {design.client && (
                      <p className="text-sm mt-4">
                        <span className="font-medium">Client:</span> {design.client}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {design.tools.map((tool, toolIndex) => (
                        <span
                          key={toolIndex}
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-zinc-100"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-400 mt-4">
                      {new Date(design.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section id="contact" className="w-full py-12 md:py-24 lg:py-32" ref={contactRef}>
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <motion.div
            className="space-y-2"
            initial={{ x: -50, opacity: 0 }}
            animate={contactInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Get in Touch</h2>
            <p className="max-w-[600px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Have a project in mind or want to chat? Feel free to reach out.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col gap-4 backdrop-blur-sm bg-white/20 border border-white/20 rounded-lg p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={contactInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-zinc-600" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-zinc-500">{portfolioData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Github className="h-6 w-6 text-zinc-600" />
              <div>
                <h3 className="font-medium">GitHub</h3>
                <p className="text-sm text-zinc-500">{portfolioData.github}</p>
              </div>
            </div>
            <form className="mt-4 grid gap-4" onSubmit={handleContactSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium leading-none">
                  Name
                </Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all duration-300 focus:bg-white/80"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all duration-300 focus:bg-white/80"
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message" className="text-sm font-medium leading-none">
                  Message
                </Label>
                <textarea
                  id="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all duration-300 focus:bg-white/80"
                  placeholder="Your message"
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="transition-all duration-300 hover:scale-[1.02]">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
          <p className="text-center text-sm leading-loose text-zinc-500 md:text-left">
            © {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {portfolioData.socialLinks.map((link, index) => (
              <motion.div key={index} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={link.url}
                  className="text-zinc-500 hover:text-zinc-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
