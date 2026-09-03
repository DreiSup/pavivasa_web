import type { ReactNode } from 'react'

/**
 * Sección de página: 20 px de lateral en móvil, 48 en escritorio; el contenido
 * se centra a 1344 px. `interior` recibe las clases de grid/flex del contenido.
 */
export default function Seccion({
  id,
  children,
  className = '',
  interior = 'flex flex-col',
  espacio = 'normal',
  as: Etiqueta = 'section',
}: {
  id?: string
  children: ReactNode
  /** Fondo y bordes de la sección. */
  className?: string
  /** Layout del contenido. */
  interior?: string
  /** normal: 64/96 px · corto: 56/72 · sinVertical. */
  espacio?: 'normal' | 'corto' | 'sinVertical'
  as?: 'section' | 'div' | 'article' | 'header'
}) {
  const vertical =
    espacio === 'normal' ? 'py-16 md:py-24' : espacio === 'corto' ? 'py-14 md:py-[72px]' : ''
  return (
    <Etiqueta id={id} className={`px-lat-movil md:px-lat-desktop ${vertical} ${className}`}>
      <div className={`max-w-contenido mx-auto w-full ${interior}`}>{children}</div>
    </Etiqueta>
  )
}

/** Cabecera de sección: antetítulo + titular (+ texto), como columna izquierda de 400 px. */
export function CabeceraSeccion({
  antetitulo,
  titulo,
  texto,
  sobreOscuro,
  nivel = 'h2',
  className = '',
}: {
  antetitulo?: ReactNode
  titulo: ReactNode
  texto?: ReactNode
  sobreOscuro?: boolean
  nivel?: 'h1' | 'h2'
  className?: string
}) {
  const H = nivel
  return (
    <div className={`flex flex-col gap-3 md:gap-4 ${className}`}>
      {antetitulo}
      <H
        className={`font-display font-bold text-34 md:text-46 leading-[1.05] md:leading-[1.02] text-balance ${
          sobreOscuro ? 'text-sobre-tinta' : 'text-tinta'
        }`}
      >
        {titulo}
      </H>
      {texto ? (
        <p className={`text-16 ${sobreOscuro ? 'text-sobre-tinta/70' : 'text-tinta-media'}`}>{texto}</p>
      ) : null}
    </div>
  )
}
