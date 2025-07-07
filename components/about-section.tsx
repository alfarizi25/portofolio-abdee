"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, GraduationCap, Palette } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  const handleDownloadCV = () => {
    window.open("https://drive.google.com/file/d/1ecJhjUE1k1hnLZ1RNTHmQMmOkpKEPXzf/view?usp=sharing", "_blank")
  }

  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-sky-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">About Me</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover my journey, expertise, and passion for creating exceptional digital experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-80 h-80 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse" />
              <div className="relative w-full h-full bg-white/10 backdrop-blur-xl rounded-full border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                <Image
                  src="/ale1.jpg?height=320&width=320"
                  alt="Abdee Raja Alfarizi"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Frontend Developer & Graphic Designer</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                I am Abdee Raja Alfarizi, an Informatics Engineering student at the Faculty of Engineering with a deep
                passion for technology and design innovation. My expertise lies in frontend development and graphic
                design, complemented by foundational skills in UI design principles.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Throughout my academic journey, I have mastered industry-standard design tools including Adobe
                Photoshop, Adobe Illustrator, and Canva. I believe that the synergy between technical programming
                capabilities and creative design thinking enables the creation of exceptional digital experiences that
                resonate with users.
              </p>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <GraduationCap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-600">Informatics</div>
                  <div className="text-sm text-gray-600">Engineering Faculty</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Palette className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-indigo-600">Design Tools</div>
                  <div className="text-sm text-gray-600">PS, AI, Canva</div>
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button
                  onClick={handleDownloadCV}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
