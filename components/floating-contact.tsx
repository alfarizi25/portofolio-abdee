"use client"

import { useState } from "react"
import { Mail, X, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false)
  const phoneNumber = "628990644145" // Indonesia format (62) without leading 0
  const email = "ale.alfarizi12@gmail.com"

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 mb-2"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="backdrop-blur-md bg-white/20 border border-white/20 rounded-full shadow-lg"
            >
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 text-white"
                onClick={() => window.open(`https://wa.me/${phoneNumber}`, "_blank")}
                title="Contact via WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="backdrop-blur-md bg-white/20 border border-white/20 rounded-full shadow-lg"
            >
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => window.open(`mailto:${email}`, "_blank")}
                title="Contact via Email"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="backdrop-blur-md bg-white/20 border border-white/20 rounded-full shadow-lg"
      >
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-zinc-800 hover:bg-zinc-700 text-white"
          onClick={() => setIsOpen(!isOpen)}
          title="Contact Options"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  )
}
