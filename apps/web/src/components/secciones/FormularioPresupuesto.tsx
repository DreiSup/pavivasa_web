'use client'

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { isClickIdParam } from '@site/tracking'
import { enviarPresupuesto, type EstadoEnvio } from '@/app/presupuesto/actions'
import { readConsentStatus } from '@/lib/consent-status'
import { ATTRIBUTION_PARAMS, CLICK_ID_PARAMS, getAttributionForSubmit } from '@/lib/attribution'
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

// Mirrors the server-side validation (`FOTO_MAX_BYTES` in actions.ts). The photo is
// capped at 4 MB here to leave headroom, under the Server Action's 4300kb body limit
// (`serverActions.bodySizeLimit`, next.config.ts), for the rest of the multipart
// form: above that combined limit the submission comes back as a 413 before
// reaching the action, so it's rejected here, in the browser, instead.
const FOTO_MAX_BYTES = 4 * 1024 * 1024
const FOTO_ERROR_TAMANO = 'La foto pesa más de 4 MB.'

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
  sinCaja = false,
}: {
  variante?: 'completo' | 'corto'
  /** Viene de las tarjetas "¿Qué quieres pavimentar?" (/presupuesto/?espacio=…). */
  espacioInicial?: string
  /** Si true, no envuelve el formulario en card (bg/border/padding). */
  sinCaja?: boolean
}) {
  const [estado, accion, enviando] = useActionState(enviarPresupuesto, estadoInicial)
  const telefonoRef = useRef<HTMLInputElement>(null)
  const [eventoId, setEventoId] = useState('')
  const [nombreFoto, setNombreFoto] = useState<string>()
  const [errorFoto, setErrorFoto] = useState<string>()
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
    // Read at submit time, not on mount: consent may have changed during the session.
    const marketingConsent = readConsentStatus() === 'aceptado' ? 'aceptado' : 'rechazado'
    datos.set('marketing_consent', marketingConsent)
    // First-touch cookie (post-consent) takes priority over this session's own capture.
    // Whitelisted read: the cookie/sessionStorage source is unvalidated JSON (see
    // lib/attribution.ts readCookie/readSession), so an unfiltered Object.entries
    // loop here would let any injected key overwrite an unrelated FormData field
    // (e.g. `marketing_consent`, set just above, or the `empresa_web` honeypot).
    const attribution = getAttributionForSubmit()
    for (const key of ATTRIBUTION_PARAMS) {
      // GDPR: click identifiers (gclid/gbraid/wbraid/fbclid) never leave the browser
      // without marketing consent. utm_* is non-identifying campaign info and is
      // still sent (see the matching server-side drop in app/presupuesto/actions.ts).
      if (marketingConsent !== 'aceptado' && isClickIdParam(key, CLICK_ID_PARAMS)) continue
      const value = attribution[key]
      if (value) datos.set(key, value)
    }
    if (attribution.ts) datos.set('attribution_ts', attribution.ts)
    datos.set('source_page', window.location.pathname)
    startTransition(() => accion(datos))
  }

  /**
   * Solo `enviado` cuenta como conversión. El honeypot devuelve `descartado`, que se
   * pinta igual pero no llega aquí: un bot ve "Recibido" sin generar un Lead.
   */
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

  // Lo que ve quien envía es lo mismo en los dos casos; lo que se mide, no.
  if (estado.estado === 'enviado' || estado.estado === 'descartado') {
    const r = estado.resumen
    const lineas = [
      r?.espacio ? `Espacio · ${r.espacio}` : null,
      r?.superficie ? `Superficie · ≈ ${r.superficie} m²` : null,
      r?.municipio ? `Municipio · ${r.municipio}` : null,
      r?.nombre ? `Contacto · ${r.nombre}` : null,
    ].filter((l): l is string => Boolean(l))

    const claseSuccess = sinCaja
      ? 'flex flex-col gap-4 md:gap-5'
      : `flex flex-col ${completo ? 'gap-5 md:gap-6 p-5 md:p-10 bg-fondo-alt' : 'gap-4 p-5 md:p-8 bg-fondo'}`

    return (
      <div
        role="status"
        className={claseSuccess}
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

  // I4: misma casilla, mismo texto y mismo enlace en las dos variantes.
  const casillaPrivacidad = (
    <div className={`flex flex-col gap-[6px] ${completo ? 'md:col-span-2' : ''}`}>
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
  )

  const claseFormulario = sinCaja
    ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5'
    : completo
      ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5 p-5 md:p-10 bg-fondo-alt'
      : 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5 p-5 md:p-8 bg-fondo'

  return (
    <form
      action={accion}
      onSubmit={alEnviar}
      aria-busy={enviando}
      noValidate
      className={claseFormulario}
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

      <Campo etiqueta="Nombre y apellidos" htmlFor={`${variante}-nombre`} obligatorio error={estado.errores.nombre} className={!completo ? 'md:col-span-2' : ''}>
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
      {!completo ? (
        <Campo etiqueta="Municipio" htmlFor={`${variante}-municipio`} error={estado.errores.municipio}>
          <input
            id={`${variante}-municipio`}
            name="municipio"
            type="text"
            autoComplete="address-level2"
            placeholder="Sollana"
            readOnly={enviando}
            aria-invalid={Boolean(estado.errores.municipio)}
            className={claseInput}
          />
        </Campo>
      ) : null}

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

          <Campo etiqueta="Sube una foto del espacio" htmlFor="completo-foto" error={estado.errores.foto ?? errorFoto}>
            <label
              htmlFor="completo-foto"
              className="flex items-center justify-between gap-3 min-h-campo px-[14px] border border-dashed border-tinta-media bg-sobre-tinta text-14 text-tinta-media cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-acero has-[:focus-visible]:outline-offset-[3px]"
            >
              <span className="truncate">{nombreFoto ?? 'JPG o PNG · hasta 4 MB'}</span>
              <span className="font-semibold text-tinta border-b-2 border-tinta shrink-0">{nombreFoto ? 'Cambiar' : 'Elegir'}</span>
              <input
                id="completo-foto"
                name="foto"
                type="file"
                accept="image/jpeg,image/png"
                disabled={enviando}
                onChange={(e) => {
                  const archivo = e.target.files?.[0]
                  // Se descarta el archivo: si se dejara puesto, el envío moriría con un 413.
                  if (archivo && archivo.size > FOTO_MAX_BYTES) {
                    e.target.value = ''
                    setNombreFoto(undefined)
                    setErrorFoto(FOTO_ERROR_TAMANO)
                    return
                  }
                  setErrorFoto(undefined)
                  setNombreFoto(archivo?.name)
                }}
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

          {casillaPrivacidad}

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
          {casillaPrivacidad}
          <Boton type="submit" variante="tinta" anchoCompleto cargando={enviando}>
            Enviar y que me llamen
          </Boton>
          <span className="hidden md:inline text-12 text-tinta-media">
            Plazo de respuesta: <DatoPendiente>pendiente</DatoPendiente>
          </span>
        </>
      )}
    </form>
  )
}
