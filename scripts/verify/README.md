# scripts/verify

Postbuild verifiers for `apps/web` — the repo's own permanent quality gate.
Not the migration's scratchpad `buildcheck` toolkit (that one proves a
build matches an *old* build byte-for-byte); this one proves a build is
*correct* on its own terms: SEO metadata, JSON-LD, sitemap, robots, internal
links, redirects, images, conversion CTAs, and that no server secret leaks
into the client bundle. See §11 of `arquitectura-plantilla-monorepo.md` and
§14 of `SEO-Local-Contexto-Claude-Code.md`.

Zero new runtime or build dependencies. Plain Node (>=20) ESM, no HTML
parser library — see `lib/html.mjs`'s comment for why a small regex
tokenizer is enough for React's SSR output specifically.

## Usage

```bash
# 1. build first (this is a POSTbuild check, it never builds anything itself)
pnpm --filter web build

# 2. run every check
pnpm verify
# or directly:
node scripts/verify/index.mjs apps/web
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

### `scripts/verify/secrets-scan.mjs` — run separately, with sentinel secrets

```bash
EMAIL_DESTINO=sentinel@example.com \
RESEND_API_KEY=sentinel_resend_key_000 \
TELEGRAM_BOT_TOKEN=sentinel_tg_bot_000 \
TELEGRAM_CHAT_ID=sentinel_tg_chat_000 \
META_CAPI_ACCESS_TOKEN=sentinel_meta_capi_000 \
  pnpm --filter web build

EMAIL_DESTINO=sentinel@example.com \
RESEND_API_KEY=sentinel_resend_key_000 \
TELEGRAM_BOT_TOKEN=sentinel_tg_bot_000 \
TELEGRAM_CHAT_ID=sentinel_tg_chat_000 \
META_CAPI_ACCESS_TOKEN=sentinel_meta_capi_000 \
  node scripts/verify/secrets-scan.mjs apps/web
```

This is a **separate script**, not part of `pnpm verify`, because it needs
its own build made with fake, CI-only sentinel values for the server-only
env vars (`packages/config/src/server-env.schema.ts`) — never point it at a
build made with real production secrets. It scans `apps/web/.next/static`
(the client-shipped output) for both the sentinel **values** and the env
var **names**, and never prints a value it finds, only the var name and the
file. See the CI workflow (`.github/workflows/ci.yml`) for how it's wired.

## What each check does

| # | Check module | What it verifies |
|---|---|---|
| a | `checks/sitemap.mjs` + `checks/live.mjs` | Every indexable prerendered page is in `sitemap.xml`; every sitemap URL is a real page; every sitemap URL returns 200. |
| b | `checks/live.mjs` | No internal `<a href>` (same-origin or relative) leads to a 404 or a redirect. |
| c | `checks/live.mjs` | Every `next.config` redirect resolves to a 200 page in exactly one hop. |
| d | `checks/jsonld.mjs` | Every `<script type="application/ld+json">` parses; no `AggregateRating`/`Review`; every `@id` reference resolves to a node defined on the page; required fields on LocalBusiness-type/Service/BreadcrumbList/BlogPosting nodes. |
| e | `checks/metadata.mjs` | Exactly one `<h1>`; non-empty `<title>`/description, unique across indexable pages; absolute self canonical (trailing slash, per `trailingSlash: true`); `og:url` present. |
| f | `checks/robots.mjs` | `robots.txt` exists, references the sitemap, doesn't disallow GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot. |
| g | `checks/images-cta.mjs` | Every `<img>` has an `alt` attribute (empty `alt=""` is reported as an informational "decorative" note, not a failure) and either `width`+`height` or a `fill` container (`data-nimg="fill"`). |
| h | `checks/images-cta.mjs` | At least one `tel:` link and at least one `wa.me` link on every page. |
| i | `secrets-scan.mjs` | No server secret names/values in `.next/static` — run separately, see above. |

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
node scripts/verify/index.mjs apps/web --next-dir /tmp/scratch/defects-next --skip-server
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
(different check, code, or route) still fails the build; this is not a
blanket "ignore known failing tests" switch.

Format (strict JSON — no comments; use the top-level `"$comment"` for the
file-level note):

```json
{
  "$comment": "...",
  "entries": [
    { "check": "metadata", "code": "duplicate-title", "route": "/proyectos/x/", "reason": "..." }
  ]
}
```

`(check, code, route)` is the matching key. A report run also prints any
baseline entry that **didn't** fire ("stale") as an informational note —
safe to delete once the underlying issue is actually fixed.
