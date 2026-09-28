import type { ImageRatio } from '@/data/projects'

/** Not exported: only `ratioClass` below consumes this lookup. */
const ratioClasses: Record<ImageRatio, string> = {
  landscape: 'aspect-[16/11]',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
}

export function ratioClass(ratio?: ImageRatio | string): string {
  if (!ratio) return ratioClasses.landscape
  return ratioClasses[ratio as ImageRatio] ?? ratioClasses.landscape
}