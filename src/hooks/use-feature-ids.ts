import { useMemo } from 'preact/hooks'
import { STORAGE_KEYS } from '../constants/storage-keys'
import { uniqueSortedStrings } from '../lib/unique-sorted'
import { useLocalStorageStringArray } from './use-local-storage-string-array'

export function useFeatureIds(baseFeatureIds: string[]) {
  const { value: customFeatureIds, add: addCustomFeatureId } =
    useLocalStorageStringArray(STORAGE_KEYS.customFeatureIds)

  const allFeatureIds = useMemo(() => {
    return uniqueSortedStrings([...baseFeatureIds, ...customFeatureIds])
  }, [baseFeatureIds, customFeatureIds])

  return {
    allFeatureIds,
    addFeatureId: addCustomFeatureId,
  }
}
