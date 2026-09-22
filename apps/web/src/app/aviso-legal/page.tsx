import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Aviso legal',
  alternates: { canonical: '/aviso-legal/' },
  robots: { index: false },
}

export default function AvisoLegal() {
  return (
    <PlantillaLegal
      titulo="Aviso legal"
      ruta="/aviso-legal/"
      secciones={[
        { id: 'seccion-objeto', titulo: 'Objeto y condiciones de uso' },
        { id: 'seccion-propiedad', titulo: 'Propiedad intelectual e industrial' },
        { id: 'seccion-responsabilidad', titulo: 'Responsabilidad' },
        { id: 'seccion-legislacion', titulo: 'Legislación aplicable' },
      ]}
    />
  )
}
