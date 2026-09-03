import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Migas from '@/components/layout/Migas'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import Chip from '@/components/ui/Chip'
import EnlaceEtiqueta from '@/components/ui/EnlaceEtiqueta'
import Seccion, { CabeceraSeccion } from '@/components/ui/Seccion'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import SubmenuServicio, { type Ancla } from '@/components/secciones/SubmenuServicio'
import SeccionMuestrario from '@/components/secciones/SeccionMuestrario'
import SeccionFAQ from '@/components/secciones/SeccionFAQ'
import LlamadaFinal from '@/components/secciones/LlamadaFinal'
import { JsonLd, schemaServicio } from '@/lib/schema'
import { proyectosPorServicio, servicioPorId } from '@/lib/datos'
import { ORDEN_SERVICIOS, RUTA_SERVICIO } from '@/lib/tipos'
import { capitalizar, enPalabras, plural } from '@/lib/texto'

/** Los siete servicios comparten esta plantilla. Todo SSG; una ruta desconocida da 404 vía notFound(). */
export function generateStaticParams() {
  return ORDEN_SERVICIOS.map((servicio) => ({ servicio }))
}

export async function generateMetadata({ params }: { params: Promise<{ servicio: string }> }): Promise<Metadata> {
  const { servicio: id } = await params
  const servicio = servicioPorId(id)
  if (!servicio) return {}
  return {
    title: servicio.nombre,
    description: servicio.descripcion,
    alternates: { canonical: RUTA_SERVICIO[servicio.id] },
  }
}

function Lista({ rotulo, items }: { rotulo: string; items: string[] }) {
  return (
    <div className="flex flex-col border-t border-tinta">
      <span className="font-mono text-d-10 tracking-[0.12em] uppercase text-tinta-media py-3">{rotulo}</span>
      <ul className="list-none m-0 p-0 flex flex-col">
        {items.map((i) => (
          <li key={i} className="py-3 border-t border-tinta/[.12] text-20 font-semibold">
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function PaginaServicio({ params }: { params: Promise<{ servicio: string }> }) {
  const { servicio: id } = await params
  const servicio = servicioPorId(id)
  if (!servicio) notFound()

  const obras = proyectosPorServicio(servicio.id)
  const municipios = new Set(obras.map((o) => o.municipio)).size
  const conMuestrario = servicio.modelos.length + servicio.colores.length > 0
  const conFicha = Boolean(servicio.fichaTecnica || servicio.especificacion)

  const anclas: Ancla[] = [
    { id: 'seccion-que-es', texto: 'Qué es' },
    { id: 'seccion-donde', texto: 'Dónde se usa' },
    ...(conMuestrario ? [{ id: 'seccion-modelos', texto: 'Modelos y colores', textoMovil: 'Modelos' }] : []),
    ...(conFicha ? [{ id: 'seccion-ficha', texto: 'Ficha técnica' }] : []),
    ...(obras.length ? [{ id: 'seccion-obras', texto: 'Obras' }] : []),
    { id: 'seccion-faq', texto: 'FAQ' },
    { id: 'seccion-presupuesto', texto: 'Presupuesto' },
  ]

  return (
    <>
      <JsonLd data={schemaServicio(servicio.id, servicio.nombre, RUTA_SERVICIO[servicio.id], servicio.descripcion)} />
      <Migas items={[{ nombre: 'Servicios' }, { nombre: servicio.nombre, corto: servicio.nombreCorto }]} />

      {/* Hero */}
      <section className="px-lat-movil md:px-lat-desktop pt-6 pb-8 md:pt-10 md:pb-[72px]">
        <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 md:items-end">
          <div className="flex flex-col gap-4 md:gap-6">
            <AntetituloSeccion>
              Servicio {servicio.numero}
              {obras.length ? (
                <>
                  {' '}
                  · {obras.length} {plural(obras.length, 'obra', 'obras')}
                  <span className="hidden md:inline"> documentadas</span>
                </>
              ) : null}
            </AntetituloSeccion>
            <h1 className="font-display font-extrabold text-46 md:text-88 leading-[0.98] md:leading-[0.95]">{servicio.nombre}</h1>
            <p className="text-16 md:text-20 text-tinta-media">
              <span className="md:hidden">{servicio.introMovil}</span>
              <span className="hidden md:inline">{servicio.intro}</span>
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <Boton variante="primario" href="/presupuesto/">
                Pedir presupuesto
              </Boton>
              {obras.length ? (
                <Boton variante="contorno" href="#seccion-obras" className="hidden md:inline-flex">
                  Ver las {obras.length} obras
                </Boton>
              ) : null}
            </div>
          </div>
          <BloquePosicion imagen={servicio.imagenHero} className="aspect-[4/3] -mx-lat-movil md:mx-0 !border-x-0 md:!border-x" prioridad />
        </div>
      </section>

      <SubmenuServicio anclas={anclas} />

      {/* Qué es */}
      <Seccion id="seccion-que-es" espacio="corto" interior="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 md:gap-16">
        <CabeceraSeccion antetitulo={<AntetituloSeccion className="hidden md:inline-flex">Qué es</AntetituloSeccion>} titulo={servicio.queEs.titulo} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 text-16 leading-[1.6]">
          {servicio.queEs.parrafos.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </Seccion>

      {/* Dónde se usa */}
      <Seccion id="seccion-donde" espacio="corto" className="bg-fondo-alt" interior="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 md:gap-16">
        <CabeceraSeccion
          antetitulo={<AntetituloSeccion className="hidden md:inline-flex">Dónde se usa</AntetituloSeccion>}
          titulo={
            <>
              <span className="md:hidden">Dónde se usa</span>
              <span className="hidden md:inline">
                {capitalizar(enPalabras(servicio.aplicaciones.length, true))} aplicaciones,{' '}
                {enPalabras(servicio.ventajas.length, true)} ventajas
              </span>
            </>
          }
        />
        <div className="hidden md:grid grid-cols-2 gap-12">
          <Lista rotulo="Aplicaciones" items={servicio.aplicaciones} />
          <Lista rotulo="Ventajas" items={servicio.ventajas} />
        </div>
        <div className="md:hidden flex flex-col gap-4">
          <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
            {servicio.aplicaciones.map((a) => (
              <li key={a}>
                <span className="inline-flex items-center px-[14px] py-[10px] border border-tinta text-14 font-semibold">{a}</span>
              </li>
            ))}
          </ul>
          <span className="font-mono text-d-10 tracking-[0.12em] uppercase text-tinta-media">Ventajas</span>
          <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
            {servicio.ventajas.map((v) => (
              <li key={v}>
                <span className="inline-flex items-center px-[14px] py-[10px] border border-tinta/40 text-14 font-semibold">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </Seccion>

      {conMuestrario ? (
        <SeccionMuestrario
          id="seccion-modelos"
          antetitulo="Modelos y colores"
          titulo="Los que ya hemos puesto en obra"
          texto={<span className="hidden md:inline">Carta completa de moldes y colores en la visita. Aquí, solo lo que puedes ver hecho.</span>}
          modelos={servicio.modelos}
          colores={servicio.colores}
          rotuloModelos="Modelos"
          rotuloColores="Colores"
          conTipo
        />
      ) : null}

      {/* Ficha técnica */}
      {conFicha ? (
        <Seccion id="seccion-ficha" espacio="corto" className="bg-tinta text-sobre-tinta" interior="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 md:gap-16">
          <CabeceraSeccion
            sobreOscuro
            antetitulo={<AntetituloSeccion sobreOscuro className="hidden md:inline-flex">{servicio.fichaTecnica ? 'Ficha técnica' : 'Ficha'}</AntetituloSeccion>}
            titulo={
              <>
                <span className="md:hidden">{servicio.fichaTecnica ? `Ficha técnica · ${servicio.fichaTecnica.columnas[0].split(' · ')[0]}` : servicio.especificacion?.titulo}</span>
                <span className="hidden md:inline">{servicio.fichaTecnica?.titulo ?? servicio.especificacion?.titulo}</span>
              </>
            }
            texto={<span className="hidden md:inline">{servicio.fichaTecnica?.texto ?? servicio.especificacion?.texto}</span>}
          />
          {servicio.fichaTecnica ? (
            <TablaFichaTecnica columnas={servicio.fichaTecnica.columnas} filas={servicio.fichaTecnica.filas} />
          ) : servicio.especificacion ? (
            <dl className="m-0 flex flex-col font-mono text-d-12 uppercase">
              {servicio.especificacion.lineas.map((l, i, arr) => (
                <div
                  key={l.etiqueta}
                  className={`flex flex-col md:flex-row md:justify-between gap-1 md:gap-8 py-3 ${i < arr.length - 1 ? 'border-b border-sobre-tinta/[.16]' : ''}`}
                >
                  <dt className="text-sobre-tinta/60 shrink-0">{l.etiqueta}</dt>
                  <dd className="m-0 md:text-right">{l.valor}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Seccion>
      ) : null}

      {/* Obras */}
      {obras.length ? (
        <Seccion id="seccion-obras" espacio="corto" interior="flex flex-col gap-5 md:gap-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
            <CabeceraSeccion
              antetitulo={<AntetituloSeccion className="hidden md:inline-flex">Obras de {servicio.nombre.toLowerCase()}</AntetituloSeccion>}
              titulo={
                <>
                  <span className="md:hidden">
                    {capitalizar(enPalabras(obras.length))} {plural(obras.length, 'obra', 'obras')} de {servicio.nombreCorto.toLowerCase()}
                  </span>
                  <span className="hidden md:inline">
                    {capitalizar(enPalabras(obras.length))} {plural(obras.length, 'obra', 'obras')}, {enPalabras(municipios, false)}{' '}
                    {plural(municipios, 'municipio', 'municipios')}
                  </span>
                </>
              }
            />
            <EnlaceEtiqueta href="/proyectos/" className="hidden md:inline-block">
              Todos los proyectos →
            </EnlaceEtiqueta>
          </div>
          <ul className="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {obras.map((o) => (
              <li key={o.slug} className="contents">
                <div className="hidden md:block">
                  <TarjetaProyecto proyecto={o} tamano="medio" />
                </div>
                <div className="md:hidden">
                  <TarjetaProyecto proyecto={o} tamano="pequeno" />
                </div>
              </li>
            ))}
          </ul>
          <Chip href={`/proyectos/?tecnica=${servicio.id}`} className="md:hidden self-start">
            Todos los proyectos
          </Chip>
        </Seccion>
      ) : null}

      <SeccionFAQ
        id="seccion-faq"
        className="border-t border-tinta"
        antetitulo="FAQ"
        titulo={`Dudas sobre el ${servicio.nombreCorto.toLowerCase()}`}
        preguntas={servicio.faq}
      />

      <LlamadaFinal id="seccion-presupuesto" titulo={servicio.cta} />
    </>
  )
}
