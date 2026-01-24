import type { Category } from './constants/category-colors'

export type Status = 'limited' | 'newly' | 'widely' | 'unknown'

export interface FeatureData {
  id: string
  name: string
  description: string
  category: Category
  status: Status
  date: string
}
