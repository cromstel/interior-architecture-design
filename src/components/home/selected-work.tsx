'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { srcSetFor } from '@/lib/responsive-image'
import type { Project } from '@/data/projects'
import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'

const EASE = [0.16, 1, 0.3, 1] as const

function ProjectImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string
  alt: string
  sizes?: string
  className?: string
}) {
  const reduced = useReducedMotion()
  // Three candidates (800w / 1200w / 2000w) so a handset never pulls a
  // desktop-sized photograph for a partial-width composition.
  const srcSet = srcSetFor(src)
  return (
    <motion.img
      src={src}
      srcSet={srcSet}
      sizes={sizes ?? '100vw'}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn(
        'block h-full w-full object-cover will-change-transform',
        reduced ? '' : 'origin-center',
        className,
      )}
      initial={reduced ? false : { y: '10%', scale: 1.14 }}
      whileInView={reduced ? undefined : { y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: EASE }}
      whileHover={reduced ? undefined : { scale: 1.05 }}
    />
  )
}

function OverlayLink({
  slug,
  children,
  className,
}: {
  slug: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link href={`/projects/${slug}`} className={cn('group block', className)}>
      {children}
    </Link>
  )
}

function MetaLine({ project, light = false }: { project: Project; light?: boolean }) {
  return (
    <p
      className={cn(
        'font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] leading-loose',
        light ? 'text-chalk/70' : 'text-stone',
      )}
    >
      {project.location}
      <span className="mx-2" aria-hidden>
        ·
      </span>
      {project.category}
      <span className="mx-2" aria-hidden>
        ·
      </span>
      {project.area}
    </p>
  )
}

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5"
    >
      →
    </span>
  )
}

export function SelectedWork({ projects }: { projects: Project[] }) {
  const all = projects

  return (
    <section id="projects" className="scroll-mt-24 px-6 md:px-10">
      <div className="max-w-7xl">
        <div className="flex items-end justify-between gap-6 pb-10 md:pb-16">
          <RevealText
            as="h2"
            text="Selected Work"
            className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-none tracking-[-0.01em] text-ink"
          />
          <FadeIn delay={0.2} className="hidden pb-2 md:block">
            <p className="meta-label">2016 — 2026</p>
          </FadeIn>
        </div>

        <div className="space-y-24 md:space-y-40">
          {all.map((project, i) => (
            <Variant key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Variant({ project, index }: { project: Project; index: number }) {
  switch (index) {
    case 0:
      return <VariantFullBleed project={project} />
    case 1:
      return <VariantSplit project={project} />
    case 2:
      return <VariantPortraitOffset project={project} />
    case 3:
      return <VariantBeside project={project} />
    case 4:
      return <VariantLeftEdge project={project} />
    case 5:
      return <VariantOffsetWide project={project} />
    case 6:
      return <VariantPortraitLead project={project} />
    default:
      return <VariantTallAgainstLedger project={project} />
  }
}

/** 01 · Mercer Street Loft — almost the entire viewport, title over photography. */
function VariantFullBleed({ project }: { project: Project }) {
  return (
    <OverlayLink slug={project.slug}>
      <div className="relative h-[78vh] min-h-[480px] overflow-hidden md:h-[92vh]">
        <ProjectImage src={project.hero.src} alt={project.hero.alt} sizes="100vw" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,9,7,0.62) 0%, rgba(10,9,7,0.08) 40%, rgba(10,9,7,0) 65%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-12">
          <p className="font-display text-sm italic text-chalk/80">{project.index}</p>
          <h3 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-none tracking-[-0.01em] text-chalk">
            {project.title} <Arrow />
          </h3>
          <MetaLine project={project} light />
        </div>
      </div>
    </OverlayLink>
  )
}

/** 02 · West 11th Townhouse — narrative column beside a tall portrait. */
function VariantSplit({ project }: { project: Project }) {
  return (
    <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-6">
      <div className="order-2 md:order-1 md:col-span-6 md:pl-2 lg:col-span-5">
        <FadeIn delay={0.1}>
          <p className="font-display text-sm italic text-stone">{project.index}</p>
          <h3 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.9rem)] font-light leading-[1.02] tracking-[-0.01em] text-ink">
            {project.title}
          </h3>
          <MetaLine project={project} />
          <p className="mt-7 max-w-sm font-sans text-sm font-light leading-relaxed text-stone">
            {project.summary}
          </p>
          <OverlayLink slug={project.slug} className="mt-9">
            <span className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink">
              View Project <Arrow />
            </span>
          </OverlayLink>
        </FadeIn>
      </div>

      <div className="order-1 md:order-2 md:col-span-6 lg:col-span-7">
        <OverlayLink slug={project.slug}>
          <div className="relative aspect-[3/4] overflow-hidden md:ml-6 lg:ml-12">
            <ProjectImage
              src={project.hero.src}
              alt={project.hero.alt}
              sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        </OverlayLink>
      </div>
    </div>
  )
}

/** 03 · Park Avenue Residence — image left, editorial metadata right. */
function VariantPortraitOffset({ project }: { project: Project }) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-12 md:gap-6">
      <div className="mx-auto w-full max-w-md md:col-span-6 lg:col-span-7">
        <OverlayLink slug={project.slug}>
          <div className="relative aspect-[4/5] overflow-hidden md:-mr-6 lg:-mr-10">
            <ProjectImage
              src={project.hero.src}
              alt={project.hero.alt}
              sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        </OverlayLink>
      </div>
      <div className="md:col-span-5 md:col-start-9 lg:col-span-4">
        <FadeIn delay={0.15}>
          <p className="font-display text-sm italic text-stone">{project.index}</p>
          <h3 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.9rem)] font-light leading-[1.02] tracking-[-0.01em] text-ink">
            {project.title}
          </h3>
          <MetaLine project={project} />
          <p className="mt-7 max-w-xs font-sans text-sm font-light leading-relaxed text-stone">
            {project.summary}
          </p>
          <div className="mt-9">
            <OverlayLink slug={project.slug}>
              <span className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink">
                View Project <Arrow />
              </span>
            </OverlayLink>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

/** 04 · Amagansett House — wide photograph with metadata beside it. */
function VariantBeside({ project }: { project: Project }) {
  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-6">
      <div className="md:col-span-8">
        <OverlayLink slug={project.slug}>
          <div className="relative aspect-[16/10] overflow-hidden">
            <ProjectImage
              src={project.hero.src}
              alt={project.hero.alt}
              sizes="(min-width: 768px) 66vw, 100vw"
            />
          </div>
        </OverlayLink>
      </div>
      <div className="flex flex-col justify-between gap-8 md:col-span-4 md:pl-4">
        <FadeIn delay={0.1}>
          <p className="font-display text-sm italic text-stone">{project.index}</p>
          <h3 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.05] tracking-[-0.01em] text-ink">
            {project.title}
          </h3>
          <MetaLine project={project} />
        </FadeIn>
        <FadeIn delay={0.2} className="hidden md:block">
          <OverlayLink slug={project.slug}>
            <span className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink">
              View Project <Arrow />
            </span>
          </OverlayLink>
        </FadeIn>
      </div>
    </div>
  )
}

/** 05 · Wythe Residence — image entering from outside the left edge. */
function VariantLeftEdge({ project }: { project: Project }) {
  return (
    <div className="overflow-hidden">
      <div className="grid items-end gap-8 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7">
          <OverlayLink slug={project.slug}>
            <div className="relative aspect-[4/5] overflow-hidden md:-ml-16 lg:-ml-24">
              <ProjectImage
                src={project.hero.src}
                alt={project.hero.alt}
                sizes="(min-width: 1024px) 55vw, (min-width: 768px) 55vw, 100vw"
              />
            </div>
          </OverlayLink>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <FadeIn delay={0.15}>
            <p className="font-display text-sm italic text-stone">{project.index}</p>
            <h3 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.9rem)] font-light leading-[1.02] tracking-[-0.01em] text-ink">
              {project.title}
            </h3>
            <MetaLine project={project} />
            <div className="mt-9">
              <OverlayLink slug={project.slug}>
                <span className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink">
                  View Project <Arrow />
                </span>
              </OverlayLink>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

/** 07 · Tribeca Penthouse — full-height portrait leading, title set beside it. */
function VariantPortraitLead({ project }: { project: Project }) {
  return (
    <div className="grid items-end gap-8 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-7">
        <OverlayLink slug={project.slug}>
          <div className="relative aspect-[4/5] overflow-hidden md:-ml-12 lg:-ml-20">
            <ProjectImage
              src={project.hero.src}
              alt={project.hero.alt}
              sizes="(min-width: 1024px) 58vw, (min-width: 768px) 58vw, 100vw"
            />
          </div>
        </OverlayLink>
      </div>
      <div className="md:col-span-4 md:col-start-9 md:pb-4">
        <FadeIn delay={0.12}>
          <p className="font-display text-sm italic text-stone">{project.index}</p>
          <h3 className="mt-4 font-display text-[clamp(2rem,4.2vw,3.6rem)] font-light leading-[1.02] tracking-[-0.01em] text-ink">
            {project.title}
          </h3>
          <MetaLine project={project} />
          <p className="mt-7 max-w-sm font-sans text-sm font-light leading-relaxed text-stone">
            {project.summary}
          </p>
          <div className="mt-9">
            <OverlayLink slug={project.slug}>
              <span className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink">
                View Project <Arrow />
              </span>
            </OverlayLink>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

/** 08 · Baxter Street Residence — a tall image set against a wide ledger. */
function VariantTallAgainstLedger({ project }: { project: Project }) {
  return (
    <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-8">
      <div className="md:col-span-4">
        <FadeIn delay={0.1}>
          <p className="font-display text-sm italic text-stone">{project.index}</p>
          <h3 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.4rem)] font-light leading-[1.05] tracking-[-0.01em] text-ink">
            {project.title}
          </h3>
          <MetaLine project={project} />
          <p className="mt-7 max-w-sm font-sans text-sm font-light leading-relaxed text-stone">
            {project.summary}
          </p>
          <div className="mt-9">
            <OverlayLink slug={project.slug}>
              <span className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink">
                View Project <Arrow />
              </span>
            </OverlayLink>
          </div>
        </FadeIn>
      </div>
      <div className="md:col-span-7 md:col-start-6">
        <OverlayLink slug={project.slug}>
          <div className="relative aspect-[3/4] overflow-hidden md:ml-8 lg:ml-14">
            <ProjectImage
              src={project.hero.src}
              alt={project.hero.alt}
              sizes="(min-width: 1024px) 58vw, (min-width: 768px) 58vw, 100vw"
            />
          </div>
        </OverlayLink>
      </div>
    </div>
  )
}

/** 06 · Hudson House — an ultrawide photograph pushed to the right. */
function VariantOffsetWide({ project }: { project: Project }) {
  return (
    <div className="py-10 md:py-0">
      <OverlayLink slug={project.slug}>
        <div className="relative ml-auto aspect-[21/10] min-h-[340px] w-full overflow-hidden lg:w-[86%]">
          <ProjectImage
            src={project.hero.src}
            alt={project.hero.alt}
            sizes="(min-width: 1024px) 86vw, 100vw"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(10,9,7,0.55) 0%, rgba(10,9,7,0.1) 45%, rgba(10,9,7,0) 70%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-10">
            <p className="font-display text-sm italic text-chalk/80">{project.index}</p>
            <h3 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-light leading-none tracking-[-0.01em] text-chalk">
              {project.title}
            </h3>
            <MetaLine project={project} light />
          </div>
        </div>
      </OverlayLink>

      <div className="flex justify-end pt-6 md:pt-8 lg:w-[86%]">
        <AnimatedRule className="h-px w-1/3 bg-ink/20" />
      </div>
    </div>
  )
}