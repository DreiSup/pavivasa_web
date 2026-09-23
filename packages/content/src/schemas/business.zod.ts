import { z } from 'zod'
import { localizedText } from './localized.zod.ts'

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  href: z.string().url(),
})

export const claimsSchema = z.object({
  yearsExperience: localizedText,
  warranty: localizedText,
  repeatCustomers: localizedText,
  declaredProvinces: z.array(z.string().min(1)).min(1),
})

export const businessSchema = z.object({
  name: z.string().min(1),
  manager: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  town: z.string().min(1),
  postalCode: z.string().min(1),
  province: z.string().min(1),
  country: z.string().min(1),
  socials: z.array(socialLinkSchema),
  claims: claimsSchema,
})
