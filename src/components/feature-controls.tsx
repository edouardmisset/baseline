import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'preact/hooks'
import { fetchAllFeatureIds } from '../api/webstatus'
import type { FavoritesFilter, SortOrder } from '../hooks/use-features'
import { uniqueSortedStrings } from '../lib/unique-sorted'
import type { FeatureData } from '../types'
import styles from './feature-controls.module.css'
import {
  ComboboxField,
  MultiSelectField,
  PrimaryButton,
  SelectField,
  TextField,
} from './ui/form-controls'

const FAVORITES_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'starred', label: 'Starred only' },
] as const

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest / Upcoming' },
  { value: 'oldest', label: 'Oldest / Stable' },
  { value: 'az', label: 'A-Z (Name)' },
  { value: 'za', label: 'Z-A (Name)' },
] as const

interface Props {
  features: FeatureData[]
  filters: {
    search: string
    category: string[]
    status: string[]
    favorites: FavoritesFilter
    sort: SortOrder
  }
  setFilters: {
    setSearch: (v: string) => void
    setCategory: (v: string[]) => void
    setStatus: (v: string[]) => void
    setFavorites: (v: FavoritesFilter) => void
    setSort: (v: SortOrder) => void
  }

  suggestedFeatureIds: string[]
  onAddFeatureId: (id: string) => void
}

export function FeatureControls({
  features,
  filters,
  setFilters,
  suggestedFeatureIds,
  onAddFeatureId,
}: Props) {
  const categories = uniqueSortedStrings(features.map(f => f.category))
  const statuses = uniqueSortedStrings(features.map(f => f.status))

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      ...categories.map(c => ({ value: c, label: c })),
    ],
    [categories],
  )

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      ...statuses.map(s => ({
        value: s,
        label: s.charAt(0).toUpperCase() + s.slice(1),
      })),
    ],
    [statuses],
  )

  // Load full feature IDs from API; fallback to provided list if empty
  const { data: allFeatureIds = [] } = useQuery<string[]>({
    queryKey: ['feature-id-suggestions'],
    queryFn: fetchAllFeatureIds,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
  })

  const featureIdSuggestions = useMemo(() => {
    const source =
      allFeatureIds.length > 0 ? allFeatureIds : suggestedFeatureIds
    return uniqueSortedStrings(source)
  }, [allFeatureIds, suggestedFeatureIds])

  const [newFeatureId, setNewFeatureId] = useState('')
  const [newFeatureIdError, setNewFeatureIdError] = useState<string | null>(
    null,
  )

  const onSubmitNewFeature = (e: Event) => {
    e.preventDefault()
    const next = newFeatureId.trim()
    if (!next) return

    if (!featureIdSuggestions.includes(next)) {
      setNewFeatureIdError('Pick a feature id from the list.')
      return
    }

    onAddFeatureId(next)
    setNewFeatureId('')
    setNewFeatureIdError(null)
  }

  return (
    <div className={styles.controlsSticky}>
      <search className={`${styles.controlsContainer} glass`}>
        <TextField
          className={styles.searchGroup}
          label="Search"
          type="search"
          placeholder="Filter by name…"
          value={filters.search}
          onValueChange={setFilters.setSearch}
        />

        <MultiSelectField
          label="Category"
          value={filters.category}
          options={categoryOptions}
          onValueChange={setFilters.setCategory}
        />

        <MultiSelectField
          label="Status"
          value={filters.status}
          options={statusOptions}
          onValueChange={setFilters.setStatus}
        />

        <SelectField
          label="Favorites"
          value={filters.favorites}
          defaultValue="all"
          options={FAVORITES_OPTIONS}
          onValueChange={v => setFilters.setFavorites(v as FavoritesFilter)}
        />

        <SelectField
          label="Sort"
          value={filters.sort}
          defaultValue="newest"
          options={SORT_OPTIONS}
          onValueChange={v => setFilters.setSort(v as SortOrder)}
        />

        <form className={styles.addFeatureForm} onSubmit={onSubmitNewFeature}>
          <ComboboxField
            label="Add feature id"
            placeholder="Search feature id…"
            value={newFeatureId}
            options={featureIdSuggestions.map(id => ({ value: id, label: id }))}
            error={newFeatureIdError}
            onValueChange={v => {
              setNewFeatureId(v)
              setNewFeatureIdError(null)
            }}
          />

          <PrimaryButton type="submit">Add</PrimaryButton>
        </form>
      </search>
    </div>
  )
}
