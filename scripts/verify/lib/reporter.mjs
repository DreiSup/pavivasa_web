// Collects issues from every check, matches them against the baseline
// allowlist (scripts/verify/known-issues.json), and prints one human report.
import { readJSONIfExists } from './fs-util.mjs'

function keyOf(issue) {
  return `${issue.check}|${issue.code}|${issue.route ?? '(global)'}`
}

export async function loadKnownIssues(filePath) {
  const data = await readJSONIfExists(filePath, { entries: [] })
  const entries = Array.isArray(data.entries) ? data.entries : []
  return new Map(entries.map((e) => [keyOf({ check: e.check, code: e.code, route: e.route }), e]))
}

export class Reporter {
  /**
   * `relevantChecks`: the check names this invocation actually runs (e.g.
   * index.mjs's checks, or just `['secrets']` for secrets-scan.mjs). Baseline
   * entries for OTHER checks are ignored for staleness — they belong to a
   * different script's run, not to "no longer reproducing here".
   */
  constructor(knownIssues, relevantChecks = null) {
    this.knownIssues = knownIssues // Map from loadKnownIssues
    this.relevantChecks = relevantChecks ? new Set(relevantChecks) : null
    this.matchedBaselineKeys = new Set()
    this.newIssues = []
    this.baselineHits = []
    this.checkSummaries = []
    this.infoNotes = []
  }

  info(note) {
    this.infoNotes.push(note)
  }

  /** issue: { check, code, route, message } — route is a public path or null for a site-wide issue. */
  report(issue) {
    const key = keyOf(issue)
    const baseline = this.knownIssues.get(key)
    if (baseline) {
      this.matchedBaselineKeys.add(key)
      this.baselineHits.push({ ...issue, reason: baseline.reason })
    } else {
      this.newIssues.push(issue)
    }
  }

  startCheck(name) {
    this._currentCheck = { name, count: 0 }
  }

  endCheck() {
    this.checkSummaries.push(this._currentCheck)
  }

  print() {
    console.log('\n=== verify report ===\n')
    for (const summary of this.checkSummaries) {
      console.log(`  ${summary.name}`)
    }

    if (this.baselineHits.length > 0) {
      console.log(`\n-- ${this.baselineHits.length} known pre-existing issue(s), allowed by scripts/verify/known-issues.json --`)
      for (const i of this.baselineHits) {
        console.log(`  [baseline] [${i.check}:${i.code}] ${i.route ?? '(global)'} — ${i.message} (reason: ${i.reason})`)
      }
    }

    const staleKeys = [...this.knownIssues.keys()].filter((k) => {
      if (this.matchedBaselineKeys.has(k)) return false
      if (this.relevantChecks && !this.relevantChecks.has(k.split('|')[0])) return false
      return true
    })
    if (staleKeys.length > 0) {
      console.log(`\n-- ${staleKeys.length} stale baseline entr(y/ies) — no longer reproducing, safe to remove --`)
      for (const k of staleKeys) console.log(`  [stale] ${k}`)
    }

    if (this.newIssues.length > 0) {
      console.log(`\n-- ${this.newIssues.length} FAILING issue(s) --`)
      for (const i of this.newIssues) {
        console.log(`  [FAIL] [${i.check}:${i.code}] ${i.route ?? '(global)'} — ${i.message}`)
      }
    }

    if (this.infoNotes.length > 0) {
      console.log(`\n-- ${this.infoNotes.length} informational note(s) (not failures) --`)
      for (const n of this.infoNotes) console.log(`  ${n}`)
    }

    console.log(`\nTotal: ${this.newIssues.length} failing, ${this.baselineHits.length} baseline-allowed, ${staleKeys.length} stale baseline entries.\n`)
  }

  get exitCode() {
    return this.newIssues.length > 0 ? 1 : 0
  }
}
