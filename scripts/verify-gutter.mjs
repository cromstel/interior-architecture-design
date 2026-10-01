/**
 * Checks that a `PageHero` banner's text sits on the same left axis as the body
 * sections beneath it.
 *
 * The failure this guards against is easy to introduce and invisible on a
 * laptop. `PageHero` wraps its plate in `mx-auto max-w-7xl` to match the body
 * sections; a narrower or un-centred plate (`max-w-5xl` with no `mx-auto`) also
 * lines up while the viewport is under the 1280px container cap, because both
 * then fill the available width. Above the cap the body centres and the banner
 * stays against the page padding, and the two drift apart — measured at 280px
 * on a 1920px viewport. Nothing in a build, typecheck or unit test sees it.
 *
 * This reads the built HTML for the container classes rather than driving a
 * browser, so it runs in CI without Chrome. It asserts the invariant directly:
 * every `PageHero` plate must carry the same container classes the body
 * sections use.
 *
 * Run: `node scripts/verify-gutter.mjs` (or `npm run gutter:verify`)
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'out')

if (!existsSync(out)) {
  console.error('out/ not found — run `npm run build` first.')
  process.exit(1)
}

// The container the body sections use. Kept as a literal so this fails loudly if
// the design token changes, rather than drifting in step with the CSS.
const REQUIRED = ['mx-auto', 'max-w-7xl']

/**
 * Every `max-w-7xl` in the document must be centred, hero and body alike.
 *
 * The hero plate was the first instance of this and the project and journal
 * index wrappers the second — all three rendered the right width but stuck to
 * the page gutter, so they sat on a different left axis from the sections around
 * them. Checking only the hero would have left the other two free to regress.
 */
function uncentredMaxW7xl(html) {
  return [...html.matchAll(/class="([^"]*\bmax-w-7xl\b[^"]*)"/g)]
    .map((m) => m[1])
    .filter((cls) => !cls.split(/\s+/).includes('mx-auto'))
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else if (entry.name.endsWith('.html')) acc.push(p)
  }
  return acc
}

const routes = ['about', 'services', 'contact', 'projects', 'journal']
const problems = []

for (const route of routes) {
  const file = join(out, route, 'index.html')
  if (!existsSync(file)) {
    problems.push(`${route}/  — page not found in the export`)
    continue
  }
  const html = readFileSync(file, 'utf8')

  // Locate the h1 first, then take the header segment that actually contains
  // it. Matching `<header>...</header>` non-greedily from the top of the
  // document finds the site navigation instead, because the nav is also a
  // <header> and it comes first.
  const h1Index = html.indexOf('<h1')
  if (h1Index < 0) {
    problems.push(`${route}/  — no <h1> in the export`)
    continue
  }

  const headerStart = html.lastIndexOf('<header', h1Index)
  if (headerStart < 0) {
    problems.push(`${route}/  — the <h1> is not inside a <header> (is the PageHero still rendered?)`)
    continue
  }

  // Walk back from the h1 to the nearest opening <div> that carries a class
  // list. That is the plate: the container holding the eyebrow, title and lede.
  const before = html.slice(headerStart, h1Index)
  const openTags = [...before.matchAll(/<div class="([^"]*)"/g)]
  const plate = openTags[openTags.length - 1]
  if (!plate) {
    problems.push(`${route}/  — could not locate the hero text plate`)
    continue
  }

  const classes = plate[1].split(/\s+/)
  const missing = REQUIRED.filter((c) => !classes.includes(c))
  if (missing.length) {
    problems.push(
      `${route}/  — hero plate is "${plate[1]}", missing ${missing.join(' + ')}.\n` +
        '      It must match the body sections or the banner drifts off the left axis\n' +
        '      above the 1280px container cap.',
    )
  }

  // Now the rest of the page: any other max-w-7xl that is not centred.
  const uncentred = uncentredMaxW7xl(html)
  for (const cls of uncentred) {
    problems.push(
      `${route}/  — a body container is "${cls}", missing mx-auto.\n` +
        '      An uncentred max-w-7xl sits on a different left axis from the banner above it.',
    )
  }
}

// --- A client-only constant must not be interpolated into server markup -----
//
// This is the check that would have caught the first attempt at PAGE_TOP_GAP.
// Exported from a `'use client'` module, a constant read by a server component
// is replaced at build time with a stub that throws when invoked, so the emitted
// class attribute becomes an error message. It compiled, and every other
// verifier passed, because they all read class *names* and never execute JS.
// Rejecting the stub text is the only place this shows up.
const CLIENT_STUB = 'Attempted to call'

for (const file of walk(out)) {
  const label = relative(out, file).split('\\').join('/')
  if (readFileSync(file, 'utf8').includes(CLIENT_STUB)) {
    problems.push(
      `${label}  — a client component was interpolated into server markup.\n` +
        '      Constants shared with server components must live outside a ' +
        "'use client' module.",
    )
  }
}

// --- Vertical: every route must open its body at the same distance ----------
//
// The identical hero led to three different first lines: 57px on /projects/,
// 112px on /about/ /services/ /contact/, and 209px on /journal/. The value is
// shared as PAGE_TOP_GAP, so the check below is on the source rather than on
// rendered pixels — the two index components also carry their own top padding,
// which is what made the drift possible in the first place.
const topGapSource = readFileSync(join(root, 'src', 'lib', 'spacing.ts'), 'utf8')
const expectedGap = topGapSource.match(/PAGE_TOP_GAP\s*=\s*'([^']+)'/)?.[1]
if (!expectedGap) {
  problems.push('src/lib/spacing.ts  — PAGE_TOP_GAP is not defined; the routes cannot agree on the top gap')
} else {
  for (const route of routes) {
    const page = readFileSync(join(root, 'src', 'app', route, 'page.tsx'), 'utf8')
    if (!page.includes('PAGE_TOP_GAP')) {
      problems.push(`${route}/  — the opening section does not use PAGE_TOP_GAP ("${expectedGap}")`)
    }
  }
  // The index components must not add their own top padding on top of it.
  for (const [file, match] of [
    ['projects/project-index.tsx', 'border-t'],
    ['journal/journal-index.tsx', 'journal-lead'],
  ]) {
    const src = readFileSync(join(root, 'src', 'components', file), 'utf8')
    const line = src.split('\n').find((l) => l.includes(match)) ?? ''
    if (/max-w-7xl[^"]*\bpt-\d/.test(line)) {
      problems.push(`components/${file}  — adds its own top padding, which double-counts against PAGE_TOP_GAP`)
    }
  }
}

if (problems.length) {
  console.error('Gutter mismatch:\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee src/components/page-hero.tsx and scripts/verify-gutter.mjs.')
  process.exit(1)
}

console.log(
  `Gutter verified on ${routes.length} routes: every max-w-7xl is centred, ` +
    `and all five open their body at the same vertical gap (${expectedGap}).`,
)
