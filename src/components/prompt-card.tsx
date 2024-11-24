'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { signInWithGoogle } from '@/services/user-service'
import { Button } from '@/components/ui/button'

interface PromptCardProps {
  title: string
  content: string
  author: string
  date: string
  tags: string[]
}

export function PromptCard({ title, content, author, date, tags }: PromptCardProps) {
  const { user } = useAuth()

  const handleCopy = async () => {
    if (!user) {
      try {
        await signInWithGoogle()
      } catch (error) {
        console.error('Error signing in:', error)
      }
      return
    }

    try {
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Card className="overflow-hidden retro-shadow hover:translate-x-[2px] hover:translate-y-[2px] transition-transform border-2">
      <CardHeader className="space-y-2 bg-gradient-to-r from-purple-500/10 to-purple-800/10 border-b-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy}
            className="text-xs text-purple-500 hover:text-purple-600"
          >
            {user ? 'Copy' : 'Sign in to Copy'}
          </Button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{content}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t-2 bg-gradient-to-r from-purple-500/5 to-purple-800/5">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
          >
            #{tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )
}
