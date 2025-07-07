"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail, Phone } from "lucide-react"

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false)

  const contactOptions = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/6208990644145?text=Hello%20Abdee,%20I'm%20interested%20in%20your%20services",
      color: "text-green-500",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:ale.alfarizi12@gmail.com?subject=Project%20Inquiry&body=Hello%20Abdee,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.",
      color: "text-blue-500",
    },
    {
      icon: Phone,
      label: "Call",
      href: "tel:+6208990644145",
      color: "text-purple-500",
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Contact Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 space-y-3"
            >
              {contactOptions.map((option, index) => (
                <motion.div
                  key={option.label}
                  initial={{ opacity: 0, x: 20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20, y: 10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Liquid Glass Background with Ripple Effect */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-sm"
                    />
                  </div>

                  <Button
                    asChild
                    className="relative bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full p-3 w-12 h-12"
                  >
                    <a
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                      title={option.label}
                    >
                      <option.icon className={`w-5 h-5 ${option.color}`} />
                    </a>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
          {/* Liquid Glass Background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            {/* Animated Liquid Ripple Effects */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 0.1, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-md"
            />
            <motion.div
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.3, 0.05, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-sky-400/20 rounded-full blur-lg"
            />
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.2, 0.03, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute inset-0 bg-gradient-to-r from-sky-400/15 to-blue-400/15 rounded-full blur-xl"
            />
          </div>

          <Button
            onClick={() => {
              console.log("Button clicked, current state:", isOpen)
              setIsOpen(!isOpen)
            }}
            className={`relative bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-4 w-14 h-14 ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
