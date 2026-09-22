'use client'

import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la sección visible para marcar el ancla activa
 * (SubmenuServicio, índice de artículo y de legal). Sin scroll-spy externo.
 */
export function useSeccionActiva(ids: string[]) {
  const [activa, setActiva] = useState<string | undefined>(ids[0])

  useEffect(() => {
    const elementos = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e))
    if (elementos.length === 0) return

    const visibles = new Map<string, number>()
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visibles.set(e.target.id, e.boundingClientRect.top)
          else visibles.delete(e.target.id)
        }
        if (visibles.size === 0) return
        // La más alta en pantalla manda.
        const [id] = Array.from(visibles.entries()).sort((a, b) => a[1] - b[1])[0]
        setActiva(id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )
    elementos.forEach((e) => observador.observe(e))
    return () => observador.disconnect()
  }, [ids])

  return activa
}
