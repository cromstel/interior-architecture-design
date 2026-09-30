/**
 * Dev-time generator for OpenGraph share cards.
 *
 * Social crawlers do not reliably render AVIF, so every shareable page needs a
 * JPEG. The hero downloads are square crops, which platforms letterbox badly,
 * so each is re-cropped to the recommended 1.91:1 link-preview ratio
 * (1200x630) and written to public/images/og/<slug>.jpg.
 *
 * Slugs and hero sources are read from the data modules so the cards can never
 * drift from the pages that exist.
 *
 * Run: `node scripts/make-og-image.mjs`
 */
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(root, 'public', 'images')
const ogDir = join(imagesDir, 'og')

const WIDTH = 1200
const HEIGHT = 630
const QUALITY = 82

const read = (p) => readFileSync(join(root, p), 'utf8')

/**
 * Collect `{ slug, path }` for every entry that declares a `hero:`.
 *
 * Handles both hero shapes used in the data layer:
 *   projects: hero('mercer-street-loft', 'mercer-loft-hero', ...)  -> path from parts
 *   journal:  img('/images/journal/.../x.avif', ...)             -> literal path
 *
 * Any helper name is accepted, and each hero is paired with the nearest
 * preceding `slug:` rather than by index — positional pairing silently breaks
 * the moment the data files diverge in shape.
 */
function collectHeroes(file) {
  const src = read(file)
  const out = []
  let slug = null

  // Walk both patterns in source order so a hero inherits the slug declared
  // above it, whatever helper the module happens to use.
  const events = [
    ...[...src.matchAll(/^\s*slug:\s*'([^']+)',/gm)].map((m) => ({ at: m.index, slug: m[1] })),
    ...[...src.matchAll(/^\s*hero:\s*\w+\(([^)]*)\)/gm)].map((m) => ({ at: m.index, args: m[1] })),
  ].sort((a, b) => a.at - b.at)

  for (const ev of events) {
    if (ev.slug !== undefined) {
      slug = ev.slug
      continue
    }
    if (!slug) continue

    const literal = ev.args.match(/'(\/images\/[^']+\.avif)'/)
    let path = literal && literal[1]
    if (!path) {
      const parts = ev.args.match(/^\s*'([^']+)'\s*,\s*'([^']+)'/)
      if (parts) path = `/images/projects/${parts[1]}/${parts[2]}.avif`
    }
    if (path) {
      out.push({ slug, path })
      slug = null // one hero per entry
    }
  }
  return out
}

/** Resolve a data-layer path to the largest source file that exists on disk. */
function resolveSource(p) {
  const base = p.replace(/^\/images\//, '').replace(/\.(avif|jpg|png|webp)$/i, '')
  const dir = dirname(base)
  const name = base.slice(dir === '.' ? 0 : dir.length + 1)
  const dirPart = dir === '.' ? '' : `${dir}/`
  return [
    join(imagesDir, `${dirPart}${name}-lg.avif`),
    join(imagesDir, `${dirPart}${name}.avif`),
  ]
    .map((x) => x.replace(/\\/g, '/'))
    .find((x) => existsSync(x))
}

const projectHeroes = collectHeroes('src/data/projects.ts')
const journalHeroes = collectHeroes('src/data/journal.ts')

// A silent partial parse is worse than a hard failure: it would leave stale
// cards behind and quietly break the og:image on pages that still reference
// them. If either module stops parsing the way we expect, stop.
//
// The expected count is derived from the number of entries in the source rather
// than hardcoded, so adding a project or article does not require editing this
// script. The guard still catches a genuine parse failure: a `hero:` that is no
// longer a recognised call form yields fewer heroes than there are `slug:`
// declarations, which is what this compares.
const entryCount = (file) =>
  [...read(file).matchAll(/^\s*slug:\s*'([^']+)',/gm)].length

for (const [label, found] of [
  ['projects.ts', projectHeroes],
  ['journal.ts', journalHeroes],
]) {
  const expected = entryCount(`src/data/${label}`)
  if (found.length !== expected) {
    console.error(
      `Expected ${expected} hero(s) in src/data/${label} but parsed ${found.length}. ` +
        'The data shape has changed — update collectHeroes() in this script.'
    )
    process.exit(1)
  }
}

const targets = [
  { slug: 'og-citgroup-and-vale', path: '/images/hero/hero-homepage.avif' },
  ...projectHeroes,
  ...journalHeroes,
]

mkdirSync(ogDir, { recursive: true })
console.log(`Generating ${targets.length} OpenGraph card(s) at ${WIDTH}x${HEIGHT}`)

let written = 0
for (const { slug, path } of targets) {
  const source = resolveSource(path)
  if (!source) {
    console.warn(`  skip ${slug}: no source on disk for ${path}`)
    continue
  }
  const dest = join(ogDir, `${slug}.jpg`)
  const tmp = `${dest}.tmp`
  const buf = await sharp(source)
    .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: 'attention' })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer()
  // Write then rename so an interrupted run never leaves a truncated card.
  writeFileSync(tmp, buf)
  renameSync(tmp, dest)
  written++
  console.log(`  ${slug}.jpg  ${(statSync(dest).size / 1024).toFixed(1)} KB`)
}

console.log(`Done. ${written} card(s) written to public/images/og/`)
