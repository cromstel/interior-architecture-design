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
 * Why the target is exactly 1200x1200 and 800x800: all three founders are to
 * carry the same dimensions as the Chief Executive's, and a uniform set is
 * easier to reason about than one that quietly differs per portrait.
 *
 * Getting there means enlarging, and that is worth stating plainly rather than
 * glossing. A square crop can only be as wide as its source is tall, so Claire's
 * largest honest square is 798px and Ethan's is 865px; reaching 1200 scales them
 * by 1.50x and 1.39x. The alternative -- padding the short side out with
 * synthesised background -- invents content instead of pixels, and a seam across
 * a photographic backdrop is far more visible than softness.
 *
 * The softness costs nothing in practice, and that is arithmetic rather than
 * reassurance. The card renders 363px wide, so the largest any file is displayed
 * at is 363 x 2 (DPR 2) = 726px. Claire at 798px and Ethan at 865px both already
 * exceed that before scaling, so neither gains sharpness from the resize and
 * neither loses detail the page could show. The extra pixels buy file
 * uniformity, which is what was asked for, and nothing visible is degraded to
 * get it.
 *
 * The crop is biased upward because faces sit high in both portraits; a centred
 * square crop of a 1200x798 frame moves 798px of width across a face that
 * occupies the middle of the original.
 *
 * Both tiers come from one crop, so they cannot drift apart in framing. The
 * source is not re-encoded beyond the crop and the tier resize: both existing
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
 * Crops to square, then resizes to an exact square of `width` pixels.
 *
 * `fit: 'fill'` with both dimensions set is what makes the result exactly
 * 1200x1200 rather than "as wide as it can be". `withoutEnlargement` is
 * deliberately absent: for a portrait whose square is smaller than the tier — the
 * 798px case — it silently returns the input unchanged, which is how both tiers
 * once came out byte-identical.
 *
 * Lanczos3 rather than the default, because this is the one path in the project
 * that enlarges and the kernel matters when it does. Both tiers come from the
 * same crop box, so they cannot drift apart in framing.
 */
async function render(input, width) {
  const meta = await sharp(input).metadata()
  return sharp(input)
    .extract(squareCrop(meta))
    .resize({ width, height: width, fit: 'fill', kernel: 'lanczos3' })
    .avif(AVIF)
    .toBuffer()
}

const meta = await sharp(basePath).metadata()
const box = squareCrop(meta)

// The small tier is the library convention: 1200w base, 800w small. Both are
// applied exactly, so all three founders end up on identical dimensions.
const baseBuf = await render(readFileSync(basePath), BASE_WIDTH)
const smallBuf = await render(readFileSync(basePath), SMALL_WIDTH)

writeFileSync(basePath, baseBuf)
writeFileSync(smallPath, smallBuf)

const kb = (b) => Math.round((b.length / 1024) * 10) / 10
const scale = BASE_WIDTH / box.width
console.log(`${slug}`)
console.log(`  source        : ${meta.width}x${meta.height}`)
console.log(`  crop          : ${box.width}x${box.height} at ${box.left},${box.top}  (bias ${BIAS})`)
console.log(`  scale to base : ${scale.toFixed(2)}x${scale === 1 ? '' : '  (enlarged)'}`)
console.log(`  wrote base    : ${kb(baseBuf)} KB  ${BASE_WIDTH}x${BASE_WIDTH}`)
console.log(`  wrote -sm     : ${kb(smallBuf)} KB  ${SMALL_WIDTH}x${SMALL_WIDTH}`)

for (const [label, p] of [['base', basePath], ['-sm', smallPath]]) {
  const m = await sharp(p).metadata()
  console.log(`  verified ${label.padEnd(5)}: ${m.width}x${m.height}  ratio ${(m.width / m.height).toFixed(3)}`)
}

console.log('')
console.log('Now run `npm run images:widths` so the descriptors record the new widths.')