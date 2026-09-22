'use client'

import { useEffect } from 'react'
import { registrarEvento } from '@/lib/eventos'
import { captureLandingParams } from '@/lib/attribution'

/**
 * Delegación de clic sobre tel:/wa.me en todo el documento. Así BarraMovil,
 * Cabecera y Pie siguen siendo componentes de servidor y aun así se miden.
 */
export default function EventosGlobales() {
  useEffect(() => {
    // Once per full page load (landing), not on every <Link> navigation:
    // exactly the "on landing" semantics this needs.
    captureLandingParams()

    function alClic(evento: MouseEvent) {
      const enlace = (evento.target as HTMLElement).closest('a')
      if (!enlace) return
      const href = enlace.getAttribute('href') ?? ''
      if (href.startsWith('tel:')) {
        registrarEvento('clic_llamar', { metaEstandar: 'Contact' })
      } else if (href.includes('wa.me')) {
        registrarEvento('clic_whatsapp', { metaEstandar: 'Contact' })
      }
    }
    document.addEventListener('click', alClic)
    return () => document.removeEventListener('click', alClic)
  }, [])

  return null
}
