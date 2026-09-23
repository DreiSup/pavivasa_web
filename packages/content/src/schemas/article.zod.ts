import { z } from 'zod'
import { localizedText } from './localized.zod.ts'
import { imageSchema } from './image.zod.ts'
import { serviceIdSchema } from './service.zod.ts'

const paragraphBlockSchema = z.object({ type: z.literal('paragraph'), text: localizedText })
const headingBlockSchema = z.object({ type: z.literal('heading'), id: z.string().min(1), text: localizedText })
const orderedListBlockSchema = z.object({
  type: z.literal('orderedList'),
  items: z.array(z.object({ title: localizedText, text: localizedText })).min(1),
})
const projectCalloutBlockSchema = z.object({
  type: z.literal('projectCallout'),
  slug: z.string().min(1),
  title: localizedText,
  lines: z.array(localizedText).min(1),
})
const pendingBlockSchema = z.object({ type: z.literal('pending'), text: localizedText })

export const articleBlockSchema = z.discriminatedUnion('type', [
  paragraphBlockSchema,
  headingBlockSchema,
  orderedListBlockSchema,
  projectCalloutBlockSchema,
  pendingBlockSchema,
])

export const articleSchema = z.object({
  slug: localizedText,
  title: localizedText,
  excerpt: localizedText,
  service: serviceIdSchema,
  date: z.string().min(1),
  dateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  image: imageSchema,
  body: z.array(articleBlockSchema).min(1),
  closing: localizedText,
})
