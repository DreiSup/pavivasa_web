// (e) exactly one <h1> per page; non-empty <title> and meta description,
// unique across indexable pages; absolute self canonical on indexable
// pages (trailing slash per trailingSlash:true); og:url present.
export function checkMetadata({ pages, siteUrl, reporter }) {
  reporter.startCheck('(e) one <h1>, title/description present + unique, canonical, og:url')

  const titleOwners = new Map()
  const descriptionOwners = new Map()

  for (const page of pages) {
    const { route, publicPath, parsed, noindex } = page
    const expectedCanonical = `${siteUrl}${publicPath}`

    if (parsed.h1Count !== 1) {
      reporter.report({
        check: 'metadata',
        code: 'h1-count',
        route: publicPath,
        message: `expected exactly one <h1>, found ${parsed.h1Count}`,
      })
    }

    if (!parsed.title) {
      reporter.report({ check: 'metadata', code: 'missing-title', route: publicPath, message: '<title> is missing or empty' })
    }
    if (!parsed.description) {
      reporter.report({ check: 'metadata', code: 'missing-description', route: publicPath, message: 'meta description is missing or empty' })
    }
    if (!parsed.canonical) {
      reporter.report({ check: 'metadata', code: 'missing-canonical', route: publicPath, message: 'canonical <link> is missing' })
    } else if (parsed.canonical !== expectedCanonical) {
      reporter.report({
        check: 'metadata',
        code: 'wrong-canonical',
        route: publicPath,
        message: `canonical is "${parsed.canonical}", expected absolute self canonical "${expectedCanonical}"`,
      })
    }
    if (!parsed.ogUrl) {
      reporter.report({ check: 'metadata', code: 'missing-og-url', route: publicPath, message: 'og:url meta tag is missing' })
    }

    // Uniqueness only matters among pages actually offered for indexing.
    if (!noindex) {
      if (parsed.title) {
        const owner = titleOwners.get(parsed.title)
        if (owner) {
          reporter.report({
            check: 'metadata',
            code: 'duplicate-title',
            route: publicPath,
            message: `title "${parsed.title}" duplicates ${owner}`,
          })
        } else {
          titleOwners.set(parsed.title, publicPath)
        }
      }
      if (parsed.description) {
        const owner = descriptionOwners.get(parsed.description)
        if (owner) {
          reporter.report({
            check: 'metadata',
            code: 'duplicate-description',
            route: publicPath,
            message: `meta description duplicates ${owner}`,
          })
        } else {
          descriptionOwners.set(parsed.description, publicPath)
        }
      }
    }
  }

  reporter.endCheck()
}
