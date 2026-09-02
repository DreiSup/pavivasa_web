import type { Metadata } from 'next'
import Link from 'next/link'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import EnlaceEtiqueta from '@/components/ui/EnlaceEtiqueta'
import Seccion, { CabeceraSeccion } from '@/components/ui/Seccion'
import DatoPendiente from '@/components/datos/DatoPendiente'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import BarraConfianza from '@/components/layout/BarraConfianza'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import SeccionFAQ from '@/components/secciones/SeccionFAQ'
import SeccionMuestrario from '@/components/secciones/SeccionMuestrario'
import { nap } from '@/lib/config'
import { proyectos, proyectosDestacados, proyectosPorServicio, serviciosOrdenados } from '@/lib/datos'
import { RUTA_SERVICIO, SERVICIOS_FUERTES } from '@/lib/tipos'
import { COLORES_OBRA, ESPACIOS, FAQ_HOME, MODELOS_IMPRESO } from '@/content/home'

export const metadata: Metadata = {
  title: `${nap.nombre} · Hormigón impreso y pulido en Valencia y Alicante`,
  description:
    'Ejecutamos y conservamos toda clase de pavimentos, recubrimientos y estructuras de hormigón. Más de 15 años de oficio para particulares, empresas y profesionales del sector.',
  alternates: { canonical: '/' },
}

export default function Home() {
  const servicios = serviciosOrdenados()
  const fuertes = servicios.filter((s) => SERVICIOS_FUERTES.includes(s.id))
  const resto = servicios.filter((s) => !SERVICIOS_FUERTES.includes(s.id))
  const destacadas = proyectosDestacados().slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 md:min-h-[828px] border-b border-tinta">
        <div className="flex flex-col justify-between gap-12 px-lat-movil pt-10 pb-8 md:px-lat-desktop md:pt-[72px] md:pb-16">
          <div className="flex flex-col gap-5 md:gap-7">
            <AntetituloSeccion>
              Expertos en pavimentos de hormigón<span className="hidden md:inline"> · Sollana, Valencia</span>
            </AntetituloSeccion>
            <h1 className="font-display font-extrabold text-46 md:text-88 leading-[0.98] md:leading-[0.95] text-balance">
              Hormigón impreso y pulido para tu casa, tu piscina o tu nave.
            </h1>
            <p className="text-16 md:text-20 text-tinta-media max-w-[560px]">
              Ejecutamos y conservamos toda clase de pavimentos<span className="hidden md:inline">, recubrimientos y estructuras</span> de
              hormigón. Más de 15 años de oficio para particulares, empresas y profesionales<span className="hidden md:inline"> del sector</span>.
            </p>
            <div className="flex flex-col md:flex-row gap-[10px] md:gap-3">
              <Boton variante="primario" href="/presupuesto/">
                Pedir presupuesto
              </Boton>
              <Boton variante="contorno" href="/proyectos/">
                Ver proyectos
              </Boton>
            </div>
          </div>
          <div className="hidden md:flex gap-8 font-mono text-d-12 uppercase text-tinta-media">
            <span>Impreso · Pulido · Lavado · Microcemento</span>
            <span>Marina Alta · Valencia</span>
          </div>
        </div>
        <BloquePosicion
          etiqueta="Foto hero · contorno de piscina · piedra inglesa crema (Dénia)"
          prioridad
          className="aspect-[4/3] md:aspect-auto !border-0 border-t md:border-t-0 md:!border-l md:!border-l-tinta/[.12] border-t-tinta/[.12] md:p-2"
        />
      </section>

      <BarraConfianza />

      {/* ¿Qué quieres pavimentar? */}
      <Seccion interior="flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-10">
          <div className="flex flex-col gap-3 md:gap-4">
            <AntetituloSeccion>Empieza por el espacio</AntetituloSeccion>
            <h2 className="font-display font-bold text-34 md:text-64 leading-[1.05] md:leading-none">¿Qué quieres pavimentar?</h2>
          </div>
          <p className="hidden md:block text-16 text-tinta-media max-w-[400px]">
            Elige el espacio y te decimos qué técnica encaja. Cada opción abre el formulario ya rellenado.
          </p>
        </div>
        <ul className="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
          {ESPACIOS.map((e) => (
            <li key={e.nombre}>
              <Link
                href={`/presupuesto/?espacio=${encodeURIComponent(e.nombre)}`}
                className="group flex flex-col gap-2 md:gap-3 no-underline text-tinta"
              >
                <BloquePosicion etiqueta={e.foto} compacto aviso="Foto · pendiente" className="aspect-square" />
                <span className="font-display font-bold text-16 md:text-20 leading-[1.2] group-hover:text-pigmento transition-colors duration-cabecera">
                  {e.nombre}
                </span>
                <span className="hidden md:inline-block self-start text-14 font-semibold border-b-2 border-tinta group-hover:text-pigmento group-hover:border-pigmento transition-colors duration-cabecera">
                  Pedir presupuesto →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Seccion>

      {/* Servicios */}
      <Seccion className="bg-fondo-alt" interior="flex flex-col gap-5 md:gap-10">
        <div className="flex flex-col gap-3 md:gap-4">
          <AntetituloSeccion>Servicios</AntetituloSeccion>
          <h2 className="font-display font-bold text-34 md:text-64 leading-[1.05] md:leading-none max-w-[900px] text-balance">
            Nuestro punto fuerte: impreso, pulido y microcemento.
          </h2>
        </div>
        <ul className="list-none m-0 p-0 flex flex-col md:grid md:grid-cols-3 gap-4">
          {fuertes.map((s, i) => {
            const n = proyectosPorServicio(s.id).length
            return (
              <li key={s.id}>
                <Link
                  href={RUTA_SERVICIO[s.id]}
                  className="group flex flex-col h-full gap-[10px] md:gap-4 p-4 md:p-6 bg-fondo no-underline text-tinta"
                >
                  <BloquePosicion
                    imagen={s.imagenHero}
                    compacto
                    className={`aspect-video md:aspect-[4/3] ${i > 0 ? 'hidden md:block' : ''}`}
                  />
                  <span className="font-mono text-d-10 md:text-d-12 uppercase text-tinta-media">
                    {s.numero} · {n} obras<span className="hidden md:inline"> documentadas</span>
                  </span>
                  <span className="font-display font-bold text-26 md:text-34 leading-[1.1] md:leading-[1.05] group-hover:text-pigmento transition-colors duration-cabecera">
                    {s.nombre}
                  </span>
                  <span className="text-14 md:text-16 text-tinta-media">{s.resumen}</span>
                  <span className="hidden md:inline-block mt-auto self-start text-16 font-semibold border-b-2 border-tinta group-hover:text-pigmento group-hover:border-pigmento transition-colors duration-cabecera">
                    Ver servicio →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <ul className="list-none m-0 p-0 flex flex-col md:grid md:grid-cols-4 border-t border-tinta">
          {resto.map((s, i) => (
            <li key={s.id} className="contents">
              <Link
                href={RUTA_SERVICIO[s.id]}
                className={`group flex md:flex-col justify-between md:justify-start gap-2 py-[14px] md:py-6 no-underline text-tinta border-b border-tinta/[.12] md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 ${
                  i === 0 ? 'md:pr-6' : i === resto.length - 1 ? 'md:pl-6' : 'md:px-6'
                }`}
              >
                <span className="hidden md:block font-mono text-d-12 uppercase text-tinta-media">{s.numero}</span>
                <span className="text-16 font-semibold md:font-display md:font-bold md:text-26 md:leading-[1.1] group-hover:text-pigmento transition-colors duration-cabecera">
                  {s.nombre}
                </span>
                <span className="hidden md:block text-14 text-tinta-media">{s.resumen}</span>
                <span aria-hidden="true" className="md:hidden text-16 font-semibold">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Seccion>

      {/* Obras destacadas */}
      <Seccion interior="flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-10">
          <div className="flex flex-col gap-3 md:gap-4">
            <AntetituloSeccion>Obras destacadas</AntetituloSeccion>
            <h2 className="font-display font-bold text-34 md:text-64 leading-[1.05] md:leading-none">Cada metro, documentado.</h2>
          </div>
          <EnlaceEtiqueta href="/proyectos/" className="hidden md:inline-block whitespace-nowrap">
            Ver los {proyectos.length} proyectos →
          </EnlaceEtiqueta>
        </div>
        <ul className="list-none m-0 p-0 flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-6">
          {destacadas.map((p) => (
            <li key={p.slug} className="contents">
              <div className="hidden md:block">
                <TarjetaProyecto proyecto={p} tamano="grande" conFicha />
              </div>
              <div className="md:hidden">
                <TarjetaProyecto proyecto={p} tamano="medio" />
              </div>
            </li>
          ))}
        </ul>
        <EnlaceEtiqueta href="/proyectos/" className="md:hidden">
          Ver los {proyectos.length} proyectos →
        </EnlaceEtiqueta>
      </Seccion>

      <SeccionMuestrario
        className="border-t border-tinta"
        antetitulo="Muestrario"
        titulo="Modelos y colores con obra hecha"
        texto={
          <span className="hidden md:inline">
            La estampación imita adoquines, piedra, baldosas o pizarra. Estos son los moldes y colores que ya hemos puesto en obra; la carta completa te la enseñamos en la visita.
          </span>
        }
        modelos={MODELOS_IMPRESO}
        colores={COLORES_OBRA}
        rotuloModelos="Modelos · impreso"
        rotuloColores="Colores · impreso y pulido"
      />

      {/* Garantía */}
      <Seccion className="bg-tinta text-sobre-tinta" interior="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 md:items-center">
        <div className="flex flex-col gap-5">
          <AntetituloSeccion sobreOscuro>Garantía</AntetituloSeccion>
          <h2 className="font-display font-extrabold text-46 md:text-88 leading-[0.98] md:leading-[0.95]">
            10 años de garantía en todos los trabajos.
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-16 md:text-20">
            <span className="hidden md:inline">La calidad de nuestros trabajos es inmejorable, pero no nos quedamos ahí: te damos</span>
            <span className="md:hidden">Te damos</span> 10 años de garantía y nos ocupamos del mantenimiento y la reparación si lo necesitas.{' '}
            <span className="hidden md:inline">Somos una empresa seria; queremos</span>
            <span className="md:hidden">Queremos</span> que vuelvas a contratarnos.
          </p>
          <ul className="hidden md:flex list-none m-0 p-0 flex-col font-mono text-d-12 uppercase leading-[2.2] border-t border-sobre-tinta/[.16] pt-4">
            <li>Garantía · 10 años</li>
            <li>Mantenimiento · incluido</li>
            <li>Reparación · si hace falta</li>
            <li className="opacity-60">
              Condiciones por escrito · <DatoPendiente sobreOscuro className="!opacity-100">pendiente</DatoPendiente>
            </li>
          </ul>
        </div>
      </Seccion>

      <SeccionFAQ
        antetitulo="Preguntas frecuentes"
        titulo="Lo que nos preguntan antes de empezar"
        tituloMovil="Preguntas frecuentes"
        preguntas={FAQ_HOME}
      />

      {/* Formulario corto */}
      <Seccion className="bg-fondo-alt" interior="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 md:items-start">
        <div className="flex flex-col gap-5">
          <h2 className="font-display font-bold text-34 md:text-64 leading-[1.05] md:leading-none">
            Cuéntanos qué quieres pavimentar y te llamamos.
          </h2>
          <p className="hidden md:block text-16 text-tinta-media">
            Tres datos. Sin compromiso. Si prefieres hablar ya:{' '}
            <a href={nap.telefonoHref} className="text-tinta font-semibold">
              {nap.telefono}
            </a>
            .
          </p>
        </div>
        <FormularioPresupuesto variante="corto" />
      </Seccion>
    </>
  )
}
