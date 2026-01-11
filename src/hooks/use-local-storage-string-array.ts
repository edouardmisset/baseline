import { useCallback, useEffect, useState } from 'preact/hooks'
import {
  readJsonFromLocalStorage,
  writeJsonToLocalStorage,
} from '../lib/local-storage'

export function useLocalStorageStringArray(key: string) {
  const [value, setValue] = useState<string[]>(() =>
    readJsonFromLocalStorage<string[]>(key, []),
  )

  useEffect(() => {
    writeJsonToLocalStorage(key, value)
  }, [key, value])

  const add = useCallback((next: string) => {
    setValue(prev => {
      if (prev.includes(next)) return prev
      return [...prev, next]
    })
  }, [])

  const remove = useCallback((next: string) => {
    setValue(prev => prev.filter(v => v !== next))
  }, [])

  const clear = useCallback(() => {
    setValue([])
  }, [])

  return { value, setValue, add, remove, clear }
}
