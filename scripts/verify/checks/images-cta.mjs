// (g) every <img> has non-empty alt (decorative images must use alt=""
// explicitly — reported as info, not a failure), and width/height or a
// `fill` container (next/image's data-nimg="fill").
// (h) tel:/wa.me links present on every page (conversion CTA).
export function checkImagesAndCta({ pages, reporter }) {
  reporter.startCheck('(g) images: alt present, dimensions or fill · (h) tel:/wa.me CTA present')

  for (const page of pages) {
    const { publicPath, parsed } = page

    parsed.images.forEach((img, i) => {
      const label = img.src ? img.src.slice(0, 80) : `image #${i + 1}`
      if (img.alt === undefined) {
        reporter.report({ check: 'images', code: 'missing-alt', route: publicPath, message: `<img> has no alt attribute at all (${label})` })
      } else if (img.alt === '') {
        reporter.info(`[images:decorative] ${publicPath} — alt="" (decorative) on ${label}`)
      }
      const hasFill = img['data-nimg'] === 'fill'
      const hasDims = Boolean(img.width) && Boolean(img.height)
      if (!hasFill && !hasDims) {
        reporter.report({
          check: 'images',
          code: 'missing-dimensions',
          route: publicPath,
          message: `<img> has neither width+height nor a fill container (${label})`,
        })
      }
    })

    const hasTel = parsed.links.some((l) => (l.href || '').startsWith('tel:'))
    const hasWhatsapp = parsed.links.some((l) => /wa\.me\//.test(l.href || ''))
    if (!hasTel) {
      reporter.report({ check: 'cta', code: 'missing-tel', route: publicPath, message: 'no tel: link found on the page' })
    }
    if (!hasWhatsapp) {
      reporter.report({ check: 'cta', code: 'missing-whatsapp', route: publicPath, message: 'no wa.me link found on the page' })
    }
  }

  reporter.endCheck()
}
