import { useMemo, useState } from 'preact/hooks'
import type { FavoritesFilter, SortOrder } from '../hooks/use-feature-filters'
import { uniqueSortedStrings } from '../lib/unique-sorted'
import type { FeatureData } from '../types'
import styles from './feature-controls.module.css'
import { PrimaryButton, SelectField, TextField } from './ui'

const FAVORITES_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'starred', label: 'Starred only' },
] as const

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest / Upcoming' },
  { value: 'oldest', label: 'Oldest / Stable' },
  { value: 'az', label: 'A–Z (Name)' },
  { value: 'za', label: 'Z–A (Name)' },
] as const

interface Props {
  features: FeatureData[]
  filters: {
    search: string
    category: string
    status: string
    favorites: FavoritesFilter
    sort: SortOrder
  }
  setFilters: {
    setSearch: (v: string) => void
    setCategory: (v: string) => void
    setStatus: (v: string) => void
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

  const featureIdSuggestions = useMemo(
    () => uniqueSortedStrings(suggestedFeatureIds),
    [suggestedFeatureIds],
  )

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
      <div className={`${styles.controlsContainer} glass`}>
        <TextField
          className={styles.searchGroup}
          label="Search"
          placeholder="Filter by name…"
          value={filters.search}
          onValueChange={setFilters.setSearch}
        />

        <SelectField
          label="Category"
          value={filters.category}
          defaultValue="all"
          options={categoryOptions}
          onValueChange={setFilters.setCategory}
        />

        <SelectField
          label="Status"
          value={filters.status}
          defaultValue="all"
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
          <TextField
            label="Add feature id"
            placeholder="e.g. anchor-positioning"
            list="feature-id-suggestions"
            value={newFeatureId}
            error={newFeatureIdError}
            onValueChange={v => {
              setNewFeatureId(v)
              setNewFeatureIdError(null)
            }}
          />

          <PrimaryButton type="submit">Add</PrimaryButton>

          <datalist id="feature-id-suggestions">
            {featureIdSuggestions.map(id => (
              <option key={id} value={id} />
            ))}
          </datalist>
        </form>
      </div>
    </div>
  )
}
