import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  alternates: { canonical: '/politica-de-privacidad/' },
  robots: { index: false },
}

export default function PoliticaPrivacidad() {
  return (
    <PlantillaLegal
      titulo="Política de privacidad"
      ruta="/politica-de-privacidad/"
      secciones={[
        { id: 'seccion-datos', titulo: 'Datos que tratamos' },
        { id: 'seccion-finalidad', titulo: 'Finalidad y base jurídica' },
        { id: 'seccion-conservacion', titulo: 'Conservación' },
        { id: 'seccion-destinatarios', titulo: 'Destinatarios' },
        { id: 'seccion-derechos', titulo: 'Tus derechos' },
      ]}
    />
  )
}
