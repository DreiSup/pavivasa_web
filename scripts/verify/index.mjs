#!/usr/bin/env node
// scripts/verify/index.mjs [appDir]
//
// Postbuild verifier — the repo's own permanent quality gate (§11 of
// arquitectura-plantilla-monorepo.md, §14 of SEO-Local-Contexto-Claude-Code.md).
// Run this AFTER `pnpm --filter web build`. See scripts/verify/README.md for
// the full list of checks, flags and how the known-issues baseline works.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

import { loadBuild, isNoindexByHeader } from './lib/manifest.mjs'
import { parsePage, isNoindexMeta } from './lib/html.mjs'
import { startServer, findFreePort } from './lib/net.mjs'
import { Reporter, loadKnownIssues } from './lib/reporter.mjs'

import { checkSitemapStatic } from './checks/sitemap.mjs'
import { checkMetadata } from './checks/metadata.mjs'
import { checkJsonLd } from './checks/jsonld.mjs'
import { checkImagesAndCta } from './checks/images-cta.mjs'
import { checkRobots } from './checks/robots.mjs'
import { checkLive } from './checks/live.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')

function parseArgs(argv) {
  const args = { appDir: null, nextDir: null, siteUrl: null, port: null, skipServer: false, knownIssues: null }
  const positional = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--next-dir') args.nextDir = argv[++i]
    else if (a === '--site-url') args.siteUrl = argv[++i]
    else if (a === '--port') args.port = Number(argv[++i])
    else if (a === '--known-issues') args.knownIssues = argv[++i]
    else if (a === '--skip-server') args.skipServer = true
    else positional.push(a)
  }
  args.appDir = positional[0] ?? null
  return args
}

async function readHtml(page, reporter) {
  try {
    return await fs.readFile(page.htmlFile, 'utf8')
  } catch {
    reporter.report({
      check: 'build',
      code: 'missing-html-file',
      route: page.publicPath,
      message: `no prerendered HTML file at ${page.htmlFile}`,
    })
    return null
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const appDir = path.resolve(repoRoot, args.appDir ?? 'apps/web')
  const nextDir = args.nextDir ? path.resolve(process.cwd(), args.nextDir) : path.join(appDir, '.next')
  const knownIssuesPath = args.knownIssues ?? path.join(__dirname, 'known-issues.json')

  const build = await loadBuild(nextDir)
  const knownIssues = await loadKnownIssues(knownIssuesPath)
  const reporter = new Reporter(knownIssues, ['build', 'sitemap', 'metadata', 'jsonld', 'images', 'cta', 'robots', 'internal-links', 'redirects'])

  // -- read + parse every page once, tag noindex (header OR <meta robots>).
  const pages = []
  for (const p of build.pages) {
    const html = await readHtml(p, reporter)
    if (html === null) continue
    const parsed = parsePage(html)
    const noindex = isNoindexByHeader(p.publicPath, build.noindexHeaderRules) || isNoindexMeta(parsed.robotsMeta)
    pages.push({ ...p, parsed, noindex })
  }

  const siteUrl = (
    args.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    pages.find((p) => p.route === '/')?.parsed.canonical ||
    'https://pavivasa.com'
  ).replace(/\/+$/, '')

  console.log(`verify: ${pages.length} page(s), site "${siteUrl}", build ${nextDir}`)

  // -- static checks (no server needed): run first, so nothing below can
  // mutate `.next` before they read it (see README.md "Why static checks run first").
  const sitemapUrls = await checkSitemapStatic({ pages, nextDir, siteUrl, reporter })
  checkMetadata({ pages, siteUrl, reporter })
  checkJsonLd({ pages, reporter })
  checkImagesAndCta({ pages, reporter })
  await checkRobots({ nextDir, siteUrl, reporter })

  if (!args.skipServer) {
    const port = args.port ?? (await findFreePort(4173))
    console.log(`verify: starting next start on port ${port} (from ${appDir})`)
    const server = await startServer(appDir, port, { NEXT_PUBLIC_SITE_URL: siteUrl })
    try {
      await checkLive({ pages, build, siteUrl, baseUrl: server.baseUrl, sitemapUrls, reporter })
    } finally {
      server.stop()
    }
  } else {
    console.log('verify: --skip-server passed, skipping (a)-live/(b)/(c) HTTP checks')
  }

  reporter.print()
  process.exit(reporter.exitCode)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
