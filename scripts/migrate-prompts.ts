import { db } from '../src/lib/firebase'
import { collection, getDocs, updateDoc } from 'firebase/firestore'

async function migratePrompts() {
  const promptsCollection = collection(db, 'prompts')
  const querySnapshot = await getDocs(promptsCollection)
  
  const batch = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    if (!data.type) {
      batch.push(updateDoc(doc.ref, { type: 'general' }))
    }
  })
  
  if (batch.length > 0) {
    console.log(`Updating ${batch.length} prompts...`)
    await Promise.all(batch)
    console.log('Migration complete!')
  } else {
    console.log('No prompts need updating')
  }
}

migratePrompts().catch(console.error)
