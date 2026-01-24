import { useCallback, useEffect, useState } from 'react'
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

  return { value, setValue, add }
}
