export const CATEGORY_COLORS: Record<string, string> = {
  HTML: 'var(--color-category-html)',
  CSS: 'var(--color-category-css)',
  JavaScript: 'var(--color-category-js)',
  'Web Platform': 'var(--color-category-web)',
}

export const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category] || 'var(--color-accent)'
