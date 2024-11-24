import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function migratePrompts() {
  const promptsCollection = collection(db, 'prompts')
  const querySnapshot = await getDocs(promptsCollection)
  
  const batch = writeBatch(db)
  let updateCount = 0
  
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    if (!data.type) {
      batch.update(doc.ref, { type: 'general' })
      updateCount++
    }
  })
  
  if (updateCount > 0) {
    console.log(`Updating ${updateCount} prompts...`)
    await batch.commit()
    console.log('Migration complete!')
  } else {
    console.log('No prompts need updating')
  }
}

migratePrompts().catch(console.error)
