/**
 * Post-build crawl over the exported site.
 *
 * Two things a static export can get wrong that no single page test catches:
 * an internal link pointing at a route that was never built, and an
 * `og:image` naming a share card that was never generated. Both fail silently
 * in the browser -- one as a 404 on click, one as a blank card in a chat
 * preview -- and neither is visible in a build log.
 *
 * Run after `next build`: `node scripts/crawl-out.mjs`
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative, sep } from 'node:path'
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
    else if (entry.name.endsWith('.html')) acc.push(p)
  }
  return acc
}

/** Does a site-absolute href resolve to a file in the export? */
function resolves(href) {
  const rel = href.replace(/^\/+/, '')
  if (rel === '') return existsSync(join(out, 'index.html'))
  if (href.endsWith('/')) return existsSync(join(out, rel, 'index.html'))
  const direct = join(out, rel)
  if (statSyncIsFile(direct)) return true
  return existsSync(join(direct, 'index.html'))
}

function statSyncIsFile(p) {
  try {
    return statSync(p).isFile()
  } catch {
    return false
  }
}

const pages = walk(out)
const links = new Map()
const ogImages = new Map()

for (const page of pages) {
  const label = relative(out, page).split(sep).join('/')
  const html = readFileSync(page, 'utf8')

  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1]
    if (!links.has(href)) links.set(href, label)
  }
  for (const m of html.matchAll(/og:image" content="https:\/\/interior-design\.cromstelit\.com(\/images\/og\/[^"]+)"/g)) {
    const src = m[1]
    if (!ogImages.has(src)) ogImages.set(src, label)
  }
}

const broken = [...links].filter(([href]) => !resolves(href))
const missingOg = [...ogImages].filter(([src]) => !existsSync(join(out, src.replace(/^\/+/, ''))))

// Every page should have exactly one h1 and a canonical, since these are the
// two things the templates are responsible for and are easy to break in a
// refactor of the shared header.
const noH1 = []
const noCanonical = []
for (const page of pages) {
  const label = relative(out, page).split(sep).join('/')
  const html = readFileSync(page, 'utf8')
  const h1s = html.match(/<h1[\s>]/g) || []
  if (h1s.length !== 1) noH1.push(`${label}  (${h1s.length} h1)`)
  if (!/<link rel="canonical"/.test(html)) noCanonical.push(label)
}

console.log(`Pages crawled        : ${pages.length}`)
console.log(`Internal links       : ${links.size}`)
console.log(`og:image referenced  : ${ogImages.size}`)
console.log(`Broken links         : ${broken.length}`)
for (const [href, from] of broken.slice(0, 15)) console.log(`  ${from}  ->  ${href}`)
console.log(`Missing og cards     : ${missingOg.length}`)
for (const [src, from] of missingOg.slice(0, 15)) console.log(`  ${from}  ->  ${src}`)
console.log(`Pages without 1 h1   : ${noH1.length}`)
for (const p of noH1.slice(0, 15)) console.log(`  ${p}`)
console.log(`Pages missing canon. : ${noCanonical.length}`)
for (const p of noCanonical.slice(0, 15)) console.log(`  ${p}`)

if (broken.length || missingOg.length || noH1.length || noCanonical.length) {
  console.error('\nThe export has a broken internal reference. See scripts/crawl-out.mjs.')
  process.exit(1)
}

console.log('\nEvery internal link resolves, every share card exists, every page has one h1 and a canonical.')
