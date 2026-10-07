/**
 * Crops an existing founder portrait square, so all three founders share one
 * aspect ratio and are framed identically by `object-cover`.
 *
 * Why square: the three cards render in a fixed frame -- `aspect-[3/4]` on the
 * landing page, `aspect-[4/5]` on About -- and the browser crops every source to
 * fill it. With three different source aspects the framing differed between
 * them: a 1.50 source and a 1.00 source lose different amounts off each side, so
 * the three faces sat at different scales in the same row. Matching the aspect
 * makes the crop identical for all three.
 *
 * Why not force them all to 1200x1200: a square crop can only be as wide as its
 * source is tall. Claire citgroup's source is 1200x798, so her largest honest
 * square is 798x798 and her base tier becomes 798w, not 1200w. Upscaling to
 * 1200 would soften her by 1.5x, which is worse than a differing descriptor.
 * `srcSetFor` now reads real widths from `image-tier-widths.ts` for exactly this
 * reason, and `verify-image-srcset.mjs` checks the declared width against the
 * file.
 *
 * The crop is biased upward because faces sit high in both portraits; a centred
 * square crop of a 1200x798 frame moves 798px of width across a face that
 * occupies the middle of the original.
 *
 * The source is not re-encoded beyond the crop and the tier resize: both existing
 * files are already AVIF, and re-encoding an already-lossy AVIF compounds
 * artefacts.
 *
 * Usage: node scripts/square-founder-portrait.mjs <slug> [upwardBias]
 *   e.g. node scripts/square-founder-portrait.mjs founders-claire-citgroup
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const studioDir = join(root, 'public', 'images', 'studio')

const slug = process.argv[2]
const BIAS = Number(process.argv[3] ?? 0.3)
if (!slug) {
  console.error('Usage: node scripts/square-founder-portrait.mjs <slug> [upwardBias]')
  process.exit(1)
}

const AVIF = { quality: 65, effort: 2 }
const BASE_WIDTH = 1200
const SMALL_WIDTH = 800

const basePath = join(studioDir, `${slug}.avif`)
const smallPath = join(studioDir, `${slug}-sm.avif`)
if (!existsSync(basePath)) {
  console.error(`Not found: ${basePath}`)
  process.exit(1)
}

/** Square crop box for a source, biased upward by `BIAS` of the discarded height. */
function squareCrop(meta) {
  const side = Math.min(meta.width, meta.height)
  return {
    left: Math.round((meta.width - side) / 2),
    top: Math.round((meta.height - side) * BIAS),
    width: side,
    height: side,
  }
}

/**
 * Crops to square then resizes to the tier width, never enlarging.
 *
 * Both tiers come from the base file rather than from the existing `-sm`, so the
 * two cannot drift apart in framing. The `-sm` is regenerated from the same crop
 * box, which is what keeps the two tiers pixel-aligned.
 */
async function render(input, width) {
  const meta = await sharp(input).metadata()
  return sharp(input)
    .extract(squareCrop(meta))
    .resize({ width, withoutEnlargement: true })
    .avif(AVIF)
    .toBuffer()
}

const meta = await sharp(basePath).metadata()
const box = squareCrop(meta)

/**
 * The small tier for a square crop.
 *
 * The library's convention is 1200w base -> 800w small, which is exactly two
 * thirds. Applying the same ratio keeps a square portrait on the same ladder
 * instead of inventing a second rule.
 *
 * It matters because of what a square crop does to the numbers. Claire's source
 * is 1200x798, so her square is 798px and a 800w small tier cannot be produced
 * without enlarging -- `withoutEnlargement` silently returns the base unchanged,
 * and both tiers came out as byte-identical 798x798 files, 65 KB where 32.5 KB
 * would do, with a srcset offering the browser the same image twice. Two thirds
 * of 798 is 532, which is a real second candidate.
 *
 * Capped at the conventional 800 so a full-size base still gets 800, not more.
 */
function smallTierFor(baseWidth) {
  const twoThirds = Math.round((baseWidth * 2) / 3 / 8) * 8
  return Math.min(SMALL_WIDTH, twoThirds)
}

const baseBuf = await render(readFileSync(basePath), BASE_WIDTH)
const smallWidth = smallTierFor(box.width)
const smallBuf = await render(readFileSync(basePath), smallWidth)

writeFileSync(basePath, baseBuf)
writeFileSync(smallPath, smallBuf)

const kb = (b) => Math.round((b.length / 1024) * 10) / 10
console.log(`${slug}`)
console.log(`  source        : ${meta.width}x${meta.height}`)
console.log(`  crop          : ${box.width}x${box.height} at ${box.left},${box.top}  (bias ${BIAS})`)
console.log(`  wrote base    : ${kb(baseBuf)} KB  ${box.width}w`)
console.log(`  wrote -sm     : ${kb(smallBuf)} KB  ${smallWidth}w  (two thirds, capped at ${SMALL_WIDTH})`)

for (const [label, p] of [['base', basePath], ['-sm', smallPath]]) {
  const m = await sharp(p).metadata()
  console.log(`  verified ${label.padEnd(5)}: ${m.width}x${m.height}  ratio ${(m.width / m.height).toFixed(3)}`)
}

console.log('')
console.log('Now run `npm run images:widths` so the descriptors record the new widths.')