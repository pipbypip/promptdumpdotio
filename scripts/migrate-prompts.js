import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Get the directory path of the current module
const __dirname = dirname(fileURLToPath(import.meta.url))

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(join(__dirname, 'serviceAccountKey.json'))
})

const db = getFirestore(app)

async function migratePrompts() {
  const promptsCollection = db.collection('prompts')
  const querySnapshot = await promptsCollection.get()
  
  const batch = db.batch()
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
