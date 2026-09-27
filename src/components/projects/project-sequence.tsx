import { cn } from '@/lib/cn'
import type { ImageChunk, Project, ProjectNote } from '@/data/projects'
import { MaskedImage } from '@/components/motion/masked-image'
import { ParallaxImage } from '@/components/motion/parallax-image'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'
import { lg } from '@/lib/image-variants'

type Block =
  | { kind: 'intro'; text: string }
  | { kind: 'note'; note: ProjectNote }
  | { kind: 'fullimg'; img: ImageChunk; offset: boolean }
  | { kind: 'split'; note: ProjectNote; img: ImageChunk }
  | { kind: 'pair'; imgs: ImageChunk[] }
  | { kind: 'strip'; imgs: ImageChunk[] }
  | { kind: 'final'; img: ImageChunk }

function buildBlocks(project: Project): Block[] {
  const blocks: Block[] = [{ kind: 'intro', text: project.intro }]
  const chapters = [...project.chapters]
  const details = [...project.details]
  let detailCursor = 0

  project.notes.forEach((note, i) => {
    const img = chapters[i % chapters.length]
    if (i % 3 === 1) {
      blocks.push({ kind: 'split', note, img })
      return
    }
    blocks.push({ kind: 'note', note })
    if (i % 3 === 0) {
      blocks.push({ kind: 'fullimg', img, offset: i % 2 === 1 })
    } else if (detailCursor + 1 < details.length) {
      blocks.push({ kind: 'pair', imgs: details.slice(detailCursor, detailCursor + 2) })
      detailCursor += 2
    } else {
      blocks.push({ kind: 'fullimg', img: chapters[(i + 1) % chapters.length], offset: i % 2 === 0 })
    }
  })

  const remaining = details.slice(detailCursor)
  if (remaining.length > 0) {
    blocks.push({ kind: 'note', note: finalNote(project) })
    blocks.push({ kind: 'strip', imgs: remaining })
  }
  blocks.push({ kind: 'final', img: project.finalImage })
  return blocks
}

function finalNote(project: Project): ProjectNote {
  return {
    heading: 'Completion',
    body: `${project.title} was completed in ${project.year}. The project was delivered with the studio’s in-house team of architects, interior designers, and craftspeople, working alongside the client and a carefully selected group of builders and fabricators.`,
  }
}

export function ProjectSequence({ project }: { project: Project }) {
  const blocks = buildBlocks(project)

  return (
    <div className="overflow-hidden">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'intro':
            return (
              <FadeIn key={i} className="px-6 py-20 md:px-10 md:py-32">
                <div className="mx-auto max-w-4xl">
                  <p className="font-display text-[clamp(1.7rem,3.8vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-ink">
                    {block.text}
                  </p>
                </div>
              </FadeIn>
            )
          case 'note':
            return <NoteBlock key={i} note={block.note} />
          case 'fullimg':
            return <FullImage key={i} img={block.img} offset={block.offset} />
          case 'split':
            return <SplitBlock key={i} note={block.note} img={block.img} />
          case 'pair':
            return <PairBlock key={i} imgs={block.imgs} />
          case 'strip':
            return <StripBlock key={i} imgs={block.imgs} />
          case 'final':
            return <FinalImage key={i} img={block.img} />
        }
      })}
    </div>
  )
}

function NoteBlock({ note }: { note: ProjectNote }) {
  return (
    <div className="px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-3xl">
        <AnimatedRule />
        <div className="pt-8 md:pt-10">
          <FadeIn>
            <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-light leading-tight tracking-[-0.01em] text-ink">
              {note.heading}
            </h2>
            <p className="mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-stone md:text-base">
              {note.body}
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

function FullImage({ img, offset }: { img: ImageChunk; offset: boolean }) {
  return (
    <figure className={cn(offset ? 'lg:ml-auto lg:w-[88%]' : '')}>
      <MaskedImage
        src={lg(img.src)}
        alt={img.alt}
        ratio={img.ratio}
        className="w-full"
        sizes="(min-width: 1024px) 88vw, 100vw"
      />
      <FigureCaption text={img.alt} />
    </figure>
  )
}

function SplitBlock({ note, img, priority = false }: { note: ProjectNote; img: ImageChunk; priority?: boolean }) {
  return (
    <div className="grid gap-8 px-6 py-16 md:grid-cols-12 md:gap-0 md:px-10 md:py-24">
      <figure className="md:col-span-7">
        <MaskedImage
          src={lg(img.src)}
          alt={img.alt}
          ratio={img.ratio}
          className="w-full"
          priority={priority}
          sizes="(min-width: 768px) 56vw, 100vw"
        />
        <FigureCaption text={img.alt} className="md:hidden" />
      </figure>
      <div className="flex md:col-span-4 md:col-start-9 md:items-end">
        <FadeIn>
          <div>
            <AnimatedRule className="mb-8 hidden md:block" />
            <p className="meta-label mb-3">Note</p>
            <h2 className="font-display text-[clamp(1.5rem,2.8vw,2.2rem)] font-light leading-tight text-ink">
              {note.heading}
            </h2>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-stone">
              {note.body}
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

function PairBlock({ imgs, priority = false }: { imgs: ImageChunk[]; priority?: boolean }) {
  return (
    <div className="grid gap-6 px-6 py-12 md:grid-cols-2 md:gap-10 md:px-10 md:py-20">
      {imgs.map((img) => (
        <figure key={img.src}>
          <MaskedImage
            src={lg(img.src)}
            alt={img.alt}
            ratio={img.ratio}
            className="w-full"
            priority={priority}
            sizes="(min-width: 768px) 46vw, 100vw"
          />
          <FigureCaption text={img.alt} />
        </figure>
      ))}
    </div>
  )
}

function StripBlock({ imgs, priority = false }: { imgs: ImageChunk[]; priority?: boolean }) {
  return (
    <div className="px-6 py-12 md:px-10 md:py-20">
      <div className={cn('grid gap-6 md:gap-8', imgs.length > 1 ? 'md:grid-cols-3' : 'md:max-w-3xl')}>
        {imgs.map((img) => (
          <figure key={img.src} className={cn(imgs.length === 1 && 'md:col-span-1')}>
            <MaskedImage
              src={lg(img.src)}
              alt={img.alt}
              ratio={img.ratio}
              className="w-full"
              priority={priority}
              sizes="(min-width: 768px) 31vw, 100vw"
            />
            <FigureCaption text={img.alt} />
          </figure>
        ))}
      </div>
    </div>
  )
}

function FinalImage({ img, priority = false }: { img: ImageChunk; priority?: boolean }) {
  return (
    <div className="py-16 md:py-28">
      <figure>
        <ParallaxImage src={lg(img.src)} alt={img.alt} ratio="wide" className="w-full" amount={0.1} priority={priority} />
        <div className="px-6 md:px-10">
          <FigureCaption text={img.alt} />
        </div>
      </figure>
    </div>
  )
}

function FigureCaption({ text, className = '' }: { text: string; className?: string }) {
  return (
    <figcaption className={cn('px-6 pt-3 font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone md:px-0', className)}>
      {text}
    </figcaption>
  )
}