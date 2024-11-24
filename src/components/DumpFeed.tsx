import React, { useState, useMemo } from 'react'
import { PlusCircle } from 'lucide-react'
import { PromptModal } from './PromptModal'
import { useNavigate } from 'react-router-dom'
import { SearchAndSort, type SortOption, type CategoryOption } from './SearchAndSort'
import { DumpCard, type Dump } from './DumpCard'

const mockDumps: Dump[] = [
  {
    id: '1',
    title: 'Stable Diffusion Masterpiece Generator',
    prompt: 'Create a masterpiece in the style of Van Gogh with a modern cyberpunk twist, featuring neon lights and starry night elements...',
    author: {
      name: 'PromptMaster',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PromptMaster'
    },
    likes: 342,
    comments: 56,
    tags: ['stable-diffusion', 'art', 'cyberpunk'],
    createdAt: '2024-01-15',
    category: 'art',
    type: 'art'
  },
  {
    id: '2',
    title: 'GPT-4 Code Review Expert',
    prompt: 'You are a senior software engineer with expertise in clean code principles and design patterns. Review the following code...',
    author: {
      name: 'CodeWizard',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CodeWizard'
    },
    likes: 289,
    comments: 42,
    tags: ['gpt-4', 'coding', 'review'],
    createdAt: '2024-01-14',
    category: 'coding',
    type: 'coding'
  },
  {
    id: '3',
    title: 'Claude Business Strategy Advisor',
    prompt: 'Act as a seasoned business strategy consultant with expertise in market analysis and growth strategies...',
    author: {
      name: 'StrategyGuru',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=StrategyGuru'
    },
    likes: 156,
    comments: 23,
    tags: ['claude', 'business', 'strategy'],
    createdAt: '2024-01-13',
    category: 'business',
    type: 'business'
  },
  {
    id: '4',
    title: 'AI Poem Creator',
    prompt: 'Compose a heartfelt poem in the style of Emily Dickinson about hope and resilience in the digital age...',
    author: {
      name: 'CreativeScribe',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CreativeScribe'
    },
    likes: 210,
    comments: 30,
    tags: ['gpt-4', 'writing', 'poetry'],
    createdAt: '2024-01-12',
    category: 'writing',
    type: 'writing'
  },
  {
    id: '5',
    title: 'Persuasive Ad Copy Generator',
    prompt: 'Create a short and engaging ad copy for a sustainable clothing brand emphasizing eco-friendliness and affordability...',
    author: {
      name: 'AdCopyGenius',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=AdCopyGenius'
    },
    likes: 275,
    comments: 40,
    tags: ['marketing', 'copywriting', 'eco'],
    createdAt: '2024-01-11',
    category: 'marketing',
    type: 'marketing'
  },
  {
    id: '6',
    title: 'MidJourney Surreal Landscape',
    prompt: 'Generate a surreal landscape featuring floating mountains, cascading waterfalls, and a dreamy twilight sky...',
    author: {
      name: 'VisualizerPro',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=VisualizerPro'
    },
    likes: 390,
    comments: 65,
    tags: ['midjourney', 'art', 'surreal'],
    createdAt: '2024-01-10',
    category: 'art',
    type: 'art'
  },
  {
    id: '7',
    title: 'SQL Query Troubleshooter',
    prompt: 'Analyze the following SQL query and optimize it for better performance on large datasets...',
    author: {
      name: 'DataDynamo',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=DataDynamo'
    },
    likes: 200,
    comments: 28,
    tags: ['coding', 'sql', 'optimization'],
    createdAt: '2024-01-09',
    category: 'coding',
    type: 'coding'
  },
  {
    id: '8',
    title: 'Game Narrative Designer',
    prompt: 'Design an engaging backstory for a stealth-action game set in a dystopian future ruled by AI overlords...',
    author: {
      name: 'GameDevHelper',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=GameDevHelper'
    },
    likes: 184,
    comments: 26,
    tags: ['gpt-4', 'gaming', 'storytelling'],
    createdAt: '2024-01-08',
    category: 'gaming',
    type: 'gaming'
  },
  {
    id: '9',
    title: 'Personalized Workout Planner',
    prompt: 'Create a 4-week fitness plan for someone aiming to lose weight and build muscle, considering dietary preferences...',
    author: {
      name: 'FitnessExpert',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=FitnessExpert'
    },
    likes: 312,
    comments: 55,
    tags: ['gpt-4', 'health', 'fitness'],
    createdAt: '2024-01-07',
    category: 'health',
    type: 'health'
  },
  {
    id: '10',
    title: 'French Grammar Coach',
    prompt: 'Explain the rules of passé composé versus imparfait with examples to help a beginner learn...',
    author: {
      name: 'LanguageLover',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LanguageLover'
    },
    likes: 150,
    comments: 20,
    tags: ['gpt-4', 'language', 'education'],
    createdAt: '2024-01-06',
    category: 'education',
    type: 'education'
  },
  {
    id: '11',
    title: 'Pitch Deck Creator',
    prompt: 'Draft an elevator pitch for a tech startup developing AI-powered personal assistants for busy professionals...',
    author: {
      name: 'StartupWizard',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=StartupWizard'
    },
    likes: 195,
    comments: 25,
    tags: ['business', 'pitch', 'startups'],
    createdAt: '2024-01-05',
    category: 'business',
    type: 'business'
  },
  {
    id: '12',
    title: 'Alternate History Scenario',
    prompt: 'Imagine a world where the Roman Empire never fell. Describe the cultural, technological, and political implications...',
    author: {
      name: 'HistoryBuff',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=HistoryBuff'
    },
    likes: 176,
    comments: 24,
    tags: ['gpt-4', 'writing', 'history'],
    createdAt: '2024-01-04',
    category: 'writing',
    type: 'writing'
  },
  {
    id: '13',
    title: 'Illustration Prompt: Urban Fantasy',
    prompt: 'Create a vibrant cityscape blending modern urban life with magical creatures and glowing runes on skyscrapers...',
    author: {
      name: 'VisualStoryteller',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=VisualStoryteller'
    },
    likes: 310,
    comments: 50,
    tags: ['art', 'fantasy', 'urban'],
    createdAt: '2024-01-03',
    category: 'art',
    type: 'art'
  },
  {
    id: '14',
    title: 'Contract Simplifier',
    prompt: 'Rephrase the following legal document into plain, simple English while retaining accuracy...',
    author: {
      name: 'LegalEagle',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LegalEagle'
    },
    likes: 240,
    comments: 35,
    tags: ['gpt-4', 'law', 'clarity'],
    createdAt: '2024-01-02',
    category: 'legal',
    type: 'legal'
  },
  {
    id: '15',
    title: 'Custom Travel Itinerary',
    prompt: 'Plan a 7-day trip to Japan, focusing on hidden gems, local cuisine, and cultural experiences...',
    author: {
      name: 'TravelExplorer',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=TravelExplorer'
    },
    likes: 300,
    comments: 48,
    tags: ['gpt-4', 'travel', 'planning'],
    createdAt: '2024-01-01',
    category: 'travel',
    type: 'travel'
  }
]

export interface Dump {
  id: string
  title: string
  prompt: string
  author: {
    name: string
    avatar: string
  }
  likes: number
  comments: number
  tags: string[]
  createdAt: string
  category: string
  type: string
}

export function DumpFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('trending')
  const [categoryOption, setCategoryOption] = useState<CategoryOption>('all')
  const [dumps, setDumps] = useState<Dump[]>(mockDumps)
  const [deletedDumps, setDeletedDumps] = useState<Dump[]>([])
  const navigate = useNavigate()

  const handleDelete = (id: string) => {
    const dumpToDelete = dumps.find(dump => dump.id === id)
    if (dumpToDelete) {
      setDumps(prevDumps => prevDumps.filter(dump => dump.id !== id))
      setDeletedDumps(prevDeleted => [dumpToDelete, ...prevDeleted])
    }
  }

  const handleUndo = () => {
    if (deletedDumps.length > 0) {
      const [lastDeleted, ...remainingDeleted] = deletedDumps
      setDumps(prevDumps => [...prevDumps, lastDeleted])
      setDeletedDumps(remainingDeleted)
    }
  }

  const handleSavePrompt = (prompt: { title: string; content: string; type: string }) => {
    const newDump: Dump = {
      id: `dump-${Date.now()}`,
      title: prompt.title,
      prompt: prompt.content,
      author: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=You'
      },
      likes: 0,
      comments: 0,
      tags: [],
      createdAt: new Date().toISOString(),
      category: prompt.type,
      type: prompt.type
    }

    // Add to feed
    setDumps(prev => [newDump, ...prev])

    // Save to user's profile
    const userDumps = JSON.parse(localStorage.getItem('userDumps') || '[]')
    const updatedUserDumps = [
      {
        id: newDump.id,
        title: newDump.title,
        content: newDump.prompt,
        likes: newDump.likes,
        comments: newDump.comments,
        createdAt: newDump.createdAt,
        category: newDump.category
      },
      ...userDumps
    ]
    localStorage.setItem('userDumps', JSON.stringify(updatedUserDumps))

    setIsModalOpen(false)
  }

  const filteredDumps = useMemo(() => {
    let result = dumps

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(dump => 
        dump.title.toLowerCase().includes(query) ||
        dump.prompt.toLowerCase().includes(query) ||
        dump.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply category filter
    if (categoryOption !== 'all') {
      result = result.filter(dump => dump.category === categoryOption)
    }

    // Apply sorting
    return [...result].sort((a, b) => {
      switch (sortOption) {
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
  }, [dumps, searchQuery, sortOption, categoryOption])

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">LIVE Dump Feed</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-medium transform transition hover:scale-105 inline-flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              New Dump
            </button>
          </div>

          <SearchAndSort
            searchValue={searchQuery}
            sortValue={sortOption}
            categoryValue={categoryOption}
            onSearch={setSearchQuery}
            onSortChange={setSortOption}
            onCategoryChange={setCategoryOption}
            onUndo={handleUndo}
            canUndo={deletedDumps.length > 0}
          />

          <div className="grid grid-cols-1 gap-6">
            {filteredDumps.length === 0 ? (
              <div className="text-center py-12 bg-background-secondary rounded-xl">
                <p className="text-foreground-secondary">No prompts found</p>
              </div>
            ) : (
              filteredDumps.map(dump => (
                <DumpCard key={dump.id} dump={dump} onDelete={handleDelete} />
              ))
            )}
          </div>
        </div>
      </div>

      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePrompt}
      />
    </div>
  )
}
