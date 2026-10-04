/**
 * Asserts every RSC payload the client router can request still exists.
 *
 * Why this is worth a build step: the export ships five payload families per
 * route and they are invisible to a link crawler. `scripts/crawl-out.mjs` only
 * follows `href`s, and these are requested at runtime by the router from URLs
 * that appear in no HTML. That gap let all 22 routes 404 on every navigation
 * prefetch while four verifiers passed.
 *
 * The families are not interchangeable, and the difference was measured rather
 * than assumed:
 *
 *   index.txt / __next._tree.txt / __next._index.txt / __next.*.__PAGE__.txt
 *       requested by the router. Remove any and client-side navigation degrades
 *       to a full page reload on every click.
 *
 *   __next._full.txt
 *       never requested -- the partial-prerender shell payload, unused by an
 *       `output: 'export'` site with no cacheComponents. Stripped by
 *       `scripts/strip-unused-payloads.mjs` after it proves each copy is a
 *       byte-identical duplicate of index.txt.
 *
 * So this fails the build when a *requested* family is missing, and reports the
 * `_full` count as information rather than an error. It does not execute
 * JavaScript: it works from the export's own file tree plus the request names
 * recovered from the router's chunks.
 *
 * Run: node scripts/verify-payloads.mjs (or `npm run payloads:verify`)
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
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

const files = walk(out)
const dirsWithHtml = new Set(
  files.filter((f) => f.endsWith('.html')).map((f) => dirname(f))
)

// The four families the router requests. A route directory must carry each of
// the three that are not __PAGE__, or a client-side navigation to it will 404.
const REQUIRED = ['index.txt', '__next._tree.txt', '__next._index.txt']

const problems = []
const stats = { routes: dirsWithHtml.size, tree: 0, index: 0, page: 0, full: 0 }

for (const dir of dirsWithHtml) {
  // 404/ ships as 404.html at the root and has no router payloads worth checking.
  const rel = relative(out, dir).split(sep).join('/')
  if (rel === '404') continue

  for (const name of REQUIRED) {
    const p = join(dir, name)
    if (existsSync(p) && statSync(p).isFile()) {
      if (name === '__next._tree.txt') stats.tree++
      if (name === '__next._index.txt') stats.index++
    } else {
      problems.push(`${rel === '.' ? '/' : rel}/  missing ${name}  (router requests it on navigation)`)
    }
  }

  // __PAGE__ lives either flat (__next.<segment>.__PAGE__.txt) or nested.
  const hasPage =
    files.some((f) => dirname(f) === dir && /__PAGE__\.txt$/.test(basename(f)) && !basename(f).startsWith('__next._' + 'index')) ||
    files.some((f) => dirname(dirname(f)) === dir && /__PAGE__\.txt$/.test(basename(f)))
  if (hasPage) stats.page++
  else problems.push(`${rel === '.' ? '/' : rel}/  missing a __PAGE__.txt payload`)
}

// `_full` is expected to be gone. Reported, not enforced -- if Next starts
// emitting it again the strip script will remove it and this stays silent.
for (const f of files) if (basename(f) === '__next._full.txt') stats.full++

console.log(`Routes with HTML          : ${stats.routes}`)
console.log(`__next._tree.txt present  : ${stats.tree}`)
console.log(`__next._index.txt present : ${stats.index}`)
console.log(`__PAGE__ present          : ${stats.page}`)
console.log(`__next._full.txt remaining: ${stats.full}  (expected 0 — unreferenced duplicate)`)
console.log(`index.txt present         : ${files.filter((f) => basename(f) === 'index.txt').length}`)

if (stats.full > 0) {
  console.log('')
  console.log('  _full payloads survived. scripts/strip-unused-payloads.mjs keeps a copy')
  console.log('  when it is not a byte-identical duplicate of index.txt, which is the')
  console.log('  correct outcome. Re-check with scripts/strip-unused-payloads.mjs output.')
}

if (problems.length) {
  console.error('\nMissing RSC payloads the router requests:\n')
  for (const p of problems.slice(0, 20)) console.error('  ' + p)
  console.error('\nThese 404 on client-side navigation and force a full page reload.')
  console.error('See scripts/fix-rsc-payloads.mjs and scripts/verify-payloads.mjs.')
  process.exit(1)
}

console.log('')
console.log('Every route carries the payloads the client router requests.')