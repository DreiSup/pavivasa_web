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
}

export type ResolvedBusiness = {
  name: string
  manager: string
  /**
   * Always defined — `Business.email` is required (`business.email`).
   * Deliberately has no override: this is the publicly-displayed NAP
   * email (footer, `/presupuesto`, legal pages, `LocalBusiness` JSON-LD).
   * The lead-form destination mailbox is a separate concern — see
   * `apps/web/src/app/presupuesto/actions.ts`'s `serverEnv.EMAIL_DESTINO`.
   */
  email: string
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
/**
 * Returns the 9 national digits of a Spanish phone. Strips spaces, dots,
 * hyphens, parentheses and one +34 / 0034 / 34 prefix. Anything that does not
 * leave exactly 9 digits returns `undefined` (caller falls back to default).
 */
function normalizePhone(value: string | undefined): string | undefined {
  if (!value) return undefined
  const clean = value.replace(/[\s.\-()]/g, '').replace(/^(?:\+34|0034|34)/, '')
  return /^\d{9}$/.test(clean) ? clean : undefined
}

/** Single formatter, 3-2-2-2 ("627 66 31 46"). */
function formatPhone(national: string): string {
  return `${national.slice(0, 3)} ${national.slice(3, 5)} ${national.slice(5, 7)} ${national.slice(7)}`
}

export function resolveBusiness(overrides: BusinessOverrides, locale: Locale): ResolvedBusiness {
  // Invalid overrides (not exactly 9 national digits) fall back to the default.
  const phoneNational = normalizePhone(overrides.phone) ?? normalizePhone(business.phone) ?? ''
  // The WhatsApp number defaults to the (already-resolved) phone, unless a valid WhatsApp-specific override is given.
  const whatsappNational = normalizePhone(overrides.whatsapp) ?? phoneNational
  const phone = phoneNational ? formatPhone(phoneNational) : ''
  const whatsapp = whatsappNational ? formatPhone(whatsappNational) : ''
  const address = overrides.address ?? business.address ?? ''
  const email = business.email

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
    phoneHref: `tel:+34${phoneNational}`,
    phoneInternational: `+34 ${phone}`,
    whatsappHref: whatsappNational
      ? `https://wa.me/34${whatsappNational}?text=${encodeURIComponent(pickLocalized(business.whatsappMessage, locale) ?? '')}`
      : undefined,
    addressLine: `${address} · ${business.postalCode} ${business.town} (${business.province})`,
  }
}
