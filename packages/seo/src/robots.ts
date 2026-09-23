export type RobotsRules = {
  rules: { userAgent: string; allow: string }[]
  sitemap: string
}

// §7 of arquitectura-plantilla-monorepo.md requires these named explicitly
// (user's decision, 2026-09-15), not just left unblocked by the `*` catch-all.
// Per RFC 9309 §2.2.1, a crawler with its own `User-agent` group ignores `*`
// entirely — today that's equivalent to the catch-all below since neither has
// a Disallow, but if `*` ever gains one, mirror it in each of these groups too.
const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot']

export function buildRobots(siteUrl: string): RobotsRules {
  return {
    rules: [{ userAgent: '*', allow: '/' }, ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' }))],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
