import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Migas from '@/components/layout/Migas'
import Boton from '@/components/ui/Boton'
import EnlaceEtiqueta from '@/components/ui/EnlaceEtiqueta'
import DatoPendiente from '@/components/datos/DatoPendiente'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import FichaObra, { type FilaFicha } from '@/components/datos/FichaObra'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import TarjetaProyecto, { EtiquetaProyecto } from '@/components/contenido/TarjetaProyecto'
import { proyectoPorSlug, proyectos, proyectosSimilares } from '@/lib/datos'
import { NOMBRE_SERVICIO, RUTA_SERVICIO, TECNICA_CORTA } from '@/lib/tipos'

/** Patrón de ruta generada desde content/. Todo SSG; un slug desconocido da 404 vía notFound(). */
export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) return {}
  return {
    title: `${NOMBRE_SERVICIO[proyecto.servicio]} en ${proyecto.municipio}`,
    description: `${proyecto.tituloLargo}. ${proyecto.tipo}, ${proyecto.municipio} (${proyecto.provincia}).`,
    alternates: { canonical: `/proyectos/${proyecto.slug}/` },
  }
}

export default async function FichaProyecto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) notFound()

  const f = proyecto.ficha
  const similares = proyectosSimilares(proyecto)
  const [principal, ...miniaturas] = proyecto.imagenes
  const tecnica = NOMBRE_SERVICIO[proyecto.servicio]

  const lineasEjecucion = [
    f.hormigon && `Hormigón · ${f.hormigon}`,
    f.espesor && `Espesor · ${f.espesor}`,
    f.arido && `Árido · ${f.arido}`,
    f.mallazo && `Mallazo · ${f.mallazo}`,
    f.fibra && `Fibra · ${f.fibra.toLowerCase()}`,
    f.dosificacionColor && `Color · ${f.dosificacionColor}`,
    f.juntas && `Juntas · ${f.juntas}`,
    f.acabado && `Acabado · ${f.acabado.toLowerCase()}`,
  ].filter((l): l is string => Boolean(l))

  const lineasMovil = [
    [f.hormigon, f.espesor, f.arido && `árido ${f.arido}`].filter(Boolean).join(' · '),
    [f.mallazo && `Mallazo ${f.mallazo}`, f.fibra && `fibra ${f.fibra === 'Polipropileno' ? 'PP' : f.fibra}`].filter(Boolean).join(' · '),
    f.dosificacionColor && `Color · ${f.dosificacionColor}`,
    f.juntas && `Juntas · ${f.juntas}`,
  ].filter((l): l is string => Boolean(l))

  const pendienteM2 = proyecto.superficie ? `${proyecto.superficie} m²` : <DatoPendiente>pendiente</DatoPendiente>
  const anio = <DatoPendiente>{proyecto.anioFoto ? `${proyecto.anioFoto} · fecha de la foto` : 'año pendiente'}</DatoPendiente>

  const filas: FilaFicha[] = [
    { etiqueta: 'Técnica', valor: tecnica },
    ...(proyecto.modelo ? [{ etiqueta: 'Modelo', valor: proyecto.modelo }] : []),
    ...(proyecto.color ? [{ etiqueta: 'Color', valor: proyecto.color }] : []),
    ...(f.espesor ? [{ etiqueta: 'Espesor', valor: f.espesor, mono: true }] : []),
    ...(f.hormigon ? [{ etiqueta: 'Hormigón', valor: f.hormigon, mono: true }] : []),
    ...(f.arido ? [{ etiqueta: 'Árido', valor: f.arido, mono: true }] : []),
    ...(f.mallazo ? [{ etiqueta: 'Mallazo', valor: f.mallazo, mono: true }] : []),
    ...(f.fibra ? [{ etiqueta: 'Fibra', valor: f.fibra }] : []),
    ...(f.dosificacionColor ? [{ etiqueta: 'Color', valor: f.dosificacionColor, mono: true }] : []),
    ...(f.juntas ? [{ etiqueta: 'Juntas', valor: f.juntas, mono: true }] : []),
    ...(f.acabado ? [{ etiqueta: 'Acabado', valor: f.acabado }] : []),
    { etiqueta: 'Municipio', valor: `${proyecto.municipio} (${proyecto.provincia})` },
    { etiqueta: 'm²', valor: pendienteM2, mono: true },
    { etiqueta: 'Año', valor: anio },
  ]
  const filasMovil = filas.filter((r) => ['Técnica', 'Modelo', 'Color', 'Municipio', 'm²', 'Año'].includes(r.etiqueta) && !r.mono || ['m²'].includes(r.etiqueta))

  return (
    <>
      <Migas items={[{ nombre: 'Proyectos', href: '/proyectos/' }, { nombre: `${tecnica} en ${proyecto.municipio}`, corto: proyecto.municipio }]} />

      <section className="px-lat-movil md:px-lat-desktop pt-5 pb-6 md:pt-8 md:pb-10">
        <div className="max-w-contenido mx-auto flex flex-col gap-3 md:gap-5">
          <EtiquetaProyecto proyecto={proyecto} />
          <h1 className="font-display font-extrabold text-34 md:text-64 leading-[1.02] md:leading-[0.98] max-w-[1100px] text-balance">
            {proyecto.tituloLargo}
          </h1>
        </div>
      </section>

      {/* Galería */}
      <section className="md:px-lat-desktop">
        <div className="max-w-contenido mx-auto flex flex-col gap-2 md:gap-3">
          <div className="relative">
            <BloquePosicion imagen={principal} prioridad className="aspect-[4/3] md:aspect-[21/9] !border-x-0 md:!border-x" />
            {miniaturas.length ? (
              <span className="md:hidden absolute right-4 bottom-[14px] font-mono text-d-10 text-tinta-media">1 / {proyecto.imagenes.length}</span>
            ) : null}
          </div>
          {miniaturas.length ? (
            <ul className="list-none m-0 p-0 grid grid-cols-4 gap-2 md:gap-3 px-lat-movil md:px-0">
              {proyecto.imagenes.map((img, i) => (
                <li key={img.etiqueta}>
                  <BloquePosicion
                    imagen={{ ...img, etiqueta: i === 0 ? '01 · general' : img.etiqueta }}
                    compacto
                    activo={i === 0}
                    className="aspect-[4/3] [&>span]:hidden md:[&>span]:inline"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* Móvil: ficha de ejecución compacta */}
      {lineasMovil.length ? (
        <div className="md:hidden px-lat-movil pt-6">
          <EtiquetaTecnica
            compacto
            titulo="Ficha de ejecución"
            lineas={[...lineasMovil, <span key="m2" className="opacity-60">m² · {proyecto.superficie ?? '[pendiente]'}</span>]}
          />
        </div>
      ) : null}

      {/* Texto + ficha */}
      <section className="px-lat-movil md:px-lat-desktop py-10 md:pt-[72px] md:pb-24">
        <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 md:gap-20 items-start">
          <div className="flex flex-col gap-8 md:gap-12 md:max-w-[680px]">
            <div className="flex flex-col gap-3 md:gap-4">
              <h2 className="font-display font-bold text-26 md:text-34 leading-[1.1]">El encargo</h2>
              {proyecto.encargo.map((p) => (
                <p key={p.slice(0, 40)} className="text-16 md:text-20 leading-[1.55] md:leading-[1.5]">
                  {p}
                </p>
              ))}
            </div>
            <div className="flex flex-col gap-3 md:gap-4">
              <h2 className="font-display font-bold text-26 md:text-34 leading-[1.1]">La ejecución</h2>
              {proyecto.ejecucion.map((p) => (
                <p key={p.slice(0, 40)} className="text-16 md:text-20 leading-[1.55] md:leading-[1.5]">
                  {p}
                </p>
              ))}
            </div>
            {lineasEjecucion.length ? (
              <EtiquetaTecnica titulo="Ficha de ejecución" lineas={lineasEjecucion} className="hidden md:flex self-start min-w-[360px]" />
            ) : null}

            <div className="md:hidden flex flex-col gap-8">
              <FichaObra compacto filas={filasMovil} />
              <Boton variante="primario" href="/presupuesto/" anchoCompleto>
                Quiero algo así
              </Boton>
            </div>
          </div>

          <aside className="hidden md:block sticky top-[calc(var(--cabecera-actual)+24px)]">
            <FichaObra
              titulo="Ficha de obra"
              filas={filas}
              pie={
                <>
                  <Boton variante="primario" href="/presupuesto/" anchoCompleto>
                    Quiero algo así
                  </Boton>
                  <EnlaceEtiqueta href={RUTA_SERVICIO[proyecto.servicio]} pequeno>
                    Sobre el {tecnica.toLowerCase()} →
                  </EnlaceEtiqueta>
                </>
              }
            />
          </aside>
        </div>
      </section>

      {/* Obras similares */}
      <section className="px-lat-movil md:px-lat-desktop pb-14 md:pb-24">
        <div className="max-w-contenido mx-auto flex flex-col gap-5 md:gap-8 border-t border-tinta pt-8">
          <div className="flex justify-between items-end">
            <h2 className="font-display font-bold text-26 md:text-34 leading-[1.1]">Obras similares</h2>
            <EnlaceEtiqueta href={`/proyectos/?tecnica=${proyecto.servicio}`} className="hidden md:inline-block">
              Todo el {TECNICA_CORTA[proyecto.servicio].toLowerCase()} →
            </EnlaceEtiqueta>
          </div>
          <ul className="list-none m-0 p-0 grid grid-cols-3 gap-[10px] md:gap-6">
            {similares.map((s) => (
              <li key={s.slug} className="contents">
                <div className="hidden md:block">
                  <TarjetaProyecto proyecto={s} tamano="grande" />
                </div>
                <div className="md:hidden">
                  <TarjetaProyecto proyecto={s} tamano="pequeno" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
