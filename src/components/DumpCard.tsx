import React, { useState, useEffect } from 'react'
import { MessageSquare, ThumbsUp, Share2, Bookmark, Trash2 } from 'lucide-react'
import { CategoryOption } from './SearchAndSort'

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
  category?: CategoryOption
}

interface DumpCardProps {
  dump: Dump
  onDelete?: (id: string) => void
}

export function DumpCard({ dump, onDelete }: DumpCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedDumps = JSON.parse(localStorage.getItem('savedDumps') || '[]');
    setIsSaved(savedDumps.some((saved: Dump) => saved.id === dump.id));
  }, [dump.id]);

  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    const savedDumps = JSON.parse(localStorage.getItem('savedDumps') || '[]');
    
    if (newSavedState) {
      if (!savedDumps.some((saved: Dump) => saved.id === dump.id)) {
        savedDumps.push(dump);
      }
    } else {
      const updatedDumps = savedDumps.filter((saved: Dump) => saved.id !== dump.id);
      localStorage.setItem('savedDumps', JSON.stringify(updatedDumps));
      return;
    }
    
    localStorage.setItem('savedDumps', JSON.stringify(savedDumps));
  };

  return (
    <div className="prompt-box">
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
      
      <h2 className="text-xl font-bold mb-2">{dump.title}</h2>
      <p className="text-foreground-secondary mb-4 line-clamp-3">{dump.prompt}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {dump.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-background-secondary-hover rounded-full text-sm text-foreground-secondary"
          >
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center space-x-6 text-foreground-secondary">
        <button className="flex items-center space-x-2 hover:text-primary transition-colors">
          <ThumbsUp className="w-4 h-4 thumbs-up" />
          <span>{dump.likes}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-primary transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span>{dump.comments}</span>
        </button>
        <button 
          className="p-2 transition-all duration-200 active:scale-95 touch-manipulation"
          onClick={() => navigator.clipboard.writeText(dump.prompt)}
          title="Copy prompt"
        >
          <Share2 className="w-4 h-4 share-icon" />
        </button>
        <button 
          className="flex items-center space-x-2 hover:text-primary transition-colors"
          onClick={handleSave}
        >
          <Bookmark 
            className={`w-4 h-4 bookmark ${isSaved ? 'saved' : ''}`} 
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
        {onDelete && (
          <button 
            className="p-2 transition-all duration-200 active:scale-95 touch-manipulation"
            onClick={() => onDelete(dump.id)}
            title="Delete prompt"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
