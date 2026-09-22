import type { ReactNode } from 'react'

/**
 * Clases del control: 48 px, borde tinta-media sobre fondo sobre-tinta, foco 2 px acero,
 * error 2 px rojo (aria-invalid), deshabilitado en fondo-alt.
 */
export const claseInput =
  'min-h-campo w-full px-[14px] bg-sobre-tinta border border-tinta-media font-sans text-16 text-tinta placeholder:text-tinta-media ' +
  'focus-visible:outline-none focus-visible:border-2 focus-visible:border-acero focus-visible:px-[13px] ' +
  'aria-[invalid=true]:border-2 aria-[invalid=true]:border-error aria-[invalid=true]:px-[13px] ' +
  'disabled:bg-fondo-alt disabled:border-fondo-alt disabled:text-tinta-media read-only:text-tinta-media'

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
        <p id={`${htmlFor}-error`} className="font-sans text-14 text-error" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  )
}
