import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// Types
export interface Prompt {
  id: string
  title: string
  content: string
  tags: string[]
  authorId: string
  authorName: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  type: string
}

// Collection references
const promptsCollection = collection(db, 'prompts')

// Prompt operations
export async function createPrompt(prompt: Omit<Prompt, 'id'>) {
  const docRef = await addDoc(promptsCollection, {
    ...prompt,
    type: prompt.type || 'general',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return docRef.id
}

export async function getPrompt(id: string) {
  const docRef = doc(db, 'prompts', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Prompt
  }
  return null
}

export async function updatePrompt(id: string, data: Partial<Prompt>) {
  const docRef = doc(db, 'prompts', id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  })
}

export async function deletePrompt(id: string) {
  const docRef = doc(db, 'prompts', id)
  await deleteDoc(docRef)
}

export async function getLivePrompts(limit = 10) {
  const q = query(
    promptsCollection,
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limit)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Prompt[]
}

export async function getUserPrompts(userId: string) {
  const q = query(
    promptsCollection,
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Prompt[]
}

export async function searchPrompts(searchTerm: string) {
  // Note: For better search functionality, consider using Algolia or ElasticSearch
  // This is a basic implementation that searches titles and tags
  const q = query(
    promptsCollection,
    where('isPublic', '==', true),
    orderBy('title'),
    limit(20)
  )
  const querySnapshot = await getDocs(q)
  const prompts = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Prompt[]
  
  return prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )
}
