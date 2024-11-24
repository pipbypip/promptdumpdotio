import { auth, db } from '@/lib/firebase'
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

export interface UserData {
  uid: string
  email: string
  displayName: string
  photoURL: string
  username?: string
  bio?: string
  promptCount: number
  createdAt: Date
  updatedAt: Date
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const { user } = result

    // Check if user exists in Firestore
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date(),
        promptCount: 0,
      })
    }

    return user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export async function createOrUpdateUser(user: User) {
  const userRef = doc(db, 'users', user.uid)
  const userDoc = await getDoc(userRef)

  if (!userDoc.exists()) {
    // Create new user
    const userData: UserData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      promptCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await setDoc(userRef, userData)
    return userData
  } else {
    // Update existing user
    const updateData = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      updatedAt: new Date(),
    }
    await updateDoc(userRef, updateData)
    return { ...userDoc.data(), ...updateData } as UserData
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserData>) {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date(),
  })
}

export async function getUserProfile(uid: string): Promise<UserData | null> {
  const userRef = doc(db, 'users', uid)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    return userDoc.data() as UserData
  }
  return null
}

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}
