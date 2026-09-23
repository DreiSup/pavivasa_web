/**
 * See `env.schema.ts` for why the zod shape and the plain reads live in
 * separate files, and for `scripts/check-env.ts` (the only thing that
 * actually parses this shape). This one additionally must never be
 * imported from a client-reachable module at all — see `server.ts`.
 *
 * No format checks here (unlike `env.schema.ts`'s GA/Ads/Pixel regexes):
 * these are opaque secrets this package can't see real values for: a wrong
 * regex would reject a valid production secret and fail the build.
 */
import { z } from 'zod'

export const ServerEnvSchema = z.object({
  EMAIL_DESTINO: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  META_CAPI_ACCESS_TOKEN: z.string().optional(),
})

export type ServerEnv = z.infer<typeof ServerEnvSchema>
