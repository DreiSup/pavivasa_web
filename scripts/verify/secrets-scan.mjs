#!/usr/bin/env node
// scripts/verify/secrets-scan.mjs [appDir]
//
// (i) no server secret VALUES or NAMES in apps/web/.next/static (the client
// JS/CSS bundle) OR apps/web/.next/server/app (the prerendered HTML/RSC
// output Next.js actually serves to every visitor) when built with
// sentinel secrets. Separate from index.mjs's `pnpm verify` on purpose: it
// needs a build made with fake, CI-only sentinel values for the
// server-only env vars (see packages/config/src/server-env.schema.ts) —
// never point this at a build made with real production secrets, since a
// hit is reported by file path only, but the point of sentinels is that a
// leak costs nothing to detect and log.
//
// Usage (CI): set sentinel values for the server-env vars, build, then:
//   node scripts/verify/secrets-scan.mjs apps/web
//
// The var NAMES are read straight out of server-env.schema.ts (regex, not a
// TS import — this script runs under plain `node`) so this list can't drift
// from the schema that actually defines "a server secret" in this repo.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import { loadKnownIssues, Reporter } from './lib/reporter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')

// Extensions to scan under .next/static (the client JS/CSS bundle).
const BUNDLE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.css', '.json', '.map', '.txt', '.html'])
// Extensions to scan under .next/server/app — deliberately NOT `.js`/`.json`:
// that directory also holds compiled server wiring (page.js, route.js,
// *_client-reference-manifest.js, *.nft.json) which legitimately reads
// server secrets by name and is never sent to a browser. Only these four
// are the prerendered output Next.js actually serves on a page load or
// client-side navigation.
const RENDERED_EXTENSIONS = new Set(['.html', '.rsc', '.meta', '.body'])
const MIN_SECRET_LENGTH = 6 // shorter values risk false positives in minified code and aren't worth flagging

async function serverEnvVarNames() {
  const schemaPath = path.join(repoRoot, 'packages/config/src/server-env.schema.ts')
  const text = await fs.readFile(schemaPath, 'utf8')
  const names = [...text.matchAll(/^\s*([A-Z][A-Z0-9_]*):\s*z\./gm)].map((m) => m[1])
  if (names.length === 0) throw new Error(`Found no server env var names in ${schemaPath} — schema shape changed?`)
  return names
}

async function walk(dir, extensions) {
  const out = []
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch (err) {
    if (err.code === 'ENOENT') return out
    throw err
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full, extensions)))
    else if (extensions.has(path.extname(entry.name))) out.push(full)
  }
  return out
}

function parseArgs(argv) {
  const args = { appDir: null, nextDir: null }
  const positional = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--next-dir') args.nextDir = argv[++i]
    else positional.push(argv[i])
  }
  args.appDir = positional[0] ?? null
  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const appDir = path.resolve(repoRoot, args.appDir ?? 'apps/web')
  const nextDir = args.nextDir ? path.resolve(process.cwd(), args.nextDir) : path.join(appDir, '.next')
  const staticDir = path.join(nextDir, 'static')
  const serverAppDir = path.join(nextDir, 'server', 'app')

  const names = await serverEnvVarNames()
  const needles = [] // { kind: 'name' | 'value', varName, text }
  for (const name of names) needles.push({ kind: 'name', varName: name, text: name })
  for (const name of names) {
    const value = process.env[name]?.trim()
    if (value && value.length >= MIN_SECRET_LENGTH) needles.push({ kind: 'value', varName: name, text: value })
  }

  if (needles.filter((n) => n.kind === 'value').length === 0) {
    console.warn(
      `secrets-scan: none of [${names.join(', ')}] are set in the current environment with a value >= ${MIN_SECRET_LENGTH} chars.\n` +
        'Set sentinel values for all of them before building, then run this scan — otherwise only the NAME check runs.',
    )
  }

  const files = [
    ...(await walk(staticDir, BUNDLE_EXTENSIONS)).map((file) => ({ file, surface: 'bundle' })),
    ...(await walk(serverAppDir, RENDERED_EXTENSIONS)).map((file) => ({ file, surface: 'rendered' })),
  ]
  console.log(`secrets-scan: scanning ${files.length} file(s) under ${staticDir} and ${serverAppDir}`)

  const hits = []
  for (const { file, surface } of files) {
    const content = await fs.readFile(file, 'utf8')
    for (const needle of needles) {
      if (content.includes(needle.text)) {
        hits.push({ file: path.relative(repoRoot, file), varName: needle.varName, kind: needle.kind, surface })
      }
    }
  }

  const knownIssues = await loadKnownIssues(path.join(__dirname, 'known-issues.json'))
  const reporter = new Reporter(knownIssues, ['secrets'])
  for (const h of hits) {
    // `route` is repurposed as "which var" here — secrets don't have a page route,
    // and the baseline key only needs to be a stable (check, code, identifier) triple.
    // `surface` distinguishes a hit in the client bundle from one in prerendered
    // HTML/RSC output, so baselining one surface's leak of a var never silently
    // allows the same var leaking on the other surface too.
    const code = `${h.surface === 'rendered' ? 'rendered-' : ''}${h.kind}-leak`
    reporter.report({ check: 'secrets', code, route: h.varName, message: `leaked into ${h.file}` })
  }
  reporter.print()
  process.exit(reporter.exitCode)
}

main().catch((err) => {
  console.error(err);
  process.exit(1)
})
