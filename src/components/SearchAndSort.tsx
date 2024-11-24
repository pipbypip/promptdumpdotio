import React from 'react'
import { Search, SortAsc } from 'lucide-react'

export type SortOption = 'trending' | 'newest' | 'oldest'
export type CategoryOption = 'all' | 'video' | 'image' | 'code' | 'chat' | 'writing'

interface SearchAndSortProps {
  onSearch: (query: string) => void
  onSortChange: (sort: SortOption) => void
  onCategoryChange: (category: CategoryOption) => void
  sortValue: SortOption
  categoryValue: CategoryOption
  searchValue: string
}

export function SearchAndSort({
  onSearch,
  onSortChange,
  onCategoryChange,
  sortValue,
  categoryValue,
  searchValue
}: SearchAndSortProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Search Bar */}
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary w-5 h-5" />
        <input
          type="text"
          placeholder="Search prompts..."
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary w-5 h-5" />
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="pl-10 pr-4 py-2 bg-background-secondary text-foreground border border-border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary min-w-[140px]"
          >
            <option value="trending" className="bg-background-secondary text-foreground">Trending</option>
            <option value="newest" className="bg-background-secondary text-foreground">Newest</option>
            <option value="oldest" className="bg-background-secondary text-foreground">Oldest</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryValue}
          onChange={(e) => onCategoryChange(e.target.value as CategoryOption)}
          className="px-4 py-2 bg-background-secondary text-foreground border border-border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary min-w-[140px]"
        >
          <option value="all" className="bg-background-secondary text-foreground">All Types</option>
          <option value="video" className="bg-background-secondary text-foreground">Video</option>
          <option value="image" className="bg-background-secondary text-foreground">Image</option>
          <option value="code" className="bg-background-secondary text-foreground">Code</option>
          <option value="chat" className="bg-background-secondary text-foreground">Chat</option>
          <option value="writing" className="bg-background-secondary text-foreground">Creative Writing</option>
        </select>
      </div>
    </div>
  )
}
