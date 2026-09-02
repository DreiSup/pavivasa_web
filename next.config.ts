import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Barra final fija: una sola URL canónica por página. No cambiar.
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // Redirecciones 301 de la web anterior (si la hay). Con trailingSlash:true
    // cada `source` tiene que llevar barra final para coincidir.
    return [
      // { source: '/contacto/', destination: '/presupuesto/', permanent: true },
    ]
  },
}

export default nextConfig
