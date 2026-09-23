import { z } from 'zod'
import { localizedText } from './localized.zod.ts'

export const claimsSchema = z.object({
  yearsExperience: localizedText,
  warranty: localizedText,
  repeatCustomers: localizedText,
  declaredProvinces: z.array(z.string().min(1)).min(1),
})
