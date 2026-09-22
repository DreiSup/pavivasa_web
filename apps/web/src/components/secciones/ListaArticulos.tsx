'use client'

import { useState } from 'react'
import type { Articulo, ServicioId } from '@/lib/tipos'
import { TECNICA_CORTA } from '@/lib/tipos'
import AntetituloSeccion from '../ui/AntetituloSeccion'
import Chip from '../ui/Chip'
import EstadoVacio from '../ui/EstadoVacio'
import TarjetaArticulo from '../contenido/TarjetaArticulo'

/** Índice del blog con filtro por técnica (en memoria: son pocos artículos). */
export default function ListaArticulos({ articulos }: { articulos: Articulo[] }) {
  const [categoria, setCategoria] = useState<ServicioId | undefined>()
  const categorias = Array.from(new Set(articulos.map((a) => a.servicio)))
  const filtrados = categoria ? articulos.filter((a) => a.servicio === categoria) : articulos

  return (
    <>
      <section className="px-lat-movil md:px-lat-desktop pt-8 pb-6 md:pt-14 md:pb-10 border-b border-tinta">
        <div className="max-w-contenido mx-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-end md:gap-16">
          <div className="flex flex-col gap-4 md:gap-5">
            <AntetituloSeccion>Blog</AntetituloSeccion>
            <h1 className="font-display font-extrabold text-46 md:text-64 leading-[0.98]">Sobre hormigón, sin rodeos.</h1>
          </div>
          <ul className="list-none m-0 p-0 flex gap-2 overflow-x-auto md:overflow-visible md:pb-[6px] -mx-lat-movil px-lat-movil md:mx-0 md:px-0">
            <li className="shrink-0">
              <Chip mono activo={!categoria} onClick={() => setCategoria(undefined)}>
                Todos
              </Chip>
            </li>
            {categorias.map((c) => (
              <li key={c} className="shrink-0">
                <Chip mono activo={categoria === c} onClick={() => setCategoria(c)}>
                  {TECNICA_CORTA[c]}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section aria-label="Artículos" className="px-lat-movil md:px-lat-desktop pt-8 pb-14 md:pt-12 md:pb-24">
        <div className="max-w-contenido mx-auto">
          {filtrados.length === 0 ? (
            <EstadoVacio titulo="Sin artículos de esa técnica" texto="Prueba con otra categoría." onAccion={() => setCategoria(undefined)} accion="Ver todos" />
          ) : (
            <ul className="list-none m-0 p-0 flex flex-col gap-10 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-12">
              {filtrados.map((a) => (
                <li key={a.slug}>
                  <TarjetaArticulo articulo={a} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
