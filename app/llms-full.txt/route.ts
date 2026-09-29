import { llmsFullTxt } from '@/lib/ai'
import { texto } from '@/lib/respuesta-texto'

export const dynamic = 'force-static'

export const GET = () => texto(llmsFullTxt())
