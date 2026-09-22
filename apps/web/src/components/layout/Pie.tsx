import Link from 'next/link'
import { nap } from '@/lib/config'
import { NOMBRE_SERVICIO, ORDEN_SERVICIOS, RUTA_SERVICIO } from '@/lib/tipos'
import { Logo } from './Logo'

const empresa = [
  { href: '/proyectos/', texto: 'Proyectos' },
  { href: '/empresa/', texto: 'Empresa' },
  { href: '/blog/', texto: 'Blog' },
  { href: '/presupuesto/', texto: 'Pedir presupuesto' },
]

const legales = [
  { href: '/aviso-legal/', texto: 'Aviso legal' },
  { href: '/politica-de-privacidad/', texto: 'Política de privacidad' },
  { href: '/politica-de-cookies/', texto: 'Política de cookies' },
]

function Rotulo({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-d-10 tracking-[0.12em] uppercase text-sobre-tinta/60 ${className}`}>{children}</span>
  )
}

const enlacePie = 'text-sobre-tinta no-underline hover:text-fondo-alt'

/** Pie: NAP, siete servicios, empresa y redes, Kit Digital, legales. Fondo tinta. */
export default function Pie() {
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-tinta text-sobre-tinta px-lat-movil pt-12 pb-[96px] md:px-lat-desktop md:pt-16 md:pb-8">
      <div className="max-w-contenido mx-auto flex flex-col gap-8 md:gap-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 md:gap-12 md:pb-12 md:border-b md:border-sobre-tinta/[.16]">
          <div className="flex flex-col gap-4 md:gap-5">
            <Logo className="!text-26 md:!text-34" />
            <p className="hidden md:block text-16 text-sobre-tinta/70">
              Pavimentos de hormigón impreso, pulido, lavado y microcemento. Más de 15 años de oficio en Valencia y Alicante.
            </p>
            <address className="not-italic flex flex-col gap-2 font-mono text-12 tracking-[0.02em]">
              <span>{nap.direccionCompleta}</span>
              <a href={nap.telefonoHref} className={enlacePie}>
                {nap.telefonoInternacional}
              </a>
              <a href={`mailto:${nap.email}`} className={enlacePie}>
                {nap.email}
              </a>
            </address>
          </div>

          <div className="grid grid-cols-2 gap-6 md:contents">
            <nav aria-label="Servicios" className="flex flex-col gap-[10px] md:gap-3">
              <Rotulo className="md:mb-1">Servicios</Rotulo>
              {ORDEN_SERVICIOS.map((id) => (
                <Link key={id} href={RUTA_SERVICIO[id]} className={`${enlacePie} text-14 md:text-16`}>
                  {NOMBRE_SERVICIO[id]}
                </Link>
              ))}
            </nav>

            <nav aria-label="Empresa y redes" className="flex flex-col gap-[10px] md:gap-3">
              <Rotulo className="md:mb-1">Empresa</Rotulo>
              {empresa.map((e) => (
                <Link key={e.href} href={e.href} className={`${enlacePie} text-14 md:text-16`}>
                  {e.texto}
                </Link>
              ))}
              <Rotulo className="mt-3 md:mt-4 md:mb-1">Redes</Rotulo>
              {nap.redes.map((r) => (
                <a key={r.href} href={r.href} rel="me noopener" target="_blank" className={`${enlacePie} text-14 md:text-16`}>
                  {r.nombre}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-[10px] md:gap-3">
            <Rotulo className="leading-[1.5]">Proyecto web financiado por la Unión Europea – NextGenerationEU</Rotulo>
            <div
              role="img"
              aria-label="Logotipos pendientes: Kit Digital, Unión Europea, Gobierno de España, Plan de Recuperación"
              className="relative h-[72px] md:h-24 bg-sobre-tinta bg-trama-clara md:border md:border-sobre-tinta/30"
            >
              <span className="absolute left-2 bottom-[6px] font-mono text-d-10 uppercase text-tinta-media">
                Logos Kit Digital · UE · Gobierno · PRTR
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[10px] pt-6 border-t border-sobre-tinta/[.16] md:border-0 md:flex-row md:justify-between md:items-center font-mono text-12 tracking-[0.02em] text-sobre-tinta/60">
          <span className="order-2 md:order-1 mt-2 md:mt-0">
            © {anio} {nap.nombre}
          </span>
          <nav aria-label="Legal" className="order-1 md:order-2 flex flex-col gap-[10px] md:flex-row md:gap-6">
            {legales.map((l) => (
              <Link key={l.href} href={l.href} className="text-sobre-tinta/70 no-underline hover:text-sobre-tinta">
                {l.texto}
              </Link>
            ))}
            {/* Reopens the cookie banner; the click listener lives in Consentimiento.tsx
                (same delegation pattern as EventosGlobales), so this stays a Server Component. */}
            <button type="button" data-cookie-settings className="text-left text-sobre-tinta/70 hover:text-sobre-tinta">
              Configurar cookies
            </button>
          </nav>
        </div>
      </div>
    </footer>
  )
}
