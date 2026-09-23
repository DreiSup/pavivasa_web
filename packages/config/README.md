# @site/config

Public env, server env and site URL/locale settings. No React, no Next.

## Layout

```
src/
  env.schema.ts         Zod shape of the public (NEXT_PUBLIC_*) env — imported as a VALUE
                        only by check-env.ts (the zod object itself); env.ts imports only
                        its inferred TYPE (`import type`, erased at compile time, no zod
                        runtime), which is what keeps zod out of the client-reachable graph
  env.ts                publicEnv — plain `process.env.NEXT_PUBLIC_X` reads, one per var,
                        always the literal form (Next only inlines that form)
  server-env.schema.ts   Zod shape of server-only secrets — same split, same reason
  server.ts             ("@site/config/server") serverEnv — plain reads of the secrets;
                        import only from server-only code, never from the main entry
  site.ts                site.url (falls back to a hardcoded default when
                        NEXT_PUBLIC_SITE_URL is unset), defaultLocale, supportedLocales,
                        publishedLocales
scripts/
  check-env.ts           the `check-env` task — parses both schemas, reports malformed
                        values, warns (doesn't fail) when NEXT_PUBLIC_SITE_URL is missing
                        in a Vercel production deploy
```

## Two-file split (schema vs. reads)

Same pattern in both `env`/`env.schema` and `server`/`server-env.schema`:
constructing a `z.object(...)` executes real code from the `zod` package.
`env.ts` is reachable from client components (through the legacy adapter
`apps/web/src/lib/config/nap.ts`), so its schema lives in a sibling file;
`env.ts` (and `server.ts`) only ever import that sibling's inferred type
(`import type`, erased — no zod at runtime), and only `check-env.ts` imports
the schema itself as a value — see `env.schema.ts`'s own comment.

## Server subpath

`"@site/config/server"` must only be imported from server-only code (a
Server Action, a route handler, `@site/tracking/server`) — never from
`"@site/config"` (the main entry) and never from a module a `'use client'`
component's bundle can reach. `lib/config/nap.ts` (reachable from client
components) never imports it: `EMAIL_DESTINO` — the lead-form's destination
mailbox — is read only from `app/presupuesto/actions.ts`, decoupled from the
publicly-displayed NAP email that `nap.ts` resolves from `@site/content`.

## `check-env`

Wired as `apps/web`'s `prebuild` script — runs via that hook ONLY, no other
wiring: pnpm/npm always run a `pre<script>` hook before `<script>` for
`pnpm run <script>`/`pnpm --filter <pkg> <script>`, AND `turbo run <task>`
too (Turborepo itself shells out to `pnpm run <task>` per package rather
than reimplementing script execution, confirmed by running `turbo run
build --filter=web` and seeing `web:build`'s own `prebuild` fire in the
log) — so `check-env` runs before `next build` either way,
`pnpm --filter web build` or `turbo run build --filter=web`
(`pnpm build`/`pnpm --filter web build` from the repo root), with no
separate turbo task needed for it. Runs on Node's native TypeScript
support (`node --experimental-strip-types`, Node ≥ 22.6) — it does not read
`.env*` files itself, only real process env (exactly what Vercel gives
`next build` too). See its own header comment for the full reasoning and
the one-line switch to make a missing `NEXT_PUBLIC_SITE_URL` in production
fail the build instead of warning. A malformed `NEXT_PUBLIC_*` value (wrong
GA/Ads/Pixel id shape, a non-absolute site URL) warns by default too, for
the same reason — a separate one-line switch, `FAIL_ON_MALFORMED_PUBLIC_ENV`.
`ServerEnvSchema` has no format checks today (see its own comment on why),
so no server-only secret can fail this way yet; if one is ever added there,
it always fails the build — no switch for that case.
