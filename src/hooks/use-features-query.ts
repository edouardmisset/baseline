import { useQuery } from '@tanstack/react-query'
import { fetchFeatures } from '../api/webstatus'
import { uniqueSortedStrings } from '../lib/unique-sorted'
import type { FeatureData } from '../types'

export function useFeaturesQuery(featureIds: string[]) {
  const ids = uniqueSortedStrings(featureIds)
  const idsKey = ids.join(',')

  return useQuery<FeatureData[]>({
    queryKey: ['features', idsKey],
    queryFn: () => fetchFeatures(ids),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled: ids.length > 0,
  })
}
