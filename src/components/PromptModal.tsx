import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface PromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (prompt: { title: string; content: string }) => void
  initialPrompt?: { title: string; content: string } | null
}

export function PromptModal({ isOpen, onClose, onSave, initialPrompt }: PromptModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // Update form when editing an existing prompt
  useEffect(() => {
    if (initialPrompt) {
      setTitle(initialPrompt.title)
      setContent(initialPrompt.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [initialPrompt])

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave({ title, content })
      setTitle('')
      setContent('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div 
        className="bg-background border border-border rounded-lg w-full max-w-2xl p-6 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialPrompt ? 'Edit Prompt' : 'Share Your Prompt'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your prompt here..."
              rows={6}
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-background-secondary hover:bg-background-secondary-hover text-foreground rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialPrompt ? 'Save Changes' : 'Save Prompt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
