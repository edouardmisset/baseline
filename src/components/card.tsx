import type { FeatureData } from '../types'
import { BaselineStatus } from './baseline-status'
import styles from './card.module.css'
import { MDNIcon } from './icons'

interface Props {
  feature: FeatureData
}

export function Card({ feature }: Props) {
  const { id, name, description, category } = feature

  return (
    <div className={`${styles.card} glass`}>
      <div className={styles.cardHeader}>
        <dt>
          <h3>{name}</h3>
        </dt>
        <div className={styles.actions}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(name)}`}
            className={styles.mdnSearchBtn}
            title="Search on MDN"
          >
            <MDNIcon />
          </a>
        </div>
        <span className={styles.badge} data-category={category}>
          {category}
        </span>
      </div>
      <dd className={styles.content}>
        <p className={styles.description}>{description}</p>
      </dd>
      <div className={styles.featureStatus}>
        <BaselineStatus id={id} />
      </div>
    </div>
  )
}
