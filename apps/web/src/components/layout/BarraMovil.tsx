import { nap } from '@/lib/config'

/** Barra fija inferior en móvil: Llamar / WhatsApp. Único elemento con sombra en todo el sitio. */
export default function BarraMovil() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 grid grid-cols-2 h-barra-movil bg-tinta shadow-barra">
      <a
        href={nap.telefonoHref}
        className="flex items-center justify-center gap-2 bg-tinta text-sobre-tinta font-sans font-bold text-16 uppercase tracking-[.04em] no-underline focus-visible:ring-2 focus-visible:ring-sobre-tinta"
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        Llamar
      </a>
      <a
        href={nap.whatsappHref ?? '/presupuesto/'}
        className="flex items-center justify-center gap-2 bg-whatsapp text-tinta font-sans font-bold text-16 uppercase tracking-[.04em] no-underline focus-visible:ring-2 focus-visible:ring-tinta border-l border-tinta/[.14]"
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.171c-1.519.785-2.835 1.945-3.756 3.288-1.185 1.649-1.85 3.529-1.85 5.487 0 2.064.499 4.081 1.47 5.921l.007.012.9.447.447.224v1.478c0 .996.805 1.801 1.801 1.801h1.478l.224.447.447.9.012.007a9.868 9.868 0 005.921 1.47c5.445 0 9.877-4.432 9.877-9.877 0-2.65-.997-5.152-2.807-7.115-1.81-1.964-4.312-3.195-7.07-3.195" />
        </svg>
        WhatsApp
      </a>
    </div>
  )
}
