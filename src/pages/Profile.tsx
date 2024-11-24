import { useState, useMemo, useEffect } from 'react'
import { Sparkles, Star, MessageCircle, Share2, Settings, Edit3, PlusCircle, Copy, Check } from 'lucide-react'
import { SearchAndSort, type SortOption, type CategoryOption } from '../components/SearchAndSort'
import { PromptModal } from '../components/PromptModal'
import { DumpCard, type Dump } from '../components/DumpCard'

interface Prompt {
  id: string
  title: string
  content: string
  likes: number
  comments: number
  createdAt: string
  category?: CategoryOption
}

interface Dump {
  id: string
  title: string
  content: string
}

export function Profile() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState('AI prompt engineer and enthusiast')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [category, setCategory] = useState<CategoryOption>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'my-dumps' | 'saved-dumps'>('my-dumps')
  const [savedDumps, setSavedDumps] = useState<Dump[]>([])

  // Load saved dumps from localStorage
  useEffect(() => {
    if (activeTab === 'saved-dumps') {
      const savedDumpsFromStorage = JSON.parse(localStorage.getItem('savedDumps') || '[]');
      setSavedDumps(savedDumpsFromStorage);
    }
  }, [activeTab]);

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let result = prompts

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(prompt => 
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (category !== 'all') {
      result = result.filter(prompt => prompt.category === category)
    }

    // Apply sorting
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return b.likes - a.likes
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default:
          return 0
      }
    })
  }, [prompts, searchQuery, sortBy, category])

  // Mock user data - will be replaced with Firebase auth user data
  const user = {
    name: 'AI Enthusiast',
    username: '@ai_prompter',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ai_prompter',
    joinedDate: 'January 2024'
  }

  const handleSavePrompt = (prompt: { title: string; content: string }) => {
    if (editingPrompt) {
      // Update existing prompt
      setPrompts(prevPrompts =>
        prevPrompts.map(p =>
          p.id === editingPrompt.id
            ? {
                ...p,
                title: prompt.title,
                content: prompt.content,
              }
            : p
        )
      )
      setEditingPrompt(null)
    } else {
      // Create new prompt
      const newPrompt: Prompt = {
        id: `prompt-${Date.now()}`,
        title: prompt.title,
        content: prompt.content,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        category: 'chat'
      }
      setPrompts(prevPrompts => [newPrompt, ...prevPrompts])
    }
    setIsModalOpen(false)
  }

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setIsModalOpen(true)
  }

  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopiedId(prompt.id)
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {isEditing ? (
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  className="mt-1 px-2 py-1 bg-background-secondary rounded border border-border"
                  autoFocus
                />
              ) : (
                <p
                  className="mt-1 text-foreground-secondary cursor-pointer hover:text-foreground"
                  onClick={() => setIsEditing(true)}
                >
                  {bio}
                </p>
              )}
            </div>
          </div>
          <button className="p-2 hover:bg-background-secondary rounded-full">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-border">
          <button
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'my-dumps'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground-secondary hover:text-foreground'
            }`}
            onClick={() => setActiveTab('my-dumps')}
          >
            My Dumps
          </button>
          <button
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'saved-dumps'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground-secondary hover:text-foreground'
            }`}
            onClick={() => setActiveTab('saved-dumps')}
          >
            Saved Dumps
          </button>
        </div>

        {/* Search and Sort */}
        <div className="mb-6">
          <SearchAndSort
            searchValue={searchQuery}
            sortValue={sortBy}
            categoryValue={category}
            onSearch={setSearchQuery}
            onSortChange={setSortBy}
            onCategoryChange={setCategory}
          />
        </div>

        {/* Content */}
        {activeTab === 'my-dumps' ? (
          <>
            {/* Add Prompt Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full p-4 mb-6 border-2 border-dashed border-border rounded-lg text-foreground-secondary hover:text-foreground hover:border-primary transition-colors flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>New Dump</span>
            </button>

            {/* Prompts List */}
            <div className="space-y-6">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="prompt-box"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{prompt.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(prompt)}
                        className="p-1 hover:text-primary transition-colors"
                        title="Edit prompt"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopy(prompt)}
                        className={`p-1 transition-all duration-200 ${
                          copiedId === prompt.id
                            ? 'text-green-500 scale-110'
                            : 'hover:text-primary'
                        }`}
                        title={copiedId === prompt.id ? 'Copied!' : 'Copy prompt'}
                      >
                        {copiedId === prompt.id ? (
                          <Check className="w-4 h-4 animate-bounce" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-foreground-secondary mb-4">
                    {prompt.content.length > 100
                      ? prompt.content.slice(0, 100) + '...'
                      : prompt.content}
                  </p>
                  <div className="flex items-center gap-4 text-foreground-secondary">
                    <button className="flex items-center gap-1 hover:text-primary">
                      <Star className="w-4 h-4" />
                      {prompt.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary">
                      <MessageCircle className="w-4 h-4" />
                      {prompt.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Saved Dumps
          <div className="space-y-6">
            {savedDumps.length === 0 ? (
              <div className="text-center py-12 bg-background-secondary rounded-xl">
                <p className="text-foreground-secondary">No saved dumps yet</p>
              </div>
            ) : (
              savedDumps.map(dump => (
                <DumpCard key={dump.id} dump={dump} />
              ))
            )}
          </div>
        )}

        {/* Modal */}
        <PromptModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingPrompt(null)
          }}
          onSave={handleSavePrompt}
          initialValues={editingPrompt}
        />
      </div>
    </div>
  )
}
