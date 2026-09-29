/**
 * Responsive image candidate helpers.
 *
 * Pure string manipulation with no filesystem access, so this module is safe to
 * import from client components. The `-lg` / `-sm` naming convention is fixed,
 * which means the candidates for any path can be derived without probing disk.
 *
 * Three tiers exist so a phone never downloads a desktop-sized photograph:
 *   -sm.avif   800w   high-DPR handsets, small editorial crops
 *   .avif     1200w   default
 *   -lg.avif  2000-2400w  large displays, only where the variant exists
 *
 * The small and base widths are fixed by the image pipeline and asserted by
 * `scripts/generate-image-widths.mjs`. The large tier is not uniform, so its
 * width is looked up in a generated map rather than assumed.
 */
import { LARGE_TIER_WIDTHS } from '@/lib/image-large-tiers'

const AVIF_RE = /-sm\.avif$/i

const SMALL_WIDTH = 800
const BASE_WIDTH = 1200

/**
 * Fallback width for an unknown `-lg` asset. Only reached if a large tier is
 * added to `public/images` without re-running `npm run images:widths`.
 * Under-declaring is the safe direction — a descriptor below the true width can
 * only defer the large tier, never select an image too small for the frame.
 */
const LARGE_WIDTH_FALLBACK = 2000

let warned = false

/** Strips a `-lg` suffix, yielding the 1200w base path. */
export function baseSrc(src: string): string {
  return src.replace(/-lg\.(avif|webp|jpe?g|png)$/i, '.$1')
}

/**
 * The 800w candidate for a given path. Derivable for every asset because the
 * small tier is generated for all of them.
 */
export function smallSrc(src: string): string {
  const base = baseSrc(src)
  return base.replace(AVIF_RE, '.avif').replace(/\.avif$/i, '-sm.avif')
}

/**
 * Builds a `srcset` covering every tier that applies to `src`.
 *
 * `src` is normally the resolved (possibly `-lg`) path. When it is not the
 * base, all three tiers are offered; otherwise the large variant is omitted
 * because it does not exist for that asset.
 *
 * Every descriptor is the file's real pixel width, which is what lets the
 * browser pick correctly. A single hardcoded `2000w` for the large tier
 * mis-declared 13 of the 19 `-lg` assets, which are 2400px unless
 * `shrink-oversized-avif.mjs` capped them at 2000px.
 */
export function srcSetFor(src: string): string | undefined {
  const base = baseSrc(src)
  const small = smallSrc(src)
  const parts = [`${small} ${SMALL_WIDTH}w`, `${base} ${BASE_WIDTH}w`]

  if (src !== base) {
    const large = LARGE_TIER_WIDTHS[src]
    if (!large && process.env.NODE_ENV !== 'production' && !warned) {
      warned = true
      console.warn(
        `[responsive-image] no recorded width for large tier "${src}"; ` +
          `declaring ${LARGE_WIDTH_FALLBACK}w. Run \`npm run images:widths\`.`
      )
    }
    parts.push(`${src} ${large ?? LARGE_WIDTH_FALLBACK}w`)
  }

  return parts.join(', ')
}
