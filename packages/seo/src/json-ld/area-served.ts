/**
 * `areaServed` published on the local-business/service nodes: only the
 * provinces actually backed by real project photos, not every province the
 * visible copy declares as coverage (see `@site/content`'s
 * `claims.declaredProvinces` and its own comment on that gap).
 *
 * Ordered by `declaredOrder` first (this site's own canonical province
 * order, already used for the visible "coverage" text), then any project
 * province `declaredOrder` doesn't mention, in first-appearance order — so
 * a province a real project uses is never silently dropped just because
 * nobody added it to the declared list.
 */
export function deriveAreaServed(projectProvinces: readonly string[], declaredOrder: readonly string[]): string[] {
  const present = new Set(projectProvinces)
  const ordered = declaredOrder.filter((province) => present.has(province))
  const remaining: string[] = []
  const seen = new Set<string>()
  for (const province of projectProvinces) {
    if (declaredOrder.includes(province) || seen.has(province)) continue
    seen.add(province)
    remaining.push(province)
  }
  return [...ordered, ...remaining]
}
