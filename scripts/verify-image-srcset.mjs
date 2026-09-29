/**
 * Verifies every `srcset` width descriptor in the built export against the real
 * pixel width of the file it points at.
 *
 * A width descriptor tells the browser how wide an image is so it can pick a
 * candidate. If the number is wrong the browser either over- or under-fetches.
 * This project already shipped one such bug: the large tier was declared a flat
 * `2000w` while 13 of its 19 assets are 2400px.
 *
 * Runs against `out/`, so it catches anything the pipeline changes. Zero
 * tolerance — a mismatch is a build failure, not a warning.
 *
 * Run: `node scripts/verify-image-srcset.mjs` (or `npm run images:verify`)
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'out')

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else if (entry.name.endsWith('.html')) acc.push(p)
  }
  return acc
}

const widths = new Map()
async function widthOf(urlPath) {
  if (!widths.has(urlPath)) {
    const { width } = await sharp(join(out, urlPath.replace(/^\//, ''))).metadata()
    widths.set(urlPath, width)
  }
  return widths.get(urlPath)
}

let pages
try {
  pages = walk(out)
} catch {
  console.error('out/ not found — run `npm run build` first.')
  process.exit(1)
}

let checked = 0
const wrong = []
const missing = []
const seen = new Set()

for (const page of pages) {
  const label = relative(out, page).split(sep).join('/')
  const html = readFileSync(page, 'utf8')

  for (const attr of html.matchAll(/(?:srcSet|imageSrcSet)="([^"]+)"/g)) {
    for (const candidate of attr[1].split(',')) {
      const [url, desc] = candidate.trim().split(/\s+/)
      if (!url || !/^\d+w$/.test(desc ?? '')) continue
      // `src` without a descriptor is covered by the descriptor check too.
      const key = `${label}|${url}|${desc}`
      if (seen.has(key)) continue
      seen.add(key)

      checked++
      const declared = Number(desc.slice(0, -1))
      let real
      try {
        real = await widthOf(url)
      } catch {
        missing.push(`${label}  ${url}`)
        continue
      }
      if (declared !== real) {
        wrong.push(`${label}  ${url}  declared ${declared}w, actual ${real}w`)
      }
    }
  }
}

const report = (label, list) => {
  console.log(`${label.padEnd(18)}: ${list.length}`)
  for (const item of [...new Set(list)].slice(0, 15)) console.log(`  ${item}`)
  if (list.length > 15) console.log(`  ... and ${list.length - 15} more`)
}

console.log(`Pages scanned        : ${pages.length}`)
console.log(`Descriptors checked  : ${checked}`)
report('Missing files', missing)
report('Incorrect widths', wrong)

if (missing.length || wrong.length) {
  console.error(
    '\nFix the pipeline, or re-run `npm run images:widths`. An inaccurate descriptor makes the browser pick the wrong candidate.'
  )
  process.exit(1)
}

console.log('\nAll width descriptors match their files.')
