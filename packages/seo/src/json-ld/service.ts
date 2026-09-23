export type ServiceInput = {
  siteUrl: string
  /** Route, including leading/trailing slash (e.g. `/hormigon-impreso/`). */
  route: string
  name: string
  description: string
  /** The local-business node's `@id` — see `businessJsonLdId`. */
  businessId: string
  areaServed: readonly string[]
}

export function buildServiceJsonLd(input: ServiceInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${input.siteUrl}${input.route}#servicio`,
    serviceType: input.name,
    description: input.description,
    provider: { '@id': input.businessId },
    areaServed: input.areaServed.map((province) => ({ '@type': 'AdministrativeArea', name: province })),
    url: `${input.siteUrl}${input.route}`,
  }
}
