/**
 * NAP único del sitio (nombre, dirección, teléfono). Ningún componente escribe
 * un teléfono o una dirección a mano: todo sale de aquí.
 *
 * Los valores por defecto son los que publica pavivasa.com (sept. 2026). Las
 * variables de entorno los sobreescriben. Lo que la web no da (horario)
 * llega vacío y se muestra con <DatoPendiente>.
 */

/**
 * Trims a raw env value and turns an empty/whitespace-only string into
 * `undefined` (an unset variable, like in .env.example or Vercel's panel,
 * should behave the same as one set to "").
 *
 * IMPORTANT: this only cleans a value you already read. Every
 * `NEXT_PUBLIC_*` read below must still be written as the literal
 * `process.env.NEXT_PUBLIC_X` — Next.js only inlines that exact member
 * expression into client bundles at build time; a dynamic lookup like
 * `process.env[nombre]` is invisible to that replacement and stays
 * `undefined` in every 'use client' component.
 */
function clean(valor: string | undefined): string | undefined {
  return valor?.trim() || undefined
}

const telefonoEnv = clean(process.env.NEXT_PUBLIC_TELEFONO) ?? '627 66 31 46'
/** El WhatsApp es el mismo móvil salvo que la variable diga otro. */
const whatsappEnv = clean(process.env.NEXT_PUBLIC_WHATSAPP) ?? telefonoEnv
const direccionEnv = clean(process.env.NEXT_PUBLIC_DIRECCION) ?? 'Calle Blasco Ibáñez, 16'

export const nap = {
  nombre: 'Pavivasa',
  gestor: 'Gabriel',
  // EMAIL_DESTINO is server-only (no NEXT_PUBLIC_ prefix): Next.js never
  // inlines it into client bundles, so in a 'use client' component this is
  // always `undefined` and falls back to the default below. That's fine —
  // no client component renders `nap.email`; the real address is only used
  // server-side (server components and app/presupuesto/actions.ts).
  email: clean(process.env.EMAIL_DESTINO) ?? 'gabriel.pavivasa@gmail.com',
  telefono: telefonoEnv,
  telefonoInternacional: `+34 ${telefonoEnv}`,
  telefonoHref: `tel:+34${telefonoEnv.replace(/\D/g, '')}`,
  whatsapp: whatsappEnv,
  whatsappHref: whatsappEnv
    ? `https://wa.me/34${whatsappEnv.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Hola, quiero presupuesto para ',
      )}`
    : undefined,
  direccion: direccionEnv,
  municipio: 'Sollana',
  codigoPostal: '46430',
  provincia: 'Valencia',
  pais: 'ES',
  /** Una sola línea para pie, menú y legales. */
  direccionCompleta: `${direccionEnv} · 46430 Sollana (Valencia)`,
  redes: [
    { nombre: 'Facebook', href: 'https://facebook.com/GabrielPavivasa' },
    { nombre: 'Instagram', href: 'https://instagram.com/gabrielpavivasa.es' },
    { nombre: 'X', href: 'https://x.com/GabrielPavivasa' },
  ],
}

/** Claims verificables en la web actual. Se usan en BarraConfianza, Empresa y Presupuesto. */
export const claims = {
  anios: 'Más de 15 años de oficio',
  garantia: '10 años de garantía con mantenimiento',
  repiten: 'Más del 30 % de clientes repiten',
  /** Cobertura declarada en /empresa/; pendiente de confirmar con el cliente. */
  provincias: ['Valencia', 'Castellón', 'Alicante', 'Murcia', 'Albacete', 'Almería'],
}

export const sitio = {
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? 'https://pavivasa.com').replace(/\/+$/, ''),
  gaId: clean(process.env.NEXT_PUBLIC_GA_ID),
  googleAdsId: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  googleAdsLeadLabel: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL),
  metaPixelId: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
}
