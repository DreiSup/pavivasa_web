import type { Claims } from '../schemas/claims.ts'

/**
 * Verifiable claims (years of experience, warranty, declared provinces),
 * used in `BarraConfianza`, `Empresa` and `Presupuesto` — all server
 * components. Kept as its own top-level export, independent from
 * `data/business.ts`'s `business` — see that file's comment on why: so a
 * client bundle that only needs NAP fields (`nap` in the legacy adapter)
 * never has a reason to include this text.
 */
export const claims = {
  yearsExperience: { es: 'Más de 15 años de oficio' },
  warranty: { es: '10 años de garantía con mantenimiento' },
  repeatCustomers: { es: 'Más del 30 % de clientes repiten' },
  /** Coverage declared on /empresa/; pending confirmation from the client (see lib/schema.tsx's areaServed for the subset backed by real project photos). */
  declaredProvinces: ['Valencia', 'Castellón', 'Alicante', 'Murcia', 'Albacete', 'Almería'],
} satisfies Claims
