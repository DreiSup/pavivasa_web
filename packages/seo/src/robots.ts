export type RobotsRules = {
  rules: { userAgent: string; allow: string }[]
  sitemap: string
}

export function buildRobots(siteUrl: string): RobotsRules {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
