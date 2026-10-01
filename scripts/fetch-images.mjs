/**
 * Dev-time asset pipeline: downloads curated Unsplash photographs into
 * public/images/ with descriptive, SEO-friendly filenames.
 *
 * Each image is downloaded once per width into a local cache and copied to
 * every project/journal path that references it. Run: `node scripts/fetch-images.mjs`
 */
import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { convertToAVIF } from './avif.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cacheDir = join(root, '.images-cache')
const outDir = join(root, 'public')
const WIDTHS = { base: 1200, lg: 2400 }

/** photo id -> human subject hint */
const S = {
  A1: '1762216454185-71127f1d4a95', // brownstone rows, stoop stairs (portrait exterior)
  A2: '1786254554660-4bb2deb40831', // brownstone townhouses, iron railings (landscape)
  A3: '1785253818725-0384d50e00d2', // classic brownstones, bay windows + foliage
  A4: '1767818375684-8b81eb234608', // apartment facade, windows
  L1: '1759203111456-b63e81a03cec', // loft living room, wood stove (landscape)
  L2: '1754613389158-3b13a051a81a', // minimal neutral living room (square)
  L3: '1787145879056-d02365c5b911', // terracotta plaster wall, niches
  L5: '1776062192650-95feba4c0e78', // wood panelling interior (portrait)
  K1: '1771888703722-ee7ad9143a67', // light wood kitchen, black windows
  K2: '1787143570370-25ff752b305e', // dark cabinetry + marble island
  K3: '1765371515325-b6611765dfad', // wooden kitchen, marble backsplash (portrait)
  S1: '1502005229762-cf1b2da7c5d6', // brown staircase
  S2: '1645228876759-99efda343053', // staircase w/ chandelier (portrait)
  S3: '1613798399354-29be7e0c0de4', // wooden staircase, white wall (landscape)
  S4: '1758950794507-94d3630cacd5', // ornate marble staircase
  C1: '1571599137135-361e3020d71f', // glass dome ceiling (portrait)
  H1: '1757020929242-9e82c55593f4', // hallway, plants, light (landscape)
  R1: '1736071956478-af22e3d458a5', // empty room, ceiling lights (landscape)
  P1: '1675430663473-8f82a1fca63b', // B&W woman (Claire)
  P2: '1525373953925-d9ed9fde387b', // grayscale man (Ethan)
  M1: '1550053808-52a75a05955d', // black marble closeup
  M2: '1764021996050-a9936cf2a431', // grey marble, white veins (landscape)
  M3: '1780253460298-8a8b0a4d0600', // travertine tiles (portrait)
  // Additional sources for the 2023 Penthouse and 2024 Tribeca project.
  // Reusing existing keys above is the cheaper path — only fetch what is new.
  B1: '1586023492125-27b2c045efd7', // dining room, pendant light, plaster walls
  B2: '1493809842364-78817add7ffb', // open living space, large windows (landscape)
  B3: '1600210492486-724fe5c67fb0', // reading corner, armchair, tall bookcase
  B4: '1600566753086-00f18fb6b3ea', // neutral bedroom, linen, soft daylight
  T1: '1600607687939-ce8a6c25118c', // stair hall, white oak treads (portrait)
  T2: '1600585154340-be6161a56a0c', // kitchen island, dark cabinetry (landscape)
  T3: '1600607687920-4e2a09cf159d', // travertine bathroom, stone tub
  T4: '1600566753190-17f0baa2a6c3', // plaster wall texture, shadow
  T5: '1600585154526-990dced4db0d', // city view from an interior window
}

/**
 * { src: source key, out: relative path under public/, lg?: also create -lg variant }
 */
const ITEMS = [
  // Homepage hero + OG
  { src: 'L2', out: 'images/hero/hero-homepage.jpg', lg: true },
  // Route hero banners. A4 and S4 were already in the S map but unused, so the
  // two index pages get photographs that appear nowhere else on the site. The
  // remaining three reuse established sources — the pipeline already reuses one
  // source across many outputs (L2 alone feeds seven), so this is consistent
  // with how the library is built, and no new network source was needed.
  //
  // About and Contact originally drew L5 and T5, which rendered as a yellow
  // construction crane and a night street with a bus. Both fought the palette
  // and neither said anything about a studio. They are replaced with M3 (warm
  // travertine, which is the material library the About page is about) and H1
  // (a warm corridor receding into light, which invites without shouting).
  //
  // Every hero source here was eyeballed at full size first. The comments on
  // the S map are from when each id was added and are not reliable: T4 is
  // filed as "plaster wall texture" but actually returns a suburban house.
  { src: 'A4', out: 'images/hero/hero-projects.jpg', lg: true },
  { src: 'S4', out: 'images/hero/hero-journal.jpg', lg: true },
  { src: 'M3', out: 'images/hero/hero-about.jpg', lg: true },
  { src: 'L3', out: 'images/hero/hero-services.jpg', lg: true },
  { src: 'H1', out: 'images/hero/hero-contact.jpg', lg: true },
  // Mercer Street Loft
  { src: 'L1', out: 'images/projects/mercer-street-loft/mercer-loft-hero.jpg', lg: true },
  { src: 'L2', out: 'images/projects/mercer-street-loft/mercer-loft-living.jpg' },
  { src: 'K1', out: 'images/projects/mercer-street-loft/mercer-loft-kitchen.jpg' },
  { src: 'R1', out: 'images/projects/mercer-street-loft/mercer-loft-ceiling.jpg', lg: true },
  { src: 'M2', out: 'images/projects/mercer-street-loft/mercer-loft-marble-detail.jpg' },
  { src: 'S1', out: 'images/projects/mercer-street-loft/mercer-loft-stair.jpg' },
  { src: 'L1', out: 'images/projects/mercer-street-loft/mercer-loft-evening.jpg', lg: true },
  // West 11th Townhouse
  { src: 'A2', out: 'images/projects/west-11th-townhouse/west-11th-facade.jpg', lg: true },
  { src: 'S2', out: 'images/projects/west-11th-townhouse/west-11th-staircase.jpg' },
  { src: 'K3', out: 'images/projects/west-11th-townhouse/west-11th-kitchen.jpg' },
  { src: 'M3', out: 'images/projects/west-11th-townhouse/west-11th-travertine-bath.jpg' },
  { src: 'L3', out: 'images/projects/west-11th-townhouse/west-11th-plaster-wall.jpg' },
  { src: 'C1', out: 'images/projects/west-11th-townhouse/west-11th-ceiling-molding.jpg' },
  { src: 'L5', out: 'images/projects/west-11th-townhouse/west-11th-millwork.jpg' },
  { src: 'A1', out: 'images/projects/west-11th-townhouse/west-11th-stoop.jpg' },
  { src: 'H1', out: 'images/projects/west-11th-townhouse/west-11th-hallway.jpg' },
  { src: 'M2', out: 'images/projects/west-11th-townhouse/west-11th-stone-detail.jpg' },
  { src: 'R1', out: 'images/projects/west-11th-townhouse/west-11th-garden-room.jpg', lg: true },
  // Park Avenue Residence
  { src: 'L3', out: 'images/projects/park-avenue-residence/park-avenue-living-room.jpg' },
  { src: 'K2', out: 'images/projects/park-avenue-residence/park-avenue-kitchen.jpg' },
  { src: 'H1', out: 'images/projects/park-avenue-residence/park-avenue-hallway.jpg' },
  { src: 'R1', out: 'images/projects/park-avenue-residence/park-avenue-dining.jpg', lg: true },
  { src: 'M2', out: 'images/projects/park-avenue-residence/park-avenue-marble-detail.jpg' },
  { src: 'C1', out: 'images/projects/park-avenue-residence/park-avenue-ceiling-detail.jpg' },
  { src: 'L2', out: 'images/projects/park-avenue-residence/park-avenue-evening.jpg', lg: true },
  // Amagansett House
  { src: 'H1', out: 'images/projects/amagansett-house/amagansett-hero.jpg', lg: true },
  { src: 'L2', out: 'images/projects/amagansett-house/amagansett-living.jpg' },
  { src: 'K1', out: 'images/projects/amagansett-house/amagansett-kitchen.jpg' },
  { src: 'S3', out: 'images/projects/amagansett-house/amagansett-staircase.jpg' },
  { src: 'M3', out: 'images/projects/amagansett-house/amagansett-stone-detail.jpg' },
  { src: 'L5', out: 'images/projects/amagansett-house/amagansett-wood-detail.jpg' },
  { src: 'A3', out: 'images/projects/amagansett-house/amagansett-lawn.jpg', lg: true },
  // Wythe Residence
  { src: 'K2', out: 'images/projects/wythe-residence/wythe-hero.jpg', lg: true },
  { src: 'L2', out: 'images/projects/wythe-residence/wythe-living.jpg' },
  { src: 'K1', out: 'images/projects/wythe-residence/wythe-kitchen.jpg' },
  { src: 'R1', out: 'images/projects/wythe-residence/wythe-open-room.jpg', lg: true },
  { src: 'M1', out: 'images/projects/wythe-residence/wythe-stone-detail.jpg' },
  { src: 'S1', out: 'images/projects/wythe-residence/wythe-stair.jpg' },
  { src: 'L2', out: 'images/projects/wythe-residence/wythe-evening.jpg', lg: true },
  // Hudson House
  { src: 'L5', out: 'images/projects/hudson-house/hudson-house-living.jpg', lg: true },
  { src: 'L1', out: 'images/projects/hudson-house/hudson-house-fireplace.jpg' },
  { src: 'K3', out: 'images/projects/hudson-house/hudson-house-kitchen.jpg' },
  { src: 'S3', out: 'images/projects/hudson-house/hudson-house-stair.jpg' },
  { src: 'M2', out: 'images/projects/hudson-house/hudson-house-stone-detail.jpg' },
  { src: 'H1', out: 'images/projects/hudson-house/hudson-house-hallway.jpg' },
  { src: 'A3', out: 'images/projects/hudson-house/hudson-house-orchard.jpg', lg: true },
  // Tribeca Penthouse (project 07)
  { src: 'B2', out: 'images/projects/tribeca-penthouse/penthouse-living.jpg', lg: true },
  { src: 'B1', out: 'images/projects/tribeca-penthouse/penthouse-dining.jpg' },
  { src: 'B3', out: 'images/projects/tribeca-penthouse/penthouse-reading.jpg' },
  { src: 'B4', out: 'images/projects/tribeca-penthouse/penthouse-bedroom.jpg' },
  { src: 'T2', out: 'images/projects/tribeca-penthouse/penthouse-kitchen.jpg' },
  { src: 'M2', out: 'images/projects/tribeca-penthouse/penthouse-stone-detail.jpg' },
  { src: 'T4', out: 'images/projects/tribeca-penthouse/penthouse-plaster-wall.jpg' },
  { src: 'T5', out: 'images/projects/tribeca-penthouse/penthouse-view.jpg', lg: true },
  // Baxter Street Residence (project 08)
  { src: 'T1', out: 'images/projects/baxter-street-residence/baxter-stair.jpg', lg: true },
  { src: 'T2', out: 'images/projects/baxter-street-residence/baxter-kitchen.jpg' },
  { src: 'B1', out: 'images/projects/baxter-street-residence/baxter-living.jpg' },
  { src: 'T3', out: 'images/projects/baxter-street-residence/baxter-bath.jpg' },
  { src: 'M3', out: 'images/projects/baxter-street-residence/baxter-tile.jpg' },
  { src: 'H1', out: 'images/projects/baxter-street-residence/baxter-hallway.jpg' },
  { src: 'B3', out: 'images/projects/baxter-street-residence/baxter-study.jpg' },
  { src: 'B2', out: 'images/projects/baxter-street-residence/baxter-evening.jpg', lg: true },
  // Studio founders
  { src: 'P1', out: 'images/studio/founders-claire-citgroup.jpg' },
  { src: 'P2', out: 'images/studio/founders-ethan-vale.jpg' },
  // Journal — The Quiet Materiality of Natural Stone
  { src: 'M2', out: 'images/journal/stone/journal-1-stone-hero.jpg', lg: true },
  { src: 'M1', out: 'images/journal/stone/journal-1-black-marble.jpg' },
  { src: 'M3', out: 'images/journal/stone/journal-1-travertine.jpg' },
  // Journal — Designing Around Natural Light
  { src: 'R1', out: 'images/journal/light/journal-2-light-hero.jpg', lg: true },
  { src: 'L2', out: 'images/journal/light/journal-2-neutral.jpg' },
  { src: 'S2', out: 'images/journal/light/journal-2-stair-light.jpg' },
  // Journal — Inside Our Hudson Valley Material Library
  { src: 'M3', out: 'images/journal/library/journal-3-library-hero.jpg', lg: true },
  { src: 'L5', out: 'images/journal/library/journal-3-wood.jpg' },
  { src: 'M1', out: 'images/journal/library/journal-3-stone.jpg' },
]

function cachePath(photoId, width) {
  return join(cacheDir, `${photoId}-${width}.jpg`)
}

async function ensureCached(photoId, width) {
  const target = cachePath(photoId, width)
  try {
    await readFile(target)
    return
  } catch {}
  const url = `https://images.unsplash.com/photo-${photoId}?auto=format&fm=jpg&fit=crop&w=${width}&q=80`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed (${res.status}) for ${photoId}@${width}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(target, buf)
  console.log(`  downloaded ${photoId}@${width}`)
}

/**
 * Destinations for a single ITEMS entry, one per width actually requested.
 *
 * The `lg: true` entries get two candidates (1200w + 2400w); the rest get one.
 * Returned as paths so the caller can both skip work and clean up afterwards.
 */
function targetsFor(item) {
  const out = []
  for (const [suffix, width] of Object.entries(WIDTHS)) {
    if (suffix === 'lg' && !item.lg) continue
    const file = item.out.replace(/\.jpg$/, suffix === 'lg' ? '-lg.jpg' : '.jpg')
    out.push({ width, file, encoded: file.replace(/\.jpg$/, '.avif') })
  }
  return out
}

async function main() {
  const force = process.argv.includes('--force')
  await mkdir(cacheDir, { recursive: true })

  // Additive by design. This used to `rm -rf public/images`, which destroyed
  // all 137 encoded AVIFs on every run — including `hero-404.avif` and the nine
  // per-slug OG cards, neither of which is produced by this script. Those come
  // from `npm run images:hero404` and `npm run images:og`, so a plain fetch
  // silently deleted assets it could never restore. It now only writes the
  // paths named in ITEMS and leaves everything else alone.
  const pending = []
  const skipped = []

  for (const item of ITEMS) {
    const targets = targetsFor(item)
    // Presence is tested on the encoded AVIF, never the JPEG: the JPEGs are
    // working sources that are deleted after encoding, so a `.jpg` check always
    // misses and re-encodes every file on every run. That re-encoding silently
    // undid `images:shrink`, widening the 2000px `-lg` assets back to 2400px.
    const already = force ? [] : targets.filter((t) => existsSync(join(outDir, t.encoded)))
    for (const t of targets) {
      if (already.includes(t)) {
        skipped.push(t.file)
        continue
      }
      pending.push(t)
    }
  }

  if (pending.length === 0) {
    console.log(`All ${ITEMS.length} items already present. Nothing to fetch.`)
    console.log('Re-run with --force to re-download and re-encode.')
    return
  }

  console.log(
    `Fetching ${pending.length} file(s) across ${ITEMS.length} items` +
      (skipped.length ? ` (skipping ${skipped.length} already present)` : '') +
      (force ? ' — forced' : '')
  )

  for (const { width, file } of pending) {
    const item = ITEMS.find((i) => targetsFor(i).some((t) => t.file === file))
    await ensureCached(S[item.src], width)
    const dest = join(outDir, file)
    await mkdir(dirname(dest), { recursive: true })
    await copyFile(cachePath(S[item.src], width), dest)
  }

  // OpenGraph share card (wide crop of the homepage hero). Only when the hero
  // itself was just written — otherwise re-copying would overwrite the card
  // that `images:og` re-cropped to 1200x630.
  if (pending.some((t) => t.file === 'images/hero/hero-homepage.jpg')) {
    const ogSrc = join(outDir, 'images/hero/hero-homepage.jpg')
    const ogDir = join(outDir, 'images/og')
    await mkdir(ogDir, { recursive: true })
    await copyFile(ogSrc, join(ogDir, 'og-citgroup-and-vale.jpg'))
  }

  // Encode to AVIF (og/ is deliberately left JPEG). The JPEGs are working
  // sources, not deliverables — the site ships AVIF only, so they are removed
  // once encoded to keep the tree in the same state as before.
  const { converted, saved } = await convertToAVIF()
  console.log(
    `Encoded ${converted} images to AVIF (-${(saved / 1024 / 1024).toFixed(2)} MB).`
  )

  for (const { file } of pending) {
    await rm(join(outDir, file), { force: true })
  }
  console.log(`Removed ${pending.length} working JPEG(s).`)

  console.log('Remaining steps: `npm run images:og`, `npm run images:hero404`,')
  console.log('`npm run images:sm`, `npm run images:shrink`, `npm run images:widths`.')
  console.log('Only those five maintain assets this script does not own.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})