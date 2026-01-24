export const CATEGORY_COLORS = {
  HTML: 'var(--color-category-html)',
  CSS: 'var(--color-category-css)',
  JavaScript: 'var(--color-category-js)',
  'Web Platform': 'var(--color-category-web)',
} as const satisfies Record<string, string>

export type Category = keyof typeof CATEGORY_COLORS

export const getCategoryColor = (category: Category) =>
  CATEGORY_COLORS[category] || 'var(--color-accent)'
