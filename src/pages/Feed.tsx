import React, { useState } from 'react'
import { DumpFeed } from '../components/DumpFeed'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth, User } from 'firebase/auth'

export function Feed() {
  const [prompts, setPrompts] = useState([])
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false)
  const auth = getAuth()
  const user = auth.currentUser as User

  const handleSavePrompt = async (prompt: { title: string; content: string; type: string }) => {
    if (!user) return;

    try {
      const db = getFirestore();
      const promptRef = collection(db, 'prompts');
      
      const newPrompt = {
        title: prompt.title,
        content: prompt.content,
        category: prompt.type,
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
      const updatedPrompts = await fetchPrompts();
      setPrompts(updatedPrompts);
    } catch (error) {
      console.error('Error saving prompt:', error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="container mx-auto">
      <DumpFeed />
    </div>
  )
}

// Note: fetchPrompts function is not defined in the provided code, 
// you need to implement it or import it from somewhere else.
