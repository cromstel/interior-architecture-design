/**
 * Verifies that every `press` row in `site.ts` resolves to a real journal
 * article, and that every article claiming the "Press" category is reachable
 * from the press list.
 *
 * The Press section links to internal `/journal/<slug>/` routes because the
 * site ships no external links. That makes a press row a promise: if the slug
 * it names is not in `journal.ts`, the link 404s against our own domain. Since
 * both lists are hand-maintained in separate files, a typo or a deleted article
 * is silent until someone clicks it.
 *
 * Zero tolerance — a mismatch is a build failure, not a warning.
 *
 * Run: `node scripts/verify-press-links.mjs` (or `npm run links:verify`)
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')

const site = read('src/data/site.ts')
const journal = read('src/data/journal.ts')

/** Slugs named by the press list. */
const pressSlugs = [...site.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1])

/** Slugs of every article, and those in the Press category. */
const articleSlugs = [...journal.matchAll(/^\s{6}slug:\s*'([a-z0-9-]+)'/gm)].map((m) => m[1])

/**
 * Articles whose *own* category is 'Press'.
 *
 * Each entry is sliced out first, then its category read from within that slice.
 * Matching `slug` and `category` in one regex across the whole file pairs a slug
 * with a later entry's category, which reported the Materials essay as Press.
 */
const pressCategorySlugs = []
for (const block of journal.split(/\n    \{/)) {
  const slug = block.match(/^\s+slug:\s*'([a-z0-9-]+)'/m)?.[1]
  if (!slug) continue
  if (/^\s+category:\s*'Press'/m.test(block)) pressCategorySlugs.push(slug)
}

const pressSet = new Set(pressSlugs)
const articleSet = new Set(articleSlugs)

const dangling = pressSlugs.filter((s) => !articleSet.has(s))
const orphans = articleSlugs.filter((s) => pressCategorySlugs.includes(s) && !pressSet.has(s))
const duplicates = pressSlugs.filter((s, i) => pressSlugs.indexOf(s) !== i)

console.log(`Press rows         : ${pressSlugs.length}`)
console.log(`Journal articles   : ${articleSlugs.length}`)
console.log(`Press articles     : ${pressCategorySlugs.length}`)
console.log(`Dangling press rows: ${dangling.length}`)
for (const s of dangling) console.log(`  no such article: ${s}`)
console.log(`Unlisted articles  : ${orphans.length}`)
for (const s of orphans) console.log(`  Press article not in the press list: ${s}`)
console.log(`Duplicate rows     : ${duplicates.length}`)
for (const s of duplicates) console.log(`  duplicate slug: ${s}`)

if (dangling.length || orphans.length || duplicates.length) {
  console.error(
    '\nEvery press row must name an existing article, and every Press-category\narticle must appear in the press list. See scripts/verify-press-links.mjs.'
  )
  process.exit(1)
}

console.log('\nAll press rows resolve to published articles.')
