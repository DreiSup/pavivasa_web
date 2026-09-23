import { z } from 'zod'
import { localizedText } from './localized.zod.ts'

export const imageSchema = z.object({
  label: localizedText,
  src: z.string().optional(),
  alt: localizedText.optional(),
})
