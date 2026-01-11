import { useState } from 'preact/hooks'

export type SortOrder = 'newest' | 'oldest' | 'az' | 'za'
export type FavoritesFilter = 'all' | 'starred'

export interface FeatureFilters {
  search: string
  category: string
  status: string
  favorites: FavoritesFilter
  sort: SortOrder
}

export function useFeatureFilters() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [favorites, setFavorites] = useState<FavoritesFilter>('all')
  const [sort, setSort] = useState<SortOrder>('newest')

  return {
    filters: {
      search,
      category,
      status,
      favorites,
      sort,
    } satisfies FeatureFilters,
    setFilters: { setSearch, setCategory, setStatus, setFavorites, setSort },
  }
}
