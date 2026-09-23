import Link from 'next/link'
import type { Articulo } from '@/lib/tipos'
import { NOMBRE_SERVICIO } from '@/lib/tipos'
import BloquePosicion from './BloquePosicion'

/**
 * Tarjeta de artículo: foto 4:3, técnica y fecha, titular, resumen.
 * Opcionalmente muestra una línea de teaser/entradilla.
 */
export default function TarjetaArticulo({ articulo, teaser }: { articulo: Articulo; teaser?: string }) {
  return (
    <Link
      href={`/blog/${articulo.slug}/`}
      className="group flex flex-col gap-3 md:gap-4 no-underline text-tinta"
    >
      <BloquePosicion
        imagen={articulo.imagen}
        compacto
        aviso="Pendiente · original a 2400 px"
        className="aspect-[4/3]"
      />
      <span className="font-mono text-d-12 uppercase text-tinta-media">
        {NOMBRE_SERVICIO[articulo.servicio]} · {articulo.fecha}
      </span>
      <span className="font-bold text-26 md:text-34 leading-[1.08] text-balance transition-colors duration-cabecera group-hover:text-pigmento">
        {articulo.titulo}
      </span>
      <span className="hidden md:block text-16 text-tinta-media">{teaser ?? articulo.entradilla}</span>
      <span className="text-14 font-bold">Leer más →</span>
    </Link>
  )
}
