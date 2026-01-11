import type { FeatureData } from '../types'
import { BaselineStatus } from './baseline-status'
import styles from './feature-card.module.css'
import { SearchIcon, StarIcon } from './icons'

interface Props {
  feature: FeatureData
  isStarred: boolean
  onToggleStar: (id: string) => void
}

export function FeatureCard({ feature, isStarred, onToggleStar }: Props) {
  const { id, name, description, category } = feature

  const handleStarClick = (e: Event) => {
    e.stopPropagation()
    onToggleStar(id)
  }

  const handleMdnClick = (e: Event) => {
    e.stopPropagation()
    window.open(
      `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(name)}`,
      '_blank',
    )
  }

  return (
    <div class={`${styles.featureCard} glass`}>
      <div class={styles.featureHeader}>
        <h3>{name}</h3>
        <div class={styles.actions}>
          <button
            type="button"
            class={styles.starBtn}
            title="Star this feature"
            aria-label={`Star ${name}`}
            aria-pressed={isStarred ? 'true' : 'false'}
            onClick={handleStarClick}
          >
            <StarIcon />
          </button>
          <button
            type="button"
            class={styles.mdnSearchBtn}
            title="Search on MDN"
            onClick={handleMdnClick}
          >
            <SearchIcon />
          </button>
        </div>
        <span class={styles.categoryBadge} data-category={category}>
          {category}
        </span>
      </div>
      <p class={styles.featureDescription}>{description}</p>
      <div class={styles.featureStatus}>
        <BaselineStatus id={id} />
      </div>
    </div>
  )
}
