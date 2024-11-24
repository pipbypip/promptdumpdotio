import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { Camera, Globe2, EyeOff } from 'lucide-react'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getAuth, updateProfile } from 'firebase/auth'
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'

interface SocialLinks {
  twitter?: string
  github?: string
  linkedin?: string
  website?: string
}

interface VisibilitySettings {
  displayName: boolean;
  username: boolean;
  bio: boolean;
  socialLinks: boolean;
}

interface SettingsProps {
  onClose: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const auth = getAuth()
  const user = auth.currentUser
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    twitter: '',
    github: '',
    linkedin: '',
    website: ''
  })
  const [visibility, setVisibility] = useState<VisibilitySettings>({
    displayName: true,
    username: true,
    bio: false,
    socialLinks: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load user data from Firestore when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return
      setIsLoading(true)
      setError(null)

      try {
        const db = getFirestore()
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const data = userDoc.data()
          setDisplayName(data.displayName || user.displayName || '')
          setUsername(data.username || '')
          setBio(data.bio || '')
          setSocialLinks({
            twitter: data.socialLinks?.twitter || '',
            github: data.socialLinks?.github || '',
            linkedin: data.socialLinks?.linkedin || '',
            website: data.socialLinks?.website || ''
          })
          // Load visibility settings
          setVisibility(data.visibility || {
            displayName: true,
            username: true,
            bio: false,
            socialLinks: false
          })
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        setError('Failed to load profile data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user])

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] || !user) return

    setIsLoading(true)
    const file = event.target.files[0]
    const storage = getStorage()
    const storageRef = ref(storage, `profile-images/${user.uid}`)

    try {
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      await updateProfile(user, {
        photoURL: downloadURL
      })

      // Update Firestore user document
      const db = getFirestore()
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        photoURL: downloadURL
      })
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }))
  }

  const handleVisibilityToggle = (field: keyof VisibilitySettings) => {
    setVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleUpdateProfile = async () => {
    if (!user) {
      setError('No user found. Please sign in again.')
      return
    }
    
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Basic validation
    if (!displayName.trim()) {
      setError('Display name is required')
      setIsLoading(false)
      return
    }

    try {
      console.log('Starting profile update...')
      
      // First, ensure we can write to Firestore
      const db = getFirestore()
      const userRef = doc(db, 'users', user.uid)
      
      // Prepare the update data
      const updateData = {
        displayName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        socialLinks: {
          twitter: socialLinks.twitter?.trim() || '',
          github: socialLinks.github?.trim() || '',
          linkedin: socialLinks.linkedin?.trim() || '',
          website: socialLinks.website?.trim() || ''
        },
        visibility,
        updatedAt: new Date().toISOString()
      }

      console.log('Updating Firestore document:', updateData)

      // Update Firestore first
      try {
        await updateDoc(userRef, updateData)
        console.log('Firestore update successful')
      } catch (firestoreError: any) {
        console.error('Firestore update failed:', firestoreError)
        // Check for specific Firestore errors
        if (firestoreError.code === 'permission-denied') {
          setError('Permission denied. Please check if you are signed in.')
        } else if (firestoreError.code === 'not-found') {
          // If document doesn't exist, create it
          try {
            await setDoc(userRef, {
              ...updateData,
              createdAt: new Date().toISOString()
            })
            console.log('Created new user document')
          } catch (setDocError) {
            console.error('Failed to create user document:', setDocError)
            throw setDocError
          }
        } else {
          throw firestoreError
        }
      }

      // Then update Firebase Auth profile
      try {
        await updateProfile(user, {
          displayName: displayName.trim()
        })
        console.log('Auth profile update successful')
      } catch (authError) {
        console.error('Auth profile update failed:', authError)
        // Continue even if auth profile update fails
        console.log('Continuing despite auth profile update failure')
      }

      setSuccess(true)
      console.log('Profile update completed successfully')
      
      // Wait a bit before closing to show success message
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error: any) {
      console.error('Profile update failed:', error)
      let errorMessage = 'Failed to update profile. Please try again.'
      
      // More specific error messages based on error type
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please sign in again.'
      } else if (error.code === 'not-found') {
        errorMessage = 'User profile not found. Please try signing out and back in.'
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-background p-6 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500">
            Profile updated successfully!
          </div>
        )}
        
        {/* Profile Image */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            <img
              src={user?.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email}`}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-primary rounded-full hover:bg-primary/80"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Display Name */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Display Name</label>
            <button
              onClick={() => handleVisibilityToggle('displayName')}
              className={`p-1 rounded-full transition-colors ${
                visibility.displayName ? 'text-primary hover:text-primary/80' : 'text-foreground-secondary hover:text-foreground'
              }`}
              title={visibility.displayName ? 'Public' : 'Private'}
            >
              {visibility.displayName ? <Globe2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 bg-background-secondary rounded border border-border"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Username</label>
            <button
              onClick={() => handleVisibilityToggle('username')}
              className={`p-1 rounded-full transition-colors ${
                visibility.username ? 'text-primary hover:text-primary/80' : 'text-foreground-secondary hover:text-foreground'
              }`}
              title={visibility.username ? 'Public' : 'Private'}
            >
              {visibility.username ? <Globe2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-background-secondary rounded border border-border"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Bio</label>
            <button
              onClick={() => handleVisibilityToggle('bio')}
              className={`p-1 rounded-full transition-colors ${
                visibility.bio ? 'text-primary hover:text-primary/80' : 'text-foreground-secondary hover:text-foreground'
              }`}
              title={visibility.bio ? 'Public' : 'Private'}
            >
              {visibility.bio ? <Globe2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 bg-background-secondary rounded border border-border"
            rows={3}
          />
        </div>

        {/* Email (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-3 py-2 bg-background-secondary rounded border border-border opacity-50"
          />
        </div>

        {/* Social Links */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Social Links</label>
            <button
              onClick={() => handleVisibilityToggle('socialLinks')}
              className={`p-1 rounded-full transition-colors ${
                visibility.socialLinks ? 'text-primary hover:text-primary/80' : 'text-foreground-secondary hover:text-foreground'
              }`}
              title={visibility.socialLinks ? 'Public' : 'Private'}
            >
              {visibility.socialLinks ? <Globe2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          {Object.entries(socialLinks).map(([platform, value]) => (
            <div key={platform} className="mb-2">
              <input
                type="url"
                placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                value={value}
                onChange={(e) => handleSocialLinkChange(platform as keyof SocialLinks, e.target.value)}
                className="w-full px-3 py-2 bg-background-secondary rounded border border-border"
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-background-secondary transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateProfile}
            className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
