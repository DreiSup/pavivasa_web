/**
 * `content:validate` — parses every piece of content with Zod and checks
 * referential integrity (§4/§11 of `arquitectura-plantilla-monorepo.md`).
 * Runs once, here, not on every `queries/` call — see this package's
 * README.
 *
 * Runs on Node's native TypeScript support (Node 22.21.1): every import
 * below is relative with an explicit `.ts` extension, and this file (like
 * the rest of the package) sticks to erasable TypeScript syntax only — no
 * enums, no parameter-property constructors.
 *
 * Deliberately imports the package's own source by relative path
 * (`../src/...`), not `@site/content`: this script runs standalone via
 * `node`, outside webpack/Next's module resolution, so it can't rely on the
 * `exports` map or `transpilePackages`.
 */
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

import type { Service } from '../src/schemas/service.ts'
import { businessSchema } from '../src/schemas/business.zod.ts'
import { claimsSchema } from '../src/schemas/claims.zod.ts'
import { serviceSchema } from '../src/schemas/service.zod.ts'
import { projectSchema } from '../src/schemas/project.zod.ts'
import { articleSchema } from '../src/schemas/article.zod.ts'
import { homeContentSchema } from '../src/schemas/home.zod.ts'
import { localizedText } from '../src/schemas/localized.zod.ts'

import { business } from '../src/data/business.ts'
import { claims } from '../src/data/claims.ts'
import { services } from '../src/data/services.ts'
import { serviceCatalog } from '../src/data/service-catalog.ts'
import { spaceNames } from '../src/data/space-names.ts'
import { projects } from '../src/data/projects.ts'
import { articles } from '../src/data/articles.ts'
import { home } from '../src/data/home.ts'

const here = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(here, '../../../apps/web/public')

const errors: string[] = []
const fail = (message: string) => errors.push(message)

function zodIssues(label: string, result: z.SafeParseReturnType<unknown, unknown>) {
  if (!result.success) {
    for (const issue of result.error.issues) {
      fail(`${label}: ${issue.path.join('.') || '(root)'} — ${issue.message}`)
    }
  }
}

// ---- 1. Shape validation ---------------------------------------------------

zodIssues('business', businessSchema.safeParse(business))
zodIssues('claims', claimsSchema.safeParse(claims))

for (const service of services) {
  zodIssues(`service "${service.id}"`, serviceSchema.safeParse(service))
}

for (const project of projects) {
  zodIssues(`project "${project.slug.es}"`, projectSchema.safeParse(project))
}

for (const article of articles) {
  zodIssues(`article "${article.slug.es}"`, articleSchema.safeParse(article))
}

zodIssues('home', homeContentSchema.safeParse(home))

const serviceCatalogEntrySchema = z.object({
  id: z.string(),
  slug: localizedText,
  shortName: localizedText,
  name: localizedText,
  flagship: z.boolean(),
})
for (const entry of serviceCatalog) {
  zodIssues(`service catalog entry "${entry.id}"`, serviceCatalogEntrySchema.safeParse(entry))
}

// ---- 2. serviceCatalog must stay in sync with services ---------------------
// (data/service-catalog.ts intentionally duplicates a few fields out of
// data/services.ts for client-bundle-size reasons — see its own comment.)

const serviceIds = new Set(services.map((s) => s.id))
for (const entry of serviceCatalog) {
  if (!serviceIds.has(entry.id)) fail(`service catalog: "${entry.id}" has no matching entry in services.ts`)
}
for (const service of services) {
  const entry = serviceCatalog.find((e) => e.id === service.id)
  if (!entry) {
    fail(`service catalog: missing entry for service "${service.id}"`)
    continue
  }
  if (entry.slug.es !== service.slug.es) fail(`service catalog: "${service.id}" slug.es out of sync ("${entry.slug.es}" vs "${service.slug.es}")`)
  if (entry.shortName.es !== service.shortName.es)
    fail(`service catalog: "${service.id}" shortName.es out of sync ("${entry.shortName.es}" vs "${service.shortName.es}")`)
  if (entry.name.es !== service.name.es) fail(`service catalog: "${service.id}" name.es out of sync ("${entry.name.es}" vs "${service.name.es}")`)
  if (entry.flagship !== service.flagship) fail(`service catalog: "${service.id}" flagship out of sync (${entry.flagship} vs ${service.flagship})`)
}
if (serviceCatalog.length !== services.length) fail(`service catalog has ${serviceCatalog.length} entries, services.ts has ${services.length}`)

// ---- 2b. spaceNames must stay in sync with home.spaces + otherSpaceLabel --
// (data/space-names.ts intentionally duplicates this out of data/home.ts —
// see its own comment: apps/web/src/content/home.ts's NOMBRES_ESPACIOS is
// read by a 'use client' component and must not drag hero/FAQ/showcase text
// along with it.)

const expectedSpaceNames = [...home.spaces.map((s) => s.name.es), home.otherSpaceLabel.es]
const actualSpaceNames = spaceNames.map((s) => s.name.es)
if (JSON.stringify(expectedSpaceNames) !== JSON.stringify(actualSpaceNames)) {
  fail(
    `space-names.ts out of sync with home.ts: expected [${expectedSpaceNames.join(', ')}], got [${actualSpaceNames.join(', ')}]`,
  )
}

// ---- 3. Referential integrity ----------------------------------------------

for (const project of projects) {
  if (!serviceIds.has(project.service)) fail(`project "${project.slug.es}": unknown service "${project.service}"`)
}

const projectSlugs = new Set(projects.map((p) => p.slug.es))
for (const article of articles) {
  if (!serviceIds.has(article.service)) fail(`article "${article.slug.es}": unknown service "${article.service}"`)
  for (const block of article.body) {
    if (block.type === 'projectCallout' && !projectSlugs.has(block.slug)) {
      fail(`article "${article.slug.es}": projectCallout references unknown project "${block.slug}"`)
    }
  }
}

// ---- 4. Slugs unique per locale --------------------------------------------

function checkUniqueSlugs(label: string, slugs: readonly { es: string; en?: string; fr?: string; de?: string }[]) {
  for (const locale of ['es', 'en', 'fr', 'de'] as const) {
    const seen = new Map<string, number>()
    for (const s of slugs) {
      const value = s[locale]
      if (value === undefined) continue
      seen.set(value, (seen.get(value) ?? 0) + 1)
    }
    for (const [value, count] of seen) {
      if (count > 1) fail(`${label}: slug "${value}" (${locale}) is used ${count} times`)
    }
  }
}
checkUniqueSlugs('projects', projects.map((p) => p.slug))
checkUniqueSlugs('articles', articles.map((a) => a.slug))
checkUniqueSlugs('services', services.map((s) => s.slug))

// ---- 5. Referenced image files exist under apps/web/public -----------------

function checkImageSrc(label: string, src: string | undefined) {
  if (!src) return
  const filePath = path.join(publicDir, src)
  if (!existsSync(filePath)) fail(`${label}: image src "${src}" does not exist under apps/web/public`)
}

checkImageSrc('home.hero', home.hero.src)
for (const space of home.spaces) checkImageSrc(`home.spaces (${space.name.es})`, space.image.src)
for (const service of services as readonly Service[]) checkImageSrc(`service "${service.id}".heroImage`, service.heroImage.src)
for (const project of projects) {
  for (const [i, image] of project.images.entries()) checkImageSrc(`project "${project.slug.es}".images[${i}]`, image.src)
}
for (const article of articles) checkImageSrc(`article "${article.slug.es}".image`, article.image.src)

// ---- Report -----------------------------------------------------------------

if (errors.length > 0) {
  console.error(`content:validate — ${errors.length} problem(s):\n`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}

const counts = readdirSync(path.join(publicDir, 'img')).length
console.log(
  `content:validate — OK (business, ${services.length} services, ${projects.length} projects, ${articles.length} articles, home, ${counts} images under public/img)`,
)
