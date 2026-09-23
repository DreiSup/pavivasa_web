import type { Business } from '../schemas/business.ts'

/**
 * Single NAP (name, address, phone) source for the whole site. Defaults are
 * what pavivasa.com publishes (Sept. 2026); `@site/config`'s public env
 * overrides `phone`/`whatsapp`/`address`/`email` at read time — see
 * `queries/business.ts`'s `resolveBusiness`. What the site doesn't give
 * (schedule) stays `undefined` and is rendered as pending data.
 */
export const business = {
  name: 'Pavivasa',
  manager: 'Gabriel',
  email: 'gabriel.pavivasa@gmail.com',
  phone: '627 66 31 46',
  address: 'Calle Blasco Ibáñez, 16',
  town: 'Sollana',
  postalCode: '46430',
  province: 'Valencia',
  country: 'ES',
  socials: [
    { platform: 'Facebook', href: 'https://facebook.com/GabrielPavivasa' },
    { platform: 'Instagram', href: 'https://instagram.com/gabrielpavivasa.es' },
    { platform: 'X', href: 'https://x.com/GabrielPavivasa' },
  ],
  claims: {
    yearsExperience: { es: 'Más de 15 años de oficio' },
    warranty: { es: '10 años de garantía con mantenimiento' },
    repeatCustomers: { es: 'Más del 30 % de clientes repiten' },
    /** Coverage declared on /empresa/; pending confirmation from the client (see lib/schema.tsx's areaServed for the subset backed by real project photos). */
    declaredProvinces: ['Valencia', 'Castellón', 'Alicante', 'Murcia', 'Albacete', 'Almería'],
  },
} satisfies Business
