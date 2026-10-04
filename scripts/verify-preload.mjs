/**
 * Checks that each hero's preload and its `<img>` resolve to the same file.
 *
 * History, because the obvious version of this check was wrong and shipped.
 * It used to fail the build when a page preloaded the same srcset more than
 * once, on the theory that Chrome discards a duplicate preload and warns
 * "preloaded but not used". Two mistakes:
 *
 *   1. The warning does not reproduce. With no WAF involved it appears on no
 *      route at any viewport tried (1440x900, 1920x1080, 390x844). It was
 *      inferred from `initiator=parser`, which is also what a correctly-used
 *      preload reports, because a preload and the element coalesce into one
 *      network request attributed to the parser.
 *   2. Removing the duplicate is actively harmful. Next 16.3.6 emits the LCP
 *      preload twice by itself, so the only way to "fix" it was to edit the
 *      built HTML. React hydrates the preload links it rendered, so deleting one
 *      makes it discard the server tree and regenerate it client-side. Measured
 *      by applying the build steps one at a time:
 *
 *        raw next build    #418 no    5 payload 404s
 *        + rsc:fix         #418 no    0
 *        + payloads:strip  #418 no    0
 *        + preload:dedupe  #418 YES   0
 *
 *      A cosmetic warning is not worth a hydration error.
 *
 * So this no longer counts preloads. What it enforces is the invariant that
 * actually costs the reader something: the preload and the element must agree on
 * `srcset` and `sizes`, or the browser fetches one file for the preload and a
 * second, different file for the image. That is the defect the README records
 * from the original `image-set()` background hero, and it is silent.
 *
 * Duplicates are reported as information. A second preload for a *different*
 * srcset is Next prefetching a linked route and is expected.
 *
 * Run: node scripts/verify-preload.mjs (or `npm run preload:verify`)
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
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
const stats = {
  pages: pages.length,
  preloads: 0,
  heroes: 0,
  agreed: 0,
  noPreload: 0,
  duplicateSrcsets: 0,
}

for (const page of pages) {
  const label = relative(out, page).split(sep).join('/')
  const html = readFileSync(page, 'utf8')

  const preloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/g)].map((m) => ({
    tag: m[0],
    srcset: /imageSrcSet="([^"]*)"/i.exec(m[0])?.[1] || '',
    sizes: /imageSizes="([^"]*)"/i.exec(m[0])?.[1] || '',
  }))
  stats.preloads += preloads.length

  const bySrcset = new Map()
  for (const p of preloads) {
    if (!p.srcset) continue
    bySrcset.set(p.srcset, (bySrcset.get(p.srcset) || 0) + 1)
  }
  for (const [, n] of bySrcset) if (n > 1) stats.duplicateSrcsets++

  // The hero is the fetchPriority=high image: the LCP element.
  const heroTag = /<img[^>]*fetchPriority="high"[^>]*>/i.exec(html)?.[0]
  if (!heroTag) continue
  stats.heroes++

  const heroSrcset = /srcSet="([^"]*)"/i.exec(heroTag)?.[1] || ''
  const heroSizes = /sizes="([^"]*)"/i.exec(heroTag)?.[1] || ''
  if (!heroSrcset) {
    problems.push(`${label}\n    hero <img> has no srcSet, so no preload can match it`)
    continue
  }

  const norm = (s) => s.replace(/\s+/g, ' ').trim()
  const match = preloads.find((p) => norm(p.srcset) === norm(heroSrcset))
  if (!match) {
    problems.push(
      `${label}\n    hero srcSet has no matching preload\n      img   : ${heroSrcset}\n      ${preloads.length} preload(s) present, none identical`
    )
    continue
  }

  if (norm(match.sizes) !== norm(heroSizes)) {
    problems.push(
      `${label}\n    preload and element disagree on sizes, so they can select different files\n` +
      `      preload : ${match.sizes || '(none)'}\n      element : ${heroSizes || '(none)'}`
    )
    continue
  }

  stats.agreed++
}

console.log(`Pages checked                    : ${stats.pages}`)
console.log(`Heroes (fetchPriority=high)     : ${stats.heroes}`)
console.log(`preload and element agree       : ${stats.agreed}`)
console.log(`Heroes with no matching preload : ${stats.noPreload}`)
console.log(`Image preloads total            : ${stats.preloads}`)
console.log(`srcsets preloaded more than once: ${stats.duplicateSrcsets}  (Next emits these; harmless)`)

if (problems.length) {
  console.error('\nPreload and hero element disagree:\n')
  for (const p of problems.slice(0, 12)) console.error('  ' + p)
  console.error('\nA mismatch means the browser downloads one file for the preload and another')
  console.error('for the image. See scripts/verify-preload.mjs.')
  process.exit(1)
}

if (stats.agreed !== stats.heroes) {
  console.error(`\nOnly ${stats.agreed} of ${stats.heroes} heroes agreed.`)
  process.exit(1)
}

console.log('')
console.log('Every hero preload matches its element on srcSet and sizes, so each downloads once.')
console.log('Duplicate preloads are Next 16.3.6 behaviour and are left in place: removing')
console.log('them from the served HTML causes a React #418 hydration error.')
