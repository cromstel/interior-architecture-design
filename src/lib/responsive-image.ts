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
 *   -lg.avif  2000w   large displays, only where the variant exists
 */

const AVIF_RE = /-sm\.avif$/i

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
 * The `-lg` tier is declared `2000w` because the helpers are filesystem-free by
 * design (this module is imported by client components) and cannot measure each
 * file. The convention is not exact: 9 of the 18 `-lg` assets are 2400px wide
 * and are therefore under-declared. That is the safe direction — a descriptor
 * never exceeds the true width, so the browser can never select a candidate
 * that is too small for the frame. It can only defer the `-lg` tier by one
 * breakpoint in a narrow band, costing some bytes, never sharpness.
 */
export function srcSetFor(src: string): string | undefined {
  const base = baseSrc(src)
  const small = smallSrc(src)
  const parts = [`${small} 800w`, `${base} 1200w`]
  if (src !== base) parts.push(`${src} 2000w`)
  return parts.join(', ')
}
