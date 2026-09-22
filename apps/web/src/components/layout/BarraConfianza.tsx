import { claims } from '@/lib/config'
import DatoPendiente from '../datos/DatoPendiente'

const datos = [
  { cifra: '+15', texto: 'años de oficio', textoMovil: 'años de oficio' },
  { cifra: '10', texto: 'años de garantía con mantenimiento', textoMovil: 'años de garantía' },
  { cifra: '+30 %', texto: 'de clientes repiten', textoMovil: 'clientes repiten' },
]

/** Franja de datos: años, garantía, fidelización y cobertura (pendiente de confirmar). */
export default function BarraConfianza() {
  return (
    <ul
      aria-label="Datos de la empresa"
      className="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-4 border-b border-tinta md:border-t-0"
    >
      {datos.map((d, i) => (
        <li
          key={d.cifra}
          className={`flex flex-col gap-1 md:gap-[6px] px-lat-movil py-4 md:px-8 md:py-6 border-tinta/[.12] ${
            i % 2 === 0 ? 'border-r' : ''
          } ${i < 2 ? 'border-b md:border-b-0' : ''} md:border-r ${i === 0 ? 'md:pl-lat-desktop' : ''}`}
        >
          <span className="font-display font-bold text-26 md:text-34 leading-none">{d.cifra}</span>
          <span className="font-mono text-d-10 md:text-d-12 uppercase text-tinta-media">
            <span className="md:hidden">{d.textoMovil}</span>
            <span className="hidden md:inline">{d.texto}</span>
          </span>
        </li>
      ))}
      <li className="flex flex-col gap-1 md:gap-[6px] px-lat-movil py-4 md:px-8 md:py-6">
        <span className="font-display font-bold text-26 md:text-34 leading-none">{claims.provincias.length}</span>
        <span className="font-mono text-d-10 md:text-d-12 uppercase text-tinta-media">
          provincias · <DatoPendiente pequeno className="md:!text-d-12">por confirmar</DatoPendiente>
        </span>
      </li>
    </ul>
  )
}
