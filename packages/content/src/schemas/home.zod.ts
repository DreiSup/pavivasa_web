import { z } from 'zod'
import { localizedText } from './localized.zod.ts'
import { imageSchema } from './image.zod.ts'
import { questionSchema } from './faq.zod.ts'

const spaceSchema = z.object({ name: localizedText, image: imageSchema })

export const homeContentSchema = z.object({
  hero: imageSchema,
  spaces: z.array(spaceSchema).min(1),
  otherSpaceLabel: localizedText,
  faq: z.array(questionSchema),
  printedModels: z.array(localizedText),
  projectColors: z.array(localizedText),
})
