import type { FeatureData } from '../types'
import { BaselineStatus } from './baseline-status'
import styles from './card.module.css'
import { MDNIcon, StarIcon } from './icons'

interface Props {
  feature: FeatureData
  isStarred: boolean
  onToggleStar: (id: string) => void
}

export function Card({ feature, isStarred, onToggleStar }: Props) {
  const { id, name, description, category } = feature

  const handleStarClick = () => {
    onToggleStar(id)
  }

  return (
    <div class={`${styles.card} glass`}>
      <div class={styles.cardHeader}>
        <dt>
          <h3>{name}</h3>
        </dt>
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
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(name)}`}
            class={styles.mdnSearchBtn}
            title="Search on MDN"
          >
            <MDNIcon />
          </a>
        </div>
        <span class={styles.badge} data-category={category}>
          {category}
        </span>
      </div>
      <dd class={styles.content}>
        <p class={styles.description}>{description}</p>
      </dd>
      <div class={styles.featureStatus}>
        <BaselineStatus id={id} />
      </div>
    </div>
  )
}
