import { business } from '../data/business.ts'
import type { SocialLink } from '../schemas/business.ts'
import { pickLocalized } from '../schemas/localized.ts'
import type { Locale } from '../schemas/localized.ts'

/**
 * Deliberately its own module, apart from `claims.ts` — see that file's
 * comment. This file's only top-level data import is `data/business.ts`.
 *
 * No separate `getBusiness()` export: `Business` carries a `Localized<T>`
 * field (`whatsappMessage`) now, so a raw, unresolved read would violate
 * the package's `Localized<T>` rule (see the README) the moment something
 * used it. `resolveBusiness()` below is the only read API, like every
 * other query, and already returns every raw and derived NAP field.
 */
export type BusinessOverrides = {
  phone?: string
  whatsapp?: string
  address?: string
  email?: string
}

export type ResolvedBusiness = {
  name: string
  manager: string
  email?: string
  phone: string
  whatsapp: string
  address: string
  town: string
  postalCode: string
  province: string
  country: string
  socials: SocialLink[]
  phoneHref: string
  phoneInternational: string
  whatsappHref?: string
  /** Single line for footer, menu and legal pages. */
  addressLine: string
}

/**
 * Pure: computes the derived NAP values (phone href, international phone,
 * WhatsApp href with its greeting text, full address line) the same way
 * `apps/web/src/lib/config.ts` did before this migration. Takes no env
 * dependency itself — the caller (the legacy adapter, reading
 * `@site/config`'s `publicEnv`) passes any override already resolved.
 * `locale` resolves the WhatsApp greeting's `Localized<string>` like every
 * other query — see the `Localized<T>` rule in the package README.
 */
export function resolveBusiness(overrides: BusinessOverrides, locale: Locale): ResolvedBusiness {
  const phone = overrides.phone ?? business.phone ?? ''
  // The WhatsApp number defaults to the (already-overridden) phone, unless a WhatsApp-specific override is given.
  const whatsapp = overrides.whatsapp ?? phone
  const address = overrides.address ?? business.address ?? ''
  const email = overrides.email ?? business.email

  return {
    name: business.name,
    manager: business.manager,
    email,
    phone,
    whatsapp,
    address,
    town: business.town,
    postalCode: business.postalCode,
    province: business.province,
    country: business.country,
    socials: business.socials,
    phoneHref: `tel:+34${phone.replace(/\D/g, '')}`,
    phoneInternational: `+34 ${phone}`,
    whatsappHref: whatsapp
      ? `https://wa.me/34${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(pickLocalized(business.whatsappMessage, locale) ?? '')}`
      : undefined,
    addressLine: `${address} · ${business.postalCode} ${business.town} (${business.province})`,
  }
}
