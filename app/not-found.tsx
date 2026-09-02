import Link from 'next/link'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'

const salidas = [
  { href: '/', titulo: 'Inicio', texto: 'Vuelve a la portada.' },
  { href: '/proyectos/', titulo: 'Proyectos', texto: 'Obra ejecutada.' },
  { href: '/presupuesto/', titulo: 'Pedir presupuesto', texto: 'Cuéntanos qué necesitas.' },
]

export default function NotFound() {
  return (
    <section className="px-[18px] md:px-lat-desktop py-14 md:py-24 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <AntetituloSeccion>Error 404</AntetituloSeccion>
        <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
          Esta página no existe
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {salidas.map((s) => (
          <Link key={s.href} href={s.href} className="flex flex-col gap-2 bg-fondo-alt p-5 no-underline">
            <h2 className="font-display font-bold fs-h3 text-20 md:text-26 text-tinta m-0">{s.titulo}</h2>
            <p className="text-14 md:text-16 text-tinta-media m-0">{s.texto}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
