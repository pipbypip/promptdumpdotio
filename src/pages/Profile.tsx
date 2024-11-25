import { useState, useMemo, useEffect } from 'react'
import { Sparkles, Star, MessageCircle, Share2, Settings as SettingsIcon, Edit3, PlusCircle, Copy, Check, Trash2 } from 'lucide-react'
import { SearchAndSort, type SortOption, type CategoryOption } from '../components/SearchAndSort'
import { PromptModal } from '../components/PromptModal'
import { DumpCard, type Dump } from '../components/DumpCard'
import { Settings } from '../components/Settings'
import { getAuth, getFirestore, doc, updateDoc, collection, addDoc, query, where, orderBy, getDocs, writeBatch } from 'firebase/firestore'
import { Link } from 'react-router-dom'

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
  prompt: string
  author: {
    name: string
    avatar: string
  }
  likes: number
  comments: number
  tags: string[]
  createdAt: string
  category?: CategoryOption
}

export function Profile() {
  const [prompts, setPrompts] = useState<Dump[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState('AI prompt engineer and enthusiast')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [category, setCategory] = useState<CategoryOption>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Dump | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'my-dumps' | 'saved-dumps'>('my-dumps')
  const [savedDumps, setSavedDumps] = useState<Dump[]>([])
  const [editingInlinePrompt, setEditingInlinePrompt] = useState<string | null>(null);
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineContent, setInlineContent] = useState('');
  const [deletedPrompts, setDeletedPrompts] = useState<Dump[]>([])

  // Load user prompts from Firebase
  useEffect(() => {
    if (!user) return;

    const loadPrompts = async () => {
      try {
        const db = getFirestore();
        const promptsRef = collection(db, 'prompts');
        const q = query(
          promptsRef,
          where('author.id', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const userPrompts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Dump[];

        setPrompts(userPrompts);
      } catch (error) {
        console.error('Error loading prompts:', error);
      }
    };

    loadPrompts();
  }, [user, activeTab]);

  // Load saved prompts from Firebase
  useEffect(() => {
    if (!user || activeTab !== 'saved-dumps') return;

    const loadSavedPrompts = async () => {
      try {
        const db = getFirestore();
        const savedPromptsRef = collection(db, 'savedPrompts');
        const q = query(
          savedPromptsRef,
          where('userId', '==', user.uid),
          orderBy('savedAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const savedPromptIds = querySnapshot.docs.map(doc => doc.data().promptId);

        // Fetch the actual prompts
        const prompts = await Promise.all(
          savedPromptIds.map(async (promptId) => {
            const promptDoc = await getDoc(doc(db, 'prompts', promptId));
            if (promptDoc.exists()) {
              return { id: promptDoc.id, ...promptDoc.data() } as Dump;
            }
            return null;
          })
        );

        setSavedDumps(prompts.filter((p): p is Dump => p !== null));
      } catch (error) {
        console.error('Error loading saved prompts:', error);
      }
    };

    loadSavedPrompts();
  }, [user, activeTab]);

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let result = prompts

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(prompt => 
        prompt.title.toLowerCase().includes(query) ||
        prompt.prompt.toLowerCase().includes(query)
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

  // Get current user
  const auth = getAuth()
  const user = auth.currentUser

  const handleSavePrompt = async (prompt: { title: string; content: string; type: string }) => {
    if (!user) {
      console.error('No user found. Please sign in.')
      return
    }

    try {
      const db = getFirestore()
      
      if (editingPrompt) {
        // Update existing prompt in Firebase
        const promptRef = doc(db, 'prompts', editingPrompt.id)
        await updateDoc(promptRef, {
          title: prompt.title,
          prompt: prompt.content,
          category: prompt.type as CategoryOption,
          updatedAt: new Date().toISOString()
        })

        // Update local state
        const updatedPrompts = prompts.map(p =>
          p.id === editingPrompt.id
            ? {
                ...p,
                title: prompt.title,
                prompt: prompt.content,
                category: prompt.type as CategoryOption
              }
            : p
        )
        setPrompts(updatedPrompts)
        setEditingPrompt(null)
      } else {
        // Create new prompt in Firebase
        const promptsRef = collection(db, 'prompts')
        const newPromptData = {
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
          category: prompt.type as CategoryOption,
          isPublic: true // You might want to make this configurable
        }

        const docRef = await addDoc(promptsRef, newPromptData)
        
        // Update local state
        const newPrompt: Dump = {
          id: docRef.id,
          ...newPromptData
        }
        const updatedPrompts = [newPrompt, ...prompts]
        setPrompts(updatedPrompts)
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
    }
    
    setIsModalOpen(false)
  }

  const handleEdit = (prompt: Dump) => {
    setEditingPrompt({
      ...prompt,
      type: prompt.category || 'general'
    })
    setIsModalOpen(true)
  }

  const handleCopy = async (prompt: Dump) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt)
      setCopiedId(prompt.id)
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

  const handleInlineEdit = (prompt: Dump) => {
    setEditingInlinePrompt(prompt.id);
    setInlineTitle(prompt.title);
    setInlineContent(prompt.prompt);
  };

  const handleInlineSave = (prompt: Dump) => {
    const updatedPrompts = prompts.map(p =>
      p.id === prompt.id
        ? {
            ...p,
            title: inlineTitle,
            prompt: inlineContent,
          }
        : p
    );
    setPrompts(updatedPrompts);
    setEditingInlinePrompt(null);
  };

  const handleDelete = (promptToDelete: Dump) => {
    setPrompts(currentPrompts => currentPrompts.filter(p => p.id !== promptToDelete.id))
    setDeletedPrompts(current => [promptToDelete, ...current])
    
    // Update Firebase
    const db = getFirestore();
    const promptRef = doc(db, 'prompts', promptToDelete.id);
    updateDoc(promptRef, {
      isDeleted: true,
    });
  }

  const handleUndo = () => {
    if (deletedPrompts.length > 0) {
      const [lastDeleted, ...remainingDeleted] = deletedPrompts
      setPrompts(current => [...current, lastDeleted])
      setDeletedPrompts(remainingDeleted)
      
      // Update Firebase
      const db = getFirestore();
      const promptRef = doc(db, 'prompts', lastDeleted.id);
      updateDoc(promptRef, {
        isDeleted: false,
      });
    }
  }

  const handleSaveToCollection = async (prompt: Dump) => {
    if (!user) return;

    try {
      const db = getFirestore();
      const savedPromptsRef = collection(db, 'savedPrompts');
      
      await addDoc(savedPromptsRef, {
        userId: user.uid,
        promptId: prompt.id,
        savedAt: new Date().toISOString()
      });

      setSavedDumps(current => [prompt, ...current]);
    } catch (error) {
      console.error('Error saving prompt to collection:', error);
    }
  };

  const handleRemoveFromCollection = async (prompt: Dump) => {
    if (!user) return;

    try {
      const db = getFirestore();
      const savedPromptsRef = collection(db, 'savedPrompts');
      const q = query(
        savedPromptsRef,
        where('userId', '==', user.uid),
        where('promptId', '==', prompt.id)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setSavedDumps(current => current.filter(p => p.id !== prompt.id));
    } catch (error) {
      console.error('Error removing prompt from collection:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user?.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email}`}
              alt={user?.displayName || 'Profile'}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{user?.displayName || 'AI Enthusiast'}</h1>
              {user?.username && (
                <Link
                  to={`/u/${user?.username}`}
                  className="text-foreground-secondary hover:text-foreground transition-colors"
                >
                  View Public Profile
                </Link>
              )}
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
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-background-secondary rounded-full"
          >
            <SettingsIcon className="w-6 h-6" />
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
            onUndo={handleUndo}
            canUndo={deletedPrompts.length > 0}
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
                    {editingInlinePrompt === prompt.id ? (
                      <input
                        type="text"
                        value={inlineTitle}
                        onChange={(e) => setInlineTitle(e.target.value)}
                        className="text-lg font-bold bg-background-secondary rounded px-2 py-1 w-full mr-2"
                        autoFocus
                      />
                    ) : (
                      <h3 
                        className="text-lg font-bold cursor-pointer hover:text-primary"
                        onDoubleClick={() => handleInlineEdit(prompt)}
                      >
                        {prompt.title}
                      </h3>
                    )}
                    <div className="flex gap-2">
                      {editingInlinePrompt === prompt.id ? (
                        <button
                          onClick={() => handleInlineSave(prompt)}
                          className="p-1 text-primary hover:text-accent transition-colors"
                          title="Save changes"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleInlineEdit(prompt)}
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
                          <button
                            onClick={() => handleDelete(prompt)}
                            className="p-1 hover:text-red-500 transition-colors"
                            title="Delete prompt"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSaveToCollection(prompt)}
                            className="p-1 hover:text-primary transition-colors"
                            title="Save to collection"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingInlinePrompt === prompt.id ? (
                    <textarea
                      value={inlineContent}
                      onChange={(e) => setInlineContent(e.target.value)}
                      className="text-foreground-secondary mb-4 w-full h-32 bg-background-secondary rounded px-2 py-1 resize-none"
                    />
                  ) : (
                    <p 
                      className="text-foreground-secondary mb-4 cursor-pointer hover:text-foreground"
                      onDoubleClick={() => handleInlineEdit(prompt)}
                    >
                      {prompt.prompt}
                    </p>
                  )}
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
                <div key={dump.id}>
                  <DumpCard dump={dump} />
                  <button
                    onClick={() => handleRemoveFromCollection(dump)}
                    className="p-1 hover:text-red-500 transition-colors"
                    title="Remove from collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <Settings onClose={() => setIsSettingsOpen(false)} />
        )}

        {/* Prompt Modal */}
        {isModalOpen && (
          <PromptModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setEditingPrompt(null)
            }}
            onSave={handleSavePrompt}
            initialPrompt={editingPrompt}
          />
        )}
      </div>
    </div>
  )
}
