/**
 * NAP único del sitio (nombre, dirección, teléfono). Ningún componente escribe
 * un teléfono o una dirección a mano: todo sale de aquí.
 *
 * Los valores por defecto son los que publica pavivasa.com (sept. 2026). Las
 * variables de entorno los sobreescriben. Lo que la web no da (horario)
 * llega vacío y se muestra con <DatoPendiente>.
 */

/** Una variable vacía (como en .env.example o en el panel de Vercel) cuenta como no definida. */
function limpiar(valor: string | undefined): string | undefined {
  return valor?.trim() || undefined
}

/**
 * Solo para variables de servidor. Las NEXT_PUBLIC_* se leen siempre como
 * `process.env.NEXT_PUBLIC_X` literal: Next.js no inyecta en el navegador
 * una lectura dinámica (`process.env[nombre]`) y ahí llegarían vacías.
 */
function env(nombre: string): string | undefined {
  return limpiar(process.env[nombre])
}

const telefonoEnv = limpiar(process.env.NEXT_PUBLIC_TELEFONO) ?? '627 66 31 46'
/** El WhatsApp es el mismo móvil salvo que la variable diga otro. */
const whatsappEnv = limpiar(process.env.NEXT_PUBLIC_WHATSAPP) ?? telefonoEnv
const direccionEnv = limpiar(process.env.NEXT_PUBLIC_DIRECCION) ?? 'Calle Blasco Ibáñez, 16'

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
  url: (limpiar(process.env.NEXT_PUBLIC_SITE_URL) ?? 'https://pavivasa.com').replace(/\/+$/, ''),
  /** Propiedad GA4 de pavivasa.com. La variable de entorno la sobreescribe. */
  gaId: limpiar(process.env.NEXT_PUBLIC_GA_ID) ?? 'G-F8KV8176ZG',
  googleAdsId: limpiar(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  googleAdsLeadLabel: limpiar(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL),
  metaPixelId: limpiar(process.env.NEXT_PUBLIC_META_PIXEL_ID),
}
