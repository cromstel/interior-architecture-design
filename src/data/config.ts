/**
 * A studio founder.
 *
 * `image` and `imageAlt` are optional so an entry can ship before its portrait
 * does. Both founders sections fall back to a typographic tile in the same box,
 * which also keeps `scripts/verify-image-srcset.mjs` honest — it fails the build
 * on a referenced file that is missing, so an absent portrait has to be absent
 * from the data rather than pointed at.
 *
 * This type exists for that reason. `site` is declared `as const`, so without an
 * annotation each founder became its own literal type and the array inferred as a
 * union whose members did not share `image` — every `founder.image` in the
 * components failed to typecheck. Annotating normalises the union.
 */
export type Founder = {
  readonly name: string
  readonly role: string
  readonly bio: string
  readonly focus: readonly string[]
  readonly note: string
  readonly image?: string
  readonly imageAlt?: string
}

export const site = {
  name: 'Citgroup & Vale',
  wordmark: 'citgroup & VALE',
  descriptor: 'Interior Architecture & Design',
  city: 'New York City',
  estYear: 2016,
  tagline: 'New York · Est. 2016',
  areas: ['New York City', 'The Hamptons', 'Beyond'],
  address: {
    street: '48 Walker Street',
    city: 'New York',
    state: 'NY',
    zip: '10013',
    country: 'United States',
    formatted: '48 Walker Street, New York, NY 10013',
    lines: ['48 Walker Street', 'New York, NY 10013'],
  },
  phone: {
    display: '+1 212 555 0147',
    displayBracketed: '+1 (212) 555-0147',
    tel: '+12125550147',
  },
  email: 'studio@citgroupandvale.com',
  social: {
    instagram: {
      label: 'Instagram',
      handle: '@citgroupandvale',
      url: 'https://www.instagram.com/citgroupandvale',
    },
    pinterest: {
      label: 'Pinterest',
      handle: 'citgroupandvale',
      url: 'https://www.pinterest.com/citgroupandvale',
    },
    linkedin: {
      label: 'LinkedIn',
      handle: 'citgroup-vale',
      url: 'https://www.linkedin.com/company/citgroup-vale',
    },
  },
  // Order matters: this is the reading order in both founders sections, and the
  // landing page lays them out left to right. Samuel is last, on the right.
  //
  // `satisfies Founder[]`, not an annotation of the form `founders: Founder[] =`.
  // TypeScript 7.0.2 mis-parses that annotation inside an object literal -- it
  // treats `founders:` as a label and `Founder[]` as an element access, giving
  // "An element access expression should take an argument". Reproduced on a
  // three-line file with no other changes, and `readonly Founder[]` fails the
  // same way. `satisfies` checks the same shape and keeps the literal narrowing
  // the components rely on. Do not "tidy" this back into an annotation.
  founders: [
    {
      name: 'Claire citgroup',
      role: 'Creative Director',
      bio: 'Claire leads the studio’s interior and creative direction, and has since the first project in 2016. Her work is concerned with the last ten percent of a room — the lamp that makes a corner usable, the shelf at the height a hand actually reaches, the object that is there because someone wanted it rather than because a scheme called for it. She is responsible for what a finished interior feels like to live in, as distinct from how well it was built.',
      focus: ['Material direction', 'Furniture & art', 'Textiles & colour', 'Styling'],
      note: 'An interior should be personal without being styled. If it looks like a picture of itself, we have gone too far.',
      image: '/images/studio/founders-claire-citgroup.avif',
      imageAlt: 'Portrait of Claire citgroup, Creative Director of Citgroup & Vale, in black and white.',
    },
    {
      name: 'Ethan Vale',
      role: 'Principal Architect',
      bio: 'Ethan leads architecture, planning, detailing, and construction. Most of the studio’s work is in buildings that already exist, which shapes how he works: he starts from the structure rather than the plan sheet, reading what a building can carry and where its light already falls before drawing anything. He is responsible for the decisions that are expensive to reverse — the opening, the stair, the load path — and for what the work looks like a century later.',
      focus: ['Architecture & planning', 'Historic fabric', 'Detailing & documentation', 'Construction'],
      note: 'The house was standing before us. It will be standing after.',
      image: '/images/studio/founders-ethan-vale.avif',
      imageAlt: 'Portrait of Ethan Vale, Principal Architect of Citgroup & Vale, in black and white.',
    },
    {
      name: 'Samuel Lamptey',
      role: 'Chief Executive',
      bio: 'Samuel runs the studio: the commissions, the fee structure, who is engaged and on what terms, and the pace the work is allowed to take. He came to architecture from construction and site management, which is why he is the one who decides what a client is actually buying when a drawing is finished. He is accountable for the studio being the same thing in ten years as it is this year.',
      focus: ['Client & commissions', 'Fee & contract', 'Site & delivery', 'Studio direction'],
      note: 'The work has to survive the people who commissioned it.',
      // No portrait yet. `Founder.image` is optional and both founders sections
      // fall back to a typographic tile, so the entry can ship ahead of the
      // photograph. The image path belongs in `public/images/studio/` as
      // founders-samuel-lamptey.avif, plus the -sm tier, before this is set.
    },
  ] satisfies Founder[],
  story: 'Founded in New York in 2016, citgroup & Vale works with a small collaborative team of architects, interior designers, craftspeople, fabricators, artists, and builders.',
} as const

export type SiteConfig = typeof site