import type { JournalEntry, JournalBlock } from '@/data/journal'
import type { Project } from '@/data/projects'

/**
 * Derived, non-factual helpers.
 *
 * Everything here is computed from copy that already exists in the data layer —
 * no facts are invented. Word counts, reading times and related-item picks are
 * all arithmetic over the published text.
 */

const WORDS_PER_MINUTE = 200

/** Flatten a block's readable text. Images carry alt text but no body copy. */
function blockText(block: JournalBlock): string {
  switch (block.kind) {
    case 'paragraph':
    case 'heading':
    case 'pullquote':
      return block.text
    case 'image':
      return block.image.alt
  }
}

export function wordCount(blocks: JournalBlock[]): number {
  return blocks
    .map(blockText)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
}

/** Rounded up to whole minutes, never below 1. */
export function readingTime(blocks: JournalBlock[]): { minutes: number; words: number } {
  const words = wordCount(blocks)
  return { minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)), words }
}

/** Every heading in an entry, for an in-page contents list. */
export function entryHeadings(blocks: JournalBlock[]): { text: string; id: string }[] {
  return blocks
    .filter((b): b is Extract<JournalBlock, { kind: 'heading' }> => b.kind === 'heading')
    .map((b) => ({ text: b.text, id: slugify(b.text) }))
}

/** Lowercase, hyphenated, ASCII-safe — stable enough for fragment ids. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Projects related to `current`, best match first.
 *
 * Ranking is by shared attribute — same category ranks above same city, which
 * ranks above same year — so a reader following one thread stays on it. The
 * result never includes the current project and never pads with filler.
 */
export function relatedProjects(current: Project, all: Project[], limit = 3): Project[] {
  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      project: p,
      score:
        (p.category === current.category ? 4 : 0) +
        (p.location === current.location ? 2 : 0) +
        (p.year === current.year ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.project.index.localeCompare(b.project.index))
    .slice(0, limit)
    .map((x) => x.project)
}

/**
 * Articles related to `current`, best match first — same category, then most
 * recent, so a journal page always offers a genuine next read.
 */
export function relatedEntries(
  current: JournalEntry,
  all: JournalEntry[],
  limit = 2
): JournalEntry[] {
  return all
    .filter((e) => e.slug !== current.slug)
    .map((e) => ({
      entry: e,
      score: e.category === current.category ? 2 : 0,
    }))
    .sort((a, b) => b.score - a.score || b.entry.dateISO.localeCompare(a.entry.dateISO))
    .slice(0, limit)
    .map((x) => x.entry)
}
