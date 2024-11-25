import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, ThumbsUp, Share2, Bookmark, Trash2, Edit, Check, Copy, Edit2 } from 'lucide-react'
import { CategoryOption } from './SearchAndSort'
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

export interface Dump {
  id: string
  title: string
  prompt: string
  author: {
    id?: string
    name: string
    avatar: string
  }
  likes: number
  comments: number
  tags: string[]
  createdAt: string
  category?: CategoryOption
}

interface DumpCardProps {
  dump: Dump
  onDelete?: (id: string) => void
  onEdit?: (dump: Dump) => void
  isEditable?: boolean
}

export function DumpCard({ dump, onDelete, onEdit, isEditable }: DumpCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [saveId, setSaveId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(dump.title);
  const [editedPrompt, setEditedPrompt] = useState(dump.prompt);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const db = getFirestore();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) return;

      try {
        const savedPromptsRef = collection(db, 'savedPrompts');
        const q = query(
          savedPromptsRef,
          where('userId', '==', user.uid),
          where('promptId', '==', dump.id)
        );

        const querySnapshot = await getDocs(q);
        const saved = !querySnapshot.empty;
        setIsSaved(saved);
        if (saved) {
          setSaveId(querySnapshot.docs[0].id);
        }
      } catch (error) {
        console.error('Error checking if prompt is saved:', error);
      }
    };

    checkIfSaved();
  }, [user, dump.id, db]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditing && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        handleSaveEdit();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, editedTitle, editedPrompt]);

  const handleSave = async () => {
    if (!user) {
      console.error('User must be logged in to save prompts');
      return;
    }

    try {
      if (isSaved && saveId) {
        // Unsave the prompt
        await deleteDoc(doc(db, 'savedPrompts', saveId));
        setIsSaved(false);
        setSaveId(null);
      } else {
        // Save the prompt
        const savedPromptRef = await addDoc(collection(db, 'savedPrompts'), {
          userId: user.uid,
          promptId: dump.id,
          savedAt: new Date().toISOString()
        });
        setIsSaved(true);
        setSaveId(savedPromptRef.id);
      }
    } catch (error) {
      console.error('Error saving/unsaving prompt:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (onEdit && (editedTitle !== dump.title || editedPrompt !== dump.prompt)) {
      const updatedDump = {
        ...dump,
        title: editedTitle,
        prompt: editedPrompt,
      };
      onEdit(updatedDump);
    }
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dump.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      console.error('User must be logged in to delete prompts');
      return;
    }

    try {
      setIsDeleting(true);
      const db = getFirestore();
      const promptRef = doc(db, 'prompts', dump.id);
      await deleteDoc(promptRef);
      onDelete?.(dump.id);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div 
      ref={cardRef} 
      className={`bg-[#e7e7e7] dark:bg-black p-6 rounded-lg transition-all duration-300 ${
        isDeleting 
          ? 'opacity-0 scale-95 pointer-events-none' 
          : 'hover:scale-[1.02] hover:shadow-lg'
      } prompt-box`}
      style={{
        transform: isDeleting ? 'translateX(-20px)' : 'translateX(0)',
      }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={dump.author.avatar}
          alt={dump.author.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{dump.author.name}</h3>
          <p className="text-sm text-foreground-secondary">
            {new Date(dump.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-background border border-border rounded-lg p-2 text-lg font-semibold"
          />
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full bg-background border border-border rounded-lg p-2 min-h-[100px]"
          />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">{dump.title}</h2>
          <p className="text-foreground-secondary mb-4 line-clamp-3 prompt-text">{dump.prompt}</p>
        </>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {dump.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-background rounded-full text-sm text-foreground-secondary"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 hover:text-primary transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>{dump.comments}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-primary transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span>{dump.likes}</span>
          </button>
          <button className="hover:text-primary transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title={copied ? 'Copied!' : 'Copy prompt'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          {isEditable && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {isEditing && (
                <button
                  onClick={handleSaveEdit}
                  className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  title="Accept changes"
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-2 rounded-lg transition-colors ${
                  isDeleting 
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-700/50'
                }`}
                title="Delete"
              >
                <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-spin' : ''}`} />
              </button>
            </>
          )}
          <button 
            className="flex items-center space-x-2 hover:text-primary transition-colors"
            onClick={handleSave}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
