# citgroup & Vale — Website

The website for citgroup & Vale, a New York interior architecture and design studio.
An editorial, static-first site: 11-section homepage, five standalone routes
(Projects, Studio, Services, Journal, Contact), eight full project case studies,
and eight journal articles. Published at <https://interior-design.cromstelit.com/>.

## Stack

- **Next.js 16** (App Router, static export) + **TypeScript**
- **Tailwind CSS v4** (CSS-first config in `src/app/globals.css`)
- **framer-motion 13** for designed motion (reduced-motion aware)
- **lucide-react** icons
- Fonts: Cormorant Garamond + Inter, self-hosted via `next/font` at build time

No server runtime — everything is prerendered to `.html` at export time.

## Commands

```bash
npm run dev              # local dev server (port 5712)
npm run build            # production build into out/ + all three verifiers
npm run typecheck        # tsc --noEmit
npm run links:verify     # every press row resolves to a published article
npm run crawl            # every internal link resolves, every og card exists, one h1 per page
npm run serve            # serve the out/ export (npx serve)
npm run serve:audit      # serve out/ with compression + cache headers, for auditing
npm run images:shrink    # cap any AVIF above 400 KB to 2000px / q58
npm run images:sm        # regenerate the 800w tier (idempotent)
npm run images:og        # regenerate the 1200x630 JPEG share cards
npm run images:hero404   # regenerate the 404 hero plate
npm run images:widths     # regenerate the large-tier width map (run after any image change)
npm run images:fetch     # download any photos named in ITEMS that are not on disk
```

`images:fetch` is **additive**: it writes only the paths named in `ITEMS`,
skipping any whose encoded AVIF is already present, and `--force` re-downloads.
It is not destructive. It does not, however, maintain `hero-404.avif` or the
share cards, so after adding entries to `ITEMS` run the full sequence:

```bash
npm run images:fetch && npm run images:og && npm run images:hero404 \
  && npm run images:sm && npm run images:shrink && npm run images:widths
```
```

## Images

All imagery is self-hosted in `public/images/` and ships as **AVIF** in three
widths, referenced through a `srcset` plus a per-composition `sizes` so a
handset never downloads a desktop-sized photograph:

| File | Width | Used by |
| --- | --- | --- |
| `-sm.avif` | 800 | high-DPR phones, small editorial crops |
| `.avif` | 1200 | default |
| `-lg.avif` | 2000–2400 | large displays, only where the variant exists |

The first two widths are fixed by the pipeline. The large tier is **not**: it
starts at 2400px and `images:shrink` caps any AVIF over 400 KB at 2000px, so the
large assets are a mix of both. `src/lib/image-large-tiers.ts` records the real
width of each one — generated, never hand-edited — because a width descriptor
has to equal the file's true pixel width for the browser to select correctly.
`images:widths` also asserts that the 800px and 1200px tiers have not drifted.

**Write `sizes` as a pixel cap when the layout caps the box.** An image inside a
`max-w-*` container settles at a fixed width and stops growing with the viewport,
so a `vw` value keeps climbing past it and the browser selects a larger candidate
than the element can display. Two of these existed and are now fixed: the About
page founders (`32vw` promised 320px for a 196px box) and the homepage studio
portrait (`45vw` promised 864px for a 608px box at 1920). Derive the cap from
the grid — `col-span-N` of a 12-column grid inside a `max-w-7xl` container is a
constant, not a percentage.

Candidates are derived from the path by `src/lib/responsive-image.ts` — pure
string manipulation with no filesystem access, so it is safe in client bundles.
The naming convention is fixed, which is why no disk probing is needed.

Run `npm run images:widths` after **any** change under `public/images`
(`images:fetch`, `images:shrink`, adding a photo). The build warns in
development if a large tier is missing from the map.

**The AVIF files are the source of truth.** The JPEG originals are optional working
files: `images:fetch` downloads them, encodes them, and they are then deleted to keep
the repository small. That is why there is no `optimize` command — there is nothing
left to convert. The two safe, idempotent maintenance commands operate on the AVIF
files directly.

Social crawlers do not reliably render AVIF, so `public/images/og/` holds a generated
1200x630 JPEG share card per page (plus the site-wide default). These, and the favicon,
are the only non-AVIF image files in the project.

```bash
npm run images:shrink    # cap any AVIF above 400 KB to 2000px / q58 (safe)
npm run images:sm        # regenerate the 800w tier (safe; --force to rebuild)
npm run images:og        # regenerate share cards (safe; fails loudly if the data shape changed)
npm run images:hero404   # regenerate the 404 hero plate (safe)
npm run images:fetch     # download any ITEMS photos missing from disk (additive; --force to re-download)
```

`images:og` derives its expected hero count from the data layer rather than a
hardcoded number, so adding a project or article does not require editing it. It
still fails loudly if a `hero:` stops being a call it can parse.

The favicon (`public/favicon.ico`, 16/32/48) is committed and needs no build step. It is
regenerated by `scripts/generate_favicon.py`, which is the one script outside the Node
toolchain and needs `pip install pillow`.

Source URLs live at the top of `scripts/fetch-images.mjs` (Unsplash `images.unsplash.com`
CDN links per project/journal/studio/hero/og). Swap any source URL and re-run the script
to change an image; rerun `npm run build` afterwards.

## Content

All copy lives in `src/data/`:

| File | Contents |
| --- | --- |
| `config.ts` | Business info: name, address, phone, email, socials, founders, est. |
| `projects.ts` | All 8 projects — typed `Project` schema (chapters, details, notes, final) |
| `journal.ts` | 8 journal entries — typed block schema (paragraph, heading, image, pullquote) |
| `site.ts` | Nav links, services, process stages, press, testimonials, form enums, long-form page copy |

Edit these files to update copy; contact details (incl. the mailto target) come from
`config.ts`. SEO titles/descriptions are derived automatically in the data modules and
`src/lib/seo.ts` (`buildMeta`).

The homepage sections and the standalone routes are deliberately **not** the same
copy. `/#studio`, `/#services` and `/#contact` are teasers; `/about/`, `/services/`
and `/contact/` carry the full argument in `studioStory`, `serviceDetail` and
`engagement`. Keeping one paragraph on both URLs would make them duplicate content.

Every route opens on a full-bleed photographic banner — the homepage, the project
and journal templates, the 404, and the five standalone routes. `PageHero` is the
shared banner for those five; each takes a `-lg` hero from `public/images/hero/`
and is the LCP image on its page, so each page preloads it with the same
`srcSetFor` candidate list and `sizes="100vw"` the element uses.

**The comments on the `S` map in `fetch-images.mjs` are not reliable.** They
record what each id was assumed to be when added, and several are wrong — `T4` is
filed as "plaster wall texture" but returns a suburban house, `L5` as "wood
panelling" but returns a construction crane. Eyeball a source at full size before
using it for anything visible.

**Press rows are internal links.** `press` in `site.ts` names a `slug` that must
exist in `journal.ts`, because the site ships no external links. `npm run
links:verify` (part of `build`) fails when a row dangles or a `Press`-category
article is missing from the list.

## Structure

```
src/
  app/
    layout.tsx              fonts, metadata, JSON-LD, nav, footer
    page.tsx                homepage section composition
    projects/page.tsx       project index (archive)
    projects/[slug]/        project case-study template (SSG)
    journal/page.tsx        journal index
    journal/[slug]/         journal article template (SSG)
    about/ services/ contact/  standalone editorial routes
    not-found.tsx           editorial 404 (exports 404.html)
  components/
    motion/                 RevealText, MaskedImage, ParallaxImage, FadeIn, AnimatedRule
    home/                   11 homepage sections
    about/                  founders
    projects/               project-hero, project-sequence, project-index, project-prev-next
    journal/                article-hero, article-body, article-nav, journal-index
    page-hero.tsx          photographic hero banner for the five routes
    hero-backdrop.tsx navigation.tsx footer.tsx floating-cta.tsx …
  data/                     all copy + types
  lib/
    cn.ts ratios.ts                 styling / layout helpers
    seo.ts schema.ts derived.ts     metadata, JSON-LD, computed fields
    responsive-image.ts             srcset + tier helpers (client-safe)
    image-large-tiers.ts            GENERATED: true width of each -lg asset
    image-variants.ts server-only lg() resolution via node:fs
    site-config.ts
```

`SelectedWork` switches presentation on project index: 01–08 each get their own
layout, and 09+ fall back to the `VariantTallAgainstLedger` default. Adding a
project without a variant is fine, but two consecutive fallbacks will look
repetitive.

## Design notes

- Palette defined as CSS tokens in `globals.css` (`ivory`, `cream`, `chalk`, `sand`,
  `taupe`, `stone`, `charcoal`, `ink`, `umber`).
- Editorial rules: no cards, no neon; asymmetric composition, varied image
  ratios, hairline animated rules, masked reveals, gentle parallax.
- The only gradient in the codebase is `HeroScrim`, a functional legibility wash
  that keeps chalk type above the required contrast over photography. It is not
  decorative.
- `prefers-reduced-motion` is respected across all motion primitives: each
  `framer-motion` consumer calls `useReducedMotion`, and `globals.css` carries a
  global `reduce` block.
- Mobile uses a full-screen animated menu and deliberately recomposed layouts.
- The contact form composes a `mailto:` to `studio@citgroupandvale.com`.

## Deployment

The build emits a fully static `out/` directory (with `404.html` and
`projects/…/index.html`, `journal/…/index.html`, plus generated `sitemap.xml` and
`robots.txt`). Deploy `out/` to any static host.

Live at <https://interior-design.cromstelit.com/>, served from
`/home/<user>/domains/cromstelit.com/public_html/interior-design` on Hostinger.
The path is all lowercase, and the subdomain's vhost root must match it exactly:
Linux filesystems are case-sensitive, so `Interior-design` and `interior-design`
are different directories and a mismatch shows up as a bare 404 rather than an
error.

The canonical origin lives in `SITE_ORIGIN` (`src/lib/site-config.ts`); change
that one value and rebuild when the host moves.

### What must ship alongside the HTML

Three things in `out/` look like build noise and are not. Removing any of them
breaks the site, so deploy the directory wholesale:

- **`*.txt` static shell payloads** (`index.txt`, `__next._full.txt`,
  `__next._index.txt`, `__next._tree.txt`, `__next.__PAGE__.txt`). The App Router
  client appends `.txt` to the pathname when it fetches an RSC payload, so
  `/projects/…/` becomes `/projects/…/index.txt`. Without these, every `<Link>`
  falls back to a full page load.
- **`_next/`**, which must keep its fingerprinted filenames — the cache headers
  treat them as immutable.
- **`404.html`**, referenced by the `ErrorDocument` directive.

`public/.htaccess` is copied into the export and supplies the compression and
cache headers the host does not set by itself. On Apache/LiteSpeed it is
required; on Netlify/Vercel/Cloudflare it is inert and their native config
applies instead.

### Auditing

`npm run serve:audit` serves `out/` the way a real host does — Brotli/gzip for
text assets, and `Cache-Control` headers — so a local Lighthouse run reflects a
production deployment rather than a bare file server.

Measured with Lighthouse 12, mobile emulation.
**Accessibility 100, best practices 100, SEO 100, CLS 0** on every run — those
do not move. Performance does, and the spread is ambient, not code:

| Condition | perf | FCP | LCP | TBT |
| --- | --- | --- | --- | --- |
| idle machine (5 runs) | 47–98 | 1.0–1.8s | 2.2–5.3s | 50–1790ms |
| typical desktop load (5 consecutive runs) | 71–78 | 1.6–1.8s | 3.9–4.0s | 310–510ms |

Treat TBT and the performance score as noise on a shared or scanning machine,
and quote the load-independent findings below instead.

The one real, large defect was the hero, and it was not the host.
`background-image: image-set(...), url(base)` declares two background layers,
and CSS composites every layer, so the browser fetched the hero **twice** — the
330 KB large variant *and* the 80 KB base — while the preload resolved to a
third resolution. `image-set()` also only accepts resolution descriptors, so a
full-bleed hero was sized on device pixel ratio alone and ignored its own width,
pulling desktop-sized files onto phones. `HeroBackdrop` now renders an `<img>`
with `srcset`/`sizes="100vw"`, so the preload and the element are guaranteed to
resolve to one file.

Load-independent, and the numbers worth trusting: LCP went 6.2s → 2.2–4.0s, the
hero is fetched **once** at 32.8 KB on a 412px viewport instead of three times
for 411.6 KB, LCP load delay and load time are both 0 ms, and the hero is an
element LCP is actually attributed to rather than an unattributable background.

The remaining LCP time is render delay: script evaluation and hydration of
~756 KB of JS on the homepage (~250 KB over Brotli for all text). The largest
single contributor is framer-motion at 42 KB Brotli, of which Lighthouse
estimates 57% is unused. Removing it means reimplementing the scroll reveals,
accordion, mobile menu and parallax in CSS plus `IntersectionObserver` — worth
roughly 24 KB Brotli, and it would need careful re-testing of the
reduced-motion and no-JS paths described under *Design notes*.

Two measurement traps worth keeping: Lighthouse's simulated throttling inflates
TTFB to ~0.5s even for a local static file, and a stray `next dev` server or a
busy antivirus will swing TBT by an order of magnitude. Stop stray servers
before measuring and run at least five times.

Note that Lighthouse refuses to score the 404 route: the audit server correctly
returns HTTP 404, which Lighthouse reports as `ERRORED_DOCUMENT_REQUEST` and
scores 0 across every category. That is the harness, not the page.

### Host requirements

- **Compression.** The homepage's text payload is ~956 KB uncompressed across 14
  files (JS, CSS, HTML); enable gzip or Brotli for `.html`, `.js`, `.css`, `.svg`
  and `.xml`, which brings it to ~255 KB.
- **Cache headers.** `Cache-Control: public, max-age=31536000, immutable` for
  fingerprinted files under `_next/static/`, and a short TTL for the HTML.

Netlify, Vercel and Cloudflare Pages set both by default. On a host that does
not, add them in `_headers` (Netlify/Cloudflare) or `vercel.json`.

A `browserslist` entry in `package.json` targets evergreen browsers so the build
ships no legacy polyfill bundle.