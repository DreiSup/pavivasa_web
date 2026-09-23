import { z } from 'zod'
import { localizedText } from './localized.zod.ts'
import { imageSchema } from './image.zod.ts'
import { serviceIdSchema } from './service.zod.ts'

const executionSpecsSchema = z.object({
  concrete: localizedText.optional(),
  thickness: localizedText.optional(),
  aggregate: localizedText.optional(),
  mesh: localizedText.optional(),
  fiber: localizedText.optional(),
  colorDosage: localizedText.optional(),
  expansionJoints: localizedText.optional(),
  finish: localizedText.optional(),
})

export const projectSchema = z.object({
  slug: localizedText,
  title: localizedText,
  longTitle: localizedText,
  service: serviceIdSchema,
  town: z.string().min(1),
  province: z.enum(['Alicante', 'Valencia']),
  district: z.string().min(1).optional(),
  spaceType: localizedText,
  model: localizedText.optional(),
  color: localizedText.optional(),
  surfaceArea: z.number().positive().optional(),
  photoYear: z.number().int().optional(),
  executionSpecs: executionSpecsSchema,
  brief: z.array(localizedText).min(1),
  execution: z.array(localizedText).min(1),
  images: z.array(imageSchema).min(1),
  featured: z.boolean(),
})
