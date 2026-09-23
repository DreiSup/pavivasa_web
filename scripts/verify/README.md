# scripts/verify

Postbuild verifiers for `apps/web` — the repo's own permanent quality gate.
Not the migration's scratchpad `buildcheck` toolkit (that one proves a
build matches an *old* build byte-for-byte); this one proves a build is
*correct* on its own terms: SEO metadata, JSON-LD, sitemap, robots, internal
links, redirects, images, conversion CTAs, and that no server secret leaks
into the client bundle. See §11 of `arquitectura-plantilla-monorepo.md` and
§14 of `SEO-Local-Contexto-Claude-Code.md`.

Zero new runtime or build dependencies. Plain Node (>=22.6) ESM, no HTML
parser library — see `lib/html.mjs`'s comment for why a small regex
tokenizer is enough for React's SSR output specifically. `>=22.6` (not
`>=20`): `checks/page-count.mjs` imports `@site/content`'s query functions
directly from their `.ts` source (same reasoning as `content:validate`/
`check-env`), so `index.mjs` needs `--experimental-strip-types` — `pnpm
verify` already passes it.

## Usage

```bash
# 1. build first (this is a POSTbuild check, it never builds anything itself)
pnpm --filter web build

# 2. run every check
pnpm verify
# or directly:
node --experimental-strip-types scripts/verify/index.mjs apps/web
```

Flags (all optional):

| Flag | Default | Meaning |
|---|---|---|
| `--next-dir <path>` | `<appDir>/.next` | Where to read HTML/manifests from. The **live server always runs from the real `appDir`**, regardless of this flag — see "Defect-planting" below. |
| `--site-url <url>` | `NEXT_PUBLIC_SITE_URL` env, else the homepage's own canonical, else `https://pavivasa.com` | Expected absolute origin for canonicals/og:url/sitemap. |
| `--port <n>` | a free port near 4173 | Port for the `next start` instance used by the HTTP-based checks. |
| `--skip-server` | off | Skip (a)'s "returns 200", (b) and (c) — the checks that need a live server. Useful for a fast local content check. |
| `--known-issues <path>` | `scripts/verify/known-issues.json` | Baseline allowlist file. |

Exit code is non-zero if any **new** (non-baselined) issue is found.

### `pnpm verify:secrets` — its own build, with sentinel secrets

```bash
pnpm verify:secrets
# == node scripts/verify/build-and-scan-secrets.mjs apps/web
```

This runs `scripts/verify/build-and-scan-secrets.mjs`, which does two
things in order, both with the sentinel values from `scripts/verify/
sentinels.mjs` (never real secrets — see that file's own comment) injected
into the environment:

1. `pnpm --filter web build` — its **own** build, made with those sentinel
   values baked into the server-only env vars
   (`packages/config/src/server-env.schema.ts`); never point this at a
   build made with real production secrets.
2. `node scripts/verify/secrets-scan.mjs apps/web` — the actual scan.

`sentinels.mjs` is the single source of truth for those values: both a
local `pnpm verify:secrets` and CI (`.github/workflows/ci.yml`, which just
calls that same pnpm script) read them from there, so a value can never
drift out of sync between "what the build was made with" and "what the
scan looks for" the way two hand-written `env:` blocks could. To run the
scan alone against a build already made with sentinel values (skipping the
rebuild), export the SAME values that build was made with (`sentinels.mjs`
again, by hand or via a one-liner that imports it) and call `node
scripts/verify/secrets-scan.mjs apps/web` directly — a shell's exported
variables don't carry over from `pnpm verify:secrets`'s own child process,
so simply running the two commands back to back does NOT reuse them; with
none set, the scan just reports every var as `missing-sentinel-value`
(its value-leak half didn't run) rather than silently looking for the
wrong string.

The scan itself covers `apps/web/.next/static` (the client-shipped JS/CSS
bundle) **and** `apps/web/.next/server/app` (the prerendered HTML and RSC
flight payloads Next.js serves to every visitor) for both the sentinel
**values** and the env var **names**, and never prints a value it finds,
only the var name and the file. It also fails (not just warns) if either of
those two directories is missing or contains zero scannable files — a
build that silently failed to produce one of them would otherwise look
like "0 hits, scan passed" — and if any known-issues.json `secrets` entry
goes stale (no longer reproduces): see "`known-issues.json`" below.

## What each check does

| # | Check module | What it verifies |
|---|---|---|
| a | `checks/sitemap.mjs` + `checks/live.mjs` | Every indexable prerendered page is in `sitemap.xml`; every sitemap URL is a real page; every sitemap URL returns 200. |
| b | `checks/live.mjs` | No internal `<a href>` (same-origin or relative) leads to a 404 or a redirect. |
| c | `checks/live.mjs` | Every `next.config` redirect resolves to a 200 page in exactly one hop. |
| d | `checks/jsonld.mjs` | Every `<script type="application/ld+json">` parses; no `AggregateRating`/`Review`; every `@id` reference resolves to a node defined on the page; required fields on LocalBusiness-type/Service/BreadcrumbList/BlogPosting nodes. |
| e | `checks/metadata.mjs` | Exactly one `<h1>`; non-empty `<title>`/description, unique across indexable pages; absolute self canonical (trailing slash, per `trailingSlash: true`); `og:url` present. |
| f | `checks/robots.mjs` | `robots.txt` exists, references the sitemap, and — checked against EVERY sitemap path, per crawler, with RFC 9309 longest-match Allow/Disallow semantics (wildcards, `$`, tie → Allow) — doesn't disallow GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot on any of them. |
| g | `checks/images-cta.mjs` | Every `<img>` has an `alt` attribute (empty `alt=""` is reported as an informational "decorative" note, not a failure) and either `width`+`height` or a `fill` container (`data-nimg="fill"`). |
| h | `checks/images-cta.mjs` | At least one `tel:` link and at least one `wa.me` link on every page. |
| i | `secrets-scan.mjs` | No server secret names/values in `.next/static` or `.next/server/app` — run separately, see above. |
| j | `checks/page-count.mjs` | The number of indexable prerendered pages is at least what `@site/content` should produce (static routes + services + projects + articles, minus documented noindex routes) and never zero — an independent cross-check against a second source of truth. |

## How pages and noindex are determined

Pages are enumerated from `prerender-manifest.json` (`lib/manifest.mjs`),
never by walking the filesystem: `next start` can cache an on-demand render
of an unmatched `/[servicio]/<slug>` back into `.next/server/app` as a new
`.html` file, which a filesystem walk would wrongly pick up as a real page.
That's also why **static checks always run before the server starts**.

A page counts as noindex (and is excluded from sitemap-completeness and
title/description-uniqueness) if either:
- a `next.config.ts` `headers()` rule sets `X-Robots-Tag: ...noindex...` on
  its route (matched against `routes-manifest.json`'s `headers`), or
- its rendered HTML has `<meta name="robots" content="...noindex...">`.

Both exist in this codebase today: the header form
(`/blog/hormigon-desactivado-piedra-vista/`) and the meta form (the three
legal pages, `/aviso-legal/`, `/politica-de-cookies/`,
`/politica-de-privacidad/`) — none of them need a `known-issues.json` entry,
they're correctly excluded by design.

## Defect-planting / testing this toolkit itself

`--next-dir` lets every static check (d, e, g, h, and half of a) run
against a **copy** of `.next` with a defect planted in it, without ever
touching the real build:

```bash
cp -a apps/web/.next /tmp/scratch/defects-next
# edit /tmp/scratch/defects-next/server/app/*.html or *.body files...
node --experimental-strip-types scripts/verify/index.mjs apps/web --next-dir /tmp/scratch/defects-next --skip-server
```

The live-server checks (b, c, and the other half of a) always start `next
start` from the **real** `appDir`, never from a copy — pnpm's relative
symlinks and `outputFileTracingRoot` mean a copied `.next` can't run its own
server reliably. A broken-link defect still gets caught this way: the
planted `<a href>` is read from the copy, then probed over HTTP against the
real (unmodified) server, and a link to a page that never existed 404s
regardless of which `.next` its HTML came from.

## `known-issues.json` — the baseline allowlist

Frontend under `apps/web/src/app/**` and `apps/web/src/components/**` is
frozen for the current migration phase (byte-identical output required).
When this toolkit finds a genuine pre-existing issue there — or anywhere
else out of scope for this task — it goes in `known-issues.json` with a
`reason`, **not** a code fix. Any issue that doesn't match an entry there
still fails the build; this is not a blanket "ignore known failing tests"
switch.

Format (strict JSON — no comments; use the top-level `"$comment"` for the
file-level note):

```json
{
  "$comment": "...",
  "entries": [
    { "check": "metadata", "code": "duplicate-title", "route": "/proyectos/x/", "detail": "Título exacto duplicado", "reason": "..." }
  ]
}
```

`(check, code, route, detail)` is the matching key. `detail` is **optional**
— a free-text discriminator (the exact duplicated title/description text,
an offending filename…) for a check whose `(check, code, route)` alone
isn't specific enough to tell two different, unrelated collisions apart; an
entry that omits it only matches an issue that itself carries no `detail`.
This is what makes a baseline entry safe against a NEW, different issue
that happens to land on the same route: without `detail`, a title collision
fixed and immediately replaced by a different, unrelated title collision on
that same route would silently keep matching the old entry.

A report run also prints any baseline entry that **didn't** fire ("stale").
`index.mjs` (`pnpm verify`) only prints it as an informational note, safe to
delete once the underlying issue is actually fixed; `secrets-scan.mjs`
(`pnpm verify:secrets`) additionally **fails** the run on a stale `secrets`
entry — a stale secret-leak entry usually means the leak got fixed and
nobody cleaned up its baseline entry, which is itself worth flagging before
a future regression silently matches that stale entry again.
