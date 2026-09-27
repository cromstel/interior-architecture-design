/**
 * Dev-time image re-encoder for oversized AVIF assets.
 *
 * The 2400px `-lg` variants of texture-heavy photographs (foliage, stone)
 * encoded very large at quality 65 — the largest was 1.5 MB, which dominated
 * LCP on those pages. This caps those files at 2000px wide and re-encodes at a
 * slightly lower quality, which keeps them visually equivalent at any real
 * display size while cutting transferred bytes substantially.
 *
 * Run: `node scripts/shrink-oversized-avif.mjs`
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(root, 'public', 'images')

const THRESHOLD = 400 * 1024 // only touch files above 400 KB
const MAX_WIDTH = 2000
const QUALITY = 58
const EFFORT = 3

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else if (entry.name.toLowerCase().endsWith('.avif')) acc.push(p)
  }
  return acc
}

const files = walk(imagesDir).filter((f) => statSync(f).size > THRESHOLD)
console.log(`Re-encoding ${files.length} AVIF file(s) above 400 KB (max width ${MAX_WIDTH}px, q${QUALITY})`)

let before = 0
let after = 0
for (const file of files) {
  const buf = readFileSync(file)
  const img = sharp(buf)
  const meta = await img.metadata()
  const out = await img
    .resize({ width: Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true })
    .avif({ quality: QUALITY, effort: EFFORT })
    .toBuffer()
  writeFileSync(file, out)
  before += buf.length
  after += out.length
  const name = file.replace(root + '\\', '').replace(/\\/g, '/')
  console.log(
    `  ${name}  ${(buf.length / 1024).toFixed(0)} KB -> ${(out.length / 1024).toFixed(0)} KB` +
      `  (${meta.width}px -> ${Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH)}px)`
  )
}

const saved = (before - after) / 1024 / 1024
console.log(`Done. Saved ${saved.toFixed(2)} MB across ${files.length} file(s).`)
