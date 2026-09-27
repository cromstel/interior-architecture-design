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
