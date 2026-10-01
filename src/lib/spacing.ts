/**
 * Vertical spacing shared by the standalone routes.
 *
 * Kept here rather than in `page-hero.tsx` because that module is `'use client'`.
 * A constant exported from a client component cannot be read by a server
 * component: Next replaces the expression with a stub that throws when invoked,
 * and the rendered `class` attribute silently becomes an error message. That
 * shipped once — the build passed every verifier and the served HTML carried the
 * stub in its class list — so `scripts/verify-gutter.mjs` now also rejects any
 * client-only interpolation in the built markup.
 *
 * This is the space between a route's breadcrumb strip and its first body
 * content. It had drifted to three values: 57px on /projects/, 112px on /about/
 * /services/ /contact/, and 209px on /journal/, so the same banner led to a
 * different first line on every route. 112px is `md:py-28`, the padding the rest
 * of the editorial pages use, so this matches the site's existing rhythm rather
 * than introducing a new one.
 */
export const PAGE_TOP_GAP = 'py-20 md:py-28'
