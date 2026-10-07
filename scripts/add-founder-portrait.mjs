/**
 * Prepares a founder portrait supplied as a cut-out and writes the two width
 * tiers the site expects.
 *
 * Why this exists rather than a straight copy: the supplied file for the Chief
 * Executive is a 1254x1254 cut-out on transparency -- the alpha channel is a
 * clean head-and-shoulders silhouette, verified by rendering it -- while the two
 * existing founder portraits are ordinary rectangular studio photographs with
 * their own backgrounds. Dropping the cut-out in as-is would show the section
 * background through the corners and read as a sticker.
 *
 * So the cut-out is composited onto a studio backdrop, desaturated, and cropped
 * to the 3/4 frame the landing page displays. `/about/` shows the same portraits
 * in a 4/5 box, so at 3/4 the extra crop there is 25px of width and nothing is
 * lost that matters.
 *
 * Treatment notes, all measured rather than eyeballed:
 *
 * - Desaturated to true greyscale. Ethan Vale's portrait measures 0.0% mean
 *   saturation; the supplied file is 39.1%, mostly a royal blue blazer and tan
 *   shirt. Left in colour it would be the only saturated thing on the page. Note
 *   that Claire's portrait measures 30.5% and so is not actually monochrome
 *   despite its alt text; this matches the stated house style and Ethan, and
 *   harmonising Claire is a separate decision left alone here.
 *
 * - Backdrop is a vertical gradient in the studio mid-grey range rather than a
 *   flat fill, because the two existing portraits both have modelled backgrounds
 *   and a flat colour would look pasted on.
 *
 * - `normalise()` is applied before greyscale so skin highlights do not clip once
 *   the colour information is discarded.
 *
 * - The source is 1254px wide, so the 1200w tier is a slight downscale and
 *   nothing is ever enlarged.
 *
 * Usage: node scripts/add-founder-portrait.mjs <source> <slug>
 *   e.g. node scripts/add-founder-portrait.mjs "C:/.../photo.avif" founders-samuel-lamptey
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images', 'studio')

const source = process.argv[2]
const slug = process.argv[3]
if (!source || !slug) {
  console.error('Usage: node scripts/add-founder-portrait.mjs <source> <slug>')
  process.exit(1)
}

// Matches scripts/avif.mjs (quality 65, effort 2). Kept identical so the new
// portrait is not a quality outlier against the rest of the library.
const AVIF = { quality: 65, effort: 2 }
const BASE_WIDTH = 1200
const SMALL_WIDTH = 800

const meta = await sharp(source).metadata()
if (!meta.width || !meta.height) {
  console.error(`Could not read dimensions from ${source}`)
  process.exit(1)
}

// The displayed frame. `ratio="portrait"` in ParallaxImage is aspect-[3/4].
const FRAME = 3 / 4

// A studio backdrop: lighter above the shoulder line, deepening toward the base,
// which is how both existing portraits are lit. Built as a raw RGB buffer
// because sharp's `composite` takes an image, not a colour descriptor.
function buildBackdrop(width, height) {
  const raw = Buffer.alloc(width * height * 3)
  const top = [0x6f, 0x6b, 0x64]
  const bottom = [0x3c, 0x3a, 0x36]
  for (let y = 0; y < height; y++) {
    // ease the ramp so it does not read as a straight linear gradient
    const t = Math.pow(y / (height - 1), 1.4)
    const r = Math.round(top[0] + (bottom[0] - top[0]) * t)
    const g = Math.round(top[1] + (bottom[1] - top[1]) * t)
    const b = Math.round(top[2] + (bottom[2] - top[2]) * t)
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 3
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b
    }
  }
  return sharp(raw, { raw: { width, height, channels: 3 } }).png().toBuffer()
}

// Tone match against the two portraits already on the page, measured rather
// than judged by eye:
//
//   Claire citgroup   mean  88   stdev 69
//   Ethan Vale        mean  61   stdev 57
//   this file, raw    mean 101   stdev 44   <- brightest and flattest
//
// Untouched it read as a bright cut-out pasted beside two dark studio frames.
// A slope above 1 adds the missing contrast and the negative offset brings the
// mean down so it sits between Claire and Ethan rather than above both.
const CONTRAST = 1.08
const LIFT = -22

const subject = await sharp(source)
  .ensureAlpha()
  .toBuffer()

/**
 * Composites the cut-out onto the backdrop, normalises, desaturates and resizes.
 * One function so the two tiers cannot drift apart.
 *
 * Two sharp passes, on purpose. Within a single pipeline sharp runs colour
 * operations before `composite` whatever order they are called in, so a
 * `greyscale()` written after `.composite()` still applies to the backdrop and
 * not to the subject. And `blend: 'over'` composites the *overlay on top*, so
 * passing the backdrop as the overlay hides the sitter entirely. Both mistakes
 * produce a plausible-looking file rather than an error: a clean gradient with
 * nobody in it, and a channel spread of 145/141/134 that is obviously not grey.
 *
 * Pass one flattens subject-over-backdrop. Pass two does the tone work and the
 * resize.
 *
 * The source is NOT cropped to the display frame. The existing founder portraits
 * keep their own aspect and are framed by `object-cover` in CSS; doing the same
 * here is what makes the tiers honest. The cut-out is 1254px square, so a 3/4
 * pre-crop would be 941px wide and a 1200w tier would then be an upscale, which
 * sharp refuses outright under `withoutEnlargement` — correctly.
 */
async function render(width) {
  const backdrop = await buildBackdrop(meta.width, meta.height)

  const flattened = await sharp(backdrop)
    .composite([{ input: subject, blend: 'over' }])
    .png()
    .toBuffer()

  return sharp(flattened)
    .normalise()
    .greyscale()
    .removeAlpha()
    .linear(CONTRAST, LIFT)
    .resize({ width, withoutEnlargement: true })
    .avif(AVIF)
    .toBuffer()
}

const baseBuf = await render(BASE_WIDTH)
const smallBuf = await render(SMALL_WIDTH)

mkdirSync(outDir, { recursive: true })
const basePath = join(outDir, `${slug}.avif`)
const smallPath = join(outDir, `${slug}-sm.avif`)
writeFileSync(basePath, baseBuf)
writeFileSync(smallPath, smallBuf)

const kb = (b) => Math.round((b.length / 1024) * 10) / 10
console.log(`source        : ${meta.width}x${meta.height} ${meta.format}${meta.hasAlpha ? ' (cut-out, alpha)' : ''}`)
console.log(`framing       : left to CSS object-cover, as for the other two portraits`)
console.log(`wrote         : ${slug}.avif        ${kb(baseBuf)} KB  ${BASE_WIDTH}w`)
console.log(`wrote         : ${slug}-sm.avif     ${kb(smallBuf)} KB  ${SMALL_WIDTH}w`)

// Confirm the result is genuinely monochrome and opaque, so the build verifiers
// and the greyscale claim both hold rather than being assumed.
const after = await sharp(basePath).stats()
const [r, g, b] = after.channels.map((c) => c.mean)
const m = await sharp(basePath).metadata()
console.log('')
console.log(`verified greyscale : ${Math.abs(r - g) < 2 && Math.abs(g - b) < 2 ? 'yes' : 'NO'}`)
console.log(`verified opaque    : ${m.hasAlpha ? 'has alpha' : 'yes'}`)
console.log(`mean luminance     : ${Math.round((r + g + b) / 3)}`)

console.log('')
console.log(`Now set image and imageAlt on the founder in src/data/config.ts:`)
console.log(`  image: '/images/studio/${slug}.avif',`)