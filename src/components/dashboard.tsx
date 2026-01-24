import { useMemo } from 'react'
import { type Category, getCategoryColor } from '../constants/category-colors'
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
    filters,
    setFilters,
    addFeatureId,
  } = useFeatures({ featureIds })

  // Group by Category
  const groupedFeatures = useMemo(
    () => Object.groupBy(processedFeatures, feature => feature.category),
    [processedFeatures],
  )

  const displayedCategories = (Object.keys(groupedFeatures) as Category[]).sort(
    (a, b) => -1 * a.localeCompare(b),
  )

  if (loading) {
    return <div className={styles.loading}>Loading features...</div>
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
                  {groupedFeatures[category].map((feature: FeatureData) => (
                    <Card key={feature.id} feature={feature} />
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
