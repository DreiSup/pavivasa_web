// JSON-LD validation for one page's combined set of <script type=
// "application/ld+json"> blocks (this codebase emits one script per block —
// business, service, breadcrumbs, article, FAQ — not one @graph; see
// apps/web/src/lib/schema.tsx). Everything here is plain-object graph
// walking, no schema.org SDK.

const FORBIDDEN_TYPES = new Set(['AggregateRating', 'Review'])

function typesOf(node) {
  if (!node || typeof node !== 'object') return []
  const t = node['@type']
  if (!t) return []
  return Array.isArray(t) ? t : [t]
}

function isReference(node) {
  // A plain `{ "@id": "..." }` link to another node, vs. a node defined here.
  return node && typeof node === 'object' && !Array.isArray(node) && '@id' in node && Object.keys(node).length === 1
}

/** Walks a parsed JSON-LD value, calling `visit(node)` for every object encountered. */
function walk(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit)
    return
  }
  if (value && typeof value === 'object') {
    visit(value)
    for (const key of Object.keys(value)) walk(value[key], visit)
  }
}

function checkRequiredFields(node, errors) {
  const types = typesOf(node)
  const isBusiness = types.some((t) => /Business$/.test(t) || t === 'LocalBusiness')
  if (isBusiness) {
    for (const field of ['name', 'url', 'telephone', 'address']) {
      if (node[field] === undefined || node[field] === null || node[field] === '') {
        errors.push({ code: 'missing-required-field', message: `${types.join('/')} node missing required field "${field}"` })
      }
    }
  }
  if (types.includes('Service')) {
    if (!node.name && !node.serviceType) errors.push({ code: 'missing-required-field', message: 'Service node missing "name"/"serviceType"' })
    if (!node.provider) errors.push({ code: 'missing-required-field', message: 'Service node missing "provider"' })
  }
  if (types.includes('BlogPosting')) {
    for (const field of ['headline', 'datePublished']) {
      if (!node[field]) errors.push({ code: 'missing-required-field', message: `BlogPosting node missing required field "${field}"` })
    }
    if (!node.mainEntityOfPage && !node.url) {
      errors.push({ code: 'missing-required-field', message: 'BlogPosting node missing "mainEntityOfPage"/"url"' })
    }
  }
  if (types.includes('BreadcrumbList')) {
    const items = Array.isArray(node.itemListElement) ? node.itemListElement : []
    if (items.length === 0) {
      errors.push({ code: 'breadcrumb-empty', message: 'BreadcrumbList node has no itemListElement' })
    } else {
      items.forEach((item, i) => {
        if (item.position !== i + 1) {
          errors.push({
            code: 'breadcrumb-position',
            message: `BreadcrumbList position out of sequence at index ${i} (got ${item.position}, expected ${i + 1})`,
          })
        }
        if (!item.name) errors.push({ code: 'breadcrumb-missing-name', message: `BreadcrumbList item ${i + 1} missing "name"` })
        const isLast = i === items.length - 1
        if (!isLast && !item.item) {
          errors.push({ code: 'breadcrumb-missing-item', message: `BreadcrumbList item ${i + 1} missing "item" (required on all but the last)` })
        }
      })
    }
  }
}

/**
 * Validates every ld+json script body found on one page.
 * @param {string[]} bodies raw script text, one per <script type="application/ld+json">.
 * @returns {{ errors: string[] }}
 */
export function validatePageJsonLd(bodies) {
  const errors = []
  const definedIds = new Set()
  const referencedIds = new Set()

  const parsed = []
  bodies.forEach((body, i) => {
    try {
      parsed.push(JSON.parse(body))
    } catch (err) {
      errors.push({ code: 'invalid-json', message: `script #${i + 1} is not valid JSON: ${err.message}` })
    }
  })

  for (const doc of parsed) {
    walk(doc, (node) => {
      if (isReference(node)) {
        referencedIds.add(node['@id'])
        return
      }
      if (typeof node['@id'] === 'string') definedIds.add(node['@id'])
      for (const type of typesOf(node)) {
        if (FORBIDDEN_TYPES.has(type)) errors.push({ code: 'forbidden-type', message: `forbidden type "${type}" present` })
      }
      checkRequiredFields(node, errors)
    })
  }

  for (const id of referencedIds) {
    if (!definedIds.has(id)) {
      errors.push({ code: 'unresolved-id', message: `@id reference "${id}" does not resolve to any node defined on the page` })
    }
  }

  return { errors }
}
