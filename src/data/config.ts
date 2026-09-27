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
      bio: 'Claire leads the studio’s interior and creative direction. Her work focuses on natural materials, furniture, art, and creating interiors that feel personal without becoming overly styled.',
      image: '/images/studio/founders-claire-citgroup.avif',
      imageAlt: 'Portrait of Claire citgroup, Creative Director of Citgroup & Vale, in black and white.',
    },
    {
      name: 'Ethan Vale',
      role: 'Principal Architect',
      bio: 'Ethan leads architecture, planning, detailing, and construction. His work focuses on proportion, material relationships, adaptive reuse, and integrating contemporary architecture within historic environments.',
      image: '/images/studio/founders-ethan-vale.avif',
      imageAlt: 'Portrait of Ethan Vale, Principal Architect of Citgroup & Vale, in black and white.',
    },
  ],
  story: 'Founded in New York in 2016, citgroup & Vale works with a small collaborative team of architects, interior designers, craftspeople, fabricators, artists, and builders.',
} as const

export type SiteConfig = typeof site