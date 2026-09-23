/**
 * `@site/content` — the single read API for the business's facts (§4 of
 * `arquitectura-plantilla-monorepo.md`). Everything here is safe to import
 * from anywhere, including client-reachable code: no zod runtime, no
 * validation side effects. Validation happens once, in
 * `scripts/validate.ts` (the `content:validate` task) — see this package's
 * README.
 */
// Explicit named re-exports, not `export * from './queries/index.ts'`, as a
// precaution: a star export is a plausible thing for a bundler to treat
// more conservatively than named re-exports, which would defeat the point
// of the file splits in `queries/`. Removed at the same time as the fixes
// in README.md's "Client-bundle rule" section, but not re-tested in
// isolation — see that section for what WAS confirmed.

export { getBusiness, resolveBusiness } from './queries/business.ts'
export type { BusinessOverrides, ResolvedBusiness } from './queries/business.ts'
export { getClaims } from './queries/claims.ts'
export type { ResolvedClaims } from './queries/claims.ts'
export { getServices, getService, getServiceCatalog, getServiceSlugMap } from './queries/services.ts'
export type { ResolvedService, ResolvedServiceCatalogEntry } from './queries/services.ts'
export {
  getProjects,
  getProject,
  getProjectsByService,
  getFeaturedProjects,
  getSimilarProjects,
  getTownsWithProjects,
} from './queries/projects.ts'
export type { ResolvedProject, ResolvedExecutionSpecs } from './queries/projects.ts'
export { getArticles, getArticle } from './queries/articles.ts'
export type { ResolvedArticle, ResolvedArticleBlock } from './queries/articles.ts'
export { getHome } from './queries/home.ts'
export type { ResolvedHomeContent } from './queries/home.ts'
export { getSpaceNames } from './queries/space-names.ts'
export type { ResolvedImage, ResolvedQuestion, Locale } from './queries/resolve.ts'

export { pickLocalized, pickLocalizedList, LOCALES } from './schemas/localized.ts'
export type {
  Localized,
  ImageContent,
  Business,
  SocialLink,
  Claims,
  Question,
  ServiceId,
  Service,
  SpecSheet,
  SpecList,
  Project,
  ExecutionSpecs,
  Article,
  ArticleBlock,
  ParagraphBlock,
  HeadingBlock,
  OrderedListBlock,
  ProjectCalloutBlock,
  PendingBlock,
  HomeContent,
  Space,
} from './schemas/index.ts'
