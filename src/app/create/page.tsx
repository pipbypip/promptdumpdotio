'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CreatePrompt() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent">
        Create New Prompt
      </h1>
      <p className="text-muted-foreground">
        Share your AI prompts with the community
      </p>
      {/* Add form components here */}
    </div>
  )
}
