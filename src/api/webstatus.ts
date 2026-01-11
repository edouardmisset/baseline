import { getCategory } from '../lib/get-category'
import type { FeatureData } from '../types'

type WebStatusFeatureResponse = {
  name?: string
  baseline?: {
    status?: FeatureData['status']
    low_date?: string
  }
  spec?: { links?: { link: string }[] }
}

type WebStatusFeatureMetadataResponse = {
  description?: string
}

export async function fetchFeature(id: string): Promise<FeatureData> {
  try {
    const [featureRes, metadataRes] = await Promise.all([
      fetch(`https://api.webstatus.dev/v1/features/${id}`),
      fetch(`https://api.webstatus.dev/v1/features/${id}/feature-metadata`),
    ])

    if (!featureRes.ok) throw new Error('Failed')

    const featureJson = (await featureRes.json()) as WebStatusFeatureResponse

    const name = featureJson.name || id
    const status = featureJson.baseline?.status || 'unknown'

    const date =
      featureJson.baseline?.low_date ||
      (status === 'limited' ? '9999-12-31' : '1970-01-01')

    const category = getCategory(featureJson.spec?.links)

    let description = ''
    if (metadataRes.ok) {
      const metadataJson =
        (await metadataRes.json()) as WebStatusFeatureMetadataResponse
      description = metadataJson.description || ''
    }

    return { id, name, description, category, status, date }
  } catch {
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
