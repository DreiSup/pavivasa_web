# @site/content

Single source of truth for the business's facts: NAP, services, projects,
articles, home copy and FAQ. No React, no Next — see §3/§4 of
`arquitectura-plantilla-monorepo.md`. `apps/web` never imports data straight
out of `src/data/`; it only reads through `src/queries/`.

## Layout

```
src/
  schemas/    Zod shapes (*.zod.ts) + the plain TS types data/queries use (*.ts)
  data/       The actual content, typed via `satisfies` — no runtime validation here
  queries/    The ONLY read API — locale-aware, resolves Localized<T> for a locale
  legal/      Unverified source texts for the legal pages (not rendered — see its README)
scripts/
  validate.ts Parses everything with Zod + checks referential integrity
```

## The `Localized<T>` rule

Every field a visitor reads as text — names, descriptions, FAQ Q&A, image
labels/alts, article prose, claims, CTAs, home copy — **and every URL
slug** — is `{ es: T; en?: T; fr?: T; de?: T }`. `es` is mandatory; the rest
fill in as translations land. This applies even to short technical values
("HM20", "10 cm", "Sí") for one reason: **uniformity**. A per-field judgment
call about "is this really translatable copy?" is exactly the kind of thing
that quietly diverges over time; wrapping everything the same way means
nobody has to make that call again. The only fields that stay **plain**
(not `Localized`):

- Internal identifiers used as lookup keys or React `key`s (`ServiceId`
  values, an article heading's anchor `id`, a `projectCallout` block's
  `slug` reference).
- Proper nouns: town, province, district/urbanización name, the business
  name, the manager's name, a social platform's name.
- Numbers and dates (`surfaceArea`, `photoYear`, a service's `number`, an
  article's `date`/`dateIso`).
- Image `src` (a file path, not text).

`queries/` resolves a `Localized<T>` for a given `locale` via
`pickLocalized`/`pickLocalizedList` and **never** falls back to Spanish for
another locale — a missing translation surfaces as `undefined`, or the item
is dropped from a list. Only `es` is populated today (`publishedLocales` in
`@site/config` is `['es']`); every other locale's fields are simply absent,
which is exactly what "missing translation" should look like.

## Adding content

- **A new service**: add an entry to `src/data/services.ts` (in menu order)
  and a matching one to `src/data/service-catalog.ts` (kept in sync by
  `content:validate`, not derived from `services.ts` at runtime — see that
  file's comment on why: bundle size for client components that only need
  the light catalog).
- **A new project**: add an entry to `src/data/projects.ts`. `service` must
  match a real `ServiceId`. Only set the `executionSpecs` fields you
  actually know; never invent a value.
- **A new article**: add an entry to `src/data/articles.ts`. Body blocks are
  typed (`paragraph`, `heading`, `orderedList`, `projectCallout`,
  `pending`) — no MDX yet. A `projectCallout` block's `slug` must match a
  real project.

Run `pnpm content:validate` after any content change (also wired into
`turbo build` for `apps/web`, and into `typecheck`'s cache key via the
`transit` task).

## Why `schemas/*.zod.ts` are separate from `schemas/*.ts`

`data/` and `queries/` (imported by `apps/web`'s legacy adapters, which are
in turn imported by several `'use client'` components) use only the plain
`*.ts` type files — zero zod runtime. The `*.zod.ts` siblings hold the
actual `z.object(...)` schemas and are imported only by
`scripts/validate.ts`. Constructing a Zod schema executes real code from
the `zod` package; keeping it out of `data/`/`queries/` keeps it out of the
client bundle. See `packages/config`'s `env.ts`/`env.schema.ts` split for
the same pattern.

## Client-bundle rule: one export per file, not per function

`apps/web`'s legacy adapters (`lib/config`, `content/home`…) are imported by
`'use client'` components for ONE specific value (e.g. `NOMBRES_ESPACIOS`,
`nap`), while the same adapter also exports other values only server
components need (e.g. `claims`, `HERO_HOME`). It's tempting to think
splitting those into separate *functions* — `getClaims()` apart from
`getBusiness()`, each reading its own data — is enough to keep the unused
one out of the client bundle. **It isn't.** Confirmed with real builds while
building phase 2: as long as both functions live in the same **file** (or
are re-exported through a barrel using `export * from`), the unused one's
whole dependency chain still ships. ES modules execute a module's entire
top-level code once it's imported, regardless of which binding is actually
read afterward, and neither Next's minifier nor a `/*#__PURE__*/` hint on
the call site reliably drops that once the module is already included.

What actually works, in order of how much it costs:

1. **`"sideEffects": ["**/*.css"]`** (or similar) in `apps/web/package.json`.
   Without an explicit `sideEffects` declaration, a bundler must assume any
   local module *might* matter even with zero used exports, so it won't be
   excluded outright. This alone let whole-module elimination work for
   files nothing imports.
2. **Physically separate files** for anything a client component reads vs.
   anything only a server component reads — even when the fixed import
   specifier (`@/lib/config`, `@/content/home`) can't change: turn the file
   into a directory with an `index.ts` that re-exports each piece from its
   own sibling module (`nap.ts` / `claims.ts`, `hero.ts` / `space-names.ts`).
   The specifier keeps resolving; the client compilation's import graph
   just never reaches the sibling it doesn't need.
3. **No `export * from` barrels** for anything client-reachable. Use
   explicit named re-exports (`export { getSpaceNames } from './space-names.ts'`)
   — a star export defeated elimination even with (1) and (2) in place.

Every query file in `queries/` follows rule 2 already (`business.ts` /
`claims.ts`, `home.ts` / `space-names.ts`): each imports only its own slice
of `data/`, never a sibling's.

## Legal texts

`src/legal/*.md` are unverified source documents, not rendered anywhere —
see `src/legal/README.md` for a data conflict (email/NIF) that needs the
owner's confirmation.
