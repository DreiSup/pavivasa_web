import { z } from 'zod'
import { localizedSchema, localizedText } from './localized.zod.ts'
import { imageSchema } from './image.zod.ts'
import { serviceIdSchema } from './service.zod.ts'

export const serviceAreaSchema = z.object({
  slug: localizedText,
  town: z.string().min(1),
  province: z.enum(['Alicante', 'Valencia']),
  region: z.string().min(1),
  // Anti-doorway floor: a town with a single job doesn't get its own page.
  projects: z.array(z.string().min(1)).min(2),
  services: z.array(serviceIdSchema).min(1),
  heading: localizedText,
  // ≤160: what Google usually shows before truncating.
  description: localizedSchema(z.string().min(50).max(160)),
  lead: localizedText,
  body: z.array(localizedText).min(1),
  // A confirmed photo must actually be a photo, not a placeholder label.
  confirmedPhoto: imageSchema.extend({ src: z.string().min(1), alt: localizedText }).optional(),
})
