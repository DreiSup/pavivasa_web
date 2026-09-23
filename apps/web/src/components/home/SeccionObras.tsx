import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Seccion from '@/components/ui/Seccion'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import { proyectosDestacados } from '@/lib/datos'

/**
 * §4.6 Obras destacadas: 3 proyectos con TarjetaProyecto en rejilla de 280px mín.
 * Ficha técnica desde executionSpecs (solo campos con valores).
 */
export default function SeccionObras() {
  const obras = proyectosDestacados().slice(0, 3)

  return (
    <Seccion interior="flex flex-col gap-6 md:gap-10">
      <div className="flex flex-col gap-3 md:gap-4">
        <AntetituloSeccion>Obra real</AntetituloSeccion>
        <h2 className="font-display font-bold text-26 md:text-34 leading-[1.1]">
          Obras destacadas
        </h2>
      </div>
      <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {obras.map((proyecto) => (
          <li key={proyecto.slug}>
            <TarjetaProyecto proyecto={proyecto} tamano="grande" conFicha />
          </li>
        ))}
      </ul>
    </Seccion>
  )
}
