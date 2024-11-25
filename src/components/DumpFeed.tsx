import React, { useState, useMemo, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'
import { PromptModal } from './PromptModal'
import { useNavigate } from 'react-router-dom'
import { SearchAndSort, type SortOption, type CategoryOption } from './SearchAndSort'
import { DumpCard, type Dump } from './DumpCard'
import { getFirestore, collection, query, orderBy, limit, getDocs, addDoc, deleteDoc, doc, where, getDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

export function DumpFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [categoryOption, setCategoryOption] = useState<CategoryOption>('all')
  const [dumps, setDumps] = useState<Dump[]>([])
  const [deletedDumps, setDeletedDumps] = useState<Dump[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Load and listen to prompts from Firebase
  useEffect(() => {
    setLoading(true)
    setError(null)
    
    const db = getFirestore()
    const promptsRef = collection(db, 'prompts')
    const q = query(
      promptsRef,
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        console.log('Real-time feed update:', {
          size: querySnapshot.size,
          empty: querySnapshot.empty
        })

        const loadedPrompts = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            title: data.title || 'Untitled',
            prompt: data.prompt || '',
            author: {
              id: data.author?.id || 'unknown',
              name: data.author?.name || 'Anonymous',
              avatar: data.author?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${doc.id}`
            },
            likes: data.likes || 0,
            comments: data.comments || 0,
            tags: data.tags || [],
            createdAt: data.createdAt || new Date().toISOString(),
            category: data.category || 'other',
            type: data.type || data.category || 'other'
          } as Dump
        })

        console.log('Feed prompts updated:', loadedPrompts.length)
        setDumps(loadedPrompts)
        setLoading(false)
      },
      (error) => {
        console.error('Error in feed listener:', error)
        setError('Failed to load prompts. Please try again.')
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleDelete = async (id: string) => {
    if (!user) {
      console.error('No user found. Please sign in.')
      return
    }

    try {
      const db = getFirestore()
      const promptRef = doc(db, 'prompts', id)
      const promptDoc = await getDoc(promptRef)

      if (!promptDoc.exists()) {
        console.error('Prompt not found')
        return
      }

      const promptData = promptDoc.data()
      if (promptData.author?.id !== user.uid) {
        console.error('Not authorized to delete this prompt')
        return
      }

      await deleteDoc(promptRef)
      const dumpToDelete = dumps.find(dump => dump.id === id)
      if (dumpToDelete) {
        setDumps(prevDumps => prevDumps.filter(dump => dump.id !== id))
        setDeletedDumps(prevDeleted => [dumpToDelete, ...prevDeleted])
      }
    } catch (error) {
      console.error('Error deleting prompt:', error)
    }
  }

  const handleUndo = async () => {
    if (!user || deletedDumps.length === 0) return

    try {
      const db = getFirestore()
      const [lastDeleted, ...remainingDeleted] = deletedDumps
      
      const promptData = {
        title: lastDeleted.title,
        prompt: lastDeleted.prompt,
        author: {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`
        },
        likes: lastDeleted.likes,
        comments: lastDeleted.comments,
        tags: lastDeleted.tags,
        createdAt: new Date().toISOString(),
        category: lastDeleted.category,
        type: lastDeleted.type
      }

      const docRef = await addDoc(collection(db, 'prompts'), promptData)
      const newDump: Dump = {
        id: docRef.id,
        ...promptData,
        author: {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`
        }
      }

      setDumps(prevDumps => [newDump, ...prevDumps])
      setDeletedDumps(remainingDeleted)
    } catch (error) {
      console.error('Error restoring prompt:', error)
    }
  }

  const handleSavePrompt = async (prompt: { title: string; content: string; type: string }) => {
    if (!user) {
      console.error('No user found. Please sign in.')
      return
    }

    try {
      const db = getFirestore()
      const promptData = {
        title: prompt.title,
        prompt: prompt.content,
        author: {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`
        },
        likes: 0,
        comments: 0,
        tags: [],
        createdAt: new Date().toISOString(),
        category: prompt.type,
        type: prompt.type,
        isPublic: true
      }

      // Add to Firebase
      const docRef = await addDoc(collection(db, 'prompts'), promptData)
      console.log('New prompt created with ID:', docRef.id)

      const newDump: Dump = {
        id: docRef.id,
        ...promptData
      }

      // Update local state
      setDumps(prev => [newDump, ...prev])
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving prompt:', error)
      setError('Failed to save prompt. Please try again.')
    }
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
            <h1 className="text-2xl font-bold">Dump Feed</h1>
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
            {loading ? (
              <div className="text-center py-12 bg-background-secondary rounded-xl">
                <p className="text-foreground-secondary">Loading prompts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-background-secondary rounded-xl">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredDumps.length === 0 ? (
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

export interface Dump {
  id: string
  title: string
  prompt: string
  author: {
    id: string
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
