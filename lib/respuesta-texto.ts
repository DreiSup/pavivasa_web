/** Respuesta de texto plano y estática para llms.txt y /ai/*. */
export function texto(cuerpo: string, status = 200) {
  return new Response(cuerpo, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
