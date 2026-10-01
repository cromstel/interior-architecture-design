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
  ],
  story: 'Founded in New York in 2016, citgroup & Vale works with a small collaborative team of architects, interior designers, craftspeople, fabricators, artists, and builders.',
} as const

export type SiteConfig = typeof site