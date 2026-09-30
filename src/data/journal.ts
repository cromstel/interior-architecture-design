import type { ImageChunk } from '@/data/projects'

export type JournalBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'image'; image: ImageChunk; aspect?: string }
  | { kind: 'pullquote'; text: string }

export type JournalEntry = {
  slug: string
  title: string
  category: string
  date: string
  dateISO: string
  excerpt: string
  hero: ImageChunk
  blocks: JournalBlock[]
  seo: { title: string; description: string }
}

const img = (src: string, alt: string, ratio: 'landscape' | 'portrait' | 'square'): ImageChunk => ({
  src,
  alt,
  ratio,
})

export function journalEntries(): JournalEntry[] {
  const raw: Omit<JournalEntry, 'seo'>[] = [
    {
      slug: 'the-quiet-materiality-of-natural-stone',
      title: 'The Quiet Materiality of Natural Stone',
      category: 'Materials',
      date: 'September 2026',
      dateISO: '2026-09-01',
      excerpt:
        'On the difference between stone used as a surface and stone used as a material — and why we keep returning to it in almost every project.',
      hero: img('/images/journal/stone/journal-1-stone-hero.avif', 'A broad honed slab of grey marble, light catching the veins.', 'landscape'),
      blocks: [
        {
          kind: 'paragraph',
          text: 'Stone has a way of slowing a room down. It arrives from the earth carrying its own history — the pressure of centuries, the patterns of water — and it asks the architecture around it to be patient, to hold still and let it speak.',
        },
        {
          kind: 'paragraph',
          text: 'In a studio working with timber, plaster, and light, stone is the anchor. It is the one material that never pretends to be anything other than what it is. Wood can be finished into almost anything; plaster can imitate almost anything. Stone only offers stone.',
        },
        {
          kind: 'heading',
          text: 'Honed, never polished',
        },
        {
          kind: 'paragraph',
          text: 'We specify honed finishes almost without exception. A honed surface holds light softly, takes a fingerprint, warms under a hand. Polish is for objects — for the marble of a sculpture, not the marble of a threshold you touch every day.',
        },
        {
          kind: 'image',
          image: img('/images/journal/stone/journal-1-black-marble.avif', 'A dark, dense stone surface with fine white veining, grounded and quiet.', 'landscape'),
        },
        {
          kind: 'paragraph',
          text: 'The limestone of a stair landing, the travertine of a bathroom, a single slab at the heart of a kitchen — in each case the stone is chosen for a specific life: who will touch it, what the morning light does there, how it will weather the next twenty years.',
        },
        {
          kind: 'pullquote',
          text: 'Stone is chosen for how it ages, not for how it performs on day one.',
        },
        {
          kind: 'image',
          image: img('/images/journal/stone/journal-1-travertine.avif', 'Honed travertine wall tiles, warm cream tones and open texture against light grout.', 'portrait'),
        },
        {
          kind: 'paragraph',
          text: 'There is also the question of restraint. A material as commanding as natural stone earns its place by being used deliberately — once, in a room, to carry a quiet idea. When stone is everywhere, it is nowhere.',
        },
        {
          kind: 'heading',
          text: 'Where it does not go',
        },
        {
          kind: 'paragraph',
          text: 'Stone is unsparing about its own weaknesses, and most of them are in places we do not control. A vertical book-matched wall will read the room as a single image, and a single image is exactly what a long room does not want — it flattens the depth that makes the room feel deep. We use it in planes that the eye reads as a run, and we accept that the vein is the price of it.',
        },
        {
          kind: 'paragraph',
          text: 'It is also unforgiving of a bad substrate, which is a technical point that becomes an aesthetic one. Stone has no tolerance the way timber does: it does not move, it does not accommodate a wall that is slightly out of plumb, and it will not be sanded down. Everything behind a stone wall has to be right, and the fixing is permanent. That is a large part of why we like it.',
        },
        {
          kind: 'image',
          image: img('/images/journal/stone/journal-1-black-marble.avif', 'A dark, dense stone surface with fine white veining, grounded and quiet.', 'landscape'),
        },
        {
          kind: 'paragraph',
          text: 'The density is worth dwelling on. A dark stone in a dim room will swallow whatever light reaches it, which is why we are careful about pairing it with north-facing rooms and small openings. Set a dense black stone against a low ceiling and the room contracts. Set the same stone against a high room with generous light and it becomes a place the eye rests.',
        },
        {
          kind: 'heading',
          text: 'Sourcing, and the slab',
        },
        {
          kind: 'paragraph',
          text: 'We buy blocks rather than slabs wherever the project allows it, and the reason is that stone is quarried in batches. A single block yields stone with a continuous internal structure; a warehouse full of slabs is assembled from many blocks, and the veining will not match across them. For a staircase or a long run of counter, that continuity is the whole point, and it is only available if you commit to the block early.',
        },
        {
          kind: 'pullquote',
          text: 'Stone does not need to be perfect. It needs to be the right piece.',
        },
        {
          kind: 'paragraph',
          text: 'Which is where the studio’s library does its most practical work. We hold leaning slabs from the yards we buy from, and when a client falls in love with a particular movement in a piece, we can often find more of it. It is an unglamorous advantage, and it is the difference between a beautiful room and one that stays beautiful once every surface is cut.',
        },
        {
          kind: 'paragraph',
          text: 'The remaining question is what a stone room asks of the people in it. A kitchen of honed stone is forgiving in the way a room of polished stone is not: it will take a scratch, a ring, a dropped pan, and it will show none of them as a disaster. That is not a small thing in a room used every day for twenty years. It is the difference between a material that has to be managed and one that simply is.',
        },
      ],
    },
    {
      slug: 'designing-around-natural-light',
      title: 'Designing Around Natural Light',
      category: 'Architecture',
      date: 'August 2026',
      dateISO: '2026-08-01',
      excerpt:
        'Light is the first material we choose. On reading a room’s light before a single wall is moved, and on planning spaces for the hours they receive.',
      hero: img('/images/journal/light/journal-2-light-hero.avif', 'A bright interior volume with ceiling light falling across the room.', 'landscape'),
      blocks: [
        {
          kind: 'paragraph',
          text: 'Before we draw a single wall, we read the light. Where does the sun arrive in the morning, which rooms hold the afternoon, when does the deep shadow come? A house is a sundial before it is a plan.',
        },
        {
          kind: 'paragraph',
          text: 'The most generous spaces in any project are rarely the largest — they are the ones positioned to receive the best hours of the day. A narrow room with southern light can feel vast; a large room that faces north can feel like a corridor.',
        },
        {
          kind: 'heading',
          text: 'Designing the shadow',
        },
        {
          kind: 'paragraph',
          text: 'Equally important is what we choose not to flood with light. A stair hall borrowing light from an adjacent room, a corridor left deliberately dim so the rooms at its ends feel brighter — contrast is as much a design instrument as the light itself.',
        },
        {
          kind: 'image',
          image: img('/images/journal/light/journal-2-neutral.avif', 'A pale interior seated in soft daylight, the room defined by light moving across plaster.', 'landscape'),
        },
        {
          kind: 'pullquote',
          text: 'A house is a sundial before it is a plan.',
        },
        {
          kind: 'paragraph',
          text: 'In renovation work, light is often the hidden architecture. Opening a house front to back, replacing a narrow stair window, cutting a skylight into a dark core — these small interventions change the experience of a home more than any surface decision could.',
        },
        {
          kind: 'image',
          image: img('/images/journal/light/journal-2-stair-light.avif', 'A stair hall with a hanging lantern and light climbing the wall, portrait.', 'portrait'),
        },
        {
          kind: 'paragraph',
          text: 'The goal is never brightness for its own sake. It is to give every room a character built from the hours of the day — a room that gathers in the morning, holds the afternoon, and settles into a quiet, low-lit evening.',
        },
        {
          kind: 'heading',
          text: 'Reading a room before it exists',
        },
        {
          kind: 'paragraph',
          text: 'Before we draw anything, we go and stand in the empty space with a compass and a notebook, and we come back at three different times on the same day. It sounds fussy. It is the cheapest hour of the entire project, because every decision made from a bad reading of the light has to be paid for later in stone, plaster, or a moved wall.',
        },
        {
          kind: 'paragraph',
          text: 'What we are looking for is not the brightest spot. It is the longest period of usable daylight, the point where the sun actually enters the glass rather than glancing off a neighbouring building, and the hour when the room is at its worst — because the room has to work at its worst, not only at its best. A space that is perfect at noon and unusable at four in December is a space that is used half the time.',
        },
        {
          kind: 'image',
          image: img('/images/journal/light/journal-2-neutral.avif', 'A pale interior seated in soft daylight, the room defined by light moving across plaster.', 'landscape'),
        },
        {
          kind: 'paragraph',
          text: 'In renovation work the biggest gains are often hiding in plain sight. A blocked window that can be reopened. A stair window that was bricked up in the 1970s and is now taking a wall. A room that can be opened through to a light well it did not know it had. None of these are architectural gestures, all of them cost almost nothing next to a new staircase, and between them they are the difference between a dark house and a legible one.',
        },
        {
          kind: 'heading',
          text: 'Artificial light, honestly',
        },
        {
          kind: 'paragraph',
          text: 'No building receives usable light for every hour, and pretending otherwise is how interiors end up with a lighting scheme that fights the daylight. We design three separate conditions: what the room does in sun, what it does in overcast weather, and what it does after dark. A pendant is not a substitute for a window. It is a different thing, and the room is better for keeping the two apart.',
        },
        {
          kind: 'pullquote',
          text: 'A pendant is not a substitute for a window.',
        },
        {
          kind: 'paragraph',
          text: 'What we look for in an artificial source is the same thing we look for in a window — where the light comes from, how it lands, and what it is actually doing to the person sitting underneath it. A source that is visible and hot in frame is doing a different job from one that washes a wall. Both are legitimate. Confusing them is what makes a room feel lit rather than illuminated.',
        },
        {
          kind: 'image',
          image: img('/images/journal/light/journal-2-light-hero.avif', 'A bright interior volume with ceiling light falling across the room.', 'landscape'),
        },
        {
          kind: 'paragraph',
          text: 'The last thing light does is tell you about the building. In a heavy nineteenth-century house, a window is a small fraction of the wall and every inch of it is contested. In a new house in the Hamptons, glass can be almost the whole elevation, and the room becomes a lens on the weather. Those are very different problems, and a single lighting approach serves neither.',
        },
        {
          kind: 'paragraph',
          text: 'What holds across both is the same discipline we apply to materials: specify for the ordinary day rather than the photograph. Nobody evaluates a room from a photograph at golden hour. They stand in it at seven in the morning in February, and they want it to be legible.',
        },
      ],
    },
    {
      slug: 'inside-our-hudson-valley-material-library',
      title: 'Inside Our Hudson Valley Material Library',
      category: 'Studio',
      date: 'July 2026',
      dateISO: '2026-07-01',
      excerpt:
        'A floor of our upstate studio is given over to materials — stone, timber, textiles, and the conversation between them. A walk through the library, shelf by shelf.',
      hero: img('/images/journal/library/journal-3-library-hero.avif', 'A wall of material samples — stone, timber, and plaster — in the studio library.', 'portrait'),
      blocks: [
        {
          kind: 'paragraph',
          text: 'The library is the studio’s slowest room. Nothing in it is decided quickly. Stone slabs lean against the walls, timbers stack in cedar racks, plaster samples catch the changing light, and textiles are pinned like small paintings.',
        },
        {
          kind: 'paragraph',
          text: 'Materials come here to meet each other. We never select in isolation — a marble chooses its companions: the oak it will sit beside, the plaster it will be framed by, the brass it will be handled with.',
        },
        {
          kind: 'heading',
          text: 'Selected, then released',
        },
        {
          kind: 'paragraph',
          text: 'When a material is finally chosen it is returned to the wall of the room where it will live and left there for a season. A material that still works after a winter of light is a material that will work for twenty years.',
        },
        {
          kind: 'image',
          image: img('/images/journal/library/journal-3-wood.avif', 'Warm oak and timber samples stacked against the library wall.', 'portrait'),
        },
        {
          kind: 'pullquote',
          text: 'Materials are chosen in conversation — never alone.',
        },
        {
          kind: 'paragraph',
          text: 'The library is also where the studio’s restraint is tested. Twice as many materials are brought in as will ever be used. The work of the room is subtraction — hearing, among everything the world offers, the narrow family of things a project actually needs.',
        },
        {
          kind: 'image',
          image: img('/images/journal/library/journal-3-stone.avif', 'Stone samples — honed marble and travertine — laid flat on the studio bench.', 'landscape'),
        },
        {
          kind: 'heading',
          text: 'How the room is organised',
        },
        {
          kind: 'paragraph',
          text: 'The library has no scheme that would survive being written down. Stone leans against the long wall in roughly the order it was acquired, timber is racked by species and cut, and the plaster samples are pinned wherever there was a nail. It looks untidy and it works better than any system we have tried, because a person who works here every day can find a thing by memory in a way no labelled shelf would allow.',
        },
        {
          kind: 'image',
          image: img('/images/journal/library/journal-3-wood.avif', 'Warm oak and timber samples stacked against the library wall.', 'portrait'),
        },
        {
          kind: 'paragraph',
          text: 'What is deliberate is the material that is absent. There are no finishes, no paint pots, no fabrics, and no brochures. Every one of those is a medium in which a decision is made quickly, in a room with good lighting and a sales pitch running. Keeping them out of the library means the only things in here are things that have survived being left alone.',
        },
        {
          kind: 'paragraph',
          text: 'The textiles are the exception, and they earn it. A textile pinned to a wall behaves like a stone sample — it has to be seen in the room at the angle it will hang, in the light it will hang in. A fabric chosen in a showroom in a different city, under a different temperature, on a different day, is a photograph of a textile rather than a textile.',
        },
        {
          kind: 'heading',
          text: 'The part nobody likes',
        },
        {
          kind: 'paragraph',
          text: 'The library is also where we say no. It is very easy, with a beautiful piece of stone in front of you and a client who has just responded to it, to agree. Almost every project we have reworked has been one where a decision was made in a moment like that and never tested — a tile that was perfect in a sample tray, a green that looked extraordinary in isolation and turned out to argue with everything around it.',
        },
        {
          kind: 'pullquote',
          text: 'The library exists to make a decision slower than it feels necessary.',
        },
        {
          kind: 'paragraph',
          text: 'So the room is arranged to slow us down without appearing to do anything, which is why there is a bench, a decent light, and nowhere to sit and work on a laptop. You are meant to pick a slab up. You are meant to put it down. A material held in the hand is judged differently from the same material photographed on a wall, and the difference is usually the answer.',
        },
        {
          kind: 'paragraph',
          text: 'When a project does close, the materials that were rejected go back on the wall and stay there. They are not filed away, and they are not treated as mistakes. Most of them would be right for a different room, on a different job, for different people — and the only way we know which is which is by having them in front of us again.',
        },
      ],
    },
    // --- Press features -------------------------------------------------
    // Each entry below backs one row of `press` in site.ts, which links here
    // by slug. The site ships no external links, so a press row whose slug has
    // no matching article in this file is a dead link to our own domain.
    // `scripts/verify-press-links.mjs` fails the build if the lists diverge.
    {
      slug: 'a-townhouse-that-refuses-to-behave',
      title: 'A Townhouse That Refuses to Behave',
      category: 'Press',
      date: 'February 2026',
      dateISO: '2026-02-01',
      excerpt:
        'Six floors of Greenwich Village rooms were left legible while everything behind them was reconsidered. On the discipline of leaving a building alone long enough to hear what it is saying.',
      hero: img('/images/journal/stone/journal-1-stone-hero.avif', 'A broad honed slab of grey marble, light catching the veins.', 'landscape'),
      blocks: [
        {
          kind: 'paragraph',
          text: 'Most renovation briefs arrive as a list of things to change. The West 11th Townhouse arrived as something closer to a negotiation: the clients loved the house, and equally they did not want to live in 1891. The question was never whether to intervene. It was how much.',
        },
        {
          kind: 'paragraph',
          text: 'The building is a six-floor townhouse on West 11th Street, and it had been altered repeatedly over a hundred and thirty years. Rooms had been divided and redivided, a stair had been moved, and the rear had been reduced to a service corridor. Very little of that history was worth restoring. Most of it was simply in the way.',
        },
        {
          kind: 'heading',
          text: 'What we kept legible',
        },
        {
          kind: 'paragraph',
          text: 'The original stair hall is the clearest example. Its oak newel posts were scarred and its balustrade had been replaced with something thinner, but the geometry was intact and the light it drew down the height of the house was the single best thing the building had. We kept the geometry, repaired what was original, and removed what was not.',
        },
        {
          kind: 'image',
          image: img('/images/journal/stone/journal-1-travertine.avif', 'Honed travertine wall tiles, warm cream tones and open texture against light grout.', 'portrait'),
        },
        {
          kind: 'paragraph',
          text: 'The plaster was a second decision of the same kind. Cornice, ceiling rose, and the shallow relief along the stair walls had been painted over so many times that they read as texture rather than as form. Clearing them back was slow, unglamorous work, and it recovered the whole vertical dimension of the stair.',
        },
        {
          kind: 'pullquote',
          text: 'The house was standing before us. It will be standing after.',
        },
        {
          kind: 'paragraph',
          text: 'Behind the preserved shell, the plan was opened front to back. Four south-facing windows that had been blocked by a rear addition now pull light to the garden wall, and a stair window that had been painted shut since the 1970s was reopened. None of that is visible in a photograph. All of it changed how the house feels to be in.',
        },
        {
          kind: 'paragraph',
          text: 'The materials were then chosen to sit quietly against that shell. Travertine at the thresholds, because a hand reaches for it daily. Lime plaster, hand-finished, because it takes light softly and takes fingerprints without complaint. Oak, left to deepen rather than reflect.',
        },
        {
          kind: 'paragraph',
          text: 'What makes the project unusual is not any single room. It is that the original fabric was treated as an argument to be understood rather than a problem to be solved — and that the answer turned out to be less demolition than the clients had expected, and more patience than either of us had budgeted for.',
        },
      ],
    },
    {
      slug: 'the-loft-as-one-continuous-field',
      title: 'The Loft as One Continuous Field',
      category: 'Press',
      date: 'November 2025',
      dateISO: '2025-11-01',
      excerpt:
        'A SoHo interior in which the original fourteen-foot volume is treated as the primary material. Why the biggest decision in a loft is often what to remove.',
      hero: img('/images/journal/light/journal-2-light-hero.avif', 'A bright interior volume with ceiling light falling across the room.', 'landscape'),
      blocks: [
        {
          kind: 'paragraph',
          text: 'The Mercer Street loft had been a warren. Four rooms divided by partitions of unknown age, a dropped ceiling at eight feet, and windows that had been narrowed at some point in the last fifty years. The floor area was 4,200 square feet. The sense of it was a much smaller number.',
        },
        {
          kind: 'paragraph',
          text: 'The case for treating the volume as the primary material is simple. Fourteen feet of uninterrupted ceiling height is not something you can buy later, and it cannot be faked convincingly — a room that was carved up and then visually reassembled always reads as a series of rooms wearing a costume.',
        },
        {
          kind: 'heading',
          text: 'Removing the division',
        },
        {
          kind: 'paragraph',
          text: 'What we removed was not only the partitions. The dropped ceiling came out, the narrowed windows were returned to their original openings, and the mechanical run that had been boxed into the middle of the plan was relocated to the perimeter — which is where it should always have been.',
        },
        {
          kind: 'image',
          image: img('/images/journal/light/journal-2-stair-light.avif', 'A stair hall with a hanging lantern and light climbing the wall, portrait.', 'portrait'),
        },
        {
          kind: 'paragraph',
          text: 'With the volume open, the plan had to be re-thought around what remained: the rhythm of the original columns, which set a spacing of about eleven feet, and the position of the windows, which give the room its orientation. Every decision after that was a decision about where the divisions should fall so that the space still reads as a whole.',
        },
        {
          kind: 'pullquote',
          text: 'The columns were already a plan. We built on them.',
        },
        {
          kind: 'paragraph',
          text: 'The division that remained is cabinetry — a long run of painted oak millwork that holds the kitchen, storage, and a fireplace, and that stops short of both end walls. It is furniture rather than architecture, and it can be read as a temporary arrangement, which is exactly how it behaves.',
        },
        {
          kind: 'paragraph',
          text: 'The floors came up, were numbered, and were re-laid in a single continuous sweep. The contractor compared the job to re-stringing an instrument. What reads now as a clean modern surface is a hundred and thirty years of patina, book-matched and repaired, with the original nail holes still in place.',
        },
        {
          kind: 'paragraph',
          text: 'The lesson we took from it is not that loft conversions should always be gutted. It is that the volume is doing more work than the plan, and that a client who wants an open loft is rarely asking for fewer walls so much as for a better reason for the ones that remain.',
        },
      ],
    },
    {
      slug: 'kitchen-as-a-piece-of-architecture',
      title: 'The Kitchen as a Piece of Architecture',
      category: 'Press',
      date: 'August 2025',
      dateISO: '2025-08-01',
      excerpt:
        'Why the room that carries the most daily weight should be designed first rather than last — a note on sequencing, and on the mistakes that come from treating a kitchen as joinery.',
      hero: img('/images/journal/library/journal-3-wood.avif', 'Warm oak and timber samples stacked against the library wall.', 'portrait'),
      blocks: [
        {
          kind: 'paragraph',
          text: 'The kitchen is where a house is tested. It is the room that gets used at every hour, by everyone, and the one that most often reveals whether the rest of the plan was honest. A house can be beautifully proportioned and still have a kitchen that was added at the end.',
        },
        {
          kind: 'paragraph',
          text: 'The failure is nearly always one of sequencing. Draw the living rooms first, leave the kitchen until the plan is otherwise resolved, and it will be fitted into whatever space is left over. It will be too small, it will face the wrong way, and it will acquire a service door that nobody wanted but nobody prevented.',
        },
        {
          kind: 'heading',
          text: 'Design it first, then the rest around it',
        },
        {
          kind: 'paragraph',
          text: 'Our sequence is the reverse. The kitchen is planned in the first pass, because its requirements are the least elastic in the house. Appliance ventilation needs an exterior wall. A tall pantry needs a corner that nothing else wants. Two people cooking at once need a certain distance between a hob and a sink, and that distance is fixed regardless of how the rest of the room eventually looks.',
        },
        {
          kind: 'image',
          image: img('/images/journal/library/journal-3-stone.avif', 'Stone samples — honed marble and travertine — laid flat on the studio bench.', 'landscape'),
        },
        {
          kind: 'paragraph',
          text: 'Once those constraints are fixed, the rest of the plan negotiates around them. In a Tribeca apartment that meant accepting a smaller dining room in exchange for a kitchen with a real window; in a Hudson Valley house it meant giving the pantry the corner that might otherwise have been a study.',
        },
        {
          kind: 'pullquote',
          text: 'The kitchen is not joinery. It is the room the house is built around.',
        },
        {
          kind: 'paragraph',
          text: 'Material choices follow the same logic. A working surface is a surface that meets heat, water, and a knife edge several times a day, and it should be specified for that rather than for how it photographs on installation day. Honed stone rather than polished. A slab with enough thickness to survive a knock, set on a substrate that will not rack.',
        },
        {
          kind: 'paragraph',
          text: 'Cabinetry should read as architecture — full height where the ceiling allows, aligned to the openings, and detailed on its own terms rather than as an appliance housing. The giveaway of a kitchen added late is a run of base units that stops short of the wall because the ceiling got in the way.',
        },
        {
          kind: 'paragraph',
          text: 'None of this is novel. It is simply the consequence of treating a kitchen as a room rather than a fit-out, and of accepting that the cheapest way to finish a house is to settle its hardest room first and let everything else be designed around an answer.',
        },
      ],
    },
    {
      slug: 'a-house-that-slows-down',
      title: 'A House That Slows Down',
      category: 'Press',
      date: 'May 2024',
      dateISO: '2024-05-01',
      excerpt:
        'Inside the Hudson Valley library, where materials are selected once and then left on the wall for a season. On the value of a decision that has to survive a winter.',
      hero: img('/images/journal/library/journal-3-library-hero.avif', 'A wall of material samples — stone, timber, and plaster — in the studio library.', 'portrait'),
      blocks: [
        {
          kind: 'paragraph',
          text: 'The library is the slowest room in the studio, and the only one where we deliberately do things inefficiently. A material that has been chosen is not immediately specified. It goes back on the wall of the room where it will live, and it stays there for a season.',
        },
        {
          kind: 'paragraph',
          text: 'The reason is that a material seen in a showroom is under specific and unrepresentative conditions. It is lit evenly, it is clean, it is new, and it is being looked at by someone who has just asked for it. None of those conditions hold in a real house. What the library is for is restoring them.',
        },
        {
          kind: 'heading',
          text: 'A winter is the test',
        },
        {
          kind: 'paragraph',
          text: 'A stone slab leaned against a wall for a season is read under every kind of light the room gets — flat noon sun, raking winter sun, and the long grey days when there is barely any. A plaster sample pinned up shows its texture at the angle a wall is actually seen from. Timber left leaning in an unheated room tells you how it moves before you have cut it.',
        },
        {
          kind: 'image',
          image: img('/images/journal/stone/journal-1-black-marble.avif', 'A dark, dense stone surface with fine white veining, grounded and quiet.', 'landscape'),
        },
        {
          kind: 'paragraph',
          text: 'Some materials fail quickly. A stone that looks correct in April can turn sallow in November, because the light it was judged under is not the light it will live in. Others fail late and quietly — a plaster that is beautiful until it is washed, a timber that darkens unevenly at the reveal.',
        },
        {
          kind: 'pullquote',
          text: 'A material that survives a winter will survive twenty years.',
        },
        {
          kind: 'paragraph',
          text: 'The library is also where the studio’s restraint is enforced. Twice as many materials are brought in as will ever be used, because the argument for including a seventh material is always persuasive when it is standing on a bench and you have seen it. The work of the room is subtraction, and the bench is where most of that arguing happens.',
        },
        {
          kind: 'paragraph',
          text: 'None of this makes the studio slow in a way a client has to tolerate. It front-loads a few weeks of indecision in order to remove months of doubt later. The cost is paid once, early, in a room where nothing is at stake. The alternative is paying it repeatedly, in a house, with a floor finished and a discovery that the stone does not agree.',
        },
      ],
    },
    {
      slug: 'the-proportion-of-things',
      title: 'The Proportion of Things',
      category: 'Press',
      date: 'March 2024',
      dateISO: '2024-03-01',
      excerpt:
        'A conversation with the studio about restraint, subtraction, and why a narrow family of materials does more work than a wide one.',
      hero: img('/images/journal/light/journal-2-neutral.avif', 'A pale interior seated in soft daylight, the room defined by light moving across plaster.', 'landscape'),
      blocks: [
        {
          kind: 'paragraph',
          text: 'People often ask whether we have a signature. It is a fair question, and the honest answer is that we have a method and no look. Almost any finished interior can be photographed convincingly. What cannot be photographed is whether the room was proportioned before it was decorated.',
        },
        {
          kind: 'paragraph',
          text: 'Proportion is the least visible thing we do and the thing that determines whether everything else succeeds. Ceiling height, the width of an opening, the distance a room asks you to walk between a door and where it wants you to arrive — these are decisions that make a space feel composed without anyone being able to say why.',
        },
        {
          kind: 'heading',
          text: 'A narrow family of materials',
        },
        {
          kind: 'paragraph',
          text: 'The second discipline is that a project should use a small number of materials well. Not one, which reads as a monoculture, and not nine, which reads as a showroom. Somewhere around four or five, related closely enough that they appear to have come from the same thought, is where a room starts to feel inevitable.',
        },
        {
          kind: 'image',
          image: img('/images/journal/stone/journal-1-stone-hero.avif', 'A broad honed slab of grey marble, light catching the veins.', 'landscape'),
        },
        {
          kind: 'paragraph',
          text: 'The temptation is always the same. A client sees a handle, a tile, a particular green, and it is a good thing, and it would add something. The question is whether it adds something to the room or only to the project. Adding is easy. Holding is the discipline.',
        },
        {
          kind: 'pullquote',
          text: 'A room with three honest materials feels richer than one with nine that are merely present.',
        },
        {
          kind: 'paragraph',
          text: 'What restraint actually buys is not minimalism. It is legibility. When a room contains few materials, a person can read the room — understand that the floor is old, that the stone is the same family as the hearth, that the light is doing the work. Complexity is not the same as richness, and a room that has been over-specified often feels poorer for it, not richer.',
        },
        {
          kind: 'paragraph',
          text: 'It also ages better, which is the only test we care about. A narrow family of materials, specified for how it will wear, continues to look intentional long after a wider scheme has started to date itself one decision at a time.',
        },
      ],
    },
  ]

  return raw.map((entry) => ({
    ...entry,
    seo: {
      title: `${entry.title} — Citgroup & Vale`,
      description: entry.excerpt,
    },
  }))
}

export function getJournalEntry(slug: string): JournalEntry | undefined {
  return journalEntries().find((e) => e.slug === slug)
}
