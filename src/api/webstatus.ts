import { getCategory } from '../lib/get-category'
import type { FeatureData } from '../types'

const API_BASE = 'https://api.webstatus.dev/v1'

type WebStatusFeature = {
  feature_id: string
  name?: string
  baseline?: {
    status?: FeatureData['status']
    low_date?: string
  }
  spec?: { links?: { link: string }[] }
}

async function fetchChunk(ids: string[]): Promise<FeatureData[]> {
  const query = ids.map(id => `id:${id}`).join(' OR ')
  try {
    const [listRes, ...metadataResList] = await Promise.all([
      fetch(
        `${API_BASE}/features?q=${encodeURIComponent(query)}&page_size=${ids.length * 2}`,
      ),
      ...ids.map(id => fetch(`${API_BASE}/features/${id}/feature-metadata`)),
    ])

    const featuresList: WebStatusFeature[] = listRes.ok
      ? ((await listRes.json()).data as WebStatusFeature[])
      : []

    const metadataList = await Promise.all(
      metadataResList.map(res =>
        res.ok ? (res.json() as Promise<{ description?: string }>) : null,
      ),
    )

    return ids.map((id, index) => {
      const feature = featuresList.find(f => f.feature_id === id)
      const metadata = metadataList[index]

      if (!feature) {
        return createFallbackFeature(id)
      }

      const name = feature.name || id
      const status = feature.baseline?.status || 'unknown'
      const date =
        feature.baseline?.low_date ||
        (status === 'limited' ? '9999-12-31' : '1970-01-01')

      const category = getCategory(
        feature.spec?.links,
      ) as FeatureData['category']
      const description = metadata?.description || ''

      return { id, name, description, category, status, date }
    })
  } catch {
    return ids.map(createFallbackFeature)
  }
}

function createFallbackFeature(id: string): FeatureData {
  return {
    id,
    name: id,
    description: 'Error loading data.',
    category: 'Web Platform',
    status: 'unknown',
    date: '1970-01-01',
  }
}

export async function fetchFeatures(ids: string[]): Promise<FeatureData[]> {
  if (ids.length === 0) return []

  const chunkSize = 40
  const chunks: string[][] = []
  for (let i = 0;i < ids.length;i += chunkSize) {
    chunks.push(ids.slice(i, i + chunkSize))
  }

  const chunksResults = await Promise.all(chunks.map(fetchChunk))
  return chunksResults.flat()
}

export async function fetchFeature(id: string): Promise<FeatureData> {
  const [result] = await fetchFeatures([id])
  return result
}
