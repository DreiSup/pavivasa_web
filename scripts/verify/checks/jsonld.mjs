// (d) JSON-LD: every <script type="application/ld+json"> parses; no
// AggregateRating/Review types; every @id reference resolves to a node
// defined on the page; required fields present for LocalBusiness-type,
// Service, BreadcrumbList (positions consecutive, item on all but last),
// BlogPosting.
import { validatePageJsonLd } from '../lib/jsonld.mjs'

export function checkJsonLd({ pages, reporter }) {
  reporter.startCheck('(d) JSON-LD: valid, no AggregateRating/Review, @id resolves, required fields')

  for (const page of pages) {
    const { publicPath, parsed } = page
    if (parsed.jsonLdBodies.length === 0) {
      reporter.report({ check: 'jsonld', code: 'no-jsonld', route: publicPath, message: 'page has no JSON-LD at all' })
      continue
    }
    const { errors } = validatePageJsonLd(parsed.jsonLdBodies)
    for (const e of errors) {
      reporter.report({ check: 'jsonld', code: e.code, route: publicPath, message: e.message })
    }
  }

  reporter.endCheck()
}
