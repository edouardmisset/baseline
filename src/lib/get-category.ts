export function getCategory(links: { link: string }[] | undefined) {
  if (!links || links.length === 0) return 'Web Platform'

  for (const l of links) {
    if (l.link.includes('csswg') || l.link.includes('css')) return 'CSS'
    if (l.link.includes('tc39') || l.link.includes('ecma')) return 'JavaScript'
    if (l.link.includes('html') || l.link.includes('whatwg')) return 'HTML'
  }

  return 'Web Platform'
}
