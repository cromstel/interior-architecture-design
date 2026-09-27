# citgroup & Vale — Website

The website for [citgroup & Vale](https://citgroupandvale.com), a New York interior
architecture and design studio. An editorial, static-first site: 13-section homepage,
six full project case studies, and three journal articles.

## Stack

- **Next.js 16** (App Router, static export) + **TypeScript**
- **Tailwind CSS v4** (CSS-first config in `src/app/globals.css`)
- **framer-motion 13** for designed motion (reduced-motion aware)
- **lucide-react** icons
- Fonts: Cormorant Garamond + Inter, self-hosted via `next/font` at build time

No server runtime — everything is prerendered to `.html` at export time.

## Commands

```bash
npm run dev        # local dev server
npm run build      # typecheck + production build into out/
npm run typecheck  # tsc --noEmit
npm run serve      # serve the out/ export (npx serve)
npm run optimize   # re-encode public/images/**/*.jpg -> .avif
npm run shrink     # cap any AVIF still above 400 KB to 2000px / q58
npm run og         # (re)generate the 1200x630 JPEG share cards
```

## Images

All imagery is self-hosted in `public/images/`, downloaded at authoring time from a
curated source list at two widths (base `w=1200`, `-lg` `w=2000` for large displays).
Every JPEG is then re-encoded to **AVIF**; the site references only the `.avif` files
with a `1200w`/`2000w` `srcset` plus a per-composition `sizes`, so phones never download
the large copy.

Social crawlers do not reliably render AVIF, so `public/images/og/` holds a generated
1200x630 JPEG share card per page (plus the site-wide default). These are the only
JPEGs in the project.

```bash
node scripts/fetch-images.mjs   # (re)download into .images-cache/ + public/images/, then optimizes to AVIF
npm run optimize                # re-encode public/images/**/*.jpg -> .avif (idempotent)
npm run shrink                  # cap any AVIF still above 400 KB to 2000px / q58
npm run og                      # regenerate the 1200x630 JPEG share cards
```

Source URLs live at the top of `scripts/fetch-images.mjs` (Unsplash `images.unsplash.com`
CDN links per project/journal/studio/hero/og). Swap any source URL and re-run the script
to change an image; rerun `npm run build` afterwards.

## Content

All copy lives in `src/data/`:

| File | Contents |
| --- | --- |
| `config.ts` | Business info: name, address, phone, email, socials, founders, est. |
| `projects.ts` | All 6 projects — typed `Project` schema (chapters, details, notes, final) |
| `journal.ts` | 3 journal entries — typed block schema (paragraph, heading, image, pullquote) |
| `site.ts` | Nav links, services, process stages, press, testimonials, form enums |

Edit these files to update copy; contact details (incl. the mailto target) come from
`config.ts`. SEO titles/descriptions are derived automatically in the data modules and
`src/lib/seo.ts` (`buildMeta`).

## Structure

```
src/
  app/
    layout.tsx              fonts, metadata, JSON-LD, nav, footer
    page.tsx                homepage section composition
    projects/[slug]/        project case-study template (SSG)
    journal/[slug]/         journal article template (SSG)
    not-found.tsx           editorial 404 (exports 404.html)
  components/
    motion/                 RevealText, MaskedImage, ParallaxImage, FadeIn, AnimatedRule
    home/                   11 homepage sections
    projects/               project-hero, project-sequence, project-prev-next
    journal/                article-hero, article-body, article-nav
    navigation.tsx footer.tsx floating-cta.tsx
  data/                     all copy + types
  lib/                      cn, ratios, seo, site-config
```

## Design notes

- Palette defined as CSS tokens in `globals.css` (`ivory`, `cream`, `chalk`, `sand`,
  `taupe`, `stone`, `charcoal`, `ink`, `umber`).
- Editorial rules: no cards, no gradients, no neon; asymmetric composition, varied image
  ratios, hairline animated rules, masked reveals, gentle parallax.
- `prefers-reduced-motion` is respected across all motion primitives.
- Mobile uses a full-screen animated menu and deliberately recomposed layouts.
- The contact form composes a `mailto:` to `studio@citgroupandvale.com`.

## Deployment

The build emits a fully static `out/` directory (with `404.html` and
`projects/…/index.html`, `journal/…/index.html`, plus generated `sitemap.xml` and
`robots.txt`). Deploy `out/` to any static host (Netlify, Vercel, S3/CloudFront, etc.).

`sitemap.xml` and `robots.txt` are produced by `src/app/sitemap.ts` and
`src/app/robots.ts` and derive from the data layer, so they cannot drift from the
routes that exist.