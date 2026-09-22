'use server'

import { z } from 'zod'
import { cookies, headers } from 'next/headers'
import { enviarEventoCAPI } from '@/lib/meta-capi'
import { nap, sitio } from '@/lib/config'
import { NOMBRES_ESPACIOS } from '@/content/home'

export type EstadoEnvio = {
  /**
   * `descartado` es el éxito falso del honeypot: se pinta igual que `enviado`
   * pero no dispara ningún evento de conversión. Cualquier estado nuevo que se
   * añada aquí tampoco los disparará mientras no se declare explícitamente.
   */
  estado: 'inicial' | 'error' | 'enviando' | 'enviado' | 'descartado'
  errores: Record<string, string>
  resumen?: { nombre: string; telefono: string; espacio: string; superficie?: string; municipio?: string }
}

// Server Action body is capped at 4300kb (`serverActions.bodySizeLimit`, next.config.ts):
// Next.js itself rejects anything above that with a 413 before it reaches this action.
const FOTO_MAX_BYTES = 4 * 1024 * 1024
const FOTO_TIPOS = ['image/jpeg', 'image/png']

// Replaces control and line-separator characters (newline, CR, tab, NEL, U+2028/2029...)
// with a space rather than rejecting the value: a valid lead must never fail just
// because its landing URL had a stray control character in a utm_* param.
function stripControlChars(value: string) {
  return value.replace(/[\u0000-\u001f\u007f\u0085\u2028\u2029]/g, ' ')
}

// `attributionLine` below joins fields with ' · ' and each field as `key=value`: a
// utm_* value carrying either sequence could inject a fake extra field into the
// plain-text email/Telegram lead notice. Collapsed to a single space (not
// stripped outright, to avoid gluing adjacent words together) rather than
// rejected: `.max(200)` below already ran against the original, untransformed
// input, so this transform running after it (and only ever shortening the
// value, never lengthening it) can't bypass that cap.
function sanitizeAttributionValue(value: string) {
  return stripControlChars(value).replace(/ ?· ?/g, ' ').replaceAll('=', ' ')
}

const esquema = z.object({
  variante: z.enum(['corto', 'completo']).default('completo'),
  nombre: z.string().trim().min(1, 'Escribe tu nombre.'),
  telefono: z
    .string()
    .transform((v) => v.replace(/[\s()+.-]/g, '').replace(/^(00)?34/, ''))
    .refine((v) => /^\d{9}$/.test(v), 'Escribe un teléfono de 9 cifras para que podamos llamarte.'),
  email: z.string().trim().email('Revisa el email.').optional().or(z.literal('')),
  espacio: z.string().refine((v) => NOMBRES_ESPACIOS.includes(v), 'Elige qué quieres pavimentar.'),
  superficie: z
    .string()
    .trim()
    .optional()
    .default('')
    .refine((v) => v === '' || /^\d{1,6}$/.test(v), 'Escribe los metros cuadrados en cifras.'),
  municipio: z.string().trim().optional().default(''),
  mensaje: z.string().trim().max(2000, 'Acorta un poco el mensaje.').optional().default(''),
  privacidad: z.string().optional(),
  evento_id: z.string().optional().default(''),
  // Absent on the no-JS path (no onSubmit means no `set` on the field): defaults
  // to 'rechazado', safe-by-default for the Meta CAPI gate (step 7).
  // `.catch` instead of failing the parse: an unrecognized/malformed value here
  // (e.g. a foreign key injected via a tossed attribution cookie, see
  // FormularioPresupuesto.tsx) must fail closed to 'rechazado', not fail the
  // whole safeParse and lose an otherwise-valid lead.
  marketing_consent: z.enum(['aceptado', 'rechazado']).optional().default('rechazado').catch('rechazado'),
  // Attribution: each field has `.catch('')` instead of failing the parse. If it
  // didn't, an unexpected character in a `gclid` or an over-length `utm_campaign`
  // (Google Ads ValueTrack values can be long; the client already truncates to
  // 200) would fail the whole `safeParse` and land on `errores.gclid`, a key no
  // field in the form renders — the visitor would see nothing and the lead would
  // be lost. `utm_*` skip the charset check: they can carry decoded spaces,
  // accented campaign names, etc. `gclid`/`gbraid`/`wbraid`/`fbclid` are opaque
  // Google/Meta identifiers with a known URL-safe charset, so they keep it.
  // `utm_*` still get control/line-separator characters (newline, CR, U+2028...)
  // replaced with a space after the length cap runs (`sanitizeAttributionValue`
  // only ever shortens the value from there, never lengthens it, so the cap
  // still applies to the original value): they land verbatim in the plain-text
  // email/Telegram lead notice (`attributionLine` below), and an unstripped
  // newline would let a crafted landing URL fake extra "fields" in that notice.
  gclid: z.string().trim().max(200).regex(/^[\w.-]*$/).optional().default('').catch(''),
  gbraid: z.string().trim().max(200).regex(/^[\w.-]*$/).optional().default('').catch(''),
  wbraid: z.string().trim().max(200).regex(/^[\w.-]*$/).optional().default('').catch(''),
  fbclid: z.string().trim().max(200).regex(/^[\w.-]*$/).optional().default('').catch(''),
  utm_source: z.string().trim().max(200).transform(sanitizeAttributionValue).optional().default('').catch(''),
  utm_medium: z.string().trim().max(200).transform(sanitizeAttributionValue).optional().default('').catch(''),
  utm_campaign: z.string().trim().max(200).transform(sanitizeAttributionValue).optional().default('').catch(''),
  utm_term: z.string().trim().max(200).transform(sanitizeAttributionValue).optional().default('').catch(''),
  utm_content: z.string().trim().max(200).transform(sanitizeAttributionValue).optional().default('').catch(''),
  attribution_ts: z.string().trim().max(20).regex(/^\d*$/).optional().default('').catch(''),
  source_page: z.string().trim().max(80).regex(/^\/[\w/-]*$/).optional().default('/presupuesto/').catch('/presupuesto/'),
})

// Límite de envíos por IP: 3 / hora. En memoria — se reinicia con cada despliegue.
const envios = new Map<string, number[]>()
const LIMITE = 3
const VENTANA_MS = 60 * 60 * 1000

function limitePorIp(ip: string) {
  const ahora = Date.now()
  const previos = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS)
  if (previos.length >= LIMITE) return false
  previos.push(ahora)
  envios.set(ip, previos)
  return true
}

function formatearTelefono(t: string) {
  return `${t.slice(0, 3)} ${t.slice(3, 5)} ${t.slice(5, 7)} ${t.slice(7)}`
}

/**
 * Fallback for `_fbc` when there's no cookie (Meta Pixel blocked, third-party
 * cookies restricted...): rebuilds the same format from the `fbclid` captured
 * on landing. Meta's official format: `fb.<subdomain>.<timestamp_ms>.<fbclid>`.
 */
function buildFbc(fbclid: string, ts: string): string | undefined {
  if (!fbclid) return undefined
  const timestamp = /^\d+$/.test(ts) ? ts : Date.now().toString()
  return `fb.1.${timestamp}.${fbclid}`
}

const TELEGRAM_MAX_CHARS = 4096

/**
 * Telegram's `sendMessage` rejects the whole message outright above 4096
 * characters — there's no partial delivery, so staying under the cap matters more
 * than what gets cut to get there. The attribution line is shortened (or dropped)
 * first since it's the least essential part of the notice. Only if the lead's own
 * data (name, phone, message...) still doesn't fit on its own is the final text
 * hard-cut as a last resort, rather than have the whole notice bounce — this can
 * happen for real: `nombre`, `municipio` and `email` have no `.max()` in the
 * schema above, so a long-enough submission reaches this path.
 */
function capTelegramText(baseLines: string[], attributionLine: string): string {
  const base = baseLines.join('\n')
  if (!attributionLine) return base.slice(0, TELEGRAM_MAX_CHARS)
  const prefix = '\nOrigen: '
  const budget = TELEGRAM_MAX_CHARS - base.length - prefix.length
  const withAttribution = budget > 0 ? `${base}${prefix}${attributionLine.slice(0, budget)}` : base
  return withAttribution.slice(0, TELEGRAM_MAX_CHARS)
}

export async function enviarPresupuesto(_prev: EstadoEnvio, formData: FormData): Promise<EstadoEnvio> {
  // 1. Honeypot: campo oculto con nombre plausible. Si viene relleno, éxito falso sin
  // enviar. Sale como `descartado`, no como `enviado`: el bot ve la misma pantalla de
  // "Recibido" pero el formulario no registra la conversión (Google Ads y Meta Lead).
  const honeypot = formData.get('empresa_web')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { estado: 'descartado', errores: {}, resumen: { nombre: '', telefono: '', espacio: '' } }
  }

  // 2. Validación de campos de texto
  const entradas = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === 'string'),
  )
  const analizado = esquema.safeParse(entradas)
  if (!analizado.success) {
    const errores: Record<string, string> = {}
    for (const issue of analizado.error.issues) {
      errores[String(issue.path[0])] = issue.message
    }
    return { estado: 'error', errores }
  }
  const {
    variante,
    nombre,
    telefono,
    email,
    espacio,
    superficie,
    municipio,
    mensaje,
    privacidad,
    evento_id: eventoId,
    marketing_consent: marketingConsent,
    gclid,
    gbraid,
    wbraid,
    fbclid,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    attribution_ts: attributionTs,
    source_page: sourcePage,
  } = analizado.data

  // GDPR defensive check: click identifiers must never be forwarded — to Meta CAPI,
  // the email/Telegram notice, or anywhere else — without marketing consent, even if
  // a tampered client request submits them anyway (the primary gate is client-side,
  // see FormularioPresupuesto.tsx).
  const marketingConsentGranted = marketingConsent === 'aceptado'
  const gclidSeguro = marketingConsentGranted ? gclid : ''
  const gbraidSeguro = marketingConsentGranted ? gbraid : ''
  const wbraidSeguro = marketingConsentGranted ? wbraid : ''
  const fbclidSeguro = marketingConsentGranted ? fbclid : ''

  // "Origen" block for the email/Telegram notice: only the attribution fields present.
  const attributionLine = [
    gclidSeguro && `gclid=${gclidSeguro}`,
    gbraidSeguro && `gbraid=${gbraidSeguro}`,
    wbraidSeguro && `wbraid=${wbraidSeguro}`,
    fbclidSeguro && `fbclid=${fbclidSeguro}`,
    utm_source && `utm_source=${utm_source}`,
    utm_medium && `utm_medium=${utm_medium}`,
    utm_campaign && `utm_campaign=${utm_campaign}`,
    utm_term && `utm_term=${utm_term}`,
    utm_content && `utm_content=${utm_content}`,
  ]
    .filter(Boolean)
    .join(' · ')

  const errores: Record<string, string> = {}
  if (variante === 'completo' && !municipio) errores.municipio = 'Dinos el municipio de la obra.'
  // La casilla existe en las dos variantes y el formulario lleva `noValidate`:
  // la única comprobación real es esta.
  if (!privacidad) errores.privacidad = 'Necesitamos que aceptes la política de privacidad.'

  // 3. Foto opcional: JPG o PNG, hasta 4 MB
  const foto = formData.get('foto')
  let adjunto: { filename: string; content: string } | undefined
  if (foto instanceof File && foto.size > 0) {
    if (!FOTO_TIPOS.includes(foto.type)) errores.foto = 'La foto tiene que ser JPG o PNG.'
    else if (foto.size > FOTO_MAX_BYTES) errores.foto = 'La foto pesa más de 4 MB.'
    else adjunto = { filename: foto.name, content: Buffer.from(await foto.arrayBuffer()).toString('base64') }
  }
  if (Object.keys(errores).length) return { estado: 'error', errores }

  // 4. Límite por IP
  const listaCabeceras = await headers()
  const ip = listaCabeceras.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonimo'
  if (!limitePorIp(ip)) {
    return { estado: 'error', errores: { form: `Demasiados envíos seguidos. Llámanos al ${nap.telefono}.` } }
  }

  // 5. Entrega del aviso. Hay dos vías posibles: email (Resend) y Telegram. Basta con
  // que una entregue. Si ninguna estaba configurada, o todas fallan, el lead se ha
  // perdido: se devuelve error para que la persona pueda llamar en vez de darlo por hecho.
  let entregado = false

  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (apiKey) {
    try {
      const respuesta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `${nap.nombre} <presupuesto@${new URL(sitio.url).hostname}>`,
          to: nap.email,
          reply_to: email || undefined,
          subject: `Presupuesto — ${nombre} · ${espacio}${municipio ? ` · ${municipio}` : ''}`,
          text: [
            `Nombre: ${nombre}`,
            `Teléfono: ${formatearTelefono(telefono)}`,
            `Email: ${email || '—'}`,
            `Espacio: ${espacio}`,
            `Superficie: ${superficie ? `${superficie} m²` : '—'}`,
            `Municipio: ${municipio || '—'}`,
            `Mensaje: ${mensaje || '—'}`,
            `Foto: ${adjunto ? adjunto.filename : '—'}`,
            attributionLine ? `Origen: ${attributionLine}` : null,
          ]
            .filter((l): l is string => Boolean(l))
            .join('\n'),
          attachments: adjunto ? [adjunto] : undefined,
        }),
        signal: AbortSignal.timeout(15000),
      })
      if (!respuesta.ok) throw new Error(`Resend ${respuesta.status}`)
      entregado = true
    } catch {
      // No se corta aquí: puede que Telegram sí entregue.
    }
  }

  // 6. Aviso por Telegram (si hay credenciales). Cuenta como entrega solo si Telegram
  // confirma con 2xx. La foto solo viaja por email: si el email no salió, el aviso
  // lo dice en vez de dar a entender que está en algún sitio.
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const telegramChat = process.env.TELEGRAM_CHAT_ID?.trim()
  if (telegramToken && telegramChat) {
    try {
      const respuesta = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChat,
          text: capTelegramText(
            [
              '🔔 Nuevo presupuesto',
              `${nombre} · ${formatearTelefono(telefono)}`,
              email || null,
              espacio,
              superficie ? `${superficie} m²` : null,
              municipio || '—',
              mensaje || null,
              adjunto
                ? `Foto: ${adjunto.filename}${entregado ? ' — adjunta en el email' : ' — SIN ENTREGAR: el email no ha salido'}`
                : null,
            ].filter((l): l is string => Boolean(l)),
            attributionLine,
          ),
        }),
        signal: AbortSignal.timeout(8000),
      })
      if (respuesta.ok) entregado = true
    } catch {
      // Igual que arriba: solo es un fallo si tampoco entregó la otra vía.
    }
  }

  if (!entregado) {
    return {
      estado: 'error',
      errores: { form: `No hemos podido enviarlo. Llámanos al ${nap.telefono}.` },
    }
  }

  // 7. Meta CAPI, deduplicado con el Pixel por evento_id
  // Gated on marketing consent, read at submit time (see FormularioPresupuesto.tsx).
  // Without consent the lead is still delivered by email/Telegram, but no event is sent to Meta.
  if (marketingConsent === 'aceptado') {
    const listaCookies = await cookies()
    await enviarEventoCAPI({
      eventoId,
      telefono,
      email: email || undefined,
      ip,
      userAgent: listaCabeceras.get('user-agent') ?? '',
      url: `${sitio.url}${sourcePage}`,
      fbp: listaCookies.get('_fbp')?.value,
      // No _fbc cookie (Pixel blocked, third-party cookies restricted...):
      // rebuild it from the fbclid captured on landing.
      fbc: listaCookies.get('_fbc')?.value ?? buildFbc(fbclidSeguro, attributionTs),
    })
  }

  return {
    estado: 'enviado',
    errores: {},
    resumen: {
      nombre,
      telefono: formatearTelefono(telefono),
      espacio,
      superficie: superficie || undefined,
      municipio: municipio || undefined,
    },
  }
}
