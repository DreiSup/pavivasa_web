import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  alternates: { canonical: '/politica-de-privacidad/' },
}

export default function PoliticaPrivacidad() {
  return (
    <PlantillaLegal
      titulo="Política de privacidad"
      ultimaActualizacion="pendiente"
      secciones={[
        'Responsable del tratamiento',
        'Datos que recogemos',
        'Finalidad y base legal',
        'Conservación',
        'Derechos de la persona usuaria',
      ]}
    />
  )
}
