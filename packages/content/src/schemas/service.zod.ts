import { z } from 'zod'
import { localizedText } from './localized.zod.ts'
import { imageSchema } from './image.zod.ts'
import { questionSchema } from './faq.zod.ts'

export const serviceIdSchema = z.enum([
  'hormigon-impreso',
  'hormigon-pulido',
  'hormigon-lavado',
  'microcemento',
  'autonivelantes',
  'pavimentos-de-caucho',
  'alicatados',
])

const specSheetSchema = z.object({
  title: localizedText,
  text: localizedText,
  columns: z.array(localizedText).min(1),
  rows: z.array(
    z.object({
      parameter: localizedText,
      values: z.array(localizedText.nullable()),
    }),
  ),
})

const specListSchema = z.object({
  title: localizedText,
  text: localizedText,
  lines: z.array(z.object({ label: localizedText, value: localizedText })),
})

export const serviceSchema = z.object({
  id: serviceIdSchema,
  slug: localizedText,
  number: z.string().regex(/^\d{2}$/),
  name: localizedText,
  shortName: localizedText,
  summary: localizedText,
  description: localizedText,
  intro: localizedText,
  introMobile: localizedText,
  heroImage: imageSchema,
  about: z.object({ title: localizedText, paragraphs: z.array(localizedText).min(1) }),
  applications: z.array(localizedText),
  advantages: z.array(localizedText),
  models: z.array(localizedText),
  colors: z.array(localizedText),
  specSheet: specSheetSchema.optional(),
  specList: specListSchema.optional(),
  faq: z.array(questionSchema),
  cta: localizedText,
  flagship: z.boolean(),
})
