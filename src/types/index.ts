export interface Prompt {
  id: string
  title: string
  content: string
  type: string
  authorId: string
  createdAt: string
  updatedAt: string
  likes: number
  comments: number
  isPublic?: boolean
  tags?: string[]
}

export type PromptType = 'general' | 'coding' | 'writing' | 'creative' | 'business' | 'academic'
