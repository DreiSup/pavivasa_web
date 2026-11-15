export type ServiceAreaInput = {
  siteUrl: string
  /** Route, including leading/trailing slash (e.g. `/zonas/calpe/`). */
  route: string
  /** Techniques done in the town, as the page's H1 says them (e.g. `Hormigón impreso`). */
  name: string
  description: string
  /** The local-business node's `@id` — see `businessJsonLdId`. */
  businessId: string
  town: string
  province: string
}

/**
 * `Service` for a `/zonas/<town>/` page: `areaServed` is the town as a
 * `City` inside its province, not the provinces list `buildServiceJsonLd`
 * publishes for the site-wide service pages. Helps the entity read, earns no
 * rich result. Never `AggregateRating`.
 */
export function buildServiceAreaJsonLd(input: ServiceAreaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${input.siteUrl}${input.route}#servicio`,
    serviceType: input.name,
    description: input.description,
    provider: { '@id': input.businessId },
    areaServed: {
      '@type': 'City',
      name: input.town,
      containedInPlace: { '@type': 'AdministrativeArea', name: input.province },
    },
    url: `${input.siteUrl}${input.route}`,
  }
}
