import Link from 'next/link'
import Boton from '@/components/ui/Boton'

const atajos = [
  { href: '/hormigon-impreso/', texto: 'Hormigón impreso' },
  { href: '/hormigon-pulido/', texto: 'Hormigón pulido' },
  { href: '/microcemento/', texto: 'Microcemento decorativo' },
]

export default function NotFound() {
  return (
    <section className="flex-1 min-h-[660px] md:min-h-[640px] px-lat-movil md:px-lat-desktop py-14 md:py-24 bg-fondo-alt bg-trama-suave flex flex-col justify-center">
      <div className="max-w-contenido mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 md:items-center">
        <div className="flex flex-col gap-5 md:gap-6">
          <span className="font-mono text-d-12 tracking-[0.12em] uppercase text-acero">
            Error 404<span className="hidden md:inline"> · página no encontrada</span>
          </span>
          <h1 className="font-display font-extrabold text-46 md:text-88 leading-[0.98] md:leading-[0.95] text-balance">
            Aquí no hay nada pavimentado.
          </h1>
          <p className="text-16 md:text-20 text-tinta-media md:max-w-[520px]">
            La dirección no existe o ha cambiado con la web nueva.<span className="hidden md:inline"> Las obras antiguas ahora viven en Proyectos.</span>
          </p>
          <div className="flex flex-col md:flex-row gap-[10px] md:gap-3">
            <Boton variante="tinta" href="/" className="md:!px-8">
              Ir al inicio
            </Boton>
            <Boton variante="contorno" href="/proyectos/" className="md:!px-8">
              Ver proyectos
            </Boton>
          </div>
        </div>
        <nav aria-label="Quizá buscabas" className="hidden md:flex flex-col gap-1 justify-self-end w-[480px]">
          <span className="font-mono text-d-10 tracking-[0.14em] uppercase text-tinta-media mb-2">Quizá buscabas</span>
          {atajos.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex justify-between items-center min-h-campo px-4 bg-fondo text-tinta no-underline text-16 font-semibold hover:text-pigmento"
            >
              {a.texto}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
          <Link
            href="/presupuesto/"
            className="flex justify-between items-center min-h-campo px-4 bg-pigmento text-sobre-tinta no-underline text-16 font-semibold hover:bg-pigmento-hover"
          >
            Pedir presupuesto
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </section>
  )
}
