import fs from 'node:fs'
import path from 'node:path'

/**
 * Resolves the high-resolution `-lg` variant for an image path at build
 * time when it exists on disk, falling back to the base asset. Handles
 * jpg, webp, and png paths. Server modules only — calls `node:fs` during
 * prerender, so it must never be imported into a client bundle.
 */
export function lg(src: string): string {
  const candidate = src.replace(/\.(jpe?g|png|webp|avif)$/i, '-lg.$1')
  const full = path.join(process.cwd(), 'public', candidate)
  return fs.existsSync(full) ? candidate : src
}