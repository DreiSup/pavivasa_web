import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Política de cookies',
  alternates: { canonical: '/politica-de-cookies/' },
  robots: { index: false },
}

export default function PoliticaCookies() {
  return (
    <PlantillaLegal
      titulo="Política de cookies"
      ruta="/politica-de-cookies/"
      secciones={[
        { id: 'seccion-que-son', titulo: 'Qué son las cookies' },
        { id: 'seccion-cuales', titulo: 'Cookies que usa esta web' },
        { id: 'seccion-gestion', titulo: 'Cómo aceptarlas, rechazarlas o borrarlas' },
      ]}
    />
  )
}
