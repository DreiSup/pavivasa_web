/**
 * `@site/content` — the single read API for the business's facts (§4 of
 * `arquitectura-plantilla-monorepo.md`). Everything here is safe to import
 * from anywhere, including client-reachable code: no zod runtime, no
 * validation side effects. Validation happens once, in
 * `scripts/validate.ts` (the `content:validate` task) — see this package's
 * README.
 */
export * from './queries/index.ts'
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
  ExecutionSpecSheet,
  ExecutionSpecList,
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
