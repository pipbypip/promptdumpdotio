import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Share2, BookOpen, Users } from 'lucide-react'

export function About() {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Share & Inspire",
      description: "Share your favorite prompts and inspire others in the community."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Explore & Discover",
      description: "Explore trending prompts across categories like writing, coding, art, and business."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Organize & Edit",
      description: "Easily organize, edit, and copy prompts for seamless use in your workflow."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connect & Collaborate",
      description: "Connect with a global community of like-minded users and innovators."
    }
  ]

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-primary/25">
                <Sparkles className="w-4 h-4 mr-1" />
                About Us
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-primary to-accent inline-block text-transparent bg-clip-text">
                PromptDump.io
              </span>
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto mb-8">
              The ultimate platform for discovering, sharing, and organizing AI prompts.
            </p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-background-secondary/50 to-background-secondary/30 border border-border rounded-lg p-8 mb-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-foreground-secondary max-w-3xl mx-auto">
              To empower creators, developers, and enthusiasts to streamline their workflows with curated prompts 
              while fostering a vibrant community of collaboration and innovation.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-r from-background-secondary/50 to-background-secondary/30 border border-border rounded-lg p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-foreground-secondary">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-xl text-foreground-secondary mb-8">
              Whether you're here to spark creativity, refine your craft, or share your expertise,
              PromptDump.io is your go-to space for AI-driven inspiration.
              <br />
              <span className="font-semibold">Together, let's shape the future of AI creativity.</span>
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
