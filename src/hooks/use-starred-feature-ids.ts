import { useCallback, useMemo } from 'preact/hooks'
import { STORAGE_KEYS } from '../constants/storage-keys'
import { useLocalStorageStringArray } from './use-local-storage-string-array'

export function useStarredFeatureIds() {
  const { value: starredIds, setValue: setStarredIds } =
    useLocalStorageStringArray(STORAGE_KEYS.starredFeatureIds)

  const starred = useMemo(() => new Set(starredIds), [starredIds])

  const toggleStar = useCallback(
    (id: string) => {
      setStarredIds(prev => {
        if (prev.includes(id)) return prev.filter(v => v !== id)
        return [...prev, id]
      })
    },
    [setStarredIds],
  )

  return { starred, toggleStar }
}
