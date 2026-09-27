/**
 * Dev-time optimizer: converts every JPEG under public/images/ to AVIF.
 *
 * The .jpg files remain on disk as working sources; every <img src>/srcSet
 * and lg() resolution in the site points at the .avif siblings. The og/ folder
 * is skipped on purpose so the OpenGraph card stays a JPEG (social crawlers
 * do not reliably accept AVIF for previews).
 *
 * Run: `node scripts/optimize-images.mjs`
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(root, 'public', 'images')
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
 * Converts every JPEG under `dir` to an AVIF sibling. Returns conversion stats.
 */
export async function convertToAVIF({ dir = imagesDir, quality = 65 } = {}) {
  const files = walk(dir)
  let before = 0
  let after = 0
  for (const file of files) {
    const out = file.replace(JPG_RE, '.avif')
    const buf = readFileSync(file)
    const avif = await sharp(buf).avif({ quality, effort: 2 }).toBuffer()
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, avif)
    before += buf.length
    after += avif.length
  }
  return { converted: files.length, saved: before - after }
}

export async function convertOgToAVIF() {
  const ogDir = join(imagesDir, 'og')
  if (!existsSync(ogDir)) return { converted: 0, saved: 0 }
  return convertToAVIF({ dir: ogDir })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const { converted, saved } = await convertToAVIF()
    const mb = (saved / 1024 / 1024).toFixed(2)
    console.log(`Converted ${converted} images to AVIF (quality ${65}).`)
    console.log(`Size delta: -${mb} MB (${saved < 0 ? 'increase' : 'saved'}).`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}