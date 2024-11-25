import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Share2, BookOpen, Users } from 'lucide-react'

export function About() {
  const pillars = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Discover",
      description: "Access a curated library of high-quality prompts across all domains"
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Share",
      description: "Contribute your expertise and help others innovate with AI"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Innovate",
      description: "Stay ahead with the latest prompt engineering techniques"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connect",
      description: "Join a global community of AI enthusiasts and creators"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-primary/25 mb-4">
            <Sparkles className="w-4 h-4 mr-1" />
            Our Vision
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The Future of
            <br />
            <span className="bg-gradient-to-r from-primary to-accent inline-block text-transparent bg-clip-text">
              Prompt Engineering
            </span>
          </h1>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background-secondary/50 border border-border rounded-lg p-6 mb-12 text-center"
        >
          <p className="text-lg text-foreground-secondary">
            We're building the world's leading platform for AI prompt discovery and collaboration. 
            Our mission is to empower users to innovate and streamline their workflows through 
            high-quality prompts and a vibrant community.
          </p>
        </motion.div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background-secondary/30 border border-border rounded-lg p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{pillar.title}</h3>
                  <p className="text-foreground-secondary">{pillar.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
