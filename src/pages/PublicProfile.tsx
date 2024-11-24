import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { DumpCard } from '../components/DumpCard'

interface UserProfile {
  displayName: string;
  username: string;
  bio: string;
  photoURL: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  visibility: {
    displayName: boolean;
    username: boolean;
    bio: boolean;
    socialLinks: boolean;
  };
}

export function PublicProfile() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [prompts, setPrompts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return
      setLoading(true)
      setError(null)

      try {
        const db = getFirestore()
        
        // First, find the user document by username
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('username', '==', username))
        const querySnapshot = await getDocs(q)
        
        if (querySnapshot.empty) {
          setError('User not found')
          return
        }

        const userDoc = querySnapshot.docs[0]
        const userData = userDoc.data() as UserProfile

        // Load user's public prompts
        const promptsRef = collection(db, 'prompts')
        const promptsQuery = query(
          promptsRef,
          where('userId', '==', userDoc.id),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc')
        )
        const promptsSnapshot = await getDocs(promptsQuery)
        const publicPrompts = promptsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setProfile(userData)
        setPrompts(publicPrompts)
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [username])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground-secondary">{error || 'Profile not found'}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="bg-background-secondary rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={profile.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`}
            alt={profile.displayName}
            className="w-20 h-20 rounded-full"
          />
          <div>
            {profile.visibility.displayName && (
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
            )}
            {profile.visibility.username && (
              <p className="text-foreground-secondary">@{profile.username}</p>
            )}
          </div>
        </div>

        {profile.visibility.bio && profile.bio && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Bio</h2>
            <p className="text-foreground-secondary">{profile.bio}</p>
          </div>
        )}

        {profile.visibility.socialLinks && Object.entries(profile.socialLinks).some(([_, value]) => value) && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Social Links</h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(profile.socialLinks).map(([platform, url]) => {
                if (!url) return null
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Public Prompts</h2>
        {prompts.length > 0 ? (
          prompts.map(prompt => (
            <DumpCard
              key={prompt.id}
              dump={prompt}
              showActions={false}
            />
          ))
        ) : (
          <p className="text-center py-8 text-foreground-secondary">
            No public prompts yet
          </p>
        )}
      </div>
    </div>
  )
}
