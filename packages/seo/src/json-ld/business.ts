/**
 * Local-business graph node. One stable `@id` (`#negocio`, kept exactly —
 * see `arquitectura-plantilla-monorepo.md` §9): every other JSON-LD block
 * references it instead of repeating the whole entity.
 */
export function businessJsonLdId(siteUrl: string): string {
  return `${siteUrl}/#negocio`
}

export type LocalBusinessInput = {
  siteUrl: string
  name: string
  email: string
  /** `tel:...` href — this builder strips the scheme itself, same as the pre-migration code. */
  phoneHref: string
  address: {
    streetAddress: string
    town: string
    postalCode: string
    province: string
    country: string
  }
  /** Provinces to publish as `areaServed` — see `deriveAreaServed`. */
  areaServed: readonly string[]
  sameAs: readonly string[]
}

export function buildLocalBusinessJsonLd(input: LocalBusinessInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessJsonLdId(input.siteUrl),
    name: input.name,
    url: input.siteUrl,
    email: input.email,
    telephone: input.phoneHref.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: input.address.streetAddress,
      addressLocality: input.address.town,
      postalCode: input.address.postalCode,
      addressRegion: input.address.province,
      addressCountry: input.address.country,
    },
    areaServed: input.areaServed.map((province) => ({ '@type': 'AdministrativeArea', name: province })),
    sameAs: input.sameAs,
  }
}
