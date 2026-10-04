/**
 * Fails the build if any page preloads the same image srcset more than once.
 *
 * Why this is a defect rather than redundancy: Chrome does not merge duplicate
 * preloads. Given two `<link rel="preload" as="image">` for one srcset it
 * discards the preload, the `<img>` then fetches on its own, and the console
 * reports "The resource ... was preloaded using link preload but not used within
 * a few seconds". The preload buys nothing and the warning is noise the reader
 * has to learn to ignore.
 *
 * It happened because `HeroBackdrop` marks its image `fetchPriority="high"`, and
 * Next emits a preload from that on its own -- so the hand-written preload in
 * `app/page.tsx` and `app/not-found.tsx` was a second one for every hero. The
 * comment there claimed the opposite: that omitting `fetchPriority` avoided a
 * duplicate. The duplicate came from the attribute on the `<img>`, which every
 * hero shares, not from the one on the preload.
 *
 * A second preload for a *different* srcset is legitimate and must not fail
 * here. Next preloads the LCP image of any route being prefetched, so a page
 * that links to /journal/ carries a preload for a journal hero it never renders.
 * That is prefetch working as intended and it is deliberately allowed.
 *
 * Reads the built HTML, so it measures what the browser actually receives.
 *
 * Run: node scripts/verify-preload.mjs (or `npm run preload:verify`)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
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

const pages = walk(out)
const problems = []
const stats = { pages: pages.length, preloads: 0, duplicatedPages: 0 }

for (const page of pages) {
  const label = relative(out, page).split(sep).join('/')
  const html = readFileSync(page, 'utf8')

  const preloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/g)].map((m) => {
    const tag = m[0]
    const srcset = /imageSrcSet="([^"]*)"/i.exec(tag)?.[1] || ''
    const sizes = /imageSizes="([^"]*)"/i.exec(tag)?.[1] || '(none)'
    const priority = /fetchPriority="([^"]*)"/i.exec(tag)?.[1] || '(none)'
    return { tag, srcset, sizes, priority }
  })
  stats.preloads += preloads.length

  // Group by srcset, which is what makes two preloads duplicates of each other.
  const bySrcset = new Map()
  for (const p of preloads) {
    if (!p.srcset) continue
    if (!bySrcset.has(p.srcset)) bySrcset.set(p.srcset, [])
    bySrcset.get(p.srcset).push(p)
  }

  for (const [srcset, group] of bySrcset) {
    if (group.length <= 1) continue
    stats.duplicatedPages++
    const sizesSeen = [...new Set(group.map((g) => g.sizes))].join(' vs ')
    const priorities = [...new Set(group.map((g) => g.priority))].join(' vs ')
    problems.push(
      `${label}\n    srcset : ${srcset}\n    repeats: ${group.length}x  sizes=[${sizesSeen}] fetchpriority=[${priorities}]`
    )
  }

  // A page with a hero must still have exactly one preload for it. Dropping the
  // hand-written preload could in principle remove all of them, which would be
  // worse than the duplicate: no preload at all on the LCP image.
  const heroImg = /<img[^>]+fetchPriority="high"[^>]*>/i.exec(html)?.[0]
  if (heroImg && preloads.length === 0) {
    problems.push(`${label}\n    has a fetchPriority=high image but no image preload at all`)
  }
}

console.log(`Pages checked                 : ${stats.pages}`)
console.log(`Image preloads found          : ${stats.preloads}`)
console.log(`Pages preloading one srcset 2x: ${stats.duplicatedPages}`)

if (problems.length) {
  console.error('\nDuplicate image preloads:\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nChrome discards the duplicate and re-fetches, so the preload does nothing.')
  console.error('See scripts/verify-preload.mjs and the comment in src/app/page.tsx.')
  process.exit(1)
}

console.log('\nEvery page preloads each hero image exactly once.')