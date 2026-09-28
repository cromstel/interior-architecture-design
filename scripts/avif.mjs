/**
 * AVIF encoder used by the image pipeline.
 *
 * The site ships AVIF only, so this is a library rather than a command: the
 * JPEG originals are optional working sources that `fetch-images.mjs`
 * downloads, encodes, and then does not keep. Once encoded, the .avif files
 * are the source of truth and there is nothing left to convert.
 *
 * Re-encoding an already-lossy AVIF to "improve" it compounds artefacts, so
 * the maintenance entry point for existing files is `shrink-oversized-avif.mjs`,
 * not this module.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Default source/target root. */
export const imagesDir = join(root, 'public', 'images')

/** Folders left as JPEG: social crawlers do not reliably render AVIF. */
const SKIP_DIRS = new Set(['og'])

const JPG_RE = /\.jpe?g$/i

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(p, acc)
    } else if (JPG_RE.test(entry.name)) {
      acc.push(p)
    }
  }
  return acc
}

/**
 * Encodes every JPEG under `dir` to an AVIF sibling and reports the byte delta.
 * The JPEG is left in place — callers decide whether to keep it.
 */
export async function convertToAVIF({ dir = imagesDir, quality = 65, effort = 2 } = {}) {
  const files = walk(dir)
  let before = 0
  let after = 0

  for (const file of files) {
    const out = file.replace(JPG_RE, '.avif')
    const buf = readFileSync(file)
    const avif = await sharp(buf).avif({ quality, effort }).toBuffer()
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, avif)
    before += buf.length
    after += avif.length
  }

  return { converted: files.length, saved: before - after }
}
