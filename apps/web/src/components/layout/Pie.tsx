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
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 md:gap-12 md:pb-12 md:border-b md:border-sobre-tinta/[.16]">
          <div className="flex flex-col gap-4 md:gap-5">
            <Logo tono="claro" tamano="grande" className="h-28 self-start" />
            <address className="not-italic flex flex-col gap-2 font-sans text-14 text-sobre-tinta/70">
              <span>{nap.direccionCompleta}</span>
              <a href={nap.telefonoHref} className={enlacePie}>
                {nap.telefonoInternacional}
              </a>
              <a href={`mailto:${nap.email}`} className={enlacePie}>
                {nap.email}
              </a>
            </address>
          </div>

          <nav aria-label="Servicios" className="flex flex-col gap-[10px] md:gap-3">
            <Rotulo className="md:mb-1">Servicios</Rotulo>
            {ORDEN_SERVICIOS.map((id) => (
              <Link key={id} href={RUTA_SERVICIO[id]} className={`${enlacePie} text-14`}>
                {NOMBRE_SERVICIO[id]}
              </Link>
            ))}
          </nav>

          <nav aria-label="Legal" className="flex flex-col gap-[10px] md:gap-3">
            <Rotulo className="md:mb-1">Legal</Rotulo>
            {legales.map((l) => (
              <Link key={l.href} href={l.href} className={`${enlacePie} text-14`}>
                {l.texto}
              </Link>
            ))}
            {/* Reopens the cookie banner; the click listener lives in Consentimiento.tsx
                (same delegation pattern as EventosGlobales), so this stays a Server Component. */}
            <button type="button" data-cookie-settings className="text-left text-sobre-tinta/70 hover:text-sobre-tinta text-14">
              Configurar cookies
            </button>
          </nav>

          <nav aria-label="Empresa" className="flex flex-col gap-[10px] md:gap-3">
            <Rotulo className="md:mb-1">Empresa</Rotulo>
            {empresa.map((e) => (
              <Link key={e.href} href={e.href} className={`${enlacePie} text-14`}>
                {e.texto}
              </Link>
            ))}
            <Rotulo className="mt-3 md:mt-4 md:mb-1">Redes</Rotulo>
            {nap.redes.map((r) => (
              <a key={r.href} href={r.href} rel="me noopener" target="_blank" className={`${enlacePie} text-14`}>
                {r.nombre}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-center justify-center">
            <div
              role="img"
              aria-label="Logotipos pendientes: Kit Digital"
              className="w-40 h-12 bg-sobre-tinta/8 bg-[repeating-linear-gradient(135deg,rgba(246,241,232,.08)_0px,rgba(246,241,232,.08)_1px,transparent_1px,transparent_12px)] flex items-center justify-center"
            >
              <span className="font-mono text-d-10 uppercase text-sobre-tinta/50 text-center px-2">
                Logos Kit Digital · pendiente
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[10px] pt-6 border-t border-sobre-tinta/[.16] font-mono text-12 tracking-[0.02em] text-sobre-tinta/60">
          <span>
            © {anio} {nap.nombre}
          </span>
        </div>
      </div>
    </footer>
  )
}
