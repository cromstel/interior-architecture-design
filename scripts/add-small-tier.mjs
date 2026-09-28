/**
 * Dev-time generator for the 800w ("small") image tier.
 *
 * The site shipped two candidates, 1200w and 2000w, so a handset at DPR 2 —
 * which needs roughly 800 CSS pixels — still pulled the 1200w file and
 * over-fetched by around 45%. This adds the missing tier from the AVIF files
 * already on disk, so no JPEG originals are needed.
 *
 * Idempotent: existing files are skipped unless --force is passed.
 *
 * Run: `node scripts/add-small-tier.mjs [--force]`
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(root, 'public', 'images')

const WIDTH = 800
const QUALITY = 62
const EFFORT = 3
const force = process.argv.includes('--force')

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else if (entry.name.toLowerCase().endsWith('.avif')) acc.push(p)
  }
  return acc
}

// Only the 1200w bases need a small sibling; `-lg` and `-sm` are skipped.
const bases = walk(imagesDir).filter((f) => {
  const n = f.split('\\').pop()
  return !/-lg\.avif$/i.test(n) && !/-sm\.avif$/i.test(n)
})

let written = 0
let skipped = 0
let before = 0
let after = 0

for (const file of bases) {
  const out = file.replace(/\.avif$/i, '-sm.avif')
  if (!force && statSync(out, { throwIfNoEntry: false })) {
    skipped++
    continue
  }
  const buf = readFileSync(file)
  const small = await sharp(buf)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .avif({ quality: QUALITY, effort: EFFORT })
    .toBuffer()
  writeFileSync(out, small)
  before += buf.length
  after += small.length
  written++
}

console.log(
  `Small tier: ${WIDTH}w q${QUALITY}. Wrote ${written}, skipped ${skipped} existing.`
)
if (written) {
  console.log(
    `Full-size set ${(before / 1024 / 1024).toFixed(2)} MB -> small set ${(after / 1024 / 1024).toFixed(2)} MB.`
  )
}
