import React, { useState, useEffect } from 'react'
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
  const { user } = useAuth();
  const db = getFirestore();

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

  const handleEdit = async () => {
    if (!user || user.uid !== dump.author.id) {
      console.error('Not authorized to edit this prompt');
      return;
    }

    if (isEditing) {
      try {
        const promptRef = doc(db, 'prompts', dump.id);
        await updateDoc(promptRef, {
          title: editedTitle,
          prompt: editedPrompt,
          updatedAt: new Date().toISOString()
        });
        setIsEditing(false);
        if (onEdit) {
          onEdit({
            ...dump,
            title: editedTitle,
            prompt: editedPrompt
          });
        }
      } catch (error) {
        console.error('Error updating prompt:', error);
      }
    } else {
      setIsEditing(true);
    }
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

  return (
    <div className="bg-[#e7e7e7] dark:bg-black p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg prompt-box">
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
        <div className="mb-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-3 py-2 mb-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
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
      
      <div className="flex items-center justify-between text-foreground-secondary">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 hover:text-primary transition-colors">
            <ThumbsUp className="w-4 h-4 thumbs-up" />
            <span>{dump.likes}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-primary transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>{dump.comments}</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCopy}
            className="p-2 transition-all duration-200 active:scale-95 touch-manipulation hover:text-primary"
            title={copied ? 'Copied!' : 'Copy prompt'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          {isEditable && (
            <>
              <button
                onClick={handleEdit}
                className="p-2 transition-all duration-200 active:scale-95 touch-manipulation hover:text-primary"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 transition-all duration-200 active:scale-95 touch-manipulation hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button 
            className="flex items-center space-x-2 hover:text-primary transition-colors"
            onClick={handleSave}
          >
            <Bookmark 
              className={`w-4 h-4 bookmark ${isSaved ? 'saved' : ''}`} 
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
