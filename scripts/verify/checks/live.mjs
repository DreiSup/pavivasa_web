// Checks that need real HTTP semantics against a running `next start`,
// always the real app directory (never a defect-planting copy of `.next` —
// see scripts/verify/README.md):
//   (a), live half: every sitemap URL returns 200.
//   (b) no internal <a href> leads to a 404 or a redirect.
//   (c) every next.config redirect resolves to a 200 page in one hop.
/**
 * Resolves `href` against `base` (a full URL) the way a browser would —
 * this is what makes relative hrefs ("no-existe/", "../contacto/") and
 * protocol-relative ones ("//pavivasa.com/x") work, and what correctly
 * rejects a same-prefix-but-different-host href like
 * "https://pavivasa.com.evil.tld/x" (`startsWith(siteUrl)` would not).
 * Returns the resolved pathname, or `null` for anything not on `siteOrigin`
 * (external links, tel:, mailto:, wa.me...).
 */
function resolveInternalPath(href, base, siteOrigin) {
  let resolved
  try {
    resolved = new URL(href, base)
  } catch {
    return null
  }
  if (resolved.origin !== siteOrigin) return null
  return resolved.pathname
}

async function fetchStatus(baseUrl, localPath) {
  try {
    const res = await fetch(`${baseUrl}${localPath}`, { redirect: 'manual', signal: AbortSignal.timeout(10000) })
    return { status: res.status, location: res.headers.get('location') }
  } catch (err) {
    return { status: null, error: String(err) }
  }
}

export async function checkLive({ pages, build, siteUrl, baseUrl, sitemapUrls, reporter }) {
  reporter.startCheck('(a) sitemap URLs -> 200 · (b) internal links -> no 404/redirect · (c) redirects -> one hop -> 200')

  const siteOrigin = new URL(siteUrl).origin
  const serverOrigin = new URL(baseUrl).origin

  // -- (a) live: every sitemap URL returns 200, plus the metadata routes themselves.
  for (const url of sitemapUrls) {
    const local = resolveInternalPath(url, siteUrl, siteOrigin) ?? url
    const { status } = await fetchStatus(baseUrl, local)
    if (status !== 200) {
      reporter.report({ check: 'sitemap', code: 'url-not-200', route: local, message: `sitemap URL "${url}" returned ${status ?? 'no response'}, expected 200` })
    }
  }
  for (const metaPath of ['/robots.txt', '/sitemap.xml']) {
    const { status } = await fetchStatus(baseUrl, metaPath)
    if (status !== 200) {
      reporter.report({ check: 'sitemap', code: 'metadata-route-not-200', route: metaPath, message: `"${metaPath}" returned ${status ?? 'no response'}, expected 200` })
    }
  }

  // -- (b) internal links: collect unique targets, fetch once each, report per occurrence.
  // Every href is resolved against ITS OWN page (siteUrl + page.publicPath), the way a
  // browser resolves it — this is what makes relative hrefs ("no-existe/", "../contacto/")
  // and protocol-relative ones ("//pavivasa.com/x") work, and correctly excludes an
  // external link that merely starts with the site's URL as a string
  // (e.g. "https://pavivasa.com.evil.tld/").
  const usageByPath = new Map() // localPath -> Set(page.publicPath)
  for (const page of pages) {
    const pageUrl = `${siteUrl}${page.publicPath}`
    for (const link of page.parsed.links) {
      const href = link.href || ''
      if (!href || href.startsWith('#')) continue
      const local = resolveInternalPath(href, pageUrl, siteOrigin)
      if (local === null) continue // external, tel:, mailto:, wa.me...
      if (!usageByPath.has(local)) usageByPath.set(local, new Set())
      usageByPath.get(local).add(page.publicPath)
    }
  }
  for (const [localPath, usedBy] of usageByPath) {
    const { status, location } = await fetchStatus(baseUrl, localPath)
    if (status === 200) continue
    const detail =
      status && status >= 300 && status < 400
        ? `redirects (${status}) to "${location}" — link should point at the final URL`
        : `returned ${status ?? 'no response'}`
    for (const usedByRoute of usedBy) {
      reporter.report({ check: 'internal-links', code: 'broken-or-redirecting', route: usedByRoute, message: `link to "${localPath}" ${detail}` })
    }
  }

  // -- (c) redirects: one hop, then 200. The Location header is resolved against
  // baseUrl (a browser would resolve it against the redirecting request's own URL,
  // which is the same origin here) — never string-matched, since Next may send an
  // absolute or a relative Location.
  for (const r of build.redirects) {
    const first = await fetchStatus(baseUrl, r.source)
    if (first.status !== 301 && first.status !== 308) {
      reporter.report({
        check: 'redirects',
        code: 'wrong-status',
        route: r.source,
        message: `expected a 301/308 redirect, got ${first.status ?? 'no response'}`,
      })
      continue
    }
    const location = first.location || ''
    // Resolved against the LOCAL server's own origin: `next start` sends a
    // Location built from the request's Host header (localhost:<port> here),
    // not from NEXT_PUBLIC_SITE_URL — a relative Location resolves the same
    // way either way, so this only matters for an absolute one.
    const local = resolveInternalPath(location, baseUrl, serverOrigin) ?? new URL(location, baseUrl).pathname
    const second = await fetchStatus(baseUrl, local)
    if (second.status !== 200) {
      const detail =
        second.status && second.status >= 300 && second.status < 400
          ? `redirects again (${second.status}) to "${second.location}" — more than one hop`
          : `returned ${second.status ?? 'no response'}`
      reporter.report({ check: 'redirects', code: 'destination-not-200', route: r.source, message: `redirect destination "${location}" ${detail}` })
    }
  }

  reporter.endCheck()
}
