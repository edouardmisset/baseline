import { useEffect, useMemo, useState } from 'preact/hooks'
import type { FeatureData } from '../types'

const STORAGE_KEY = 'feature-list-starred'

interface UseFeaturesProps {
  featureIds: string[]
}

const getCategory = (links: { link: string }[]) => {
  if (!links || links.length === 0) return 'Web Platform'
  for (const l of links) {
    if (l.link.includes('csswg') || l.link.includes('css')) return 'CSS'
    if (l.link.includes('tc39') || l.link.includes('ecma')) return 'JavaScript'
    if (l.link.includes('html') || l.link.includes('whatwg')) return 'HTML'
  }
  return 'Web Platform'
}

export function useFeatures({ featureIds }: UseFeaturesProps) {
  const [features, setFeatures] = useState<FeatureData[]>([])
  const [loading, setLoading] = useState(true)
  const [starred, setStarred] = useState<Set<string>>(new Set())

  // Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [filterStarred, setFilterStarred] = useState('all')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setStarred(new Set(JSON.parse(stored)))
    } catch {}
  }, [])

  const toggleStar = (id: string) => {
    const newStarred = new Set(starred)
    if (newStarred.has(id)) newStarred.delete(id)
    else newStarred.add(id)
    setStarred(newStarred)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newStarred]))
  }

  useEffect(() => {
    const fetchFeature = async (id: string): Promise<FeatureData> => {
      try {
        const [featureRes, metadataRes] = await Promise.all([
          fetch(`https://api.webstatus.dev/v1/features/${id}`),
          fetch(`https://api.webstatus.dev/v1/features/${id}/feature-metadata`),
        ])

        if (!featureRes.ok) throw new Error('Failed')

        const featureFn = await featureRes.json()
        const name = featureFn.name || id
        const status = featureFn.baseline?.status || 'unknown'
        const date =
          featureFn.baseline?.low_date ||
          (status === 'limited' ? '9999-12-31' : '1970-01-01')
        const category = getCategory(featureFn.spec?.links || [])

        let description = ''
        if (metadataRes.ok) {
          const metadata = await metadataRes.json()
          description = metadata.description || ''
        }

        return { id, name, description, category, status, date }
      } catch (_e) {
        return {
          id,
          name: id,
          description: 'Error loading data.',
          category: 'Web Platform',
          status: 'unknown',
          date: '1970-01-01',
        }
      }
    }

    const load = async () => {
      setLoading(true)
      const data = await Promise.all([...new Set(featureIds)].map(fetchFeature))
      setFeatures(data)
      setLoading(false)
    }
    load()
  }, [featureIds])

  const processedFeatures = useMemo(() => {
    return features
      .filter(f => {
        if (search && !f.name.toLowerCase().includes(search.toLowerCase()))
          return false
        if (category !== 'all' && f.category !== category) return false
        if (status !== 'all' && f.status !== status) return false
        if (filterStarred === 'starred' && !starred.has(f.id)) return false
        return true
      })
      .sort((a, b) => {
        switch (sort) {
          case 'oldest':
            return a.date.localeCompare(b.date)
          case 'az':
            return a.name.localeCompare(b.name)
          case 'za':
            return b.name.localeCompare(a.name)
          default:
            return b.date.localeCompare(a.date)
        }
      })
  }, [features, search, category, status, filterStarred, sort, starred])

  return {
    features,
    loading,
    processedFeatures,
    starred,
    toggleStar,
    filters: { search, category, status, filterStarred, sort },
    setFilters: {
      setSearch,
      setCategory,
      setStatus,
      setFilterStarred,
      setSort,
    },
  }
}
