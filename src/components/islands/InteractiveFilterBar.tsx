/**
 * InteractiveFilterBar - Island component for filtering features
 * This hydrates immediately (client:load) as it's the main interaction point
 */
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { fetchFeatures } from '../../api/webstatus'
import { getCategoryColor } from '../../constants/category-colors'
import { STORAGE_KEYS } from '../../constants/storage-keys'
import type { SortOrder } from '../../hooks/use-features'
import { useLocalStorageStringArray } from '../../hooks/use-local-storage-string-array'
import { slugify } from '../../lib/slugify'
import { uniqueSortedStrings } from '../../lib/unique-sorted'
import type { FeatureData } from '../../types'
import { Card } from '../card'
import styles from '../dashboard.module.css'
import { FilterBar } from '../filter-bar'
import { LinkIcon } from '../icons'

// Declare the preloaded data type
declare global {
  interface Window {
    __PRELOADED_DATA__?: {
      features: FeatureData[]
      buildTimestamp: string
    }
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
    },
  },
})

interface Props {
  initialFeatures: FeatureData[]
  suggestedFeatureIds: string[]
}

function FilterBarIsland({ initialFeatures, suggestedFeatureIds }: Props) {
  // Get preloaded data from build time
  const preloadedFeatures =
    typeof window !== 'undefined'
      ? (window.__PRELOADED_DATA__?.features ?? initialFeatures)
      : initialFeatures

  // Feature IDs State - combines base + custom from localStorage
  const { value: customFeatureIds, add: addCustomFeatureId } =
    useLocalStorageStringArray(STORAGE_KEYS.customFeatureIds)

  const baseFeatureIds = useMemo(
    () => preloadedFeatures.map(f => f.id),
    [preloadedFeatures],
  )

  const allFeatureIds = useMemo(() => {
    return uniqueSortedStrings([...baseFeatureIds, ...customFeatureIds])
  }, [baseFeatureIds, customFeatureIds])

  // Filters State
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string[]>(['all'])
  const [status, setStatus] = useState<string[]>(['all'])
  const [sort, setSort] = useState<SortOrder>('newest')

  const filters = { search, category, status, sort }
  const setFilters = {
    setSearch,
    setCategory,
    setStatus,
    setSort,
  }

  // Data Query - uses preloaded data as initial, fetches fresh in background
  const { data: features = preloadedFeatures } = useQuery<FeatureData[]>({
    queryKey: ['features', allFeatureIds.join(',')],
    queryFn: () => fetchFeatures(allFeatureIds),
    initialData: preloadedFeatures,
    staleTime: 0, // Always revalidate in background (stale-while-revalidate)
    enabled: allFeatureIds.length > 0,
  })

  // Processing & Filtering
  const processedFeatures = useMemo(() => {
    return features
      .filter(f => {
        if (search && !f.name.toLowerCase().includes(search.toLowerCase()))
          return false
        if (
          category.length > 0 &&
          !category.includes('all') &&
          !category.includes(f.category)
        )
          return false
        if (category.length === 0) return false
        if (
          status.length > 0 &&
          !status.includes('all') &&
          !status.includes(f.status)
        )
          return false
        if (status.length === 0) return false
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
  }, [features, search, category, status, sort])

  // Group by Category
  const groupedFeatures = useMemo(
    () => Object.groupBy(processedFeatures, feature => feature.category),
    [processedFeatures],
  )

  const displayedCategories = Object.keys(groupedFeatures).sort(
    (a, b) => -1 * a.localeCompare(b),
  )

  // Hide static content and show dynamic content once hydrated
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
    // Hide the static pre-rendered container
    const staticContainer = document.getElementById('features-container')
    if (staticContainer) {
      staticContainer.style.display = 'none'
    }
  }, [])

  return (
    <>
      <FilterBar
        features={features}
        filters={filters}
        setFilters={setFilters}
        suggestedFeatureIds={suggestedFeatureIds}
        onAddFeatureId={addCustomFeatureId}
      />

      {hydrated && (
        <section className={styles.featuresScroll}>
          {processedFeatures.length === 0 ? (
            <p className={styles.noResults}>
              No features match the current filters.
            </p>
          ) : (
            displayedCategories.map(category => {
              const slug = slugify(category)
              return (
                <details key={category} open>
                  <summary
                    className={`${styles.categoryHeader} glass`}
                    style={
                      {
                        '--category-color': getCategoryColor(category),
                      } as React.CSSProperties
                    }
                  >
                    <h2 id={slug} className={styles.categoryTitle}>
                      {category}
                    </h2>
                    <a className={styles.anchorLink} href={`#${slug}`}>
                      <span aria-hidden="true">
                        <LinkIcon />
                      </span>
                      <span className="srOnly">Link to section {category}</span>
                    </a>
                  </summary>
                  <dl className={styles.featuresGrid}>
                    {groupedFeatures[category]?.map((feature: FeatureData) => (
                      <Card key={feature.id} feature={feature} />
                    ))}
                  </dl>
                </details>
              )
            })
          )}
        </section>
      )}
    </>
  )
}

// Wrap with QueryClientProvider for the island
export function InteractiveFilterBar(props: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <FilterBarIsland {...props} />
    </QueryClientProvider>
  )
}
