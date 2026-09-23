import { z } from 'zod'
import { localizedText } from './localized.zod.ts'
import { imageSchema } from './image.zod.ts'
import { questionSchema } from './faq.zod.ts'

const spaceSchema = z.object({ name: localizedText, image: imageSchema })

const heroTabSchema = z.object({
  serviceId: z.enum(['hormigon-impreso', 'hormigon-pulido', 'microcemento']),
  tabLabel: localizedText,
  eyebrow: localizedText,
  title: localizedText,
  subtitle: localizedText,
  image: imageSchema.optional(),
})

export const homeContentSchema = z.object({
  hero: imageSchema,
  heroTabs: z.array(heroTabSchema).length(3),
  spaces: z.array(spaceSchema).min(1),
  otherSpaceLabel: localizedText,
  faq: z.array(questionSchema),
  printedModels: z.array(localizedText),
  projectColors: z.array(localizedText),
})
