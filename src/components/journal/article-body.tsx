import { cn } from '@/lib/cn'
import type { JournalBlock, JournalEntry } from '@/data/journal'
import { MaskedImage } from '@/components/motion/masked-image'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'
import { lg } from '@/lib/image-variants'

const captionClass =
  'pt-3 font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone'

export function ArticleBody({ entry }: { entry: JournalEntry }) {
  let paragraphIndex = 0

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
      <div className="space-y-14 md:space-y-20">
        {entry.blocks.map((block, i) => {
          switch (block.kind) {
            case 'paragraph': {
              const isFirst = paragraphIndex === 0
              paragraphIndex += 1
              return (
                <FadeIn key={i}>
                  <p
                    className={cn(
                      'mx-auto max-w-2xl font-display text-xl font-light leading-[1.75] text-charcoal',
                      isFirst &&
                        '[&::first-letter]:float-left [&::first-letter]:mr-3 [&::first-letter]:mt-1 [&::first-letter]:font-display [&::first-letter]:text-[3.4rem] [&::first-letter]:font-medium [&::first-letter]:leading-[0.85] [&::first-letter]:text-ink',
                    )}
                  >
                    {block.text}
                  </p>
                </FadeIn>
              )
            }
            case 'heading':
              return (
                <div key={i} className="mx-auto max-w-2xl pt-4">
                  <AnimatedRule className="mb-8 w-16" />
                  <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-tight tracking-[-0.01em] text-ink">
                    {block.text}
                  </h2>
                </div>
              )
            case 'image': {
              const offset = i % 4 === 2
              return (
                <figure key={i} className={cn(offset ? 'lg:ml-auto lg:w-[84%]' : 'lg:w-[92%]')}>
                  <MaskedImage
                    src={lg(block.image.src)}
                    alt={block.image.alt}
                    ratio={block.image.ratio}
                    className="w-full"
                    sizes="(min-width: 1024px) 84vw, 100vw"
                  />
                  <figcaption className={cn(captionClass, 'mt-3 md:mt-4')}>{block.image.alt}</figcaption>
                </figure>
              )
            }
            case 'pullquote':
              return (
                <figure key={i} className="mx-auto max-w-3xl py-6 md:py-10">
                  <AnimatedRule className="mb-10 w-16 bg-ink/30" />
                  <blockquote className="text-balance font-display text-[clamp(1.7rem,4vw,2.9rem)] font-light italic leading-[1.25] tracking-[-0.01em] text-ink">
                    {block.text}
                  </blockquote>
                </figure>
              )
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}