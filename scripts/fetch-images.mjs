/**
 * Dev-time asset pipeline: downloads curated Unsplash photographs into
 * public/images/ with descriptive, SEO-friendly filenames.
 *
 * Each image is downloaded once per width into a local cache and copied to
 * every project/journal path that references it. Run: `node scripts/fetch-images.mjs`
 */
import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises'
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
}

/**
 * { src: source key, out: relative path under public/, lg?: also create -lg variant }
 */
const ITEMS = [
  // Homepage hero + OG
  { src: 'L2', out: 'images/hero/hero-homepage.jpg', lg: true },
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

async function main() {
  await mkdir(cacheDir, { recursive: true })
  await rm(join(outDir, 'images'), { recursive: true, force: true })
  console.log(`Fetching ${ITEMS.length} images (\u00d72 widths)`)

  for (const item of ITEMS) {
    for (const [suffix, width] of Object.entries(WIDTHS)) {
      if (suffix === 'lg' && !item.lg) continue
      await ensureCached(S[item.src], width)
      const file = item.out.replace(/\.jpg$/, suffix === 'lg' ? '-lg.jpg' : '.jpg')
      const dest = join(outDir, file)
      await mkdir(dirname(dest), { recursive: true })
      await copyFile(cachePath(S[item.src], width), dest)
    }
  }

  // OpenGraph share card (wide crop of the homepage hero)
  const ogSrc = join(outDir, 'images/hero/hero-homepage.jpg')
  const ogDir = join(outDir, 'images/og')
  await mkdir(ogDir, { recursive: true })
  await copyFile(ogSrc, join(ogDir, 'og-citgroup-and-vale.jpg'))

  // Encode every downloaded JPEG to AVIF (og/ is deliberately left JPEG).
  const { converted, saved } = await convertToAVIF()
  console.log(
    `Encoded ${converted} images to AVIF (-${(saved / 1024 / 1024).toFixed(2)} MB).`
  )
  console.log('Share cards are generated separately: `npm run images:og`.')
  console.log('Done. All images written to public/images/.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})