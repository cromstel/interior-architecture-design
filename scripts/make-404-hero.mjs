/**
 * Dev-time generator for the 404 hero banner.
 *
 * The 404 has no photograph of its own in `scripts/fetch-images.mjs`, so this
 * derives a dedicated pair from the studio's existing "empty room, ceiling
 * lights" negative (mercer-loft-ceiling) — an unoccupied room, which is exactly
 * what the 404 headline describes. The frame is desaturated and slightly
 * dimmed so it reads as a quiet, still plate rather than as a repeat of the
 * Mercer Street Loft chapter image.
 *
 * Source is 2400x1600, so both output widths are true downscales: 1200w base
 * and 2000w `-lg`, matching the `lg()` / srcSet contract used site-wide.
 *
 * Note: `scripts/fetch-images.mjs` deletes and regenerates `public/images/`
 * from scratch, so re-run this script (or `npm run images:hero404`) after it.
 *
 * Run: `node scripts/make-404-hero.mjs`
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(
  root,
  'public',
  'images',
  'projects',
  'mercer-street-loft',
  'mercer-loft-ceiling-lg.avif',
)
const OUT_DIR = join(root, 'public', 'images', 'hero')

/** Output width -> AVIF quality, mirroring avif.mjs (65) / shrink-oversized-avif.mjs (58). */
const VARIANTS = [
  { file: 'hero-404.avif', width: 1200, quality: 65, effort: 2 },
  { file: 'hero-404-lg.avif', width: 2000, quality: 58, effort: 3 },
]

const source = readFileSync(SOURCE)
const { width: sourceWidth, height: sourceHeight } = await sharp(source).metadata()

for (const { file, width, quality, effort } of VARIANTS) {
  // Guard against ever emitting an enlarged file: the base is already the
  // smaller of the two widths.
  if (width > sourceWidth) {
    throw new Error(
      `Refusing to upscale ${file}: source is only ${sourceWidth}px wide.`,
    )
  }
  const out = await sharp(source)
    .resize({ width, withoutEnlargement: true })
    // Muted, still, slightly underexposed — the tonal register of the 404 copy.
    .modulate({ saturation: 0.5, brightness: 0.9 })
    .avif({ quality, effort })
    .toBuffer()
  writeFileSync(join(OUT_DIR, file), out)
  const meta = await sharp(out).metadata()
  console.log(
    `  ${file}  ${meta.width}x${meta.height}  ${(out.length / 1024).toFixed(0)} KB`,
  )
}

console.log(
  `Done. Wrote ${VARIANTS.length} 404 hero variants from ${sourceWidth}x${sourceHeight} source.`,
)
