import type { Metadata } from 'next'
import Migas from '@/components/layout/Migas'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Chip from '@/components/ui/Chip'
import Seccion, { CabeceraSeccion } from '@/components/ui/Seccion'
import DatoPendiente from '@/components/datos/DatoPendiente'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import LlamadaFinal from '@/components/secciones/LlamadaFinal'
import { claims, nap } from '@/lib/config'
import { municipiosConObra } from '@/lib/datos'

export const metadata: Metadata = {
  title: 'Empresa',
  description:
    'Pavivasa: pavimentos de hormigón impreso, pulido, decorativo y obras industriales desde Sollana (Valencia). Más de 15 años de trayectoria y equipo, maquinaria y moldes propios.',
  alternates: { canonical: '/empresa/' },
}

const valores = [
  {
    titulo: 'Somos claros y legales',
    texto: 'Trato claro, directo y personalizado. Nos involucramos en tu proyecto como si fuera nuestro.',
    textoMovil: 'Trato claro, directo y personalizado. Tu proyecto, como si fuera nuestro.',
  },
  {
    titulo: 'Creemos en lo que hacemos',
    texto: 'Lo demostramos en cada metro construido, en cada proyecto terminado, en cada detalle.',
    textoMovil: 'En cada metro construido, en cada proyecto terminado.',
  },
  {
    titulo: 'Satisfacción y confianza',
    texto: 'Más del 30 % de nuestros trabajos son para clientes que ya habían contado con nosotros.',
    textoMovil: 'Más del 30 % de los trabajos son para clientes que repiten.',
  },
  {
    titulo: 'Calidad y garantía',
    texto: '10 años de garantía en todos los trabajos, con mantenimiento. Queremos que vuelvas a contratarnos.',
    textoMovil: '10 años de garantía con mantenimiento.',
  },
  {
    titulo: 'Pavimentos de confianza',
    texto: 'La mayoría de nuestros clientes siguen pidiéndonos trabajos después de muchos años.',
    textoMovil: 'La mayoría de clientes siguen llamándonos después de muchos años.',
  },
]

export default function Empresa() {
  const municipios = municipiosConObra()

  return (
    <>
      <Migas items={[{ nombre: 'Empresa' }]} />

      <section className="px-lat-movil md:px-lat-desktop pt-6 pb-8 md:pt-10 md:pb-[72px]">
        <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 md:items-end">
          <div className="flex flex-col gap-4 md:gap-6">
            <AntetituloSeccion>
              Empresa · Sollana<span className="hidden md:inline"> (Valencia)</span>
            </AntetituloSeccion>
            <h1 className="font-display font-extrabold text-46 md:text-88 leading-[0.98] md:leading-[0.95] text-balance">
              Pavimentos de hormigón desde hace más de 15 años.
            </h1>
          </div>
          <p className="text-16 md:text-20 text-tinta-media md:max-w-[560px]">
            <span className="md:hidden">
              Hormigón impreso, pulido, decorativo y obras industriales. Más de 15 años sirviendo a empresarios, propietarios y visionarios en toda la región.
            </span>
            <span className="hidden md:inline">
              Somos una empresa dedicada a los pavimentos de hormigón impreso, pulido, decorativo y obras industriales. Más de 15 años sirviendo a empresarios, propietarios y visionarios en obras de éxito en toda la región, con un equipo de profesionales cualificados para asegurar tu obra.
            </span>
          </p>
        </div>
      </section>

      <div className="md:px-lat-desktop">
        <div className="max-w-contenido mx-auto">
          <BloquePosicion
            imagen={{
              etiqueta: 'Foto de equipo en obra · nunca stock',
              src: '/img/trabajadores2.png',
              alt: 'Equipo de Pavivasa extendiendo hormigón fresco descargado desde el camión hormigonera',
            }}
            className="aspect-[4/3] md:aspect-[21/9] !border-x-0 md:!border-x [&>span:first-child]:md:top-[14px]"
          />
        </div>
      </div>

      <Seccion espacio="corto" interior="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 md:gap-16">
        <CabeceraSeccion antetitulo={<AntetituloSeccion className="hidden md:inline-flex">Experiencia</AntetituloSeccion>} titulo="Equipo, maquinaria y moldes propios." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 text-16 leading-[1.6]">
          <p>
            <span className="md:hidden">
              Especial experiencia en propiedades residenciales, complejos comerciales e instalaciones deportivas. Equipo especializado, maquinaria y todos los utensilios y moldes para una correcta realización de la obra.
            </span>
            <span className="hidden md:inline">
              Tenemos especial experiencia y capacidad en la construcción de propiedades residenciales, complejos comerciales e instalaciones deportivas. Disponemos de un equipo de trabajadores especializados, la maquinaria necesaria para la ejecución y todos los utensilios y moldes que permiten una correcta realización de la obra.
            </span>
          </p>
          <p>
            <span className="md:hidden">Nuestro punto fuerte: el hormigón impreso, el hormigón pulido y el microcemento decorativo.</span>
            <span className="hidden md:inline">
              Esta empresa es el resultado de la experiencia de 15 años de trayectoria empresarial y un estudio continuo de los procesos de ejecución en pavimentación y revestimientos de hormigón. Nuestro punto fuerte es el hormigón impreso, el hormigón pulido y el microcemento decorativo.
            </span>
          </p>
        </div>
      </Seccion>

      <Seccion espacio="corto" className="bg-fondo-alt" interior="flex flex-col gap-5 md:gap-10">
        <CabeceraSeccion antetitulo={<AntetituloSeccion className="hidden md:inline-flex">Cinco valores</AntetituloSeccion>} titulo="Por qué elegirnos" />
        <ol className="list-none m-0 p-0 flex flex-col md:grid md:grid-cols-5 border-t border-tinta">
          {valores.map((v, i) => (
            <li
              key={v.titulo}
              className={`grid grid-cols-[32px_1fr] gap-3 md:flex md:flex-col md:gap-[14px] py-4 md:py-7 border-b border-tinta/[.12] md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 ${
                i === 0 ? 'md:pr-6' : i === valores.length - 1 ? 'md:pl-6' : 'md:px-6'
              }`}
            >
              <span className="font-mono text-d-12 text-tinta-media pt-[3px] md:pt-0">0{i + 1}</span>
              <div className="flex flex-col gap-[6px] md:gap-[14px]">
                <h3 className="font-display font-bold text-16 md:text-20 uppercase leading-[1.2] md:leading-[1.15]">{v.titulo}</h3>
                <p className="text-14 text-tinta-media">
                  <span className="md:hidden">{v.textoMovil}</span>
                  <span className="hidden md:inline">{v.texto}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Seccion>

      <Seccion espacio="corto" interior="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 md:gap-16">
        <CabeceraSeccion
          antetitulo={<AntetituloSeccion className="hidden md:inline-flex">Zona de trabajo</AntetituloSeccion>}
          titulo={
            <>
              <span className="md:hidden">Donde ya hemos pavimentado</span>
              <span className="hidden md:inline">Donde ya hemos pavimentado.</span>
            </>
          }
          texto={
            <span className="hidden md:inline">
              Oficina en {nap.direccion}, {nap.municipio} ({nap.provincia}). Cobertura declarada: {claims.provincias.join(', ').replace(/, ([^,]*)$/, ' y $1')}{' '}
              <DatoPendiente>por confirmar</DatoPendiente>.
            </span>
          }
        />
        <div className="flex flex-col gap-4 md:gap-6">
          <ul className="list-none m-0 p-0 flex flex-wrap gap-2 md:gap-[10px]">
            {municipios.map((m) => (
              <li key={m}>
                <Chip mono href={`/proyectos/?municipio=${encodeURIComponent(m)}`} className="md:px-[18px]">
                  {m}
                </Chip>
              </li>
            ))}
          </ul>
          <p className="md:hidden text-14 text-tinta-media">
            Oficina: {nap.direccion}, {nap.municipio} ({nap.provincia}). Cobertura declarada en {claims.provincias.length} provincias{' '}
            <DatoPendiente>por confirmar</DatoPendiente>.
          </p>
          <BloquePosicion
            etiqueta="Mapa · Marina Alta y provincia de Valencia · municipios con obra"
            aviso="Pendiente · confirmar zona prioritaria"
            className="hidden md:block aspect-[16/7]"
          />
        </div>
      </Seccion>

      <LlamadaFinal oscura botonesEnFila titulo="Cuéntanos tu obra y te llamamos." />
    </>
  )
}
