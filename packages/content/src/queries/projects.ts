import { projects } from '../data/projects.ts'
import type { ServiceId } from '../schemas/service.ts'
import type { ExecutionSpecs, Project } from '../schemas/project.ts'
import { pickLocalized, pickLocalizedList, resolveImage } from './resolve.ts'
import type { Locale, ResolvedImage } from './resolve.ts'

export type ResolvedExecutionSpecs = {
  concrete?: string
  thickness?: string
  aggregate?: string
  mesh?: string
  fiber?: string
  colorDosage?: string
  expansionJoints?: string
  finish?: string
}

export type ResolvedProject = {
  slug: string
  title: string
  longTitle: string
  service: ServiceId
  town: string
  province: 'Alicante' | 'Valencia'
  district?: string
  spaceType: string
  model?: string
  color?: string
  surfaceArea?: number
  photoYear?: number
  executionSpecs: ResolvedExecutionSpecs
  brief: string[]
  execution: string[]
  images: ResolvedImage[]
  featured: boolean
}

/** Only includes a key when the source data has it — see `resolveImage`'s comment on why. */
function resolveExecutionSpecs(specs: ExecutionSpecs, locale: Locale): ResolvedExecutionSpecs {
  const result: ResolvedExecutionSpecs = {}
  const concrete = pickLocalized(specs.concrete, locale)
  const thickness = pickLocalized(specs.thickness, locale)
  const aggregate = pickLocalized(specs.aggregate, locale)
  const mesh = pickLocalized(specs.mesh, locale)
  const fiber = pickLocalized(specs.fiber, locale)
  const colorDosage = pickLocalized(specs.colorDosage, locale)
  const expansionJoints = pickLocalized(specs.expansionJoints, locale)
  const finish = pickLocalized(specs.finish, locale)
  if (concrete !== undefined) result.concrete = concrete
  if (thickness !== undefined) result.thickness = thickness
  if (aggregate !== undefined) result.aggregate = aggregate
  if (mesh !== undefined) result.mesh = mesh
  if (fiber !== undefined) result.fiber = fiber
  if (colorDosage !== undefined) result.colorDosage = colorDosage
  if (expansionJoints !== undefined) result.expansionJoints = expansionJoints
  if (finish !== undefined) result.finish = finish
  return result
}

function resolveProject(rawProject: (typeof projects)[number], locale: Locale): ResolvedProject | undefined {
  // Widen to the general `Project` shape: individual literals in `projects` (via `as const`)
  // only carry the keys they set, so e.g. `.model` isn't valid on every union member directly.
  const project: Project = rawProject
  const slug = pickLocalized(project.slug, locale)
  const title = pickLocalized(project.title, locale)
  if (slug === undefined || title === undefined) return undefined

  const model = pickLocalized(project.model, locale)
  const color = pickLocalized(project.color, locale)

  return {
    slug,
    title,
    longTitle: pickLocalized(project.longTitle, locale) ?? title,
    service: project.service,
    town: project.town,
    province: project.province,
    ...('district' in project ? { district: project.district } : {}),
    spaceType: pickLocalized(project.spaceType, locale) ?? '',
    ...(model !== undefined ? { model } : {}),
    ...(color !== undefined ? { color } : {}),
    ...('surfaceArea' in project ? { surfaceArea: project.surfaceArea } : {}),
    ...('photoYear' in project ? { photoYear: project.photoYear } : {}),
    executionSpecs: resolveExecutionSpecs(project.executionSpecs, locale),
    brief: pickLocalizedList(project.brief, locale),
    execution: pickLocalizedList(project.execution, locale),
    images: project.images.map((image) => resolveImage(image, locale)),
    featured: project.featured,
  }
}

/** All projects, resolved for `locale`, in their `data/projects.ts` order. */
export function getProjects(locale: Locale): ResolvedProject[] {
  const out: ResolvedProject[] = []
  for (const project of projects) {
    const resolved = resolveProject(project, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getProject(slug: string, locale: Locale): ResolvedProject | undefined {
  // Slugs aren't translated yet (only `es` is filled in): matching on the resolved slug is
  // already correct today and keeps working once other locales get their own slug.
  return getProjects(locale).find((p) => p.slug === slug)
}

export function getProjectsByService(service: ServiceId, locale: Locale, excludeSlug?: string): ResolvedProject[] {
  return getProjects(locale).filter((p) => p.service === service && p.slug !== excludeSlug)
}

export function getFeaturedProjects(locale: Locale): ResolvedProject[] {
  return getProjects(locale).filter((p) => p.featured)
}

/** Same-technique projects for "similar projects". If there aren't `count`, fills the rest with other techniques (in project-list order), same as the site did before. */
export function getSimilarProjects(project: ResolvedProject, locale: Locale, count = 3): ResolvedProject[] {
  const all = getProjects(locale)
  const same = all.filter((p) => p.service === project.service && p.slug !== project.slug)
  if (same.length >= count) return same.slice(0, count)
  const others = all.filter((p) => p.service !== project.service && p.slug !== project.slug)
  return [...same, ...others].slice(0, count)
}

/** Towns with at least one project, in first-appearance order (matches `Array.from(new Set(...))`'s insertion order). */
export function getTownsWithProjects(locale: Locale): string[] {
  return Array.from(new Set(getProjects(locale).map((p) => p.town)))
}
