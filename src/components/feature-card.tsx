import type { FeatureData } from '../types'
import { BaselineStatus } from './baseline-status'
import styles from './feature-card.module.css'

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
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
          <button
            type="button"
            class={styles.mdnSearchBtn}
            title="Search on MDN"
            onClick={handleMdnClick}
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
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
