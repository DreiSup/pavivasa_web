/**
 * Zod shape of the public (`NEXT_PUBLIC_*`) environment. This file is kept
 * separate from `env.ts` on purpose: constructing a `z.object(...)` executes
 * real code from the `zod` package, and `env.ts` is reachable from
 * client components (through the legacy adapter `apps/web/src/lib/config.ts`,
 * imported by `Cabecera.tsx`, `MenuMovil.tsx`, `Consentimiento.tsx`…). If this
 * schema lived in `env.ts` and got imported anywhere in that chain, the zod
 * runtime would ship in the client bundle just to describe a shape that's
 * already fully expressed by the plain `clean()` reads in `env.ts`.
 *
 * Nothing in the client-reachable graph imports this file. It exists for its
 * inferred type and for a future server-side `content:validate`-style check.
 */
import { z } from 'zod'

export const PublicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  NEXT_PUBLIC_TELEFONO: z.string().optional(),
  NEXT_PUBLIC_WHATSAPP: z.string().optional(),
  NEXT_PUBLIC_DIRECCION: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_ADS_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
})

export type PublicEnv = z.infer<typeof PublicEnvSchema>
