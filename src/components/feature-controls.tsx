import type { FeatureData } from '../types'
import styles from './feature-controls.module.css'

interface Props {
  features: FeatureData[]
  filters: {
    search: string
    category: string
    status: string
    filterStarred: string
    sort: string
  }
  setFilters: {
    setSearch: (v: string) => void
    setCategory: (v: string) => void
    setStatus: (v: string) => void
    setFilterStarred: (v: string) => void
    setSort: (v: string) => void
  }
}

export default function FeatureControls({
  features,
  filters,
  setFilters,
}: Props) {
  const categories = Array.from(new Set(features.map(f => f.category))).sort()
  const statuses = Array.from(new Set(features.map(f => f.status))).sort()

  return (
    <div class={`panel ${styles.controlsContainer}`}>
      <div class={`${styles.controlGroup} ${styles.searchGroup}`}>
        <label class={styles.label} htmlFor="search-input">
          Search
        </label>
        <input
          type="text"
          id="search-input"
          class="formControl"
          placeholder="Filter by name..."
          value={filters.search}
          onInput={e =>
            setFilters.setSearch((e.target as HTMLInputElement).value)
          }
        />
      </div>

      <div class={styles.controlGroup}>
        <label class={styles.label} htmlFor="category-filter">
          Category
        </label>
        <select
          id="category-filter"
          class="formControl formSelect"
          value={filters.category}
          onChange={e =>
            setFilters.setCategory((e.target as HTMLSelectElement).value)
          }
        >
          <option value="all">All</option>
          {categories.map(cat => (
            <option value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div class={styles.controlGroup}>
        <label class={styles.label} htmlFor="status-filter">
          Status
        </label>
        <select
          id="status-filter"
          class="formControl formSelect"
          value={filters.status}
          onChange={e =>
            setFilters.setStatus((e.target as HTMLSelectElement).value)
          }
        >
          <option value="all">All</option>
          {statuses.map(s => (
            <option value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div class={styles.controlGroup}>
        <label class={styles.label} htmlFor="starred-filter">
          Favorites
        </label>
        <select
          id="starred-filter"
          class="formControl formSelect"
          value={filters.filterStarred}
          onChange={e =>
            setFilters.setFilterStarred((e.target as HTMLSelectElement).value)
          }
        >
          <option value="all">All</option>
          <option value="starred">Starred Only</option>
        </select>
      </div>

      <div class={styles.controlGroup}>
        <label class={styles.label} htmlFor="sort-order">
          Sort By
        </label>
        <select
          id="sort-order"
          class="formControl formSelect"
          value={filters.sort}
          onChange={e =>
            setFilters.setSort((e.target as HTMLSelectElement).value)
          }
        >
          <option value="newest">Newest / Upcoming</option>
          <option value="oldest">Oldest / Stable</option>
          <option value="az">A–Z (Name)</option>
          <option value="za">Z–A (Name)</option>
        </select>
      </div>
    </div>
  )
}
