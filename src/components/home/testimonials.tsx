import { testimonials } from '@/data/site'
import { AnimatedRule } from '@/components/motion/animated-rule'
import { FadeIn } from '@/components/motion/fade-in'
import { cn } from '@/lib/cn'

export function Testimonials() {
  return (
    <section className="px-6 py-28 md:px-10 md:py-48">
      <div className="mx-auto max-w-5xl">
        {testimonials.map((t, i) => {
          const left = i % 2 === 0
          return (
            <div key={t.attribution}>
              <FadeIn
                delay={0.05}
                className={cn('py-12 md:py-16', left ? 'md:text-left' : 'md:text-right')}
              >
                <blockquote
                  className={cn('mx-auto max-w-3xl', left ? 'md:mr-auto' : 'md:ml-auto')}
                >
                  <p className="text-balance font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-light leading-[1.3] tracking-[-0.005em] text-ink">
                    {t.quote}
                  </p>
                  <footer className="mt-8">
                    <p className="font-sans text-[11px] font-normal uppercase tracking-[var(--tracking-meta)] text-ink">
                      — {t.attribution}
                    </p>
                    <p className="mt-1.5 font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone">
                      {t.place}
                    </p>
                  </footer>
                </blockquote>
              </FadeIn>
              {i < testimonials.length - 1 && (
                <AnimatedRule className="mx-auto max-w-xl" />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}