# @site/seo

JSON-LD builders, sitemap/robots builders and canonical/alternates helpers.
No React, no Next — see §3/§4 of `arquitectura-plantilla-monorepo.md`.

## Layout

```
src/
  json-ld/
    business.ts     Local-business graph node (stable `#negocio` @id)
    service.ts       Service node
    faq.ts           FAQPage (only with real answers)
    article.ts       BlogPosting
    breadcrumbs.ts   BreadcrumbList (drops route-less intermediate items)
    area-served.ts   deriveAreaServed — provinces actually backed by projects
  sitemap.ts         buildSitemapEntries
  robots.ts          buildRobots
  canonical.ts       buildCanonical/buildAlternates (unwired, for a future locale rollout)
  routes.ts          DEFAULT_ROUTES — public route prefixes (/proyectos/, /blog/), with an
                     optional `routes` override on buildSitemapEntries/buildArticleJsonLd
  index.ts           explicit named re-exports only, no `export * from`
```

## Design

Every builder takes plain, already-resolved data — a route string, a
business `@id`, an array of provinces — never a `@site/content` query or a
Next.js type directly. That keeps this package's only two rules (no React,
no Next) trivially true, and keeps its output reproducible from a unit test
with no content or framework in the loop. `apps/web`'s adapters
(`lib/schema.tsx`, `app/sitemap.ts`, `app/robots.ts`) are what call
`@site/content` and feed the results in.

## `areaServed`

`deriveAreaServed(projectProvinces, declaredOrder)` is not "every province
this site claims to cover" — it's the subset actually backed by a real,
published project, ordered by the site's own canonical province order
(`declaredOrder`, e.g. `@site/content`'s `claims.declaredProvinces`) first,
then any further project province in first-appearance order. This
reproduces the exact `['Valencia', 'Alicante']` this site published before
the migration (both provinces are in `declaredOrder`, in that order) without
hardcoding a province list inside this package.

## `html` byte-identity note

The JSON-LD builders' key order matters: the build snapshot toolkit
(`buildcheck`) diffs the raw `<script type="application/ld+json">` text
byte-for-byte, not just a key-sorted digest. Keep every builder's key
insertion order exactly as written (e.g. `item` after `name` in
breadcrumbs, `telephone` derived via `.replace('tel:', '')`) — don't
"tidy" it.
