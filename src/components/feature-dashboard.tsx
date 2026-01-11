import { useMemo } from 'preact/hooks'
import { getCategoryColor } from '../constants/category-colors'
import { useFeatures } from '../hooks/use-features'
import { slugify } from '../lib/slugify'
import type { FeatureData } from '../types'
import { FeatureCard } from './feature-card'
import { FeatureControls } from './feature-controls'
import styles from './feature-dashboard.module.css'

interface Props {
  featureIds: string[]
}

export function FeatureDashboard({ featureIds }: Props) {
  const {
    features,
    loading,
    processedFeatures,
    starred,
    toggleStar,
    filters,
    setFilters,
    addFeatureId,
  } = useFeatures({ featureIds })

  // Group by Category
  const groupedFeatures = useMemo(() => {
    return processedFeatures.reduce(
      (acc, feature) => {
        if (!acc[feature.category]) {
          acc[feature.category] = []
        }
        acc[feature.category].push(feature)
        return acc
      },
      {} as Record<string, FeatureData[]>,
    )
  }, [processedFeatures])

  const displayedCategories = Object.keys(groupedFeatures).sort()

  if (loading) {
    return <div class={styles.loading}>Loading features...</div>
  }

  return (
    <div class={styles.featureDashboard}>
      <FeatureControls
        features={features}
        filters={filters}
        setFilters={setFilters}
        suggestedFeatureIds={featureIds}
        onAddFeatureId={addFeatureId}
      />

      <div class={styles.featuresScroll}>
        <div class={styles.featuresContainer}>
          {displayedCategories.map(category => {
            const slug = slugify(category)
            const color = getCategoryColor(category)
            return (
              <details key={category} class={styles.categoryGroup} open>
                <summary
                  class={`${styles.categoryHeader} glass`}
                  style={
                    { '--category-color': color } as Record<string, string>
                  }
                >
                  <h2 id={slug} class={styles.categoryTitle}>
                    {category}
                  </h2>
                  <a class={styles.anchorLink} href={`#${slug}`}>
                    <span aria-hidden="true">
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentcolor"
                          d="m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z"
                        />
                      </svg>
                    </span>
                    <span class="srOnly">Link to section {category}</span>
                  </a>
                </summary>
                <div class={styles.featuresGrid}>
                  {groupedFeatures[category].map(feature => (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      isStarred={starred.has(feature.id)}
                      onToggleStar={toggleStar}
                    />
                  ))}
                </div>
              </details>
            )
          })}
        </div>

        {processedFeatures.length === 0 && (
          <div class={styles.noResults}>
            No features match the current filters.
          </div>
        )}
      </div>
    </div>
  )
}
