import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the directory path of the current module
const __dirname = dirname(fileURLToPath(import.meta.url))

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '../.env.local') })

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

console.log('Starting migration with config:', {
  ...firebaseConfig,
  apiKey: '***'
})

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function migratePrompts() {
  console.log('Fetching prompts...')
  const promptsCollection = collection(db, 'prompts')
  const querySnapshot = await getDocs(promptsCollection)
  
  const batch = writeBatch(db)
  let updateCount = 0
  
  querySnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data()
    if (!data.type) {
      console.log('Updating prompt:', docSnapshot.id)
      batch.update(doc(db, 'prompts', docSnapshot.id), { type: 'general' })
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
