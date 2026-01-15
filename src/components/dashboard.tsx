import { useMemo } from 'preact/hooks'
import { getCategoryColor } from '../constants/category-colors'
import { useFeatures } from '../hooks/use-features'
import { slugify } from '../lib/slugify'
import type { FeatureData } from '../types'
import { Card } from './card'
import styles from './dashboard.module.css'
import { FilterBar } from './filter-bar'
import { LinkIcon } from './icons'

interface Props {
  featureIds: string[]
}

export function Dashboard({ featureIds }: Props) {
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
  const groupedFeatures = useMemo(
    () => Object.groupBy(processedFeatures, feature => feature.category),
    [processedFeatures],
  )

  const displayedCategories = Object.keys(groupedFeatures).sort(
    (a, b) => -1 * a.localeCompare(b),
  )

  if (loading) {
    return <div class={styles.loading}>Loading features...</div>
  }

  return (
    <>
      <FilterBar
        features={features}
        filters={filters}
        setFilters={setFilters}
        suggestedFeatureIds={featureIds}
        onAddFeatureId={addFeatureId}
      />

      <section class={styles.featuresScroll}>
        {processedFeatures.length === 0 ? (
          <p class={styles.noResults}>No features match the current filters.</p>
        ) : (
          displayedCategories.map(category => {
            const slug = slugify(category)
            return (
              <details key={category} open>
                <summary
                  class={`${styles.categoryHeader} glass`}
                  style={{ '--category-color': getCategoryColor(category) }}
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
                <dl class={styles.featuresGrid}>
                  {groupedFeatures[category].map((feature: FeatureData) => (
                    <Card
                      key={feature.id}
                      feature={feature}
                      isStarred={starred.has(feature.id)}
                      onToggleStar={toggleStar}
                    />
                  ))}
                </dl>
              </details>
            )
          })
        )}
      </section>
    </>
  )
}
