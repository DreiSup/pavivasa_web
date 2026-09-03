'use server'

import { z } from 'zod'
import { cookies, headers } from 'next/headers'
import { enviarEventoCAPI } from '@/lib/meta-capi'
import { nap, sitio } from '@/lib/config'
import { NOMBRES_ESPACIOS } from '@/content/home'

export type EstadoEnvio = {
  estado: 'inicial' | 'error' | 'enviando' | 'enviado'
  errores: Record<string, string>
  resumen?: { nombre: string; telefono: string; espacio: string; superficie?: string; municipio?: string }
}

const FOTO_MAX_BYTES = 10 * 1024 * 1024
const FOTO_TIPOS = ['image/jpeg', 'image/png']

const esquema = z.object({
  variante: z.enum(['corto', 'completo']).default('completo'),
  nombre: z.string().trim().min(1, 'Escribe tu nombre.'),
  telefono: z
    .string()
    .transform((v) => v.replace(/[\s+.-]/g, '').replace(/^(00)?34/, ''))
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

export async function enviarPresupuesto(_prev: EstadoEnvio, formData: FormData): Promise<EstadoEnvio> {
  // 1. Honeypot: campo oculto con nombre plausible. Si viene relleno, éxito falso sin enviar.
  const honeypot = formData.get('empresa_web')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { estado: 'enviado', errores: {}, resumen: { nombre: '', telefono: '', espacio: '' } }
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
  const { variante, nombre, telefono, email, espacio, superficie, municipio, mensaje, privacidad, evento_id: eventoId } =
    analizado.data

  const errores: Record<string, string> = {}
  if (variante === 'completo' && !municipio) errores.municipio = 'Dinos el municipio de la obra.'
  if (variante === 'completo' && !privacidad) errores.privacidad = 'Necesitamos que aceptes la política de privacidad.'

  // 3. Foto opcional: JPG o PNG, hasta 10 MB
  const foto = formData.get('foto')
  let adjunto: { filename: string; content: string } | undefined
  if (foto instanceof File && foto.size > 0) {
    if (!FOTO_TIPOS.includes(foto.type)) errores.foto = 'La foto tiene que ser JPG o PNG.'
    else if (foto.size > FOTO_MAX_BYTES) errores.foto = 'La foto pesa más de 10 MB.'
    else adjunto = { filename: foto.name, content: Buffer.from(await foto.arrayBuffer()).toString('base64') }
  }
  if (Object.keys(errores).length) return { estado: 'error', errores }

  // 4. Límite por IP
  const listaCabeceras = await headers()
  const ip = listaCabeceras.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonimo'
  if (!limitePorIp(ip)) {
    return { estado: 'error', errores: { form: `Demasiados envíos seguidos. Llámanos al ${nap.telefono}.` } }
  }

  // 5. Email con Resend (si hay clave)
  const apiKey = process.env.RESEND_API_KEY
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
          ].join('\n'),
          attachments: adjunto ? [adjunto] : undefined,
        }),
        signal: AbortSignal.timeout(15000),
      })
      if (!respuesta.ok) throw new Error(`Resend ${respuesta.status}`)
    } catch {
      return {
        estado: 'error',
        errores: { form: `No hemos podido enviarlo. Llámanos al ${nap.telefono}.` },
      }
    }
  }

  // 6. Aviso por Telegram (si hay credenciales)
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChat = process.env.TELEGRAM_CHAT_ID
  if (telegramToken && telegramChat) {
    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChat,
          text: [
            '🔔 Nuevo presupuesto',
            `${nombre} · ${formatearTelefono(telefono)}`,
            espacio,
            superficie ? `${superficie} m²` : null,
            municipio || '—',
          ]
            .filter(Boolean)
            .join('\n'),
        }),
        signal: AbortSignal.timeout(8000),
      })
    } catch {
      // No bloquea el envío por un fallo de Telegram.
    }
  }

  // 7. Meta CAPI, deduplicado con el Pixel por evento_id
  const listaCookies = await cookies()
  await enviarEventoCAPI({
    eventoId,
    telefono,
    email: email || undefined,
    ip,
    userAgent: listaCabeceras.get('user-agent') ?? '',
    url: `${sitio.url}/presupuesto/`,
    fbp: listaCookies.get('_fbp')?.value,
    fbc: listaCookies.get('_fbc')?.value,
  })

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
