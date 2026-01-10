import { h } from 'preact';
import styles from './FeatureControls.module.css';
import { FeatureData } from '../types';

interface Props {
  features: FeatureData[];
  search: string;
  category: string;
  status: string;
  starred: string;
  sort: string;
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onStarredChange: (val: string) => void;
  onSortChange: (val: string) => void;
}

export default function FeatureControls({
  features,
  search,
  category,
  status,
  starred,
  sort,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onStarredChange,
  onSortChange,
}: Props) {
  const categories = Array.from(new Set(features.map((f) => f.category))).sort();
  const statuses = Array.from(new Set(features.map((f) => f.status))).sort();

  return (
    <div class={styles['controls-container']}>
      <div class={`${styles['control-group']} ${styles['search-group']}`}>
        <label htmlFor="search-input">Search</label>
        <input
          type="text"
          id="search-input"
          class={styles['control-input']}
          placeholder="Filter by name..."
          value={search}
          onInput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
        />
      </div>

      <div class={styles['control-group']}>
        <label htmlFor="category-filter">Category</label>
        <select
          id="category-filter"
          class={styles['control-select']}
          value={category}
          onChange={(e) => onCategoryChange((e.target as HTMLSelectElement).value)}
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div class={styles['control-group']}>
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          class={styles['control-select']}
          value={status}
          onChange={(e) => onStatusChange((e.target as HTMLSelectElement).value)}
        >
          <option value="all">All</option>
          {statuses.map((s) => (
            <option value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div class={styles['control-group']}>
        <label htmlFor="starred-filter">Favorites</label>
        <select
          id="starred-filter"
          class={styles['control-select']}
          value={starred}
          onChange={(e) => onStarredChange((e.target as HTMLSelectElement).value)}
        >
          <option value="all">All</option>
          <option value="starred">Starred Only</option>
        </select>
      </div>

      <div class={styles['control-group']}>
        <label htmlFor="sort-order">Sort By</label>
        <select
          id="sort-order"
          class={styles['control-select']}
          value={sort}
          onChange={(e) => onSortChange((e.target as HTMLSelectElement).value)}
        >
          <option value="newest">Newest / Upcoming</option>
          <option value="oldest">Oldest / Stable</option>
          <option value="az">A–Z (Name)</option>
          <option value="za">Z–A (Name)</option>
        </select>
      </div>
    </div>
  );
}
