import { nap } from '@/lib/config'
import Boton from '../ui/Boton'
import Seccion from '../ui/Seccion'

/** Sección de cierre con el CTA de presupuesto y el teléfono. Clara (servicio) u oscura (empresa). */
export default function LlamadaFinal({
  id,
  titulo,
  oscura,
  /** En escritorio, botones en columna (servicio) o en fila (empresa). */
  botonesEnFila,
}: {
  id?: string
  titulo: string
  oscura?: boolean
  botonesEnFila?: boolean
}) {
  return (
    <Seccion
      id={id}
      className={oscura ? 'bg-tinta text-sobre-tinta' : 'bg-fondo-alt'}
      interior="flex flex-col gap-5 md:flex-row md:justify-between md:items-center md:gap-16"
    >
      <h2 className="font-display font-bold text-34 md:text-64 leading-[1.05] md:leading-none max-w-[760px] text-balance">
        {titulo}
      </h2>
      <div className={`flex flex-col gap-3 shrink-0 ${botonesEnFila ? 'md:flex-row' : ''}`}>
        <Boton variante={oscura ? 'primario' : 'tinta'} href="/presupuesto/" className="md:!px-8">
          Pedir presupuesto
        </Boton>
        <Boton variante="contorno" sobreOscuro={oscura} href={nap.telefonoHref} className="hidden md:inline-flex md:!px-8">
          {oscura ? <span className="font-mono text-d-14">{nap.telefono}</span> : `Llamar · ${nap.telefono}`}
        </Boton>
      </div>
    </Seccion>
  )
}
