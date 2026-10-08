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
        {
          id: 'seccion-propiedad',
          titulo: 'Propiedad intelectual e industrial',
          contenido: (
            <p>
              El nombre de población que aparece al escribir el código postal en el formulario de presupuesto sale de los
              datos de códigos postales de{' '}
              <a href="https://www.geonames.org/" rel="noopener noreferrer" className="text-tinta underline">
                GeoNames
              </a>
              , publicados con licencia{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/deed.es"
                rel="noopener noreferrer"
                className="text-tinta underline"
              >
                CC BY 4.0
              </a>
              .
            </p>
          ),
        },
        { id: 'seccion-responsabilidad', titulo: 'Responsabilidad' },
        { id: 'seccion-legislacion', titulo: 'Legislación aplicable' },
      ]}
    />
  )
}
