import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Seccion from '@/components/ui/Seccion'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { FAQ_HOME } from '@/content/home'

/**
 * §4.9 FAQ: <details>/<summary> con icono +/−, primera pregunta abierta.
 * Respuestas pendientes como DatoPendiente.
 */
export default function SeccionPreguntas() {
  return (
    <Seccion interior="flex flex-col">
      <div className="w-full max-w-[800px] mx-auto flex flex-col">
        <div className="flex flex-col gap-3 md:gap-4 mb-6">
          <AntetituloSeccion>Preguntas frecuentes</AntetituloSeccion>
          <h2 className="font-display font-bold text-26 md:text-34 leading-[1.1]">
            ¿Tienes dudas?
          </h2>
        </div>

        <div className="flex flex-col">
        {FAQ_HOME.map((item, index) => (
          <details
            key={index}
            open={index === 0}
            className="group border-b border-tinta/[.16]"
          >
            <summary
              className="list-none flex justify-between items-center gap-[14px] py-[18px] text-16 font-semibold text-tinta cursor-pointer no-underline
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-acero focus-visible:outline-offset-[3px]
              [&::-webkit-details-marker]:hidden"
            >
              <span>{item.pregunta}</span>
              <span
                aria-hidden
                className="font-mono text-20 flex-shrink-0 group-open:hidden"
              >
                +
              </span>
              <span
                aria-hidden
                className="font-mono text-20 flex-shrink-0 hidden group-open:inline"
              >
                −
              </span>
            </summary>
            <div className="pb-[18px] text-14 text-tinta-media leading-[1.5]">
              {item.respuesta ? (
                <p>{item.respuesta}</p>
              ) : (
                <p>
                  <DatoPendiente>Respuesta pendiente de confirmar</DatoPendiente>
                </p>
              )}
            </div>
          </details>
        ))}
        </div>
      </div>
    </Seccion>
  )
}
