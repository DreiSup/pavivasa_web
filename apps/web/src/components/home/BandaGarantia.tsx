import Link from 'next/link'

/**
 * §4.8 Banda de garantía: franja acero con título, texto tuteo y botón contorno.
 */
export default function BandaGarantia() {
  return (
    <section className="bg-acero text-sobre-tinta py-16 md:py-24">
      <div className="px-lat-movil md:px-lat-desktop">
        <div className="max-w-[680px] mx-auto flex flex-col items-center gap-4 md:gap-6 text-center">
          <h2 className="font-display font-extrabold text-26 md:text-34 leading-[0.98] md:leading-[1.05]">
            10 años de garantía en todos nuestros trabajos
          </h2>
          <p className="text-16 text-sobre-tinta/85 leading-[1.5]">
            También te hacemos el mantenimiento y la reparación de tu pavimento si lo necesitas.
          </p>
          <Link
            href="#formulario"
            className="min-h-[52px] flex items-center px-[30px] border-2 border-sobre-tinta text-sobre-tinta font-sans font-bold text-14 uppercase tracking-[0.03em] no-underline transition-colors duration-cabecera hover:bg-sobre-tinta/10"
          >
            Pedir presupuesto
          </Link>
        </div>
      </div>
    </section>
  )
}
