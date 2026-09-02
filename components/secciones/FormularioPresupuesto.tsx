'use client'

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { enviarPresupuesto, type EstadoEnvio } from '@/app/presupuesto/actions'
import { nap } from '@/lib/config'
import { NOMBRES_ESPACIOS } from '@/content/home'
import { registrarEvento } from '@/lib/eventos'
import Campo, { claseInput, claseInputMono } from '../ui/Campo'
import Boton from '../ui/Boton'
import AntetituloSeccion from '../ui/AntetituloSeccion'
import EnlaceEtiqueta from '../ui/EnlaceEtiqueta'
import DatoPendiente from '../datos/DatoPendiente'
import EtiquetaTecnica from '../datos/EtiquetaTecnica'

const estadoInicial: EstadoEnvio = { estado: 'inicial', errores: {} }

const claseChip =
  'inline-flex items-center min-h-tactil px-4 border border-tinta bg-sobre-tinta font-sans text-14 font-semibold text-tinta cursor-pointer transition-colors duration-cabecera ' +
  'peer-checked:bg-pigmento peer-checked:border-pigmento peer-checked:text-sobre-tinta peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-acero peer-focus-visible:outline-offset-[3px] hover:bg-tinta hover:text-sobre-tinta'

/**
 * Formulario de presupuesto. `corto` (home): nombre, teléfono, espacio.
 * `completo` (/presupuesto/): + email, municipio, m², foto, mensaje, privacidad.
 * Estados: inicial · error (teléfono) · enviando (campos bloqueados) · enviado ("Recibido").
 */
export default function FormularioPresupuesto({
  variante = 'completo',
  espacioInicial,
}: {
  variante?: 'completo' | 'corto'
  /** Viene de las tarjetas "¿Qué quieres pavimentar?" (/presupuesto/?espacio=…). */
  espacioInicial?: string
}) {
  const [estado, accion, enviando] = useActionState(enviarPresupuesto, estadoInicial)
  const telefonoRef = useRef<HTMLInputElement>(null)
  const [eventoId, setEventoId] = useState('')
  const [nombreFoto, setNombreFoto] = useState<string>()
  const eventoDisparado = useRef(false)
  const completo = variante === 'completo'
  const espacioPorDefecto = espacioInicial && NOMBRES_ESPACIOS.includes(espacioInicial) ? espacioInicial : undefined

  // event_id compartido entre Pixel (navegador) y CAPI (servidor) para deduplicar el Lead.
  useEffect(() => {
    setEventoId(crypto.randomUUID())
  }, [])

  useEffect(() => {
    if (estado.estado === 'error' && estado.errores.telefono) telefonoRef.current?.focus()
  }, [estado])

  /**
   * Con JS, se envía en una transición en vez de por `action`: así React no vacía
   * el formulario tras un error de validación y quien escribe no pierde lo tecleado.
   * Sin JS, el atributo `action` sigue funcionando.
   */
  function alEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    startTransition(() => accion(datos))
  }

  useEffect(() => {
    if (estado.estado === 'enviado' && !eventoDisparado.current) {
      eventoDisparado.current = true
      registrarEvento('envio_formulario', {
        metaEstandar: 'Lead',
        metaEventId: eventoId,
        conversionAds: true,
        params: { espacio: estado.resumen?.espacio, municipio: estado.resumen?.municipio, variante },
      })
    }
  }, [estado, eventoId, variante])

  if (estado.estado === 'enviado') {
    const r = estado.resumen
    const lineas = [
      r?.espacio ? `Espacio · ${r.espacio}` : null,
      r?.superficie ? `Superficie · ≈ ${r.superficie} m²` : null,
      r?.municipio ? `Municipio · ${r.municipio}` : null,
      r?.nombre ? `Contacto · ${r.nombre}` : null,
    ].filter((l): l is string => Boolean(l))

    return (
      <div
        role="status"
        className={`flex flex-col ${completo ? 'gap-5 md:gap-6 p-5 md:p-10 bg-fondo-alt' : 'gap-4 p-5 md:p-8 bg-fondo'}`}
      >
        <AntetituloSeccion>Solicitud enviada</AntetituloSeccion>
        <h2 className={`font-display font-extrabold leading-[0.98] ${completo ? 'text-46 md:text-64' : 'text-46'}`}>
          Recibido.
        </h2>
        <p className={`${completo ? 'text-16 md:text-20' : 'text-16'} max-w-[640px]`}>
          Te llamaremos al <span className="font-mono">{r?.telefono}</span> para hablar de tu obra. Plazo de respuesta:{' '}
          <DatoPendiente>pendiente</DatoPendiente>.
        </p>
        <EtiquetaTecnica titulo="Resumen de lo pedido" lineas={lineas} compacto={!completo} className="md:self-start md:min-w-[360px]" />
        {completo ? (
          <div className="flex flex-wrap gap-6">
            <EnlaceEtiqueta href="/proyectos/">Ver proyectos →</EnlaceEtiqueta>
            <EnlaceEtiqueta href="/hormigon-impreso/">Sobre el hormigón impreso →</EnlaceEtiqueta>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <form
      action={accion}
      onSubmit={alEnviar}
      aria-busy={enviando}
      noValidate
      className={
        completo
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5 p-5 md:p-10 bg-fondo-alt'
          : 'flex flex-col gap-4 md:gap-5 p-5 md:p-8 bg-fondo'
      }
    >
      {estado.errores.form ? (
        <p className="md:col-span-2 font-sans text-14 font-semibold text-error" role="alert">
          {estado.errores.form}
        </p>
      ) : null}

      {/* Honeypot: oculto para personas, visible para bots */}
      <input type="text" name="empresa_web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="evento_id" value={eventoId} />
      <input type="hidden" name="variante" value={variante} />

      <Campo etiqueta="Nombre y apellidos" htmlFor={`${variante}-nombre`} obligatorio error={estado.errores.nombre}>
        <input
          id={`${variante}-nombre`}
          name="nombre"
          type="text"
          autoComplete="name"
          required
          readOnly={enviando}
          aria-invalid={Boolean(estado.errores.nombre)}
          className={claseInput}
        />
      </Campo>
      <Campo etiqueta="Teléfono" htmlFor={`${variante}-telefono`} obligatorio error={estado.errores.telefono}>
        <input
          ref={telefonoRef}
          id={`${variante}-telefono`}
          name="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          readOnly={enviando}
          aria-invalid={Boolean(estado.errores.telefono)}
          aria-describedby={estado.errores.telefono ? `${variante}-telefono-error` : undefined}
          className={claseInputMono}
        />
      </Campo>

      {completo ? (
        <>
          <Campo etiqueta="Email" htmlFor="completo-email" error={estado.errores.email}>
            <input
              id="completo-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              readOnly={enviando}
              aria-invalid={Boolean(estado.errores.email)}
              className={claseInput}
            />
          </Campo>
          <Campo etiqueta="Municipio" htmlFor="completo-municipio" obligatorio error={estado.errores.municipio}>
            <input
              id="completo-municipio"
              name="municipio"
              type="text"
              autoComplete="address-level2"
              required
              readOnly={enviando}
              aria-invalid={Boolean(estado.errores.municipio)}
              className={claseInput}
            />
          </Campo>

          <fieldset className="md:col-span-2 m-0 p-0 border-0 flex flex-col gap-[10px]">
            <legend className="font-sans text-14 font-semibold mb-[10px]">
              ¿Qué quieres pavimentar?{' '}
              <span className="text-pigmento" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {NOMBRES_ESPACIOS.map((e, i) => (
                <span key={e} className="relative">
                  <input
                    type="radio"
                    name="espacio"
                    value={e}
                    id={`espacio-${i}`}
                    defaultChecked={e === espacioPorDefecto}
                    disabled={enviando}
                    required
                    className="peer sr-only"
                  />
                  <label htmlFor={`espacio-${i}`} className={claseChip}>
                    {e}
                  </label>
                </span>
              ))}
            </div>
            {estado.errores.espacio ? (
              <p className="font-sans text-14 text-error" aria-live="polite">
                {estado.errores.espacio}
              </p>
            ) : null}
          </fieldset>

          <Campo etiqueta="Superficie aproximada" htmlFor="completo-superficie" error={estado.errores.superficie}>
            <div className="flex">
              <input
                id="completo-superficie"
                name="superficie"
                type="text"
                inputMode="numeric"
                readOnly={enviando}
                aria-invalid={Boolean(estado.errores.superficie)}
                className={`${claseInputMono} border-r-0`}
              />
              <span className="flex items-center shrink-0 whitespace-nowrap px-[14px] border border-tinta-media bg-fondo font-sans text-14 text-tinta-media">
                m²
              </span>
            </div>
          </Campo>

          <Campo etiqueta="Sube una foto del espacio" htmlFor="completo-foto" error={estado.errores.foto}>
            <label
              htmlFor="completo-foto"
              className="flex items-center justify-between gap-3 min-h-campo px-[14px] border border-dashed border-tinta-media bg-sobre-tinta text-14 text-tinta-media cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-acero has-[:focus-visible]:outline-offset-[3px]"
            >
              <span className="truncate">{nombreFoto ?? 'JPG o PNG · hasta 10 MB'}</span>
              <span className="font-semibold text-tinta border-b-2 border-tinta shrink-0">{nombreFoto ? 'Cambiar' : 'Elegir'}</span>
              <input
                id="completo-foto"
                name="foto"
                type="file"
                accept="image/jpeg,image/png"
                disabled={enviando}
                onChange={(e) => setNombreFoto(e.target.files?.[0]?.name)}
                className="sr-only"
              />
            </label>
          </Campo>

          <Campo etiqueta="Cuéntanos algo más" htmlFor="completo-mensaje" className="md:col-span-2" error={estado.errores.mensaje}>
            <textarea
              id="completo-mensaje"
              name="mensaje"
              rows={4}
              placeholder="Estado actual del suelo, accesos, si hay piscina, fechas orientativas…"
              readOnly={enviando}
              className={`${claseInput} py-3 min-h-[120px] resize-y leading-[1.5]`}
            />
          </Campo>

          <div className="md:col-span-2 flex flex-col gap-[6px]">
            <label className="flex items-start gap-3 text-14 leading-[1.5] cursor-pointer">
              <input
                type="checkbox"
                name="privacidad"
                value="si"
                required
                disabled={enviando}
                aria-invalid={Boolean(estado.errores.privacidad)}
                className="casilla appearance-none shrink-0 w-5 h-5 mt-[2px] border border-tinta bg-sobre-tinta cursor-pointer checked:bg-tinta aria-[invalid=true]:border-2 aria-[invalid=true]:border-error"
              />
              <span>
                Acepto la{' '}
                <Link href="/politica-de-privacidad/" className="text-tinta">
                  política de privacidad
                </Link>
                . Usaremos tus datos solo para responder a esta solicitud.{' '}
                <span className="text-pigmento" aria-hidden="true">
                  *
                </span>
              </span>
            </label>
            {estado.errores.privacidad ? (
              <p className="font-sans text-14 text-error" aria-live="polite">
                {estado.errores.privacidad}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <Boton type="submit" variante="primario" cargando={enviando} className="md:!px-8">
              Enviar y que me llamen
            </Boton>
            <span className="text-12 text-tinta-media">
              Plazo de respuesta: <DatoPendiente>pendiente</DatoPendiente>
            </span>
          </div>
        </>
      ) : (
        <>
          <Campo etiqueta="¿Qué quieres pavimentar?" htmlFor="corto-espacio" obligatorio error={estado.errores.espacio}>
            <select
              id="corto-espacio"
              name="espacio"
              required
              disabled={enviando}
              defaultValue={espacioPorDefecto ?? NOMBRES_ESPACIOS[0]}
              className={`${claseInput} cursor-pointer`}
            >
              {NOMBRES_ESPACIOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Campo>
          <Boton type="submit" variante="tinta" anchoCompleto cargando={enviando}>
            Enviar y que me llamen
          </Boton>
          <span className="text-12 text-tinta-media">
            Al enviar aceptas la{' '}
            <Link href="/politica-de-privacidad/" className="text-tinta-media">
              política de privacidad
            </Link>
            . <span className="hidden md:inline">Plazo de respuesta: <DatoPendiente>pendiente</DatoPendiente></span>
          </span>
        </>
      )}
    </form>
  )
}
