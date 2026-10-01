/**
 * Verifies the `.htaccess` FilesMatch patterns against the real filenames in
 * `out/`, so the cache rules cannot quietly stop matching.
 *
 * Why this exists: two earlier versions of the immutable rule were wrong and
 * both looked fine in the file. `FilesMatch "^/_next/static/"` matches no
 * basename, because a basename never contains a slash. `DirectoryMatch` is
 * correct but silently ignored on this host. The rule that shipped matches the
 * hash in the filename, and the negative lookahead is what keeps the three
 * `_buildManifest.js`-style files — whose names are stable across builds — from
 * being pinned as immutable, which would serve a stale build after a redeploy.
 *
 * Reads the patterns out of the .htaccess rather than duplicating them, so
 * editing one without the other is caught.
 *
 * Run: node scripts/verify-htaccess.mjs (or `npm run htaccess:verify`)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'out')
const htaccess = readFileSync(join(root, 'public', '.htaccess'), 'utf8')

if (!existsSync(out)) {
  console.error('out/ not found — run `npm run build` first.')
  process.exit(1)
}

/** Pull a FilesMatch regex out of the .htaccess so the test cannot drift. */
function pattern(label) {
  const m = htaccess.match(new RegExp(`<FilesMatch "([^"]+)">\\s*\\n\\s*Header[^\\n]*${label}`, 'i'))
  if (!m) throw new Error(`could not find the ${label} FilesMatch in public/.htaccess`)
  return new RegExp(m[1], 'i')
}

const immutableChunk = pattern('31536000, immutable')
const revalidateHtml = pattern('max-age=0, must-revalidate')
const shortTtl = pattern('max-age=3600')
const immutableMedia = /max-age=31536000, immutable/

// FilesMatch matches on the basename in Apache, so that is what is tested.
const files = []
;(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else files.push(e.name)
  }
})(out)

const problems = []
const stats = { immutableChunk: 0, revalidateHtml: 0, shortTtl: 0, immutableMedia: 0, unmatched: 0, excludedManifests: 0 }

// The manifest files share a name across builds, so they must never be immutable.
const mustNotBeImmutable = ['_buildManifest.js', '_clientMiddlewareManifest.js', '_ssgManifest.js']

for (const name of new Set(files)) {
  const ext = name.slice(name.lastIndexOf('.'))
  if (/\.(js|css)$/i.test(ext)) {
    if (mustNotBeImmutable.includes(name)) {
      // Deliberate exclusion. These three share a name across builds, so
      // immutable would pin a browser to a stale build after the next deploy.
      if (immutableChunk.test(name)) {
        problems.push(`${name}  — marked immutable, but its name is stable across builds`)
      } else {
        stats.excludedManifests++
      }
    } else if (immutableChunk.test(name)) {
      stats.immutableChunk++
    } else {
      stats.unmatched++
      problems.push(`${name}  — a fingerprinted js/css asset that the immutable rule does not match`)
    }
  } else if (ext === '.html') {
    if (revalidateHtml.test(name)) stats.revalidateHtml++
    else problems.push(`${name}  — HTML that the must-revalidate rule does not match`)
  } else if (/\.(txt|xml)$/i.test(ext)) {
    if (shortTtl.test(name)) stats.shortTtl++
    else problems.push(`${name}  — xml/txt that the 1-hour rule does not match`)
  } else if (/\.(avif|woff2|svg)$/i.test(ext)) {
    if (immutableMedia.test(htaccess) && /\.(avif|woff2|svg)$/i.test(ext)) stats.immutableMedia++
  }
}

console.log(`fingerprinted js/css immutable: ${stats.immutableChunk}`)
console.log(`build manifests excluded      : ${stats.excludedManifests}  (stable names, must not be immutable)`)
console.log(`html marked must-revalidate   : ${stats.revalidateHtml}`)
console.log(`xml/txt at 1 hour             : ${stats.shortTtl}`)
console.log(`avif/woff2 immutable rule set : ${immutableMedia.test(htaccess) ? 'yes' : 'NO'}`)
console.log(`fingerprinted assets unmatched : ${stats.unmatched}`)

if (problems.length) {
  console.error('\n.htaccess patterns do not cover the export:\n')
  for (const p of problems.slice(0, 20)) console.error('  ' + p)
  console.error('\nSee public/.htaccess and scripts/verify-htaccess.mjs.')
  process.exit(1)
}

console.log('\nEvery .htaccess cache pattern matches the real filenames in out/.')
