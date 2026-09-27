'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { services } from '@/data/site'
import { RevealText } from '@/components/motion/reveal-text'
import { AnimatedRule } from '@/components/motion/animated-rule'

export function Services() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="services" className="relative scroll-mt-24 overflow-hidden bg-ivory px-6 py-24 md:px-10 md:py-40">
      {/* Subtle decorative hairline triangle — architectural reference */}
      <div className="pointer-events-none absolute text-ink left-[2%] top-[30%] opacity-[0.08] md:left-[4%] md:top-[25%]">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polygon points="50,5 95,95 5,95" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.25" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl">
        <div className="mb-16 flex items-end justify-between gap-6 md:mb-24">
          <RevealText
            as="h2"
            text="Services"
            className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-none tracking-[-0.01em] text-ink"
          />
          <p className="meta-label hidden pb-2 md:block">05 disciplines</p>
        </div>

        <ul>
          {services.map((service, i) => {
            const isOpen = open === i
            return (
              <li key={service.title} onMouseEnter={() => setOpen(i)} onMouseLeave={() => setOpen((v) => (v === i ? null : v))}>
                <AnimatedRule />
                <div className="group cursor-pointer py-8 md:py-10">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    onFocus={() => setOpen(i)}
                    aria-expanded={isOpen}
                    aria-controls={`services-panel-${i}`}
                    className="flex w-full items-baseline gap-5 text-left md:gap-10"
                  >
                    <span className="font-display text-lg italic text-stone">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'font-display text-[clamp(1.7rem,4vw,3.2rem)] font-light leading-none tracking-[-0.01em] text-ink transition-transform duration-500 ease-out',
                        'translate-x-0 group-hover:translate-x-2',
                      )}
                    >
                      {service.title}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto flex h-8 w-8 items-center justify-center font-sans text-stone transition-all duration-500 ease-out"
                    >
                      <span
                        className={cn(
                          'relative block h-2.5 w-2.5',
                          isOpen ? 'rotate-45' : 'group-hover:rotate-45',
                          'transition-transform duration-500 ease-out',
                        )}
                      >
                        <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
                      </span>
                    </span>
                  </button>
                  <div
                    id={`services-panel-${i}`}
                    className={cn(
                      'grid overflow-hidden transition-all duration-700 ease-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="min-h-0">
                      <p className="pt-6 pl-9 font-sans text-sm font-light leading-relaxed text-stone md:pl-[5.5rem] md:pt-8 md:text-[15px]">
                        {service.body}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <AnimatedRule />
      </div>
    </section>
  )
}