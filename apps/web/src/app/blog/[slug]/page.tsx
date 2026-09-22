import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Migas from '@/components/layout/Migas'
import Boton from '@/components/ui/Boton'
import DatoPendiente from '@/components/datos/DatoPendiente'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import IndiceAnclas from '@/components/secciones/IndiceAnclas'
import { JsonLd, schemaArticulo } from '@/lib/schema'
import { articuloPorSlug, articulos } from '@/lib/datos'
import { NOMBRE_SERVICIO } from '@/lib/tipos'

export function generateStaticParams() {
  return articulos.map((a) => ({ slug: a.slug }))
}

// Full param set is known at build time: unknown slugs 404 immediately, no on-demand render/cache entry.
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const articulo = articuloPorSlug(slug)
  if (!articulo) return {}
  return {
    title: articulo.titulo,
    description: articulo.entradilla,
    alternates: { canonical: `/blog/${articulo.slug}/` },
  }
}

export default async function PaginaArticulo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const articulo = articuloPorSlug(slug)
  if (!articulo) notFound()

  const anclas = articulo.cuerpo
    .filter((b): b is Extract<typeof b, { tipo: 'h2' }> => b.tipo === 'h2')
    .map((b) => ({ id: `seccion-${b.id}`, texto: b.texto }))
  const tituloCorto = articulo.titulo.split(':')[0]

  return (
    <>
      <JsonLd data={schemaArticulo(articulo)} />
      <Migas items={[{ nombre: 'Blog', href: '/blog/' }, { nombre: tituloCorto }]} />

      <article className="px-lat-movil md:px-lat-desktop pt-6 pb-14 md:pt-10 md:pb-24">
        <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-[1fr_680px_1fr] md:gap-x-12">
          <header className="md:col-start-2 flex flex-col gap-4 md:gap-6">
            <span className="font-mono text-d-12 uppercase text-tinta-media">
              {NOMBRE_SERVICIO[articulo.servicio]} · {articulo.fecha} · <DatoPendiente>autor pendiente</DatoPendiente>
            </span>
            <h1 className="font-display font-extrabold text-34 md:text-64 leading-[1.02] md:leading-[0.98] text-balance">{articulo.titulo}</h1>
            <p className="text-16 md:text-20 text-tinta-media">{articulo.entradilla}</p>
          </header>

          <BloquePosicion imagen={articulo.imagen} prioridad className="md:col-span-3 my-8 md:my-12 aspect-[4/3] md:aspect-[21/9]" />

          {anclas.length ? (
            <aside className="hidden md:block md:col-start-1 sticky top-[calc(var(--cabecera-actual)+24px)] self-start">
              <IndiceAnclas titulo="En este artículo" anclas={anclas} />
            </aside>
          ) : null}

          <div className="md:col-start-2 flex flex-col gap-5 md:gap-7 text-16 md:text-20 leading-[1.55]">
            {articulo.cuerpo.map((b, i) => {
              switch (b.tipo) {
                case 'p':
                  return <p key={i}>{b.texto}</p>
                case 'h2':
                  return (
                    <h2 key={i} id={`seccion-${b.id}`} className="font-display font-bold text-26 md:text-34 leading-[1.1] mt-3 md:mt-5">
                      {b.texto}
                    </h2>
                  )
                case 'ol':
                  return (
                    <ol key={i} className="m-0 pl-7 flex flex-col gap-3">
                      {b.items.map((it) => (
                        <li key={it.titulo}>
                          <strong className="font-semibold">{it.titulo}</strong> {it.texto}
                        </li>
                      ))}
                    </ol>
                  )
                case 'obra':
                  return (
                    <EtiquetaTecnica
                      key={i}
                      titulo={b.titulo}
                      lineas={b.lineas}
                      pie={
                        <Link href={`/proyectos/${b.slug}/`} className="text-sobre-tinta">
                          Ver la ficha de obra →
                        </Link>
                      }
                      className="md:self-start md:min-w-[360px]"
                    />
                  )
                case 'pendiente':
                  return (
                    <p key={i} className="p-4 md:px-6 md:py-5 border border-dashed border-tinta/30 font-mono text-d-12 uppercase text-tinta-media leading-[1.8]">
                      [{b.texto}]
                    </p>
                  )
              }
            })}
          </div>

          <div className="md:col-start-2 mt-10 md:mt-14 p-5 md:p-8 bg-fondo-alt flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-6">
            <span className="font-display font-bold text-26 leading-[1.1]">{articulo.cierre}</span>
            <Boton variante="primario" href="/presupuesto/" className="shrink-0">
              Pedir presupuesto
            </Boton>
          </div>
        </div>
      </article>
    </>
  )
}
