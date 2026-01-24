import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { fetchAllFeatureIds } from '../api/webstatus'
import type { SortOrder } from '../hooks/use-features'
import { uniqueSortedStrings } from '../lib/unique-sorted'
import type { FeatureData } from '../types'
import styles from './filter-bar.module.css'
import {
  ComboboxField,
  MultiSelectField,
  PrimaryButton,
  SelectField,
  TextField,
} from './ui/form-controls'

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
    sort: SortOrder
  }
  setFilters: {
    setSearch: (value: string) => void
    setCategory: (value: string[]) => void
    setStatus: (value: string[]) => void
    setSort: (value: SortOrder) => void
  }

  suggestedFeatureIds: string[]
  onAddFeatureId: (id: string) => void
}

export function FilterBar({
  features,
  filters,
  setFilters,
  suggestedFeatureIds,
  onAddFeatureId,
}: Props) {
  const categories = uniqueSortedStrings(
    features.map(feature => feature.category),
  )
  const statuses = uniqueSortedStrings(features.map(feature => feature.status))

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      ...categories.map(category => ({ value: category, label: category })),
    ],
    [categories],
  )

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      ...statuses.map(status => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
      })),
    ],
    [statuses],
  )

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

  const onSubmitNewFeature = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = newFeatureId.trim()
    if (!next || !featureIdSuggestions.includes(next)) return

    onAddFeatureId(next)
    setNewFeatureId('')
  }

  return (
    <div className={styles.controlsSticky}>
      <search className={`${styles.controlsContainer} glass`}>
        <TextField
          className={styles.searchGroup}
          label="Search"
          type="search"
          placeholder="Filter by feature name"
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
          label="Sort"
          value={filters.sort}
          defaultValue="newest"
          options={SORT_OPTIONS}
          onValueChange={v => setFilters.setSort(v as SortOrder)}
        />

        <form className={styles.addFeatureForm} onSubmit={onSubmitNewFeature}>
          <ComboboxField
            label="Add feature id"
            placeholder="Search feature id"
            value={newFeatureId}
            options={featureIdSuggestions.map(id => ({ value: id, label: id }))}
            onValueChange={v => {
              setNewFeatureId(v)
            }}
          />

          <PrimaryButton type="submit">Add</PrimaryButton>
        </form>
      </search>
    </div>
  )
}
