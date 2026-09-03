import type { ReactNode } from 'react'
import Seccion, { CabeceraSeccion } from '../ui/Seccion'
import AntetituloSeccion from '../ui/AntetituloSeccion'
import MuestraAcabado from '../contenido/MuestraAcabado'

/** Muestrario de modelos y colores con obra hecha (home y servicio). */
export default function SeccionMuestrario({
  id,
  antetitulo,
  titulo,
  texto,
  modelos,
  colores,
  rotuloModelos = 'Modelos',
  rotuloColores = 'Colores',
  conTipo,
  className = '',
}: {
  id?: string
  antetitulo: string
  titulo: string
  texto?: ReactNode
  modelos: string[]
  colores: string[]
  rotuloModelos?: string
  rotuloColores?: string
  conTipo?: boolean
  className?: string
}) {
  return (
    <Seccion id={id} className={className} interior="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-6 md:gap-16">
      <CabeceraSeccion antetitulo={<AntetituloSeccion>{antetitulo}</AntetituloSeccion>} titulo={titulo} texto={texto} />
      <div className="flex flex-col gap-6 md:gap-8">
        {modelos.length ? (
          <div className="flex flex-col gap-3">
            <span className="font-mono text-d-12 uppercase text-tinta-media">{rotuloModelos}</span>
            <ul className="list-none m-0 p-0 grid grid-cols-3 md:grid-cols-5 gap-[10px] md:gap-3">
              {modelos.map((m) => (
                <li key={m}>
                  <MuestraAcabado nombre={m} tipo="modelo" conTipo={conTipo} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {colores.length ? (
          <div className="flex flex-col gap-3">
            <span className="font-mono text-d-12 uppercase text-tinta-media">{rotuloColores}</span>
            <ul className="list-none m-0 p-0 grid grid-cols-5 md:grid-cols-10 gap-[10px] md:gap-3">
              {colores.map((c) => (
                <li key={c}>
                  <MuestraAcabado nombre={c} tipo="color" />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Seccion>
  )
}
