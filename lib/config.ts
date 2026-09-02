/**
 * NAP único del sitio (nombre, dirección, teléfono). Ningún componente escribe
 * un teléfono o una dirección a mano: todo sale de aquí. Lo que aún no esté
 * confirmado llega vacío por variable de entorno y se muestra con <DatoPendiente>.
 */

const telefonoEnv = process.env.NEXT_PUBLIC_TELEFONO?.trim() || undefined
const whatsappEnv = process.env.NEXT_PUBLIC_WHATSAPP?.trim() || undefined
const direccionEnv = process.env.NEXT_PUBLIC_DIRECCION?.trim() || undefined

export const nap = {
  nombre: 'Pavivasa',
  email: process.env.EMAIL_DESTINO ?? 'info@pavivasa.com',
  telefono: telefonoEnv,
  telefonoMostrado: telefonoEnv ?? '9XX XXX XXX',
  telefonoHref: telefonoEnv ? `tel:+34${telefonoEnv.replace(/\D/g, '')}` : undefined,
  whatsapp: whatsappEnv,
  whatsappHref: whatsappEnv
    ? `https://wa.me/34${whatsappEnv.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Hola, quiero presupuesto para ',
      )}`
    : undefined,
  direccion: direccionEnv,
  direccionMostrada: direccionEnv ?? 'CALLE Y NÚMERO · MUNICIPIO · CP',
  municipio: 'MUNICIPIO',
  codigoPostal: '00000',
  provincia: 'PROVINCIA',
  pais: 'ES',
}

export const sitio = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pavivasa.com',
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
}
