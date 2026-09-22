import Link from 'next/link'
import { nap } from '@/lib/config'
import Migas from '../layout/Migas'
import DatoPendiente from '../datos/DatoPendiente'
import FichaObra from '../datos/FichaObra'
import IndiceAnclas from './IndiceAnclas'

export const PAGINAS_LEGALES = [
  { href: '/aviso-legal/', titulo: 'Aviso legal', corto: 'Aviso legal' },
  { href: '/politica-de-privacidad/', titulo: 'Política de privacidad', corto: 'Privacidad' },
  { href: '/politica-de-cookies/', titulo: 'Política de cookies', corto: 'Cookies' },
]

export type SeccionLegal = { id: string; titulo: string; nota?: string }

/**
 * Las tres páginas legales comparten esta plantilla. El texto lo redacta el
 * cliente o su asesoría: aquí solo va el NAP real y los huecos pendientes.
 */
export default function PlantillaLegal({
  titulo,
  ruta,
  secciones,
  ultimaActualizacion,
}: {
  titulo: string
  ruta: string
  secciones: SeccionLegal[]
  ultimaActualizacion?: string
}) {
  const anclas = [{ id: 'seccion-titular', texto: '1. Titular' }, ...secciones.map((s, i) => ({ id: s.id, texto: `${i + 2}. ${s.titulo}` }))]

  return (
    <>
      <Migas items={[{ nombre: titulo }]} />

      {/* Móvil: pestañas entre las tres páginas */}
      <nav aria-label="Páginas legales" className="md:hidden flex mx-lat-movil mt-5 border-b border-tinta">
        {PAGINAS_LEGALES.map((p) => {
          const activa = p.href === ruta
          return (
            <Link
              key={p.href}
              href={p.href}
              aria-current={activa ? 'page' : undefined}
              className={`flex items-center min-h-tactil px-3 text-14 font-semibold no-underline border-b-2 -mb-px ${
                activa ? 'text-tinta border-pigmento' : 'text-tinta-media border-transparent'
              }`}
            >
              {p.corto}
            </Link>
          )
        })}
      </nav>

      <section className="px-lat-movil md:px-lat-desktop pt-6 pb-14 md:pt-10 md:pb-24">
        <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-[320px_minmax(0,680px)] gap-10 md:gap-20 items-start">
          <aside className="hidden md:flex flex-col gap-6 sticky top-[calc(var(--cabecera-actual)+24px)]">
            <nav aria-label="Páginas legales" className="flex flex-col gap-1">
              {PAGINAS_LEGALES.map((p) => {
                const activa = p.href === ruta
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    aria-current={activa ? 'page' : undefined}
                    className={`flex items-center min-h-tactil px-4 text-16 font-semibold no-underline ${
                      activa ? 'bg-tinta text-sobre-tinta' : 'text-tinta border-b border-tinta/[.12] hover:text-pigmento'
                    }`}
                  >
                    {p.titulo}
                  </Link>
                )
              })}
            </nav>
            <IndiceAnclas titulo="En esta página" anclas={anclas} />
          </aside>

          <div className="flex flex-col gap-5 md:gap-7 text-16">
            <span className="font-mono text-d-12 uppercase text-tinta-media">
              <span className="md:hidden">Actualizado</span>
              <span className="hidden md:inline">Última actualización</span> ·{' '}
              {ultimaActualizacion ?? <DatoPendiente>pendiente</DatoPendiente>}
            </span>
            <h1 className="font-display font-extrabold text-46 md:text-64 leading-[0.98]">{titulo}</h1>

            <h2 id="seccion-titular" className="font-display font-bold text-20 md:text-26 leading-[1.1] mt-3 md:mt-5">
              1. Titular del sitio web
            </h2>
            <FichaObra
              compacto
              filas={[
                { etiqueta: 'Denominación', valor: nap.nombre },
                { etiqueta: 'Razón social · NIF', valor: <DatoPendiente>pendiente</DatoPendiente> },
                { etiqueta: 'Domicilio', valor: nap.direccionCompleta },
                { etiqueta: 'Teléfono', valor: nap.telefonoInternacional, mono: true },
                { etiqueta: 'Email', valor: nap.email },
              ]}
              className="text-14 md:text-16"
            />

            {secciones.map((s, i) => (
              <div key={s.id} className="contents">
                <h2 id={s.id} className="font-display font-bold text-20 md:text-26 leading-[1.1] mt-3 md:mt-5">
                  {i + 2}. {s.titulo}
                </h2>
                <p className="p-4 md:px-6 md:py-5 border border-dashed border-tinta/30 font-mono text-d-12 uppercase text-tinta-media leading-[1.8]">
                  [{s.nota ?? (i === 0 ? 'Texto legal pendiente · lo redacta el cliente o su asesoría · no se sustituye por plantilla' : 'Texto legal pendiente')}]
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
