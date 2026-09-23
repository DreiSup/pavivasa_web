import { nap } from '@/lib/config'

/** Barra fija inferior en móvil: Llamar / WhatsApp. Único elemento con sombra en todo el sitio. */
export default function BarraMovil() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 grid grid-cols-2 h-barra-movil bg-tinta shadow-barra">
      <a
        href={nap.telefonoHref}
        className="flex items-center justify-center bg-tinta text-sobre-tinta font-sans font-bold text-16 uppercase tracking-[.04em] no-underline"
      >
        Llamar
      </a>
      <a
        href={nap.whatsappHref ?? '/presupuesto/'}
        className="flex items-center justify-center bg-tinta text-sobre-tinta font-sans font-bold text-16 uppercase tracking-[.04em] no-underline border-l border-sobre-tinta/[.14]"
      >
        WhatsApp
      </a>
    </div>
  )
}
