import { h } from 'preact';
import styles from './FeatureCard.module.css';
import { FeatureData } from '../types';
import BaselineStatus from './BaselineStatus';
import { useState } from 'preact/hooks';

interface Props {
  feature: FeatureData;
  isStarred: boolean;
  onToggleStar: (id: string) => void;
}

export default function FeatureCard({ feature, isStarred, onToggleStar }: Props) {
  const { id, name, description, category, status, date } = feature;
  const [animating, setAnimating] = useState(false);

  const handleStarClick = (e: Event) => {
    e.stopPropagation();
    onToggleStar(id);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  const handleMdnClick = (e: Event) => {
    e.stopPropagation();
    window.open(`https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(name)}`, '_blank');
  };

  return (
    <div
      class={`${styles['feature-card']} feature-card`}
      data-id={id}
      data-category={category}
      data-status={status}
      data-date={date}
    >
      <div class={styles['feature-header']}>
        <h3>{name}</h3>
        <div class={styles['actions']}>
          <button
            class={`${styles['star-btn']} star-btn`}
            title="Star this feature"
            aria-label={`Star ${name}`}
            aria-pressed={isStarred ? 'true' : 'false'}
            data-animating={animating ? 'true' : undefined}
            onClick={handleStarClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              class={styles['star-icon']}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
          <button
            class={`${styles['mdn-search-btn']} mdn-search-btn`}
            title="Search on MDN"
            onClick={handleMdnClick}
          >
            <svg
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
        <span
          class={`${styles['category-badge']} category-badge`}
          data-category={category}
        >
          {category}
        </span>
      </div>
      <p class={styles['feature-description']}>{description}</p>
      <div class={styles['feature-status']}>
        <BaselineStatus id={id} />
      </div>
    </div>
  );
}
