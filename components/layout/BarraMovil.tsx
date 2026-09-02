import { nap } from '@/lib/config'
import DatoPendiente from '../datos/DatoPendiente'

/** Barra fija inferior en móvil: Llamar / WhatsApp. Único elemento con sombra en todo el sitio. */
export default function BarraMovil() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 grid grid-cols-2 h-barra-movil bg-fondo shadow-barra">
      <a
        href={nap.telefonoHref}
        className="flex items-center justify-center gap-2 bg-tinta text-sobre-tinta font-sans font-semibold text-16 no-underline"
      >
        Llamar
        <span className="font-mono text-d-12 font-medium opacity-80">{nap.telefono}</span>
      </a>
      <a
        href={nap.whatsappHref ?? '/presupuesto/'}
        className="flex items-center justify-center gap-[6px] bg-fondo text-tinta font-sans font-semibold text-16 no-underline border-t border-tinta/[.12]"
      >
        WhatsApp
        {!nap.whatsapp ? <DatoPendiente pequeno>pendiente</DatoPendiente> : null}
      </a>
    </div>
  )
}
