/**
 * Adds the flat-named copies of the App Router RSC payloads that the client
 * router actually requests.
 *
 * The bug this works around, reproduced live on interior-design.cromstelit.com:
 * every `<Link>` on the site prefetched a 404. Next 16.3.6 writes each page's
 * `__PAGE__.txt` into a nested directory:
 *
 *   emitted   about/__next.about/__PAGE__.txt
 *   requested /about/__next.about.__PAGE__.txt          <- 404
 *
 * and for a dynamic segment it nests one level deeper per segment:
 *
 *   emitted   journal/<slug>/__next.journal/$d$slug/__PAGE__.txt
 *   requested /journal/<slug>/__next.journal.$d$slug.__PAGE__.txt   <- 404
 *
 * Two separate names, so no host can serve one from the other. The export is
 * not wrong about the content and the host is not refusing the URL — a dot is
 * legal in a filename and the host returns 200 for the nested form — the file
 * simply never gets created under the name the router asks for.
 *
 * The homepage is unaffected: it has no route segment, so Next writes
 * `__next.__PAGE__.txt` flat already and that one resolves.
 *
 * So this walks the export and, for each nested payload, writes a flat alias
 * beside it. The nested originals are left in place: something else may read
 * them, and removing a file Next wrote is a worse bet than carrying ~400 KB.
 * A browser fetches whichever form the router names, so this does not double
 * anything a visitor downloads.
 *
 * Idempotent — re-running overwrites the aliases with the same bytes.
 *
 * Run after `next build`: `node scripts/fix-rsc-payloads.mjs`
 */
import { readdirSync, existsSync, copyFileSync, statSync } from 'node:fs'
import { join, dirname, relative, basename, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'out')

if (!existsSync(out)) {
  console.error('out/ not found — run `npm run build` first.')
  process.exit(1)
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

/**
 * The flat name the router asks for, or null if this file is not a nested
 * payload.
 *
 * Everything from the first `__next.*` segment onward is joined with dots, so
 * the trailing `__PAGE__.txt` becomes the last dot-separated component:
 *
 *   journal/<slug>/__next.journal/$d$slug/__PAGE__.txt
 *   -> journal/<slug>/__next.journal.$d$slug.__PAGE__.txt
 */
function flatAlias(absPath) {
  if (basename(absPath) !== '__PAGE__.txt') return null

  const segs = relative(out, absPath).split(sep)
  const start = segs.findIndex((s, i) => i > 0 && s.startsWith('__next.'))
  if (start === -1) return null // homepage payload, already flat

  const tail = segs.slice(start).join('.')
  return join(...segs.slice(0, start), tail)
}

const created = []
const skipped = []

for (const file of walk(out)) {
  const aliasRel = flatAlias(file)
  if (!aliasRel) continue

  const alias = join(out, aliasRel)
  if (existsSync(alias) && statSync(alias).size === statSync(file).size) {
    skipped.push(aliasRel)
    continue
  }

  copyFileSync(file, alias)
  created.push(aliasRel)
}

console.log(`RSC payload aliases created : ${created.length}`)
for (const a of created.slice(0, 8)) console.log(`  + ${a}`)
if (created.length > 8) console.log(`  ... and ${created.length - 8} more`)
console.log(`already present (idempotent): ${skipped.length}`)

if (created.length === 0 && skipped.length === 0) {
  console.error('\nNo nested __PAGE__.txt payloads found. Expected one per route.')
  console.error('If Next changed its export layout, revisit this script — see the')
  console.error('crawl check in scripts/crawl-out.mjs, which asserts the flat names.')
  process.exit(1)
}

console.log('\nNested payloads now resolve under both the emitted and the requested name.')