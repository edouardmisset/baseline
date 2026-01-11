import { useMemo } from 'preact/hooks'
import { getCategoryColor } from '../constants/category-colors'
import { useFeatures } from '../hooks/use-features'
import { slugify } from '../lib/slugify'
import type { FeatureData } from '../types'
import { FeatureCard } from './feature-card'
import { FeatureControls } from './feature-controls'
import styles from './feature-dashboard.module.css'
import { LinkIcon } from './icons'

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
                      <LinkIcon />
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
