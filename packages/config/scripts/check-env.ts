/**
 * `check-env` — parses `@site/config`'s public and server environment
 * shapes with Zod and reports malformed values before the app builds.
 * Companion to `packages/content/scripts/validate.ts`'s `content:validate`
 * (same reasoning: runs once, here, not on every `env.ts`/`server.ts`
 * import — see those files' and `env.schema.ts`'s comments for why the zod
 * runtime is kept out of that client-reachable graph).
 *
 * Runs on Node's native TypeScript support, like `content:validate` — every
 * import below is relative with an explicit `.ts` extension, and this file
 * sticks to erasable TypeScript syntax only.
 *
 * Wired as `apps/web`'s `prebuild` script (see its `package.json`), so it
 * runs before `next build` regardless of how that's invoked — directly
 * (`pnpm --filter web build`, the deterministic build command) or through
 * `turbo run build`. pnpm/npm run pre<script> hooks automatically before
 * <script>; see pnpm's docs on `enable-pre-post-scripts` (on by default).
 *
 * Limitation: this is a plain `node` process, so — unlike `next build`
 * itself — it does NOT read `.env*` files (`@next/env`'s job, and adding
 * that dependency here just for this felt like overkill — see the phase
 * report's "problems"/"questions"). It only sees real process env vars.
 * On Vercel that's exactly what `next build` sees too (dashboard env vars
 * are real process env, not files); the gap is a local build relying on
 * `.env.local`/`.env.production` for one of the vars checked below.
 */
import { z } from 'zod'

import { PublicEnvSchema } from '../src/env.schema.ts'
import { publicEnv } from '../src/env.ts'
import { ServerEnvSchema } from '../src/server-env.schema.ts'
import { serverEnv } from '../src/server.ts'

const errors: string[] = []

function zodIssues(label: string, result: z.SafeParseReturnType<unknown, unknown>) {
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`${label}: ${issue.path.join('.') || '(root)'} — ${issue.message}`)
    }
  }
}

zodIssues('public env', PublicEnvSchema.safeParse(publicEnv))
// Never echoes a value here: these are secrets, and a malformed one is
// still a secret.
zodIssues('server env', ServerEnvSchema.safeParse(serverEnv))

/**
 * §9 of `arquitectura-plantilla-monorepo.md` asks for a production build to
 * fail when `NEXT_PUBLIC_SITE_URL` is unset (`site.ts` would otherwise
 * silently publish canonical URLs, the sitemap and JSON-LD under the
 * hardcoded `https://pavivasa.com` fallback). Pending the user's decision,
 * this WARNS loudly instead of failing the build. One-line switch to make
 * it fail instead: flip this constant to `true`.
 */
const FAIL_IF_SITE_URL_MISSING_IN_PRODUCTION = false

if (process.env.VERCEL_ENV === 'production' && !publicEnv.NEXT_PUBLIC_SITE_URL) {
  const message =
    'check-env — NEXT_PUBLIC_SITE_URL is unset in a production deployment. ' +
    'Falling back to the hardcoded default in @site/config/site.ts: canonical ' +
    'URLs, the sitemap and JSON-LD will publish under that host instead of the ' +
    'real one. Set NEXT_PUBLIC_SITE_URL in the Vercel project settings.'
  if (FAIL_IF_SITE_URL_MISSING_IN_PRODUCTION) {
    errors.push(message)
  } else {
    console.warn(`\n⚠ ${message}\n`)
  }
}

if (errors.length > 0) {
  console.error(`check-env — ${errors.length} problem(s):\n`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}

console.log('check-env — OK')
