# @site/config

Public env, server env and site URL/locale settings. No React, no Next.

## Layout

```
src/
  env.schema.ts         Zod shape of the public (NEXT_PUBLIC_*) env — imported only by
                        check-env.ts, never by env.ts itself (keeps zod out of the
                        client-reachable graph)
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
`apps/web/src/lib/config/nap.ts`), so its schema lives in a sibling file
that only `check-env.ts` imports — see `env.schema.ts`'s own comment.

## Server subpath

`"@site/config/server"` must only be imported from server-only code (a
Server Action, a route handler, `@site/tracking/server`) — never from
`"@site/config"` (the main entry) and never from a module a `'use client'`
component's bundle can reach. See `server.ts`'s own comment for the one
deliberate exception (`lib/config/nap.ts` reading `EMAIL_DESTINO` directly).

## `check-env`

Wired as `apps/web`'s `prebuild` script, so it runs before `next build`
regardless of how that build is invoked. Runs on Node's native TypeScript
support (`node --experimental-strip-types`, Node ≥ 22.6) — it does not read
`.env*` files itself, only real process env (exactly what Vercel gives
`next build` too). See its own header comment for the full reasoning and
the one-line switch to make a missing `NEXT_PUBLIC_SITE_URL` in production
fail the build instead of warning.
