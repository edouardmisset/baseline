import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'preact/hooks'
import { fetchFeatures } from '../api/webstatus'
import { STORAGE_KEYS } from '../constants/storage-keys'
import { uniqueSortedStrings } from '../lib/unique-sorted'
import type { FeatureData } from '../types'
import { useLocalStorageStringArray } from './use-local-storage-string-array'

export type SortOrder = 'newest' | 'oldest' | 'az' | 'za'
export type FavoritesFilter = 'all' | 'starred'

export interface FeatureFilters {
  search: string
  category: string[]
  status: string[]
  favorites: FavoritesFilter
  sort: SortOrder
}

interface UseFeaturesProps {
  featureIds: string[]
}

export function useFeatures({ featureIds: baseFeatureIds }: UseFeaturesProps) {
  // Feature IDs State
  const { value: customFeatureIds, add: addCustomFeatureId } =
    useLocalStorageStringArray(STORAGE_KEYS.customFeatureIds)

  const allFeatureIds = useMemo(() => {
    return uniqueSortedStrings([...baseFeatureIds, ...customFeatureIds])
  }, [baseFeatureIds, customFeatureIds])

  // Starred State
  const { value: starredIds, setValue: setStarredIds } =
    useLocalStorageStringArray(STORAGE_KEYS.starredFeatureIds)
  const starred = useMemo(() => new Set(starredIds), [starredIds])

  const toggleStar = useCallback(
    (id: string) => {
      setStarredIds(prev =>
        prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id],
      )
    },
    [setStarredIds],
  )

  // Filters State
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string[]>(['all'])
  const [status, setStatus] = useState<string[]>(['all'])
  const [favorites, setFavorites] = useState<FavoritesFilter>('all')
  const [sort, setSort] = useState<SortOrder>('newest')

  const filters = { search, category, status, favorites, sort }
  const setFilters = {
    setSearch,
    setCategory,
    setStatus,
    setFavorites,
    setSort,
  }

  // Data Query
  const idsKey = allFeatureIds.join(',')
  const { data: features = [], isLoading: loading } = useQuery<FeatureData[]>({
    queryKey: ['features', idsKey],
    queryFn: () => fetchFeatures(allFeatureIds),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled: allFeatureIds.length > 0,
  })

  // Processing & Filtering
  const processedFeatures = useMemo(() => {
    return features
      .filter(f => {
        if (search && !f.name.toLowerCase().includes(search.toLowerCase()))
          return false
        // If "all" is selected, include all categories. If nothing selected, exclude all.
        if (
          category.length > 0 &&
          !category.includes('all') &&
          !category.includes(f.category)
        )
          return false
        if (category.length === 0) return false
        // If "all" is selected, include all statuses. If nothing selected, exclude all.
        if (
          status.length > 0 &&
          !status.includes('all') &&
          !status.includes(f.status)
        )
          return false
        if (status.length === 0) return false
        if (favorites === 'starred' && !starred.has(f.id)) return false
        return true
      })
      .sort((a, b) => {
        switch (sort) {
          case 'oldest':
            return a.date.localeCompare(b.date)
          case 'az':
            return a.name.localeCompare(b.name)
          case 'za':
            return b.name.localeCompare(a.name)
          default: // newest
            return b.date.localeCompare(a.date)
        }
      })
  }, [features, search, category, status, favorites, sort, starred])

  return {
    addFeatureId: addCustomFeatureId,
    features,
    loading,
    processedFeatures,
    starred,
    toggleStar,
    filters,
    setFilters,
  }
}
