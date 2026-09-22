'use client'

import type { Ancla } from './SubmenuServicio'
import { useSeccionActiva } from '../ui/useSeccionActiva'

/** Índice lateral de anclas ("En este artículo", "En esta página"). La activa lleva barra pigmento. */
export default function IndiceAnclas({ titulo, anclas }: { titulo: string; anclas: Ancla[] }) {
  const activa = useSeccionActiva(anclas.map((a) => a.id))

  return (
    <nav aria-label={titulo} className="flex flex-col gap-3 text-14">
      <span className="font-mono text-d-10 tracking-[0.14em] uppercase text-tinta-media">{titulo}</span>
      {anclas.map((a) => {
        const esActiva = activa === a.id
        return (
          <a
            key={a.id}
            href={`#${a.id}`}
            aria-current={esActiva ? 'location' : undefined}
            className={`no-underline transition-colors duration-cabecera ${
              esActiva
                ? 'text-tinta font-semibold border-l-2 border-pigmento pl-3'
                : 'text-tinta-media pl-[14px] hover:text-tinta'
            }`}
          >
            {a.texto}
          </a>
        )
      })}
    </nav>
  )
}
