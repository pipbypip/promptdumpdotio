import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY,
})

const promptsIndex = client.index('prompts')

export async function indexPrompt(prompt: {
  id: string
  title: string
  content: string
  tags: string[]
  author: string
}) {
  await promptsIndex.addDocuments([prompt])
}

export async function searchPrompts(query: string) {
  const results = await promptsIndex.search(query, {
    attributesToHighlight: ['title', 'content'],
    attributesToRetrieve: ['id', 'title', 'content', 'tags', 'author'],
    limit: 10,
  })
  return results.hits
}

export async function deletePrompt(id: string) {
  await promptsIndex.deleteDocument(id)
}

// Initialize the index with proper settings
export async function initializeSearch() {
  await promptsIndex.updateSettings({
    searchableAttributes: ['title', 'content', 'tags', 'author'],
    filterableAttributes: ['tags', 'author'],
    sortableAttributes: ['createdAt'],
    displayedAttributes: ['id', 'title', 'content', 'tags', 'author', 'createdAt'],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ],
  })
}
