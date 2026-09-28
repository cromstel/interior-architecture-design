'use client'

import { useState } from 'react'
import { ChevronDown, ArrowUpRight } from 'lucide-react'
import { site } from '@/data/config'
import { projectTypes, budgetOptions } from '@/data/site'
import { RevealText } from '@/components/motion/reveal-text'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  type: string
  budget: string
  timeline: string
  details: string
}

const empty: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  type: '',
  budget: '',
  timeline: '',
  details: '',
}

const inputClass =
  'w-full border-b border-ink/15 bg-transparent py-3 font-sans text-sm font-light text-ink placeholder:text-stone/60 transition-colors duration-500 focus:border-ink'

export function ContactSection() {
  const [form, setForm] = useState<FormState>(empty)

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const inputProps = (key: keyof FormState) => ({
    value: form[key],
    onChange: set(key),
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const lines = [
      ['First name', form.firstName],
      ['Last name', form.lastName],
      ['Email', form.email],
      ['Phone', form.phone],
      ['Project location', form.location],
      ['Project type', form.type],
      ['Approximate budget', form.budget],
      ['Desired timeline', form.timeline],
      ['Project details', form.details],
    ]
    const body = lines.map(([k, v]) => `${k}: ${v}`).join('\n')
    const subject = `Project Enquiry — ${form.location || 'New York'}`
    const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = href
  }

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-ivory px-6 py-28 md:px-10 md:py-44">
      {/* Subtle decorative hairline — vertical hairline + small circle, contact reference */}
      <div className="pointer-events-none absolute text-ink right-[6%] top-[10%] opacity-[0.05] md:right-[4%] md:top-[15%]">
        <svg width="80" height="200" viewBox="0 0 80 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="40" y1="0" x2="40" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="40" cy="100" r="18" stroke="currentColor" strokeWidth="0.25" fill="none" />
          <line x1="40" y1="82" x2="40" y2="118" stroke="currentColor" strokeWidth="0.25" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <RevealText
              as="h2"
              text="Start a Conversation"
              className="font-display text-[clamp(2.6rem,5.6vw,4.8rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink"
            />
            <p className="mt-8 max-w-sm font-sans text-sm font-light leading-relaxed text-stone md:text-base">
              We work on a limited number of residential, hospitality, and commercial projects each
              year. Tell us a little about yours.
            </p>

            <div className="mt-14 space-y-5">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink"
              >
                Email the Studio
                <ArrowUpRight size={13} strokeWidth={1.5} className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <address className="not-italic">
                <a
                  href={`tel:${site.phone.tel}`}
                  className="group inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink"
                >
                  Call the Studio
                  <ArrowUpRight size={13} strokeWidth={1.5} className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </address>
              <p className="pt-4 font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone">
                {site.address.formatted}
              </p>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <form onSubmit={onSubmit} className="space-y-7">
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="meta-label mb-2 block">
                    First name
                  </label>
                  <input id="firstName" {...inputProps('firstName')} required autoComplete="given-name" placeholder="First name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="lastName" className="meta-label mb-2 block">
                    Last name
                  </label>
                  <input id="lastName" {...inputProps('lastName')} required autoComplete="family-name" placeholder="Last name" className={inputClass} />
                </div>
              </div>

              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="meta-label mb-2 block">
                    Email
                  </label>
                  <input id="email" {...inputProps('email')} type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className="meta-label mb-2 block">
                    Phone number
                  </label>
                  <input id="phone" {...inputProps('phone')} type="tel" autoComplete="tel" placeholder="+1" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="meta-label mb-2 block">
                  Project location
                </label>
                <input id="location" {...inputProps('location')} placeholder="Neighborhood, city, or region" className={inputClass} />
              </div>

              <div className="grid gap-7 sm:grid-cols-2">
                <SelectField
                  id="type"
                  label="Project type"
                  value={form.type}
                  onChange={set('type')}
                  options={projectTypes}
                  placeholder="Select a type"
                />
                <SelectField
                  id="budget"
                  label="Approximate budget"
                  value={form.budget}
                  onChange={set('budget')}
                  options={budgetOptions}
                  placeholder="Select a range"
                />
              </div>

              <div>
                <label htmlFor="timeline" className="meta-label mb-2 block">
                  Desired timeline
                </label>
                <input id="timeline" {...inputProps('timeline')} placeholder="e.g. Summer 2027" className={inputClass} />
              </div>

              <div>
                <label htmlFor="details" className="meta-label mb-2 block">
                  Project details
                </label>
                <textarea
                  id="details"
                  {...inputProps('details')}
                  rows={5}
                  placeholder="A few words about the property, the brief, and what you’re hoping to build…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 border border-ink px-8 py-4 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink transition-colors duration-500 hover:bg-ink hover:text-chalk"
                >
                  Send Enquiry
                </button>
                <p className="font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone">
                  Opens your email client
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: readonly string[]
  placeholder: string
}) {
  return (
    <div>
      <label htmlFor={id} className="meta-label mb-2 block">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`${inputClass} appearance-none pr-8 ${value ? 'text-ink' : 'text-stone'}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-stone"
        />
      </div>
    </div>
  )
}