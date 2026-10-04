/**
 * Removes `__next._full.txt` from the export, but only while it is provably dead.
 *
 * Next 16.3.6 emits five families of RSC payload per route. Four of them are
 * load-bearing and one is not:
 *
 *   index.txt           the route's RSC payload; the router fetches it on every
 *                       client-side navigation. Deleting it forces a full reload.
 *   __next._tree.txt    route-tree payload, refetched during link prefetch.
 *   __next._index.txt   fetched on initial load.
 *   __next.*.__PAGE__   the page payload -- the flat alias is the fix for every
 *                       "preloaded but not used"/404 in the console.
 *   __next._full.txt    NOT REQUESTED. This one.
 *
 * `_full` is the payload for a partially prerendered shell, which this site does
 * not use: `next.config.ts` is `output: 'export'` with no `cacheComponents` and
 * no `ppr`. Three independent checks agree it is dead weight here:
 *
 *   1. Nothing names it. Not one JS chunk, not one HTML file, not one RSC
 *      payload contains the string `_full`, while `_tree`, `_index` and
 *      `index.txt` are all named in the router's own chunks.
 *   2. The browser never fetches it. Recorded across hard loads and client-side
 *      clicks on every route shape; the requested set is `index.txt`, `_tree`,
 *      `_index` and `__PAGE__` only.
 *   3. It is byte-identical to the sibling `index.txt` for all 23 routes, so it
 *      is pure duplication rather than a distinct artifact.
 *
 * Reclaims 23 files / 0.83 MB uncompressed for nothing.
 *
 * The removal is conditional on that evidence, re-checked per route at build
 * time rather than assumed from this comment. If a future Next version emits a
 * `_full` that differs from `index.txt`, or starts referencing it, this script
 * leaves every file alone and says why. Deleting a payload Next may need is a
 * far worse outcome than shipping 0.83 MB, so the guard is the point.
 */
import { readdirSync, readFileSync, existsSync, rmSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname, basename, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'out')
const TARGET = '__next._full.txt'

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

const files = walk(out)
const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex')

// Check 1, re-run at build time: does any shipped artifact name `_full`?
const referenceHolders = []
for (const f of files) {
  if (f.endsWith('.txt') && basename(f) === TARGET) continue
  if (!/\.(js|html|txt)$/i.test(f)) continue
  let text
  try { text = readFileSync(f, 'utf8') } catch { continue }
  if (text.includes('_full')) referenceHolders.push(relative(out, f).split(sep).join('/'))
}

if (referenceHolders.length) {
  console.log(`Kept every ${TARGET}: ${referenceHolders.length} file(s) reference it.`)
  for (const r of referenceHolders.slice(0, 8)) console.log(`  referenced by ${r}`)
  console.log('')
  console.log('A payload something still asks for is not dead weight. Nothing removed.')
  process.exit(0)
}

const candidates = files.filter((f) => basename(f) === TARGET)
const kept = []
let removed = 0
let bytes = 0

for (const f of candidates) {
  // Check 3: only drop it if it is an exact duplicate of the sibling that the
  // router does fetch. If they differ, `_full` may carry something unique.
  const sibling = join(dirname(f), 'index.txt')
  if (!existsSync(sibling) || sha(f) !== sha(sibling)) {
    kept.push(relative(out, f).split(sep).join('/'))
    continue
  }
  bytes += statSync(f).size
  rmSync(f)
  removed++
}

console.log(`${TARGET} removed : ${removed} of ${candidates.length}`)
if (bytes) console.log(`bytes reclaimed: ${(bytes / 1024 / 1024).toFixed(2)} MB uncompressed`)
if (kept.length) {
  console.log(`kept (not an exact duplicate of index.txt): ${kept.length}`)
  for (const k of kept.slice(0, 8)) console.log(`  ${k}`)
}

if (removed === 0 && kept.length === 0) {
  console.error(`\nNo ${TARGET} found in the export.`)
  console.error('If Next stopped emitting it, this script has nothing to do — that is fine,')
  console.error('but it means the reclaim has already happened upstream.')
}

if (kept.length) {
  console.log('')
  console.log('Some payloads were kept because they differ from index.txt. Those may carry')
  console.log('content the router needs; verify with scripts/verify-payloads.mjs before removing.')
}
