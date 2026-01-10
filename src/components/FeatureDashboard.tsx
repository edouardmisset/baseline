import { h, Fragment } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';
import FeatureControls from './FeatureControls';
import FeatureCard from './FeatureCard';
import styles from './FeatureDashboard.module.css';
import { FeatureData } from '../types';

interface Props {
  featureIds: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  HTML: "var(--html-color)",
  CSS: "var(--css-color)",
  JavaScript: "var(--js-color)",
  "Web Platform": "var(--web-platform-color)",
};

const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category] || "var(--sl-color-text-accent)";

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

const getCategory = (links: { link: string }[]) => {
  if (!links || links.length === 0) return 'Web Platform';
  for (const l of links) {
    if (l.link.includes('csswg') || l.link.includes('css')) return 'CSS';
    if (l.link.includes('tc39') || l.link.includes('ecma')) return 'JavaScript';
    if (l.link.includes('html') || l.link.includes('whatwg')) return 'HTML';
  }
  return 'Web Platform';
};

const STORAGE_KEY = 'feature-list-starred';

export default function FeatureDashboard({ featureIds }: Props) {
  const [features, setFeatures] = useState<FeatureData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Controls State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [starredFilter, setStarredFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Starred State
  const [starred, setStarred] = useState<Set<string>>(new Set());

  // Load Starred
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setStarred(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleStar = (id: string) => {
    const newStarred = new Set(starred);
    if (newStarred.has(id)) {
      newStarred.delete(id);
    } else {
      newStarred.add(id);
    }
    setStarred(newStarred);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newStarred]));
  };

  // Fetch Logic
  useEffect(() => {
    const fetchFeature = async (id: string): Promise<FeatureData> => {
       try {
        const [featureRes, metadataRes] = await Promise.all([
          fetch(`https://api.webstatus.dev/v1/features/${id}`),
          fetch(`https://api.webstatus.dev/v1/features/${id}/feature-metadata`),
        ]);

        if (!featureRes.ok) {
          console.error(`Failed to fetch feature ${id}: ${featureRes.statusText}`);
          return {
            id,
            name: id,
            description: 'Failed to load feature data.',
            category: 'Web Platform',
            status: 'unknown',
            date: '1970-01-01',
          };
        }

        const featureFn = await featureRes.json();
        const name = featureFn.name || id;
        const status = featureFn.baseline?.status || 'unknown';
        // Use low_date for availability, fall back to "future" (9999) for limited features to sort them as "newest"
        const date =
          featureFn.baseline?.low_date ||
          (status === 'limited' ? '9999-12-31' : '1970-01-01');
        const category = getCategory(featureFn.spec?.links || []);

        let description = '';
        if (metadataRes.ok) {
          const metadata = await metadataRes.json();
          description = metadata.description || '';
        }

        return {
          id,
          name,
          description,
          category,
          status,
          date,
        };
      } catch (e) {
        console.error(`Error fetching ${id}`, e);
        return {
          id,
          name: id,
          description: 'Error loading data.',
          category: 'Web Platform',
          status: 'unknown',
          date: '1970-01-01',
        };
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      const uniqueIds = [...new Set(featureIds)];
      const data = await Promise.all(uniqueIds.map(fetchFeature));
      setFeatures(data);
      setLoading(false);
    };

    fetchAll();
  }, [featureIds]);

  // Filtering and Sorting
  const processedFeatures = useMemo(() => {
    let filtered = features.filter(f => {
      // Search
      if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
      // Category
      if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
      // Status
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      // Starred
      if (starredFilter === 'starred' && !starred.has(f.id)) return false;
      return true;
    });

    // Sort
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'newest': return b.date.localeCompare(a.date);
        case 'oldest': return a.date.localeCompare(b.date);
        case 'az': return a.name.localeCompare(b.name);
        case 'za': return b.name.localeCompare(a.name);
        default: return b.date.localeCompare(a.date);
      }
    });
  }, [features, search, categoryFilter, statusFilter, starredFilter, sort, starred]);

  // Group by Category
  const groupedFeatures = useMemo(() => {
    return processedFeatures.reduce(
      (acc, feature) => {
        if (!acc[feature.category]) {
          acc[feature.category] = [];
        }
        acc[feature.category].push(feature);
        return acc;
      },
      {} as Record<string, FeatureData[]>
    );
  }, [processedFeatures]);

  const displayedCategories = Object.keys(groupedFeatures).sort();

  if (loading) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading features...</div>;
  }

  return (
    <div class={styles['feature-dashboard']}>
      <FeatureControls
        features={features}
        search={search}
        category={categoryFilter}
        status={statusFilter}
        starred={starredFilter}
        sort={sort}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
        onStarredChange={setStarredFilter}
        onSortChange={setSort}
      />

      <div class={styles['features-container']}>
        {displayedCategories.map((category) => {
          const slug = slugify(category);
          const color = getCategoryColor(category);
          return (
            <details
              key={category}
              class={styles['category-group']}
              open
            >
              <summary
                class={styles['category-header']}
                style={{ '--category-color': color } as any}
              >
                <h2 id={slug} class={styles['category-title']}>
                  {category}
                </h2>
                <a
                  class={styles['anchor-link']}
                  href={`#${slug}`}
                  aria-labelledby={slug}
                >
                  <span aria-hidden="true" class="sl-anchor-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path
                        fill="currentcolor"
                        d="m12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z"
                      />
                    </svg>
                  </span>
                  <span class={`sr-only`}>Section titled “{category}”</span>
                </a>
              </summary>
              <div class={styles['features-grid']}>
                {groupedFeatures[category].map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    isStarred={starred.has(feature.id)}
                    onToggleStar={toggleStar}
                  />
                ))}
              </div>
            </details>
          );
        })}
      </div>

      {processedFeatures.length === 0 && (
         <div class={styles['no-results']}>
          No features match the current filters.
        </div>
      )}
    </div>
  );
}
