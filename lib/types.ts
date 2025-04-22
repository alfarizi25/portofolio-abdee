// Define types for portfolio data structure
export interface SkillItem {
  name: string
  level: number
}

export interface ProjectItem {
  title: string
  description: string
  image: string
  technologies: string[]
  demoUrl: string
  githubUrl: string
}

export interface GraphicDesignItem {
  title: string
  description: string
  image: string
  category: string
  tools: string[]
  client?: string
  date: string
}

export interface SocialLink {
  name: string
  url: string
}

export interface MessageItem {
  name: string
  email: string
  message: string
  date: string
}

export interface PortfolioData {
  name: string
  tagline: string
  profileImage: string
  about: string
  university: string
  developerInfo: string
  resumeUrl: string
  email: string
  github: string
  skills: SkillItem[]
  projects: ProjectItem[]
  graphicDesigns: GraphicDesignItem[]
  socialLinks: SocialLink[]
  messages: MessageItem[]
}
