import type { Localized } from './localized.ts'

export type SocialLink = {
  /** Proper noun (platform name): plain, not translated. */
  platform: string
  href: string
}

export type Claims = {
  yearsExperience: Localized<string>
  warranty: Localized<string>
  repeatCustomers: Localized<string>
  /** Provinces claimed as coverage in the copy; only some have real project photos (see lib/schema.tsx's areaServed). Plain: proper nouns. */
  declaredProvinces: string[]
}

export type Business = {
  /** Proper noun: plain. */
  name: string
  /** Contact person's name — proper noun: plain. */
  manager: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
  /** Town — proper noun: plain. */
  town: string
  postalCode: string
  /** Province — proper noun: plain. */
  province: string
  country: string
  socials: SocialLink[]
  claims: Claims
}
