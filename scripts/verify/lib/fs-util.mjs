// Small filesystem helpers shared by the verify scripts. No project-specific
// assumptions here — see lib/manifest.mjs for anything Next.js-shaped.
import { promises as fs } from 'node:fs'

export async function pathExists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

export async function readJSON(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

export async function readJSONIfExists(filePath, fallback = null) {
  if (!(await pathExists(filePath))) return fallback
  return readJSON(filePath)
}

export async function readTextIfExists(filePath, fallback = '') {
  if (!(await pathExists(filePath))) return fallback
  return fs.readFile(filePath, 'utf8')
}
