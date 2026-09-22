import type { Pregunta } from '@/lib/tipos'
import Seccion, { CabeceraSeccion } from '../ui/Seccion'
import AntetituloSeccion from '../ui/AntetituloSeccion'
import Acordeon from './Acordeon'

/** Preguntas frecuentes: cabecera a la izquierda (400 px) y acordeón a la derecha. */
export default function SeccionFAQ({
  id,
  antetitulo,
  titulo,
  tituloMovil,
  preguntas,
  className = '',
}: {
  id?: string
  antetitulo: string
  titulo: string
  tituloMovil?: string
  preguntas: Pregunta[]
  className?: string
}) {
  return (
    <Seccion id={id} className={className} interior="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-5 md:gap-16">
      <CabeceraSeccion
        antetitulo={<AntetituloSeccion className="hidden md:inline-flex">{antetitulo}</AntetituloSeccion>}
        titulo={
          tituloMovil ? (
            <>
              <span className="md:hidden">{tituloMovil}</span>
              <span className="hidden md:inline">{titulo}</span>
            </>
          ) : (
            titulo
          )
        }
      />
      <Acordeon preguntas={preguntas} />
    </Seccion>
  )
}
