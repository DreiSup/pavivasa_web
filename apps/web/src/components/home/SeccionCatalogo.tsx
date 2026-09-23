import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Seccion from '@/components/ui/Seccion'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import { MODELOS_IMPRESO, COLORES_OBRA } from '@/content/home'

/**
 * §4.7 Catálogo: chips de modelos y rejilla de colores con tramas.
 * Colores mostrados como BloquePosicion (sin hexes inventados, solo nombres).
 */
export default function SeccionCatalogo() {
  return (
    <Seccion className="bg-fondo-alt" interior="flex flex-col gap-6 md:gap-10">
      <div className="flex flex-col gap-3 md:gap-4">
        <AntetituloSeccion>Catálogo</AntetituloSeccion>
        <h2 className="font-display font-bold text-34 md:text-64 leading-[1.05] md:leading-none">
          Modelos y colores
        </h2>
      </div>

      {/* Chips de modelos */}
      <div className="flex flex-wrap gap-2">
        {MODELOS_IMPRESO.map((modelo) => (
          <span
            key={modelo}
            className="h-[34px] flex items-center px-4 border border-tinta bg-fondo font-sans text-14 font-semibold text-tinta"
          >
            {modelo}
          </span>
        ))}
      </div>

      {/* Rejilla de colores */}
      <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-[2px]">
        {COLORES_OBRA.map((color) => (
          <li key={color} className="flex flex-col gap-2">
            <BloquePosicion etiqueta={color} sinAviso className="aspect-square" />
            <span className="text-d-12 text-tinta-media">{color}</span>
          </li>
        ))}
      </ul>
    </Seccion>
  )
}
