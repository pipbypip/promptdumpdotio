import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface UserProfile extends User {
  username?: string
  bio?: string
  promptCount?: number
}

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          const userData = userDoc.data()
          
          setUser({
            ...user,
            username: userData?.username,
            bio: userData?.bio,
            promptCount: userData?.promptCount,
          })
        } else {
          setUser(null)
        }
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return { user, loading, error }
}
