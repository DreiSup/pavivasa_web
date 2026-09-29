import { aiServicio } from '@/lib/ai'
import { ORDEN_SERVICIOS, type ServicioId } from '@/lib/tipos'
import { texto } from '@/lib/respuesta-texto'

export const dynamic = 'force-static'
export const dynamicParams = false

export const generateStaticParams = () => ORDEN_SERVICIOS.map((id) => ({ archivo: `${id}.md` }))

export async function GET(_: Request, { params }: { params: Promise<{ archivo: string }> }) {
  const { archivo } = await params
  const id = archivo.replace(/\.md$/, '') as ServicioId
  return ORDEN_SERVICIOS.includes(id) ? texto(aiServicio(id)) : texto('No encontrado', 404)
}
