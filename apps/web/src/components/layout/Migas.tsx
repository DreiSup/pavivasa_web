import Link from 'next/link'
import { schemaMigas, JsonLd } from '@/lib/schema'

export type Miga = { nombre: string; href?: string; /** Texto corto para móvil. */ corto?: string }

/** Migas de pan visibles + BreadcrumbList JSON-LD desde la misma fuente. */
export default function Migas({ items }: { items: Miga[] }) {
  const todas: Miga[] = [{ nombre: 'Inicio', href: '/' }, ...items]

  return (
    <nav aria-label="Migas de pan" className="px-lat-movil pt-4 md:px-lat-desktop md:pt-5">
      <JsonLd data={schemaMigas(todas.map((m) => ({ nombre: m.nombre, ruta: m.href })))} />
      <ol className="max-w-contenido mx-auto flex flex-wrap items-center gap-2 md:gap-[10px] font-mono text-d-12 md:tracking-[0.04em] text-tinta-media list-none p-0 m-0">
        {todas.map((item, i) => {
          const esUltimo = i === todas.length - 1
          return (
            <li key={item.nombre} className="flex items-center gap-2 md:gap-[10px]">
              {esUltimo ? (
                <span className="text-tinta" aria-current="page">
                  {item.corto ? (
                    <>
                      <span className="md:hidden">{item.corto}</span>
                      <span className="hidden md:inline">{item.nombre}</span>
                    </>
                  ) : (
                    item.nombre
                  )}
                </span>
              ) : item.href ? (
                <Link href={item.href} className="text-tinta-media no-underline hover:text-pigmento">
                  {item.nombre}
                </Link>
              ) : (
                <span>{item.nombre}</span>
              )}
              {!esUltimo ? <span aria-hidden="true">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
