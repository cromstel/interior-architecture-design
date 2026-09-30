import Link from 'next/link'
import { press } from '@/data/site'
import { RevealText } from '@/components/motion/reveal-text'
import { AnimatedRule } from '@/components/motion/animated-rule'
import { FadeIn } from '@/components/motion/fade-in'

export function Press() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-40">
      <div className="max-w-5xl">
        <RevealText
          as="h2"
          text="Selected Press"
          className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-none tracking-[-0.01em] text-ink"
        />
        <ul className="mt-14 md:mt-20">
          {press.map((item, i) => (
            <li key={item.publication}>
              <FadeIn delay={0.04 * i}>
                <AnimatedRule />
                <Link
                  href={`/journal/${item.slug}/`}
                  className="group flex flex-col gap-3 py-7 md:flex-row md:items-baseline md:gap-8 md:py-8"
                >
                  <div className="md:w-56 md:shrink-0">
                    <p className="font-sans text-[11px] font-light uppercase tracking-[var(--tracking-meta)] text-stone">
                      {item.publication}
                      <span className="mx-2" aria-hidden>
                        ·
                      </span>
                      {item.year}
                    </p>
                  </div>

                  <div className="md:flex-1">
                    <h3 className="font-display text-[clamp(1.3rem,2.6vw,2rem)] font-light leading-none text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-stone">
                      {item.standfirst}
                    </p>
                  </div>

                  <span
                    aria-hidden
                    className="shrink-0 self-start text-stone transition-transform duration-500 ease-out group-hover:translate-x-1.5 md:self-auto"
                  >
                    →
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
        <AnimatedRule />
      </div>
    </section>
  )
}