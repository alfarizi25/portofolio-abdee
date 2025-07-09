"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Heart, MapPin, Send, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/alfarizi25",
      label: "GitHub",
      color: "from-gray-600 to-gray-800",
      hoverColor: "hover:from-gray-700 hover:to-gray-900",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/abdee-alfarizi2507",
      label: "LinkedIn",
      color: "from-blue-600 to-blue-800",
      hoverColor: "hover:from-blue-700 hover:to-blue-900",
    },
    {
      icon: Mail,
      href: "mailto:ale.alfarizi12@gmail.com",
      label: "Email",
      color: "from-red-500 to-red-700",
      hoverColor: "hover:from-red-600 hover:to-red-800",
    },
  ]

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <footer className="relative overflow-hidden">
      {/* Enhanced Liquid Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/40 to-indigo-50/30">
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/6 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-sky-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
            x: [0, 30, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 35,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-sky-400/10 to-blue-400/10 rounded-full blur-2xl"
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12"
          >
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{ x: [-100, 400] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20 skew-x-12 opacity-0 group-hover:opacity-100 rounded-3xl"
                />

                <div className="relative">
                  <h3 className="text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                      Abdee Raja Alfarizi
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                  Frontend Developer & Graphic Designer passionate about creating digital experiences that make a
                  difference.
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <div className="p-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl backdrop-blur-md border border-white/30">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm">Cirebon, Indonesia</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <div className="p-2 bg-gradient-to-r from-indigo-500/20 to-sky-500/20 rounded-2xl backdrop-blur-md border border-white/30">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-sm">ale.alfarizi12@gmail.com</span>
                    </motion.div>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-4">
                    {socialLinks.map(({ icon: Icon, href, label, color, hoverColor }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 bg-gradient-to-r ${color} ${hoverColor} rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md border border-white/20`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="sr-only">{label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: [-100, 300] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20 skew-x-12 opacity-0 group-hover:opacity-100 rounded-3xl"
              />

              <div className="relative">
                <h4 className="text-xl font-bold mb-6 text-gray-800">Quick Links</h4>
                <nav className="space-y-3">
                  {quickLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="block text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm py-1"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: [-100, 300] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20 skew-x-12 opacity-0 group-hover:opacity-100 rounded-3xl"
              />

              <div className="relative">
                <h4 className="text-xl font-bold mb-4 text-gray-800">Stay Updated</h4>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Get notified about new projects and updates.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/30 backdrop-blur-md border-white/40 rounded-2xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-gray-800 placeholder:text-gray-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-xl p-8 hover:shadow-2xl transition-all duration-500 group"
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{ x: [-100, 800] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-32 skew-x-12 opacity-0 group-hover:opacity-100 rounded-3xl"
            />

            <div className="relative flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <p className="text-gray-600 flex items-center text-sm">
                  © {currentYear} Abdee Raja Alfarizi. Made with{" "}
                  <Heart className="w-4 h-4 mx-1 text-red-500 fill-current animate-pulse" />
                  and lots of coffee.
                </p>
              </div>

              {/* Back to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md border border-white/20"
              >
                <ArrowUp className="w-5 h-5" />
                <span className="sr-only">Back to top</span>
              </motion.button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
