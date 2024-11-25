import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Edit, Share2, Search, Sparkles, Heart } from 'lucide-react'
import { AuthModal } from '../components/AuthModal'
import { TerminalOutput } from '../components/TerminalOutput'

function FeatureCard({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg bg-background-secondary"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-foreground-secondary">{description}</p>
    </motion.div>
  )
}

export function Explore() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  
  const features = [
    {
      title: "Create & Share",
      description: "Easily add your favorite AI prompts, organize them with tags, and share them with the community. Our AI suggests categories to help your prompts reach the right audience.",
      icon: BookOpen
    },
    {
      title: "Edit & Iterate",
      description: "Edit your prompts anytime as they evolve. Found a great prompt? Use the one-click copy feature to try it out or customize it for your needs.",
      icon: Edit
    },
    {
      title: "Smart Search",
      description: "Find the perfect prompt using our AI-powered search. Filter by categories, tags, or use natural language queries to discover exactly what you need.",
      icon: Search
    },
    {
      title: "Community",
      description: "Join a vibrant community of prompt engineers. Get feedback, collaborate on ideas, and showcase your best prompts to gain recognition.",
      icon: Share2
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-primary/25">
              <Sparkles className="w-4 h-4 mr-1" />
              Welcome to PromptDump.io
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Personal
            <br />
            <span className="bg-gradient-to-r from-primary to-accent inline-block text-transparent bg-clip-text">
              Prompt Library
            </span>
          </h1>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Create, organize, and discover AI prompts in one place.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Terminal Animation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl font-bold mb-4">
            Discover Amazing Prompts
          </h2>
          <p className="text-foreground-secondary mb-8">
            Browse through our extensive collection of AI prompts
          </p>
          <div className="max-w-[1200px] mx-auto bg-[#e7e7e7] dark:bg-black p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-border prompt-box">
            <TerminalOutput />
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Ready to start your prompt collection?
          </h2>
          <p className="text-foreground-secondary mb-8">
            Join our community and start sharing your prompts today.
          </p>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="matrix-gradient px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2"
          >
            <Heart className="w-5 h-5" />
            <span>Get Started</span>
          </button>
        </motion.div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}
