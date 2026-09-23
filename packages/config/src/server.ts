/**
 * Server-only secrets. Import this ONLY from `"@site/config/server"`, and
 * only from server-only code (Server Actions, route handlers, server-only
 * lib modules such as `lib/meta-capi.ts`). Never from `"@site/config"`
 * (the main entry) and never from a module a `'use client'` component
 * imports — these have no `NEXT_PUBLIC_` prefix, so Next.js never inlines a
 * value into the client bundle, but they also have no business being
 * reachable from that graph at all.
 *
 * `app/presupuesto/actions.ts` imports this subpath directly; `lib/meta-capi.ts`
 * reaches it indirectly, through `@site/tracking/server` (its own only
 * `@site/config/server` import). The legacy adapter `lib/config/nap.ts`
 * deliberately does NOT: it still reads `process.env.EMAIL_DESTINO` directly,
 * exactly as the pre-migration `lib/config.ts` did, to avoid pulling this
 * module into the same import graph as the client-reachable `nap` object —
 * see that file's own comment.
 */
import type { ServerEnv } from './server-env.schema.ts'

function clean(value: string | undefined): string | undefined {
  return value?.trim() || undefined
}

export const serverEnv: ServerEnv = {
  EMAIL_DESTINO: clean(process.env.EMAIL_DESTINO),
  RESEND_API_KEY: clean(process.env.RESEND_API_KEY),
  TELEGRAM_BOT_TOKEN: clean(process.env.TELEGRAM_BOT_TOKEN),
  TELEGRAM_CHAT_ID: clean(process.env.TELEGRAM_CHAT_ID),
  META_CAPI_ACCESS_TOKEN: clean(process.env.META_CAPI_ACCESS_TOKEN),
}

export type { ServerEnv }
