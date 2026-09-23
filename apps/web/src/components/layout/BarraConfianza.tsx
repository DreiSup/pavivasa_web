import DatoPendiente from '../datos/DatoPendiente'

const datos = [
  { cifra: '+15', texto: 'De oficio', textoMovil: 'De oficio' },
  { cifra: '10', texto: 'De garantía con mantenimiento', textoMovil: 'De garantía' },
  { cifra: null, texto: 'Cobertura declarada', textoMovil: 'Cobertura' },
  { cifra: '+30%', texto: 'De clientes repiten', textoMovil: 'De clientes repiten' },
]

/** Franja acero de datos: años, garantía, cobertura y fidelización. */
export default function BarraConfianza() {
  return (
    <ul
      aria-label="Datos de la empresa"
      className="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-4 md:auto-cols-fr bg-acero text-sobre-tinta"
    >
      {datos.map((d) => (
        <li key={d.cifra ?? d.texto} className="flex flex-col gap-1 md:gap-[6px] px-lat-movil py-8 md:px-8 md:py-8">
          {d.cifra ? (
            <span className="font-display font-black text-26 md:text-26 leading-none">{d.cifra}</span>
          ) : (
            <span className="font-display font-black text-26 md:text-26 leading-none italic opacity-75">
              <DatoPendiente sobreOscuro>Zona a confirmar</DatoPendiente>
            </span>
          )}
          <span className="font-mono text-d-10 md:text-d-12 uppercase text-sobre-tinta/75">
            <span className="md:hidden">{d.textoMovil}</span>
            <span className="hidden md:inline">{d.texto}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
