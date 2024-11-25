import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { DumpCard } from '../components/DumpCard';
import { categoryData } from './CategoryPage';
import { getFirestore, collection, query, where, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Dump } from '../types/dump';
import { useAuth } from '../contexts/AuthContext';
import { PromptModal } from '../components/PromptModal';

type SortOption = 'newest' | 'oldest' | 'mostLiked';

interface FilterState {
  search: string;
  sortBy: SortOption;
  showOnlyLiked: boolean;
  showOnlyMine: boolean;
}

export function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Dump[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Dump[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { user } = useAuth();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'newest',
    showOnlyLiked: false,
    showOnlyMine: false
  });
  
  const category = categoryId ? categoryData[categoryId as keyof typeof categoryData] : null;
  const subcategoryName = subcategoryId ? decodeURIComponent(subcategoryId).replace(/-/g, ' ') : '';
  const subcategory = category?.subcategories.find(
    sub => sub.toLowerCase() === subcategoryName.toLowerCase()
  );

  // Apply filters and search
  useEffect(() => {
    if (!prompts.length) {
      setFilteredPrompts([]);
      return;
    }

    let result = [...prompts];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(prompt => 
        prompt.title.toLowerCase().includes(searchLower) ||
        prompt.content.toLowerCase().includes(searchLower)
      );
    }

    // Apply user filters
    if (filters.showOnlyMine && user) {
      result = result.filter(prompt => prompt.authorId === user.uid);
    }

    // Apply sort
    switch (filters.sortBy) {
      case 'oldest':
        result.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
        break;
      case 'mostLiked':
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        break;
    }

    setFilteredPrompts(result);
  }, [prompts, filters, user]);

  const handleSavePrompt = async (prompt: { title: string; content: string; type: string }) => {
    if (!user || !category || !subcategory) return;

    try {
      const db = getFirestore();
      const promptRef = collection(db, 'prompts');
      
      const newPrompt = {
        title: prompt.title,
        content: prompt.content,
        category: subcategory,
        mainCategory: category.title,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhotoURL: user.photoURL || null,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(promptRef, newPrompt);
      setIsPromptModalOpen(false);
      
      // Refresh prompts
      fetchPrompts();
    } catch (error) {
      console.error('Error saving prompt:', error);
      // TODO: Show error toast
    }
  };

  const fetchPrompts = async () => {
    if (!category || !subcategory) return;
    
    setLoading(true);
    setError(null);

    try {
      const db = getFirestore();
      const promptsRef = collection(db, 'prompts');
      const q = query(
        promptsRef,
        where('category', '==', subcategory),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const fetchedPrompts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dump[];

      setPrompts(fetchedPrompts);
      setFilteredPrompts(fetchedPrompts);
    } catch (err) {
      console.error('Error fetching prompts:', err);
      setError('Failed to load prompts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [category, subcategory]);

  if (!category || !subcategory) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <button 
          onClick={() => navigate('/categories')}
          className="text-primary hover:text-accent"
        >
          Return to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate(`/category/${categoryId}`)}
          className="flex items-center gap-2 text-primary hover:text-accent"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {category.title}
        </button>

        {user && (
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Prompt
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-4xl">{category.icon}</span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent inline-block text-transparent bg-clip-text">
            {subcategory}
          </h1>
        </div>
        <p className="text-foreground-secondary max-w-2xl mx-auto">
          Browse {subcategory} prompts
        </p>
      </motion.div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-background-secondary hover:bg-background-secondary-hover border border-border rounded-lg transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            <p className="text-foreground-secondary mt-2">Loading prompts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-background-secondary rounded-xl">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredPrompts.length > 0 ? (
          <>
            <div className="text-sm text-foreground-secondary mb-4">
              Showing {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
            </div>
            {filteredPrompts.map(prompt => (
              <DumpCard
                key={prompt.id}
                dump={prompt}
                showActions={true}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-12 bg-background-secondary rounded-xl">
            <p className="text-foreground-secondary">
              {filters.search 
                ? 'No prompts found matching your search.' 
                : 'No prompts found in this category yet.'}
            </p>
            {user ? (
              <button
                onClick={() => setIsPromptModalOpen(true)}
                className="mt-4 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
              >
                Add the First Prompt
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="mt-4 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
              >
                Login to Add Prompts
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background border border-border rounded-lg w-full max-w-md p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Filter Prompts</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 hover:bg-background-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortOption }))}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostLiked">Most Liked</option>
                </select>
              </div>

              {user && (
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.showOnlyMine}
                      onChange={(e) => setFilters(prev => ({ ...prev, showOnlyMine: e.target.checked }))}
                      className="form-checkbox rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Show only my prompts</span>
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      sortBy: 'newest',
                      showOnlyLiked: false,
                      showOnlyMine: false
                    });
                    setIsFilterModalOpen(false);
                  }}
                  className="px-4 py-2 bg-background-secondary hover:bg-background-secondary-hover text-foreground rounded-lg transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onSave={handleSavePrompt}
        initialCategory={subcategory}
      />
    </div>
  );
}
