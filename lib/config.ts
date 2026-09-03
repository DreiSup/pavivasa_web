/**
 * NAP único del sitio (nombre, dirección, teléfono). Ningún componente escribe
 * un teléfono o una dirección a mano: todo sale de aquí.
 *
 * Los valores por defecto son los que publica pavivasa.com (sept. 2026). Las
 * variables de entorno los sobreescriben. Lo que la web no da (WhatsApp,
 * horario) llega vacío y se muestra con <DatoPendiente>.
 */

/** Una variable vacía (como en .env.example o en el panel de Vercel) cuenta como no definida. */
function env(nombre: string): string | undefined {
  return process.env[nombre]?.trim() || undefined
}

const telefonoEnv = env('NEXT_PUBLIC_TELEFONO') ?? '627 66 31 46'
const whatsappEnv = env('NEXT_PUBLIC_WHATSAPP')
const direccionEnv = env('NEXT_PUBLIC_DIRECCION') ?? 'Calle Blasco Ibáñez, 16'

export const nap = {
  nombre: 'Pavivasa',
  gestor: 'Gabriel',
  email: env('EMAIL_DESTINO') ?? 'gabriel.pavivasa@gmail.com',
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
  url: (env('NEXT_PUBLIC_SITE_URL') ?? 'https://pavivasa.com').replace(/\/+$/, ''),
  gaId: env('NEXT_PUBLIC_GA_ID'),
  googleAdsId: env('NEXT_PUBLIC_GOOGLE_ADS_ID'),
  googleAdsLeadLabel: env('NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL'),
  metaPixelId: env('NEXT_PUBLIC_META_PIXEL_ID'),
}
