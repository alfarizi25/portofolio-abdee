"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const skills = [
    {
      category: "Frontend Development",
      icon: "💻",
      color: "from-blue-500 to-indigo-500",
      technologies: [
        { name: "React", level: 95, icon: "⚛️", description: "Building dynamic user interfaces" },
        { name: "Next.js", level: 90, icon: "▲", description: "Full-stack React framework" },
        { name: "TypeScript", level: 88, icon: "📘", description: "Type-safe JavaScript development" },
        { name: "Tailwind CSS", level: 92, icon: "🎨", description: "Utility-first CSS framework" },
        { name: "Framer Motion", level: 85, icon: "🎭", description: "Animation library for React" },
        { name: "Vue.js", level: 80, icon: "💚", description: "Progressive JavaScript framework" },
      ],
    },
    {
      category: "Design & Creative",
      icon: "🎨",
      color: "from-indigo-500 to-sky-500",
      technologies: [
        { name: "Adobe Photoshop", level: 90, icon: "🅿️", description: "Advanced photo editing and manipulation" },
        { name: "Adobe Illustrator", level: 85, icon: "🅰️", description: "Vector graphics and logo design" },
        { name: "Canva", level: 95, icon: "🎨", description: "Quick design and social media graphics" },
        { name: "Figma", level: 80, icon: "🎯", description: "UI/UX design and prototyping" },
        { name: "UI Design", level: 75, icon: "📱", description: "User interface design principles" },
        { name: "Graphic Design", level: 88, icon: "🖼️", description: "Visual communication and branding" },
      ],
    },
  ]

  return (
    <section id="skills" className="py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50">
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
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/10 to-sky-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            A comprehensive showcase of my technical expertise and creative capabilities across multiple domains
          </p>
        </motion.div>

        {/* Interactive Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card
                className={`relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  activeCategory === category.category ? "ring-2 ring-blue-500/50" : ""
                }`}
                onClick={() => setActiveCategory(activeCategory === category.category ? null : category.category)}
              >
                {/* Animated background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                />

                <CardContent className="relative p-8">
                  {/* Category Header */}
                  <motion.div className="flex items-center justify-between mb-8" whileHover={{ scale: 1.02 }}>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`text-4xl p-3 rounded-2xl bg-gradient-to-br ${category.color} bg-opacity-10 backdrop-blur-sm`}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {category.category}
                        </h3>
                        <p className="text-gray-500 text-sm">{category.technologies.length} Technologies</p>
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: activeCategory === category.category ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl text-gray-400"
                    >
                      ▼
                    </motion.div>
                  </motion.div>

                  {/* Skills List */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: activeCategory === category.category ? "auto" : "200px",
                      opacity: activeCategory === category.category ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="space-y-4 overflow-hidden"
                  >
                    {category.technologies.map((tech, techIndex) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: categoryIndex * 0.1 + techIndex * 0.05 }}
                        viewport={{ once: true }}
                        className="group/skill relative"
                        onMouseEnter={() => setHoveredSkill(tech.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        {/* Skill Item */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-2xl">
                              {/* Custom icons for Adobe products */}
                              {tech.name === "Adobe Photoshop" && (
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  Ps
                                </div>
                              )}
                              {tech.name === "Adobe Illustrator" && (
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  Ai
                                </div>
                              )}
                              {tech.name === "Canva" && (
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  C
                                </div>
                              )}
                              {tech.name === "Figma" && (
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  F
                                </div>
                              )}
                              {!["Adobe Photoshop", "Adobe Illustrator", "Canva", "Figma"].includes(tech.name) &&
                                tech.icon}
                            </motion.div>
                            <div>
                              <h4 className="font-semibold text-gray-800 group-hover/skill:text-blue-600 transition-colors">
                                {tech.name}
                              </h4>
                              {(activeCategory === category.category || hoveredSkill === tech.name) && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="text-xs text-gray-500 mt-1"
                                >
                                  {tech.description}
                                </motion.p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Badge
                              variant="secondary"
                              className={`bg-gradient-to-r ${category.color} text-white border-0 font-semibold`}
                            >
                              {tech.level}%
                            </Badge>
                          </div>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="mt-2 w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${tech.level}%` }}
                            transition={{
                              duration: 1.5,
                              delay: categoryIndex * 0.2 + techIndex * 0.1 + 0.5,
                              ease: "easeOut",
                            }}
                            viewport={{ once: true }}
                            className={`h-full bg-gradient-to-r ${category.color} rounded-full relative overflow-hidden`}
                          >
                            {/* Shimmer effect */}
                            <motion.div
                              animate={{ x: [-100, 200] }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 skew-x-12"
                            />
                          </motion.div>
                        </div>

                        {/* Hover tooltip */}
                        {hoveredSkill === tech.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20"
                          >
                            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm">
                              Proficiency: {tech.level}%
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Category Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeCategory === category.category ? 1 : 0 }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(
                            category.technologies.reduce((acc, tech) => acc + tech.level, 0) /
                              category.technologies.length,
                          )}
                          %
                        </div>
                        <div className="text-xs text-gray-500">Avg. Proficiency</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-2xl font-bold text-indigo-600">{category.technologies.length}</div>
                        <div className="text-xs text-gray-500">Technologies</div>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
