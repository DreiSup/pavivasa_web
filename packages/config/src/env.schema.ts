/**
 * Zod shape of the public (`NEXT_PUBLIC_*`) environment. This file is kept
 * separate from `env.ts` on purpose: constructing a `z.object(...)` executes
 * real code from the `zod` package, and `env.ts` is reachable from
 * client components (through the legacy adapter `apps/web/src/lib/config/nap.ts`,
 * imported by `Cabecera.tsx`, `MenuMovil.tsx`, `Consentimiento.tsx`…). If this
 * schema lived in `env.ts` and got imported anywhere in that chain, the zod
 * runtime would ship in the client bundle just to describe a shape that's
 * already fully expressed by the plain `clean()` reads in `env.ts`.
 *
 * Nothing in the client-reachable graph imports this file. It exists for its
 * inferred type and for `scripts/check-env.ts` (the `check-env` task, wired
 * as `apps/web`'s `prebuild` — see that script's own comment), a
 * `content:validate`-style check for the environment.
 */
import { z } from 'zod'

export const PublicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url('must be an absolute URL, e.g. "https://pavivasa.com"').optional(),
  NEXT_PUBLIC_TELEFONO: z.string().optional(),
  NEXT_PUBLIC_WHATSAPP: z.string().optional(),
  NEXT_PUBLIC_DIRECCION: z.string().optional(),
  // Permissive on purpose — these only catch obviously wrong values (a
  // pasted URL, a stray label) pending confirmation of the real IDs, not
  // every valid Google/Meta id format.
  NEXT_PUBLIC_GA_ID: z
    .string()
    .regex(/^(G|GT|UA)-[A-Za-z0-9-]+$/, 'expected a GA4/Google tag id like "G-XXXXXXXXXX" (or legacy "UA-…", "GT-…")')
    .optional(),
  NEXT_PUBLIC_GOOGLE_ADS_ID: z.string().regex(/^AW-\d+$/, 'expected a Google Ads id like "AW-XXXXXXXXX"').optional(),
  NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().regex(/^\d{5,20}$/, 'expected a numeric Meta Pixel id').optional(),
})

export type PublicEnv = z.infer<typeof PublicEnvSchema>
