export type BreadcrumbItem = { name: string; route?: string }

export function buildBreadcrumbsJsonLd(siteUrl: string, items: readonly BreadcrumbItem[]) {
  /**
   * `item` is required on every ListItem except the last. An intermediate
   * level with no route (a label with no page of its own) can't be
   * published: it's dropped BEFORE the map, so `position` comes out
   * correlative 1, 2, 3 — never 1, 3.
   */
  const publishable = items.filter((item, i) => Boolean(item.route) || i === items.length - 1)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: publishable.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.route ? { item: `${siteUrl}${item.route}` } : {}),
    })),
  }
}
