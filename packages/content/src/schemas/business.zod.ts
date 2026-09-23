import { z } from 'zod'

import { localizedText } from './localized.zod.ts'

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  href: z.string().url(),
})

export const businessSchema = z.object({
  name: z.string().min(1),
  manager: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  town: z.string().min(1),
  postalCode: z.string().min(1),
  province: z.string().min(1),
  country: z.string().min(1),
  socials: z.array(socialLinkSchema),
  whatsappMessage: localizedText,
})
