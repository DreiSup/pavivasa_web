// Reads Next.js's own build manifests to enumerate pages, redirects and
// noindex-by-header rules — the ground truth for "what got built", instead
// of walking the filesystem (which can pick up on-demand renders a prior
// `next start` cached back into `.next/server/app` — see lib/server.mjs).
import path from 'node:path'
import { readJSON, readTextIfExists } from './fs-util.mjs'

// Metadata routes that are not "pages" for the purposes of any of the
// checks here (sitemap membership, links, h1/title/description, images...).
const METADATA_ROUTES = new Set([
  '/opengraph-image.jpg',
  '/apple-icon.png',
  '/icon.png',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
])

function routeToHtmlFile(route) {
  const rel = route === '/' ? 'index' : route.replace(/^\//, '')
  return `${rel}.html`
}

/**
 * Loads everything from `<nextDir>` needed to enumerate pages and their
 * routing facts. `nextDir` defaults to `<appDir>/.next` but can point at a
 * copy (defect-planting, or comparing an older build) — this module never
 * touches anything outside it.
 */
export async function loadBuild(nextDir) {
  const prerender = await readJSON(path.join(nextDir, 'prerender-manifest.json'))
  const routes = await readJSON(path.join(nextDir, 'routes-manifest.json'))
  const buildId = (await readTextIfExists(path.join(nextDir, 'BUILD_ID'), '')).trim()

  const noindexHeaderRules = (routes.headers || [])
    .filter((rule) => (rule.headers || []).some((h) => /^x-robots-tag$/i.test(h.key) && /noindex/i.test(h.value)))
    .map((rule) => new RegExp(rule.regex))

  // Only literal, user-authored redirects (next.config's redirects()), not
  // Next's own internal trailing-slash normalization redirects.
  const redirects = (routes.redirects || [])
    .filter((r) => !r.internal)
    .map((r) => ({ source: r.source, destination: r.destination, statusCode: r.statusCode }))

  const pages = []
  for (const route of Object.keys(prerender.routes || {})) {
    if (route === '/_not-found' || METADATA_ROUTES.has(route)) continue
    pages.push({
      route,
      htmlFile: path.join(nextDir, 'server', 'app', routeToHtmlFile(route)),
      // trailingSlash: true (next.config.ts) — every public URL ends in /.
      publicPath: route === '/' ? '/' : `${route}/`,
    })
  }
  pages.sort((a, b) => a.route.localeCompare(b.route))

  return { buildId, pages, noindexHeaderRules, redirects, appDir: path.dirname(nextDir) }
}

export function isNoindexByHeader(route, noindexHeaderRules) {
  return noindexHeaderRules.some((re) => re.test(route))
}

export async function readServerAppFile(nextDir, name) {
  return readTextIfExists(path.join(nextDir, 'server', 'app', name), null)
}
