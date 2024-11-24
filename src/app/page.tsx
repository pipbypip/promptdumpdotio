'use client'

import { PromptCard } from '@/components/prompt-card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleAction = async () => {
    try {
      if (!user) {
        await signInWithGoogle()
      } else {
        router.push('/create')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent">
            Live Dumps
          </h1>
          {!loading && (
            <Button
              onClick={handleAction}
              className="retro-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
            >
              {user ? 'Start Dumping' : 'Sign in to Dump'}
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Discover and share AI prompts with the community
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PromptCard
          title="Midjourney Art Style"
          content="Create a cyberpunk cityscape with neon lights and flying cars..."
          author="@pixelmaster"
          date="2024-01-20"
          tags={['midjourney', 'art', 'cyberpunk']}
        />
        <PromptCard
          title="ChatGPT Code Review"
          content="Review this Python code for best practices and potential improvements..."
          author="@codewhisperer"
          date="2024-01-19"
          tags={['chatgpt', 'code', 'review']}
        />
        <PromptCard
          title="Stable Diffusion Character"
          content="Generate a fantasy character portrait with detailed armor..."
          author="@artisan"
          date="2024-01-18"
          tags={['stable-diffusion', 'character', 'fantasy']}
        />
      </div>
    </div>
  )
}
