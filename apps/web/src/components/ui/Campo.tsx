import type { ReactNode } from 'react'

/**
 * Clases del control: 48 px, borde 1.5px tinta/30 sobre fondo,
 * foco pigmento + ring, error rojo (aria-invalid), deshabilitado en tinta/6.
 */
export const claseInput =
  'min-h-campo w-full px-[14px] bg-fondo border-[1.5px] border-tinta/30 font-sans text-16 text-tinta placeholder:text-tinta-media ' +
  'focus-visible:outline-none focus-visible:border-[1.5px] focus-visible:border-pigmento focus-visible:shadow-[0_0_0_3px_rgba(193,68,14,0.18)] focus-visible:px-[14px] ' +
  'aria-[invalid=true]:border-[1.5px] aria-[invalid=true]:border-error aria-[invalid=true]:px-[14px] ' +
  'disabled:bg-tinta/6 disabled:border-tinta/14 disabled:text-tinta-media read-only:text-tinta-media'

/** Teléfono, m² y demás datos van en mono. */
export const claseInputMono = `${claseInput} font-mono text-d-14`

type Props = {
  etiqueta: string
  htmlFor: string
  obligatorio?: boolean
  ayuda?: string
  error?: string
  deshabilitado?: boolean
  children: ReactNode
  className?: string
}

/** Envoltorio de campo de formulario: etiqueta, control, ayuda y error. */
export default function Campo({
  etiqueta,
  htmlFor,
  obligatorio,
  ayuda,
  error,
  deshabilitado,
  children,
  className = '',
}: Props) {
  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      <label
        htmlFor={htmlFor}
        className={`font-sans text-14 font-semibold ${deshabilitado ? 'text-tinta-media' : 'text-tinta'}`}
      >
        {etiqueta}
        {obligatorio ? (
          <>
            {' '}
            <span className="text-pigmento" aria-hidden="true">
              *
            </span>
          </>
        ) : null}
      </label>
      {children}
      {ayuda ? <p className="font-sans text-12 text-tinta-media">{ayuda}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="font-mono text-d-12 text-error" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  )
}
