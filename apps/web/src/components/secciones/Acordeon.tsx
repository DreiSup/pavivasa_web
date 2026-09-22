import type { Pregunta } from '@/lib/tipos'
import DatoPendiente from '../datos/DatoPendiente'

/**
 * Acordeón de FAQ con <details>: funciona sin JS y es accesible.
 * Las respuestas que Gabriel aún no ha redactado se muestran como DatoPendiente.
 */
export default function Acordeon({ preguntas, primeraAbierta = true }: { preguntas: Pregunta[]; primeraAbierta?: boolean }) {
  return (
    <div className="flex flex-col border-t border-tinta">
      {preguntas.map((p, i) => (
        <details key={p.pregunta} open={primeraAbierta && i === 0} className="group border-b border-tinta/[.12]">
          <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex justify-between items-center gap-4 md:gap-6 min-h-[56px] md:min-h-[64px] py-[14px] md:py-4 font-display font-bold text-16 md:text-20 leading-[1.2] text-tinta">
            <span>{p.pregunta}</span>
            <span aria-hidden="true" className="font-mono text-20 font-normal shrink-0">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className="pb-5 md:pb-6 text-14 md:text-16 text-tinta-media">
            {p.respuesta ?? (
              <>
                Respuesta: <DatoPendiente>pendiente · la redacta Gabriel</DatoPendiente>
              </>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
