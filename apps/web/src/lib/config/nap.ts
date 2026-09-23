/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same exports, same Spanish shapes, same values as before this migration —
 * now sourced from `@site/content` (business facts, locale 'es') and
 * `@site/config` (env). Deliberately its own module, apart from
 * `claims.ts` — see `./index.ts`'s comment.
 */
import { publicEnv, site } from '@site/config'
import { resolveBusiness } from '@site/content'

// `nap.email` below is the PUBLICLY-DISPLAYED business email (footer,
// `/presupuesto`, legal pages, `LocalBusiness` JSON-LD) — it comes only from
// `@site/content`'s business data, resolved for locale 'es', with no env
// override. `EMAIL_DESTINO` (the lead-form's destination mailbox) is a
// separate, server-only concern read directly in
// `apps/web/src/app/presupuesto/actions.ts` via `@site/config/server` — it
// must never reach this module, which several `'use client'` components
// (Cabecera, MenuMovil, Consentimiento…) import for `nap`/`sitio`.
//
// `resolveBusiness` alone (no separate `getBusiness()` call) — it already
// returns every NAP field, raw or derived, resolved for `locale`. Reading
// the raw `Business` object directly here would bypass its `Localized<T>`
// fields (see `queries/business.ts`'s `Localized<T>` rule comment).
const resolved = resolveBusiness(
  {
    phone: publicEnv.NEXT_PUBLIC_TELEFONO,
    whatsapp: publicEnv.NEXT_PUBLIC_WHATSAPP,
    address: publicEnv.NEXT_PUBLIC_DIRECCION,
  },
  'es',
)

export const nap = {
  nombre: resolved.name,
  gestor: resolved.manager,
  email: resolved.email,
  telefono: resolved.phone,
  telefonoInternacional: resolved.phoneInternational,
  telefonoHref: resolved.phoneHref,
  whatsapp: resolved.whatsapp,
  whatsappHref: resolved.whatsappHref,
  direccion: resolved.address,
  municipio: resolved.town,
  codigoPostal: resolved.postalCode,
  provincia: resolved.province,
  pais: resolved.country,
  direccionCompleta: resolved.addressLine,
  redes: resolved.socials.map((s) => ({ nombre: s.platform, href: s.href })),
}

export const sitio = {
  url: site.url,
  gaId: publicEnv.NEXT_PUBLIC_GA_ID,
  googleAdsId: publicEnv.NEXT_PUBLIC_GOOGLE_ADS_ID,
  googleAdsLeadLabel: publicEnv.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  metaPixelId: publicEnv.NEXT_PUBLIC_META_PIXEL_ID,
}
