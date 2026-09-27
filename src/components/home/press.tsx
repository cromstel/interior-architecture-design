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
                <div className="group flex items-baseline justify-between gap-6 py-6 transition-colors duration-500 md:py-7">
                  <span className="font-display text-[clamp(1.3rem,2.6vw,2rem)] font-light text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                    {item.publication}
                  </span>
                  <span className="font-sans text-[11px] font-light uppercase tracking-[var(--tracking-meta)] text-stone">
                    {item.year}
                  </span>
                </div>
              </FadeIn>
            </li>
          ))}
        </ul>
        <AnimatedRule />
      </div>
    </section>
  )
}