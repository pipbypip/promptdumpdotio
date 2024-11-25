import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Edit, Loader2, LogOut, Settings, User, Save, X } from 'lucide-react';
import { DumpCard } from '../components/DumpCard';
import { categoryData } from './CategoryPage';
import { getFirestore, collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Dump } from '../types/dump';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';

type CategoryFilter = 'all' | keyof typeof categoryData;

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [prompts, setPrompts] = useState<Dump[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Dump[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState('AI enthusiast and prompt engineer');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Get all categories for the dropdown
  const categories = Object.entries(categoryData).map(([key, value]) => ({
    id: key,
    title: value.title,
    icon: value.icon,
  }));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserPrompts = async () => {
      setLoading(true);
      setError(null);

      try {
        const db = getFirestore();
        const promptsRef = collection(db, 'prompts');
        const q = query(
          promptsRef,
          where('author.id', '==', user.uid),
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
        setError('Failed to load your prompts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPrompts();
  }, [user, navigate]);

  // Filter prompts when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPrompts(prompts);
    } else {
      const filtered = prompts.filter(prompt => 
        prompt.mainCategory === categoryData[selectedCategory as keyof typeof categoryData].title
      );
      setFilteredPrompts(filtered);
    }
  }, [selectedCategory, prompts]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setUpdateLoading(true);
    try {
      // Update display name in Firebase Auth
      await updateProfile(user, {
        displayName: displayName,
      });

      // Update bio in Firestore
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        bio: bio,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-background-secondary rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-background-secondary-hover border-4 border-primary flex items-center justify-center">
                <User className="w-12 h-12 text-foreground-secondary" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-foreground-secondary mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-foreground-secondary mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-2">
                  {displayName || 'Anonymous User'}
                </h1>
                <p className="text-foreground-secondary mb-2">
                  {user.email}
                </p>
                <p className="text-foreground-secondary mb-4">
                  {bio}
                </p>
              </>
            )}
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-background-secondary border border-border rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={updateLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 border border-primary rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updateLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-background-secondary border border-border rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-background-secondary border border-border rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-background-secondary border border-border rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Dropdown */}
      <div className="mb-8">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full md:w-64 flex items-center justify-between gap-2 px-4 py-2 bg-background-secondary hover:bg-background-secondary-hover border border-border rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              {selectedCategory === 'all' ? (
                <span>All Categories</span>
              ) : (
                <>
                  <span>{categoryData[selectedCategory as keyof typeof categoryData].icon}</span>
                  <span>{categoryData[selectedCategory as keyof typeof categoryData].title}</span>
                </>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-50 w-full md:w-64 mt-2 py-2 bg-background border border-border rounded-lg shadow-lg">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-background-secondary transition-colors"
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id as CategoryFilter);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-background-secondary transition-colors flex items-center gap-2"
                >
                  <span>{category.icon}</span>
                  <span>{category.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            <p className="text-foreground-secondary mt-2">Loading your prompts...</p>
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
              {selectedCategory !== 'all' && ` in ${categoryData[selectedCategory as keyof typeof categoryData].title}`}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6"
            >
              {filteredPrompts.map(prompt => (
                <DumpCard
                  key={prompt.id}
                  dump={prompt}
                  showActions={true}
                />
              ))}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12 bg-background-secondary rounded-xl">
            <p className="text-foreground-secondary">
              {selectedCategory === 'all'
                ? "You haven't created any prompts yet."
                : `You haven't created any prompts in ${categoryData[selectedCategory as keyof typeof categoryData].title} yet.`}
            </p>
            <button
              onClick={() => navigate('/categories')}
              className="mt-4 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors"
            >
              Create Your First Prompt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
