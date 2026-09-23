import type { Localized } from './localized.ts'

export type SocialLink = {
  /** Proper noun (platform name): plain, not translated. */
  platform: string
  href: string
}

export type Business = {
  /** Proper noun: plain. */
  name: string
  /** Contact person's name — proper noun: plain. */
  manager: string
  /** Required: the business always publishes one. Still overridable by `EMAIL_DESTINO` — see `resolveBusiness`. */
  email: string
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
  /** Prefilled text of the WhatsApp CTA's `?text=` param — visitor-facing copy: `Localized`. */
  whatsappMessage: Localized<string>
}
