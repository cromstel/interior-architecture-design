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
 * Collect `{ slug, src }` for every entry that declares a `hero:`.
 * Handles both hero shapes used in the data layer:
 *   projects: img('mercer-street-loft', 'mercer-loft-hero', ...)  -> path built from parts
 *   journal:  img('/images/journal/.../x.avif', ...)             -> literal path
 */
function collectHeroes(file) {
  const src = read(file)
  const out = []
  // Slugs appear as `slug: '...'`; the first ones are type declarations, so we
  // pair positionally with the hero calls and drop any without a hero.
  const slugs = [...src.matchAll(/^\s*slug:\s*'([^']+)',/gm)].map((m) => m[1])
  const heroes = [...src.matchAll(/hero:\s*img\(([^)]*)\)/g)].map((m) => m[1])

  heroes.forEach((args, i) => {
    const slug = slugs[i]
    if (!slug) return
    const literal = args.match(/'(\/images\/[^']+\.avif)'/)
    let path = literal && literal[1]
    if (!path) {
      const parts = args.match(/^\s*'([^']+)'\s*,\s*'([^']+)'/)
      if (parts) path = `/images/projects/${parts[1]}/${parts[2]}.avif`
    }
    if (path) out.push({ slug, path })
  })
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

const targets = [
  { slug: 'og-citgroup-and-vale', path: '/images/hero/hero-homepage.avif' },
  ...collectHeroes('src/data/projects.ts'),
  ...collectHeroes('src/data/journal.ts'),
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
