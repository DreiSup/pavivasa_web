/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same exports, same Spanish shapes, same values as before this migration —
 * now sourced from `@site/content` (business facts, locale 'es') and
 * `@site/config` (env). Deliberately its own module, apart from
 * `claims.ts` — see `./index.ts`'s comment.
 */
import { publicEnv, site } from '@site/config'
import { getBusiness, resolveBusiness } from '@site/content'

const business = getBusiness()

// EMAIL_DESTINO is read directly here (not via `@site/config/server`) on
// purpose: this module is imported by several `'use client'` components
// (Cabecera, MenuMovil, Consentimiento…) for `nap`/`sitio`. `@site/config`'s
// server subpath must never be reachable from that graph — see its own
// comment. Reading a non-`NEXT_PUBLIC_` var here is exactly what this file
// did before the migration: Next.js never inlines its value into the client
// bundle (no literal `NEXT_PUBLIC_` prefix to match), so on the client this
// is always `undefined` and falls back to `business.email` below, same as
// always. Only server components/Server Actions ever see the real value.
const emailOverride = process.env.EMAIL_DESTINO?.trim() || undefined

const resolved = resolveBusiness({
  phone: publicEnv.NEXT_PUBLIC_TELEFONO,
  whatsapp: publicEnv.NEXT_PUBLIC_WHATSAPP,
  address: publicEnv.NEXT_PUBLIC_DIRECCION,
  email: emailOverride,
})

export const nap = {
  nombre: business.name,
  gestor: business.manager,
  email: resolved.email ?? business.email!,
  telefono: resolved.phone,
  telefonoInternacional: resolved.phoneInternational,
  telefonoHref: resolved.phoneHref,
  whatsapp: resolved.whatsapp,
  whatsappHref: resolved.whatsappHref,
  direccion: resolved.address,
  municipio: business.town,
  codigoPostal: business.postalCode,
  provincia: business.province,
  pais: business.country,
  direccionCompleta: resolved.addressLine,
  redes: business.socials.map((s) => ({ nombre: s.platform, href: s.href })),
}

export const sitio = {
  url: site.url,
  gaId: publicEnv.NEXT_PUBLIC_GA_ID,
  googleAdsId: publicEnv.NEXT_PUBLIC_GOOGLE_ADS_ID,
  googleAdsLeadLabel: publicEnv.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  metaPixelId: publicEnv.NEXT_PUBLIC_META_PIXEL_ID,
}
