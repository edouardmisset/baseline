import { getCategory } from '../lib/get-category'
import type { FeatureData } from '../types'

type WebStatusFeature = {
  feature_id: string
  name?: string
  baseline?: {
    status?: FeatureData['status']
    low_date?: string
  }
  spec?: { links?: { link: string }[] }
}

type WebStatusFeatureListResponse = {
  data: WebStatusFeature[]
}

type WebStatusFeatureMetadataResponse = {
  description?: string
}

export async function fetchFeatures(ids: string[]): Promise<FeatureData[]> {
  if (ids.length === 0) return []

  const chunkSize = 40
  const chunks: string[][] = []
  for (let i = 0;i < ids.length;i += chunkSize) {
    chunks.push(ids.slice(i, i + chunkSize))
  }

  const chunkPromises = chunks.map(async chunkIds => {
    const query = chunkIds.map(id => `id:${id}`).join(' OR ')
    try {
      const [listRes, ...metadataResList] = await Promise.all([
        fetch(
          `https://api.webstatus.dev/v1/features?q=${encodeURIComponent(query)}&page_size=${chunkSize * 2}`,
        ),
        ...chunkIds.map(id =>
          fetch(`https://api.webstatus.dev/v1/features/${id}/feature-metadata`),
        ),
      ])

      let featuresList: WebStatusFeature[] = []
      if (listRes.ok) {
        const data = (await listRes.json()) as WebStatusFeatureListResponse
        featuresList = data.data
      }

      const metadataList = await Promise.all(
        metadataResList.map(res =>
          res.ok
            ? (res.json() as Promise<WebStatusFeatureMetadataResponse>)
            : null,
        ),
      )

      return chunkIds.map((id, index) => {
        const feature = featuresList.find(f => f.feature_id === id)
        const metadata = metadataList[index]

        if (!feature) {
          return {
            id,
            name: id,
            description: 'Error loading data.',
            category: 'Web Platform' as const,
            status: 'unknown' as const,
            date: '1970-01-01',
          }
        }

        const name = feature.name || id
        const status = feature.baseline?.status || 'unknown'
        const date =
          feature.baseline?.low_date ||
          (status === 'limited' ? '9999-12-31' : '1970-01-01')

        const category = getCategory(feature.spec?.links) as FeatureData['category']
        const description = metadata?.description || ''

        return { id, name, description, category, status, date }
      })
    } catch {
      return chunkIds.map(id => ({
        id,
        name: id,
        description: 'Error loading data.',
        category: 'Web Platform' as FeatureData['category'],
        status: 'unknown' as const,
        date: '1970-01-01',
      }))
    }
  })

  const chunksResults = await Promise.all(chunkPromises)
  return chunksResults.flat()
}

export async function fetchFeature(id: string): Promise<FeatureData> {
  const [result] = await fetchFeatures([id])
  return result
}
