# Changes

## v2026-10-09 — build a081f1d (deployed)

- Hero motion (scale entrance) applied to all 5 hero sections (`ded612e`).
- `/about/` a11y link contrast fixed (`meta-label` → `meta-label-sand`; 3.8:1 → 9.5:1).
- Audit findings documented (`PERFORMANCE.md`) and deploy tracked (`VERSION`, `deploy/version-log.txt`, tag `deploy-a081f1d`).
- `serve-audit.cjs` mirror cache corrected (avif/woff2 now `immutable` 1yr, matching live `.htaccess`).
- Deploy to `interior-design.cromstelit.com`: archive uploaded via TUS, endpoint accepted, all 22 sitemap URLs 200, no `#418`, no preload warnings.

## v2026-10-08 — build 8661491 (founders)

- All three founder portraits aligned at `1200×1200` (main) / `800×800` (small), identical dimensions.
- Image-tier width map regenerated (`TIER_WIDTHS`).

## Before v2026-10-08

- Preload duplication fix (reverted `scripts/dedupe-preloads.mjs`; hydration preserved).
- `__next._full.txt` payload families stripped (`0.83 MB` saved).
- Founders square-cropped + portrait pipeline reusable (`scripts/square-founder-portrait.mjs`).
