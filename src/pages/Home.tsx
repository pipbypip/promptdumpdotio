import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PromptDemo } from '../components/PromptDemo'
import { Sparkles, Share2 } from 'lucide-react'
import { PromptModal } from '../components/PromptModal'

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-background-secondary p-6 rounded-lg transform transition hover:scale-105">
      <div className="p-3 bg-background-secondary-hover inline-block rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground-secondary">{description}</p>
    </div>
  )
}

export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSavePrompt = (prompt: { title: string; content: string }) => {
    console.log('Saved prompt:', prompt)
    navigate('/profile')
  }

  return (
    <main className="flex-grow">
      <div className="relative">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/50 pointer-events-none" />
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left side - Hero content */}
            <div>
              <div className="space-y-8">
                <div className="inline-block">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-primary/25">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Now with AI-powered prompt suggestions
                  </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary to-accent inline-block text-transparent bg-clip-text">
                    Share and Discover
                  </span>
                  <br />
                  AI Prompts
                </h1>
                <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
                  Got prompts? Ditch the notepad and dump your prompts for better organisation, enhancement and sharing of powerful AI prompts and idea starters.
                </p>
                <div className="flex space-x-4">
                  <Link
                    to="/feed"
                    className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transform transition hover:scale-105 inline-flex items-center"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Dump Feed
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-background-secondary hover:bg-background-secondary-hover text-foreground px-6 py-3 rounded-lg font-medium transform transition hover:scale-105 inline-flex items-center"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Prompt
                  </button>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="mt-16 grid grid-cols-1 gap-6">
                <FeatureCard
                  icon={<Sparkles className="w-8 h-8 text-primary" />}
                  title="AI-Powered Suggestions"
                  description="Get intelligent prompt suggestions based on your goals and preferences."
                />
                <FeatureCard
                  icon={<Share2 className="w-8 h-8 text-primary" />}
                  title="Easy Sharing"
                  description="Share your prompts with the community and get feedback."
                />
                <FeatureCard
                  icon={<Sparkles className="w-8 h-8 text-primary" />}
                  title="Prompt Analytics"
                  description="Track how your prompts perform and get insights."
                />
              </div>
            </div>

            {/* Right side - Interactive Demo */}
            <div className="sticky top-24">
              <PromptDemo />
            </div>
          </div>
        </div>
      </div>

      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePrompt}
      />
    </main>
  )
}
