import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Barra final fija: una sola URL canónica por página. No cambiar.
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // El formulario de presupuesto admite una foto de hasta 10 MB.
    serverActions: { bodySizeLimit: '12mb' },
  },
  /**
   * `/blog/hormigon-desactivado-piedra-vista/` sigue publicada (puede tener
   * enlaces entrantes) pero su cuerpo es solo el aviso de que el original está
   * en rumano: no hay artículo que indexar. Se marca noindex por cabecera —
   * Google trata X-Robots-Tag igual que <meta name="robots"> — y queda fuera
   * del sitemap. Quitar esta entrada en cuanto haya texto en castellano.
   */
  async headers() {
    return [
      {
        source: '/blog/hormigon-desactivado-piedra-vista/',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }],
      },
    ]
  },
  async redirects() {
    // Redirecciones 301 de la web WordPress anterior. Con trailingSlash:true
    // cada `source` tiene que llevar barra final para coincidir.
    return [
      // El dominio .vercel.app sirve la web entera en producción y Vercel no le
      // pone noindex: para Google es un duplicado. Se manda al dominio propio.
      // Los previews usan otras URLs y no se ven afectados.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'pavivasa-web.vercel.app' }],
        destination: 'https://www.pavivasa.com/:path*',
        permanent: true,
      },
      { source: '/contacto/', destination: '/presupuesto/', permanent: true },
      { source: '/servicios/pavimentos-de-hormigon-impreso/', destination: '/hormigon-impreso/', permanent: true },
      { source: '/servicios/pavimentos-de-hormigon-pulido/', destination: '/hormigon-pulido/', permanent: true },
      { source: '/servicios/pavimentos-de-hormigon-lavado/', destination: '/hormigon-lavado/', permanent: true },
      { source: '/servicios/microcemento-decorativo/', destination: '/microcemento/', permanent: true },
      { source: '/servicios/autonivelantes/', destination: '/autonivelantes/', permanent: true },
      { source: '/servicios/pavimentos-de-caucho/', destination: '/pavimentos-de-caucho/', permanent: true },
      { source: '/servicios/alicatados-en-valencia/', destination: '/alicatados/', permanent: true },
      { source: '/politica-de-cookies-ue/', destination: '/politica-de-cookies/', permanent: true },
      // Rutas de servicio que en pavivasa.com cuelgan de la raíz (sin /servicios/)
      { source: '/microcemento-decorativo/', destination: '/microcemento/', permanent: true },
      { source: '/morteros-autonivelantes/', destination: '/autonivelantes/', permanent: true },
      { source: '/pavimentos-caucho/', destination: '/pavimentos-de-caucho/', permanent: true },
      // Fichas de obra que colgaban de la raíz en WordPress
      { source: '/hormigon-impreso-denia/', destination: '/proyectos/hormigon-impreso-denia/', permanent: true },
      { source: '/hormigon-impreso-moraira/', destination: '/proyectos/hormigon-impreso-moraira/', permanent: true },
      { source: '/hormigon-impreso-calpe/', destination: '/proyectos/hormigon-impreso-calpe/', permanent: true },
      { source: '/hormigon-impreso-calpe-2/', destination: '/proyectos/hormigon-impreso-calpe-2/', permanent: true },
      { source: '/hormigon-impreso-benissa/', destination: '/proyectos/hormigon-impreso-benissa/', permanent: true },
      { source: '/hormigon-impreso-lliria/', destination: '/proyectos/hormigon-impreso-lliria/', permanent: true },
      { source: '/hormigon-impreso-montaberner/', destination: '/proyectos/hormigon-impreso-montaberner/', permanent: true },
      { source: '/hormigon-pulido-xabia/', destination: '/proyectos/hormigon-pulido-xabia/', permanent: true },
      { source: '/hormigon-pulido-alicante/', destination: '/proyectos/hormigon-pulido-alicante/', permanent: true },
      { source: '/hormigon-pulido-benissa/', destination: '/proyectos/hormigon-pulido-benissa/', permanent: true },
      { source: '/hormigon-pulido-ribarroja-del-turia/', destination: '/proyectos/hormigon-pulido-ribarroja-del-turia/', permanent: true },
      { source: '/hormigon-pulido-daimus/', destination: '/proyectos/hormigon-pulido-daimus/', permanent: true },
      { source: '/hormigon-lavado-valencia-godella/', destination: '/proyectos/hormigon-lavado-valencia-godella/', permanent: true },
      { source: '/microcemento-en-moraira/', destination: '/proyectos/microcemento-en-moraira/', permanent: true },
      { source: '/microcemento-en-alicante/', destination: '/proyectos/microcemento-en-alicante/', permanent: true },
      // Artículos
      {
        source: '/hormigon-impreso-denia-la-solucion-ideal-embellecer-tus-espacios/',
        destination: '/blog/hormigon-impreso-denia-la-solucion-ideal-embellecer-tus-espacios/',
        permanent: true,
      },
      {
        source: '/hormigon-fratasado-fino-decorativo-viviendas-la-revolucion-diseno-funcionalidad/',
        destination: '/blog/hormigon-fratasado-fino-decorativo-viviendas/',
        permanent: true,
      },
      {
        source: '/brillo-elegancia-explorando-hormigon-pulido/',
        destination: '/blog/brillo-elegancia-explorando-hormigon-pulido/',
        permanent: true,
      },
      {
        source: '/hormigon-desactivado-piedra-vista-estetica-funcionalidad-solo-material/',
        destination: '/blog/hormigon-desactivado-piedra-vista/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
