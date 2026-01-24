import type { Category } from '../constants/category-colors'

export function getCategory(links?: { link: string }[]): Category {
  if (!links || links.length === 0) return 'Web Platform'

  for (const { link } of links) {
    if (link.includes('csswg') || link.includes('css')) return 'CSS'
    if (link.includes('tc39') || link.includes('ecma')) return 'JavaScript'
    if (link.includes('html') || link.includes('whatwg')) return 'HTML'
  }

  return 'Web Platform'
}
