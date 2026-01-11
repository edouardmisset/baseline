import { useMemo } from 'preact/hooks'
import { useFeatureFilters } from './use-feature-filters'
import { useFeatureIds } from './use-feature-ids'
import { useFeaturesQuery } from './use-features-query'
import { useStarredFeatureIds } from './use-starred-feature-ids'

interface UseFeaturesProps {
  featureIds: string[]
}

export function useFeatures({ featureIds }: UseFeaturesProps) {
  const { allFeatureIds, addFeatureId } = useFeatureIds(featureIds)

  const { starred, toggleStar } = useStarredFeatureIds()
  const { filters, setFilters } = useFeatureFilters()

  const { data: features = [], isLoading } = useFeaturesQuery(allFeatureIds)

  const processedFeatures = useMemo(() => {
    return features
      .filter(f => {
        if (
          filters.search &&
          !f.name.toLowerCase().includes(filters.search.toLowerCase())
        )
          return false
        if (filters.category !== 'all' && f.category !== filters.category)
          return false
        if (filters.status !== 'all' && f.status !== filters.status)
          return false
        if (filters.favorites === 'starred' && !starred.has(f.id)) return false
        return true
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'oldest':
            return a.date.localeCompare(b.date)
          case 'az':
            return a.name.localeCompare(b.name)
          case 'za':
            return b.name.localeCompare(a.name)
          default:
            return b.date.localeCompare(a.date)
        }
      })
  }, [features, filters, starred])

  return {
    addFeatureId,
    features,
    loading: isLoading,
    processedFeatures,

    starred,
    toggleStar,

    filters,
    setFilters,
  }
}
