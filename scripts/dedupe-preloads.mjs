/**
 * Removes byte-identical duplicate image preloads from the exported HTML.
 *
 * Next 16.3.6 emits the LCP image preload twice. On every route that uses a
 * `HeroBackdrop` this produced:
 *
 *   <link rel="preload" as="image" imageSrcSet="..." imageSizes="100vw" fetchPriority="high"/>
 *   <link rel="preload" as="image" imageSrcSet="..." imageSizes="100vw"/>
 *
 * and, once the attribute was dropped, two identical tags with no
 * `fetchPriority` at all. Neither copy is ours to remove by deleting markup:
 * with no `<link>` anywhere in the source, Next still emits both.
 *
 * The duplicate is not harmless. Chrome does not merge duplicate preloads -- it
 * discards the preload, the `<img>` then fetches on its own, and the console
 * reports "The resource ... was preloaded using link preload but not used within
 * a few seconds". Confirmed with `scripts/hero-preload-check.mjs`: the hero
 * request comes back with `initiator=parser` rather than `preload`, so the
 * preload never did its job.
 *
 * Only tags that are byte-identical are collapsed, so nothing is merged that
 * Next meant to distinguish -- a preload for a different srcset or a different
 * `sizes` is left alone. Collapsing to the first occurrence is correct because
 * the tags carry no ordering dependency and duplicates are adjacent in practice.
 *
 * Runs after `next build`; `scripts/verify-preload.mjs` then fails the build if
 * any duplicate survives, so this cannot silently stop working.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'out')

if (!existsSync(out)) {
  console.error('out/ not found — run `npm run build` first.')
  process.exit(1)
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else if (entry.name.endsWith('.html')) acc.push(p)
  }
  return acc
}

const IMAGE_PRELOAD = /<link[^>]*\brel="preload"[^>]*\bas="image"[^>]*\/?>/g

let totalRemoved = 0
const touched = []

for (const page of walk(out)) {
  const html = readFileSync(page, 'utf8')
  const matches = [...html.matchAll(IMAGE_PRELOAD)]
  if (matches.length < 2) continue

  const seen = new Set()
  const drop = new Set()
  for (const m of matches) {
    if (seen.has(m[0])) drop.add(m.index)
    else seen.add(m[0])
  }
  if (!drop.size) continue

  // Rebuild by slicing out the duplicates, back to front so indices hold.
  let next = html
  for (const i of [...drop].sort((a, b) => b - a)) {
    next = next.slice(0, i) + next.slice(i + matches.find((m) => m.index === i)[0].length)
  }

  if (next === html) continue
  writeFileSync(page, next)
  totalRemoved += drop.size
  touched.push([relative(out, page).split(sep).join('/'), drop.size])
}

console.log(`Duplicate image preloads removed : ${totalRemoved}`)
for (const [page, n] of touched.slice(0, 10)) console.log(`  ${page}  (${n})`)
if (touched.length > 10) console.log(`  ... and ${touched.length - 10} more pages`)

if (totalRemoved === 0) {
  console.log('')
  console.log('No duplicates found. If Next still emits two, verify-preload.mjs will')
  console.log('have failed the build; this script has nothing left to do.')
} else {
  console.log('')
  console.log('Each hero image is now preloaded once, so Chrome can act on it.')
}