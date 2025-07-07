"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-4 bg-gradient-to-t from-gray-100 to-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Abdee Raja Alfarizi
              </span>
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Full Stack Developer & UI/UX Designer passionate about creating digital experiences that make a
              difference.
            </p>
          </div>

          <div className="flex justify-center space-x-6 mb-8">
            {[
              { icon: Github, href: "https://github.com/alfarizi25", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/abdee-raja-alfarizi", label: "LinkedIn" },
              { icon: Mail, href: "mailto:ale.alfarizi12@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="sr-only">{label}</span>
              </motion.a>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-500 flex items-center justify-center">
              © {currentYear} Abdee Raja Alfarizi. Made with{" "}
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              and lots of coffee.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
