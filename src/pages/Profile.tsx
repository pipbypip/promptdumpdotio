import { useState, useMemo, useEffect } from 'react'
import { Sparkles, Star, MessageCircle, Share2, Settings as SettingsIcon, Edit3, PlusCircle, Copy, Check, Trash2, LogOut } from 'lucide-react'
import { SearchAndSort, type SortOption, type CategoryOption } from '../components/SearchAndSort'
import { PromptModal } from '../components/PromptModal'
import { DumpCard, type Dump } from '../components/DumpCard'
import { Settings } from '../components/Settings'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, updateDoc, collection, addDoc, query, where, orderBy, getDocs, writeBatch, getDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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

interface ChangeHistory {
  type: 'delete' | 'edit';
  prompt: Dump;
  previousState?: Dump;
}

export function Profile() {
  console.log('Profile component rendering');  // Debug log
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
  const [editingInlinePrompt, setEditingInlinePrompt] = useState<string | null>(null)
  const [inlineTitle, setInlineTitle] = useState('')
  const [inlineContent, setInlineContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [changeHistory, setChangeHistory] = useState<ChangeHistory[]>([])
  const { logout } = useAuth()

  // Get current user
  const auth = getAuth()
  const user = auth.currentUser
  console.log('Current user:', user?.uid);  // Debug log

  // Load user prompts from Firebase
  useEffect(() => {
    console.log('Loading prompts effect triggered');  // Debug log
    if (!user) {
      console.log('No user found, skipping prompt load');  // Debug log
      setLoading(false);
      return;
    }

    const loadPrompts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Starting to load prompts for user:', user.uid);  // Debug log
        const db = getFirestore();
        const promptsRef = collection(db, 'prompts');
        const q = query(
          promptsRef,
          where('author.id', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        console.log('Executing Firestore query with params:', {
          authorId: user.uid,
          collection: 'prompts'
        });  // Debug log

        const querySnapshot = await getDocs(q);
        console.log('Query results:', {
          size: querySnapshot.size,
          empty: querySnapshot.empty,
          metadata: querySnapshot.metadata
        });  // Debug log

        const userPrompts = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Document data:', {
            id: doc.id,
            title: data.title,
            authorId: data.author?.id,
            createdAt: data.createdAt
          });  // Debug log
          return {
            id: doc.id,
            ...data,
            // Ensure required fields have default values
            title: data.title || 'Untitled',
            prompt: data.prompt || '',
            author: {
              id: data.author?.id || user.uid,
              name: data.author?.name || user.displayName || 'Anonymous',
              avatar: data.author?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`
            },
            likes: data.likes || 0,
            comments: data.comments || 0,
            tags: data.tags || [],
            createdAt: data.createdAt || new Date().toISOString(),
            category: data.category || 'other'
          } as Dump;
        });

        setPrompts(userPrompts);
        console.log('Prompts loaded successfully:', {
          count: userPrompts.length,
          firstPrompt: userPrompts[0]
        });  // Debug log
      } catch (error) {
        console.error('Error loading prompts:', error);
        if (error instanceof Error) {
          setError(`Failed to load prompts: ${error.message}`);
        } else {
          setError('Failed to load prompts. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPrompts();
  }, [user]);

  // Load saved prompts from Firebase
  useEffect(() => {
    console.log('Loading saved prompts effect triggered');  // Debug log
    if (!user || activeTab !== 'saved-dumps') {
      console.log('No user found or not on saved dumps tab, skipping saved prompts load');  // Debug log
      return;
    }

    const loadSavedPrompts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Starting to load saved prompts for user:', user.uid);  // Debug log
        const db = getFirestore();
        const savedPromptsRef = collection(db, 'savedPrompts');
        const q = query(
          savedPromptsRef,
          where('userId', '==', user.uid),
          orderBy('savedAt', 'desc')
        );

        console.log('Executing saved prompts query with params:', {
          userId: user.uid,
          collection: 'savedPrompts'
        });  // Debug log

        const querySnapshot = await getDocs(q);
        console.log('Saved prompts query results:', {
          size: querySnapshot.size,
          empty: querySnapshot.empty,
          metadata: querySnapshot.metadata
        });  // Debug log

        const savedPromptIds = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Saved prompt document:', {
            id: doc.id,
            promptId: data.promptId,
            savedAt: data.savedAt
          });  // Debug log
          return data.promptId;
        }).filter(Boolean);

        console.log('Fetching full prompt details for saved prompts:', savedPromptIds);  // Debug log

        // Fetch the actual prompts
        const prompts = await Promise.all(
          savedPromptIds.map(async (promptId) => {
            try {
              const promptDoc = await getDoc(doc(db, 'prompts', promptId));
              if (promptDoc.exists()) {
                const data = promptDoc.data();
                console.log('Retrieved prompt data:', {
                  id: promptDoc.id,
                  title: data.title,
                  author: data.author
                });  // Debug log
                return {
                  id: promptDoc.id,
                  ...data,
                  // Ensure required fields have default values
                  title: data.title || 'Untitled',
                  prompt: data.prompt || '',
                  author: {
                    id: data.author?.id || 'unknown',
                    name: data.author?.name || 'Anonymous',
                    avatar: data.author?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${promptId}`
                  },
                  likes: data.likes || 0,
                  comments: data.comments || 0,
                  tags: data.tags || [],
                  createdAt: data.createdAt || new Date().toISOString(),
                  category: data.category || 'other'
                } as Dump;
              }
              console.warn('Saved prompt not found:', promptId);  // Debug log
              return null;
            } catch (error) {
              console.error('Error fetching prompt:', promptId, error);  // Debug log
              return null;
            }
          })
        );

        const validPrompts = prompts.filter((p): p is Dump => p !== null);
        setSavedDumps(validPrompts);
        console.log('Saved prompts loaded successfully:', {
          total: prompts.length,
          valid: validPrompts.length,
          prompts: validPrompts
        });  // Debug log
      } catch (error) {
        console.error('Error loading saved prompts:', error);
        if (error instanceof Error) {
          setError(`Failed to load saved prompts: ${error.message}`);
        } else {
          setError('Failed to load saved prompts. Please try again.');
        }
      } finally {
        setLoading(false);
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

  const handleSavePrompt = async (prompt: { title: string; content: string; type: string }) => {
    if (!user) {
      console.error('No user found. Please sign in.');
      return;
    }

    try {
      const db = getFirestore();
      
      if (editingPrompt) {
        console.log('Updating existing prompt:', editingPrompt.id);
        const promptRef = doc(db, 'prompts', editingPrompt.id);
        await updateDoc(promptRef, {
          title: prompt.title,
          prompt: prompt.content,
          category: prompt.type as CategoryOption,
          updatedAt: new Date().toISOString()
        });

        const updatedPrompts = prompts.map(p =>
          p.id === editingPrompt.id
            ? {
                ...p,
                title: prompt.title,
                prompt: prompt.content,
                category: prompt.type as CategoryOption
              }
            : p
        );
        setPrompts(updatedPrompts);
        setEditingPrompt(null);
        console.log('Prompt updated successfully');
      } else {
        console.log('Creating new prompt');
        const promptsRef = collection(db, 'prompts');
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
          isPublic: true
        };

        const docRef = await addDoc(promptsRef, newPromptData);
        console.log('New prompt created with ID:', docRef.id);
        
        const newPrompt: Dump = {
          id: docRef.id,
          ...newPromptData
        };
        const updatedPrompts = [newPrompt, ...prompts];
        setPrompts(updatedPrompts);
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      if (error instanceof Error) {
        setError(`Failed to save prompt: ${error.message}`);
      } else {
        setError('Failed to save prompt. Please try again.');
      }
    }
    
    setIsModalOpen(false);
  }

  const handleEdit = async (updatedDump: Dump) => {
    try {
      const originalDump = prompts.find(p => p.id === updatedDump.id);
      if (!originalDump) return;

      // Add to history before making the change
      setChangeHistory(current => [{
        type: 'edit',
        prompt: updatedDump,
        previousState: originalDump
      }, ...current]);

      setPrompts(prevPrompts => 
        prevPrompts.map(prompt => 
          prompt.id === updatedDump.id ? updatedDump : prompt
        )
      );

      // Update in Firebase
      const db = getFirestore();
      const promptRef = doc(db, 'prompts', updatedDump.id);
      await updateDoc(promptRef, {
        title: updatedDump.title,
        prompt: updatedDump.prompt,
        category: updatedDump.category
      });
    } catch (error) {
      console.error('Error updating prompt:', error);
      // Revert the change on error
      if (changeHistory.length > 0) {
        const lastChange = changeHistory[0];
        if (lastChange.previousState) {
          setPrompts(current => 
            current.map(p => p.id === lastChange.prompt.id ? lastChange.previousState! : p)
          );
        }
        setChangeHistory(current => current.slice(1));
      }
    }
  };

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

  const handleDelete = async (promptId: string) => {
    try {
      const promptToDelete = prompts.find(p => p.id === promptId);
      if (!promptToDelete) return;

      // Add to history before deleting
      setChangeHistory(current => [{
        type: 'delete',
        prompt: promptToDelete
      }, ...current]);

      // Update UI optimistically
      setPrompts(currentPrompts => currentPrompts.filter(p => p.id !== promptId));

      // Delete from Firebase
      const db = getFirestore();
      const promptRef = doc(db, 'prompts', promptId);
      await deleteDoc(promptRef);

      console.log('Prompt deleted successfully:', promptId);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      // Revert the optimistic update on error
      const lastChange = changeHistory[0];
      if (lastChange && lastChange.type === 'delete') {
        setPrompts(current => [...current, lastChange.prompt]);
        setChangeHistory(current => current.slice(1));
      }
    }
  };

  const handleUndo = async () => {
    if (changeHistory.length === 0) return;

    try {
      const lastChange = changeHistory[0];
      const db = getFirestore();

      if (lastChange.type === 'delete') {
        // Restore deleted prompt
        const promptRef = doc(db, 'prompts', lastChange.prompt.id);
        await setDoc(promptRef, {
          title: lastChange.prompt.title,
          prompt: lastChange.prompt.prompt,
          author: lastChange.prompt.author,
          likes: lastChange.prompt.likes,
          comments: lastChange.prompt.comments,
          tags: lastChange.prompt.tags,
          createdAt: lastChange.prompt.createdAt,
          category: lastChange.prompt.category,
          isPublic: true
        });

        setPrompts(current => [lastChange.prompt, ...current]);
      } else if (lastChange.type === 'edit' && lastChange.previousState) {
        // Revert edited prompt
        const promptRef = doc(db, 'prompts', lastChange.prompt.id);
        await updateDoc(promptRef, {
          title: lastChange.previousState.title,
          prompt: lastChange.previousState.prompt,
          category: lastChange.previousState.category
        });

        setPrompts(current => 
          current.map(p => p.id === lastChange.prompt.id ? lastChange.previousState! : p)
        );
      }

      // Remove the undone change from history
      setChangeHistory(current => current.slice(1));
    } catch (error) {
      console.error('Error undoing change:', error);
    }
  };

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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={user?.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.uid}`}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user?.displayName || 'User'}</h1>
            {isEditing ? (
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 p-1 border rounded"
              />
            ) : (
              <p className="text-gray-600">{bio}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Prompt</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => logout()}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <SearchAndSort
        onSearch={setSearchQuery}
        onSortChange={setSortBy}
        onCategoryChange={setCategory}
        onUndo={handleUndo}
        canUndo={changeHistory.length > 0}
        sortValue={sortBy}
        categoryValue={category}
        searchValue={searchQuery}
      />

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-border">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'my-dumps'
              ? 'text-primary border-b-2 border-primary'
              : 'text-foreground-secondary hover:text-foreground'
          }`}
          onClick={() => setActiveTab('my-dumps')}
        >
          My Dumps
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'saved-dumps'
              ? 'text-primary border-b-2 border-primary'
              : 'text-foreground-secondary hover:text-foreground'
          }`}
          onClick={() => setActiveTab('saved-dumps')}
        >
          Saved
        </button>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12 bg-background-secondary rounded-lg">
            <p className="text-foreground-secondary">Loading prompts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-background-secondary rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : activeTab === 'my-dumps' ? (
          filteredPrompts.length === 0 ? (
            <div className="text-center py-12 bg-background-secondary rounded-lg">
              <p className="text-foreground-secondary">No prompts found</p>
            </div>
          ) : (
            filteredPrompts.map((prompt) => (
              <DumpCard
                key={prompt.id}
                dump={prompt}
                onDelete={() => handleDelete(prompt.id)}
                onEdit={handleEdit}
                isEditable={true}
              />
            ))
          )
        ) : (
          savedDumps.length === 0 ? (
            <div className="text-center py-12 bg-background-secondary rounded-lg">
              <p className="text-foreground-secondary">No saved prompts yet</p>
            </div>
          ) : (
            savedDumps.map((prompt) => (
              <DumpCard
                key={prompt.id}
                dump={prompt}
                isEditable={false}
              />
            ))
          )
        )}
      </div>

      {/* Modals */}
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

      {isSettingsOpen && (
        <Settings onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  )
}
