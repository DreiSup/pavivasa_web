// (j) Indexable page count sanity check: the number of indexable prerendered
// pages must be at least what @site/content should produce (never zero, and
// never below the sum of static routes + services + projects + articles,
// minus the routes documented as intentionally noindex) — an independent
// cross-check against a second source of truth, so a build that silently
// drops a whole content collection (a broken `generateStaticParams`, an
// empty `.next` from a failed step upstream…) fails loudly here even if
// every OTHER check above happens to have nothing to complain about.
//
// Reads `@site/content` through the same query functions the app's
// `generateStaticParams` calls (`getServices`/`getProjects`/`getArticles`,
// locale 'es') — not `data/*.ts` directly — so an item with no 'es'
// translation is excluded here exactly like it would be from the real
// build, never over-counted.
//
// This script runs on Node's native TypeScript support (see package.json's
// `verify` script: `node --experimental-strip-types`), the same mechanism
// `content:validate`/`check-env` use, because these imports pull in `.ts`
// source directly — plain `node` without that flag cannot load them.
import { getServices } from '../../../packages/content/src/queries/services.ts'
import { getProjects } from '../../../packages/content/src/queries/projects.ts'
import { getArticles } from '../../../packages/content/src/queries/articles.ts'

// Static routes: the `apps/web/src/app/**` pages that don't come from a
// @site/content collection — frozen for this migration phase (CLAUDE.md's
// "Frontend congelado"), so this list only changes if a route is
// deliberately added/removed there. Kept as an explicit list of paths, not
// a bare number, so that intentional change is a visible one-line diff here
// too, not a silently-adjusted magic constant.
const STATIC_ROUTES = [
  '/',
  '/empresa/',
  '/presupuesto/',
  '/proyectos/',
  '/blog/',
  '/aviso-legal/',
  '/politica-de-cookies/',
  '/politica-de-privacidad/',
]

// Routes documented as intentionally noindex — see this package's own
// README.md, "How pages and noindex are determined". Kept in sync by hand:
// a future deliberate noindex route needs adding here too, or this check
// will demand more indexable pages than the build can ever produce.
const DOCUMENTED_NOINDEX_ROUTES = [
  '/blog/hormigon-desactivado-piedra-vista/', // X-Robots-Tag header (next.config.ts)
  '/aviso-legal/', // <meta name="robots" content="noindex">
  '/politica-de-cookies/',
  '/politica-de-privacidad/',
]

export function checkPageCount({ pages, reporter }) {
  reporter.startCheck('(j) indexable page count: at least what @site/content should produce')

  const services = getServices('es')
  const projects = getProjects('es')
  const articles = getArticles('es')

  const expectedTotal = STATIC_ROUTES.length + services.length + projects.length + articles.length
  const expectedIndexable = expectedTotal - DOCUMENTED_NOINDEX_ROUTES.length
  const breakdown = `static ${STATIC_ROUTES.length} + services ${services.length} + projects ${projects.length} + articles ${articles.length} − documented noindex ${DOCUMENTED_NOINDEX_ROUTES.length}`

  const actualIndexable = pages.filter((p) => !p.noindex).length

  if (actualIndexable === 0) {
    reporter.report({
      check: 'build',
      code: 'no-indexable-pages',
      route: null,
      message: `0 indexable pages in the build (${pages.length} total prerendered) — expected ${expectedIndexable} (${breakdown})`,
    })
  } else if (actualIndexable < expectedIndexable) {
    reporter.report({
      check: 'build',
      code: 'page-count-below-expected',
      route: null,
      message: `only ${actualIndexable} indexable page(s) in the build, expected at least ${expectedIndexable} (${breakdown}); ${pages.length} total prerendered pages`,
    })
  }

  reporter.endCheck()
}
