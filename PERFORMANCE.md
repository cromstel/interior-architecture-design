# Performance Audit — interior-design.cromstelit.com (commit a081f1d)

Method: Lighthouse 13.5.0 via `npm run serve:audit` (mirror on `localhost:4600`, brotli q5 + cache headers). 18 runs: `/` ×3 per preset (median reported), 6 subroutes ×1 per preset. Live WAF-protected URL (`interior-design.cromstelit.com`) not audited headless — verified via browser (200, headings render, console clean). Baseline from earlier session: mobile perf 51, desktop 96, a11y/bp/seo 100, CLS 0.0.

## Scores (median of repeats for `/`)

Mobile: perf **59**, LCP **4.94s**, FCP 2.20s, CLS **0.000**, TBT 1112ms, A11y 100, BP 100, SEO 100. Desktop: perf **93**, LCP 1.22s, CLS 0.000, A11y 100.

No regression vs baseline for `ded612e`; desktop −3 is within ambient band + Lighthouse major-version change. `a081f1d` fixed the one real regression (`/about/` a11y 96 → 100 after meta-label-sand).

## Verify-only (hero motion) — all 7 checks passed

- CLS 0.000 (transforms are layout-inert). LCP element = hero `<img>` on all routes. 1 preload per hero (25/25 agree); duplicates (21 pages) coalesce — do not strip (breaks #418). No `#418`, no preload warnings, reduced-motion guard present.

## Real findings (resolved or documented)

1. `/about/` contrast (fixed `a081f1d`). 2. Mirror cache mismatch (fixed `serve-audit.cjs`). 3. LCP mobile poor band — pre-existing (hydration main-thread work, not motion). 4. Image tier — verified working; 1600w tier is a pipeline option. 5. JS polyfill layer — verified present; browserslist at `chrome>=111`; requires build-level change.

## Deploy record

- Archive: `interior-design-site.zip` (29.52 MB, 394 entries, flat, forward-slash). Endpoint `hosting_websites_deploy-static-site-archive`: `Request accepted`. TUS upload verified (`201` created / `204` complete).
- VERSION: `a081f1d`; tag: `deploy-a081f1d`; commit `16b90f9` (version file + deploy log).
