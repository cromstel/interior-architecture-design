export const navLinks = [
  { label: 'Projects', href: '/projects/' },
  { label: 'Studio', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Journal', href: '/journal/' },
  { label: 'Contact', href: '/contact/' },
] as const

export const services = [
  {
    title: 'Interior Architecture',
    body: 'Spatial planning, architectural interventions, custom millwork, material specification, and interior detailing.',
  },
  {
    title: 'Residential Interiors',
    body: 'Complete interior design for apartments, townhouses, penthouses, and private residences.',
  },
  {
    title: 'Renovation',
    body: 'Architectural and interior transformation of existing homes while respecting their original character.',
  },
  {
    title: 'Furniture & Art',
    body: 'Furniture sourcing, custom pieces, collectible design, artwork, lighting, and styling.',
  },
  {
    title: 'Hospitality',
    body: 'Boutique hotels, restaurants, private clubs, and intimate hospitality environments.',
  },
] as const

export const processStages = [
  {
    number: '01',
    title: 'Discovery',
    body: 'Understanding the property, client, lifestyle, architecture, and ambitions for the project.',
  },
  {
    number: '02',
    title: 'Concept',
    body: 'Establishing spatial direction, materials, atmosphere, and architectural language.',
  },
  {
    number: '03',
    title: 'Design Development',
    body: 'Refining layouts, millwork, lighting, finishes, furniture, and architectural details.',
  },
  {
    number: '04',
    title: 'Documentation',
    body: 'Preparing detailed drawings, specifications, schedules, and construction information.',
  },
  {
    number: '05',
    title: 'Construction',
    body: 'Working closely with contractors, craftspeople, fabricators, and consultants throughout execution.',
  },
  {
    number: '06',
    title: 'Installation',
    body: 'Furniture, artwork, objects, styling, and final project completion.',
  },
] as const

/**
 * Press coverage. Each row carries the publication, the year, the article title
 * and a standfirst, and links to an internal journal post — `slug` must resolve
 * to a real route, since the site ships no external links.
 */
export const press = [
  {
    publication: 'Architectural Digest',
    year: '2026',
    slug: 'a-townhouse-that-refuses-to-behave',
    title: 'A Townhouse That Refuses to Behave',
    standfirst:
      'On the West 11th Townhouse, where six floors of historic rooms were left legible while everything behind them was reconsidered.',
  },
  {
    publication: 'Dezeen',
    year: '2025',
    slug: 'the-loft-as-one-continuous-field',
    title: 'The Loft as One Continuous Field',
    standfirst:
      'A SoHo interior in which the original fourteen-foot volume is treated as the primary material.',
  },
  {
    publication: 'Dwell',
    year: '2025',
    slug: 'kitchen-as-a-piece-of-architecture',
    title: 'The Kitchen as a Piece of Architecture',
    standfirst:
      'Why the room that carries the most daily weight should be designed first rather than last.',
  },
  {
    publication: 'The Local Project',
    year: '2024',
    slug: 'a-house-that-slows-down',
    title: 'A House That Slows Down',
    standfirst:
      'Inside the Hudson Valley library, where materials are selected once and then left on the wall for a season.',
  },
  {
    publication: 'Wallpaper*',
    year: '2024',
    slug: 'the-proportion-of-things',
    title: 'The Proportion of Things',
    standfirst:
      'A conversation with the studio about restraint, subtraction, and why a narrow family of materials does more work than a wide one.',
  },
] as const

export const testimonials = [
  {
    quote:
      '“They understood that we wanted the apartment to feel refined without ever feeling precious. The finished home feels completely natural to us.”',
    attribution: 'Daniel & Emily Carter',
    place: 'Tribeca, New York',
    projectSlug: 'mercer-street-loft',
    context: 'Full-floor SoHo loft, 4,200 sq ft',
  },
  {
    quote:
      '“The studio managed to preserve everything we loved about the townhouse while completely changing the way we live inside it.”',
    attribution: 'Michael Reynolds',
    place: 'Greenwich Village, New York',
    projectSlug: 'west-11th-townhouse',
    context: 'Six-floor townhouse, 6,800 sq ft',
  },
  {
    quote:
      '“Every decision felt considered. Materials, lighting, furniture, and architecture all feel like they belong together.”',
    attribution: 'Sarah Mitchell',
    place: 'Brooklyn, New York',
    projectSlug: 'wythe-residence',
    context: 'Converted Williamsburg loft, 3,600 sq ft',
  },
] as const

/**
 * Long-form studio copy for the About and Services pages.
 *
 * The homepage sections deliberately stay short — they are teasers that link
 * here. Reusing the same paragraphs on both URLs would make them duplicate
 * content, so the full argument lives only in this data.
 */
export const studioStory = {
  lede: 'citgroup & Vale was founded in New York in 2016 on a single conviction: that the rooms people live in should improve for twenty years, not be finished in six months.',
  body: [
    'The studio works from a Walker Street loft with a deliberately small team — architects, interior designers, craftspeople, and fabricators who stay with a project from the first conversation to the last object placed. We take on a limited number of projects each year, and we turn down more than we accept.',
    'That limit is the point. It is what allows the same people who drew the plan to be present when the plaster is being worked, when the stone is being set, and when the client changes their mind about a handle. Continuity is not a service we offer. It is the only way we know to make work we are willing to sign.',
    'We are New York based and work principally in the city, in the Hudson Valley, and on the East End, with a small number of projects further afield. What unifies that work is not a style but a method: begin with how light moves through a space, choose materials for how they will age, and let proportion do the work that decoration is usually asked to do.',
  ],
  principles: [
    {
      title: 'Light before plan',
      body: 'A plan is drawn twice — once in rooms, and once in light. Each space is positioned for the best hours it will actually receive, so a house changes character through the day without a single wall moving.',
    },
    {
      title: 'Materials chosen for their afterlife',
      body: 'We specify surfaces for what they will look like in ten years. Stone is honed rather than polished because a hand reaches for it daily. Timber is left to silver where it will catch weather, and deepened where it will not.',
    },
    {
      title: 'Restraint as a method',
      body: 'Twice as many materials are brought to a project as will ever survive. The work of the room is subtraction — holding a narrow family of materials so that each one is allowed to be itself.',
    },
    {
      title: 'Proportion before decoration',
      body: 'Ceiling height, opening width, and the distance a room asks you to walk are decided before anything is chosen to put in it. Most of what makes an interior feel resolved is invisible.',
    },
    {
      title: 'The original stays legible',
      body: 'When we work in an old building, the aim is that the original should still be readable a century from now. New work is reversible wherever it can be, and honest about what it is.',
    },
    {
      title: 'One team, start to finish',
      body: 'The people who drew the plan are the people present at handover. Nothing is handed to a second team, and nothing is explained to a client by someone who was not there.',
    },
  ],
  practice: [
    { label: 'Founded', value: '2016' },
    { label: 'Studio', value: 'New York City' },
    { label: 'Team', value: 'Architects, interior designers, craftspeople' },
    { label: 'Projects each year', value: 'A limited number, by invitation' },
  ],
} as const

export const serviceDetail = [
  {
    title: 'Interior Architecture',
    body: 'Spatial planning, architectural interventions, custom millwork, material specification, and interior detailing.',
    scope: [
      'Measured survey and as-built documentation',
      'Spatial planning and circulation',
      'Architectural openings, stairs, and structural work',
      'Custom millwork and built-in furniture',
      'Lighting design and specification',
      'Material specification, samples, and sign-off',
    ],
  },
  {
    title: 'Residential Interiors',
    body: 'Complete interior design for apartments, townhouses, penthouses, and private residences.',
    scope: [
      'Concept and spatial direction',
      'Layout and furniture plans',
      'Finish schedules and procurement',
      'Window treatments and soft furnishing',
      'Art curation and placement',
      'Styling and final installation',
    ],
  },
  {
    title: 'Renovation',
    body: 'Architectural and interior transformation of existing homes while respecting their original character.',
    scope: [
      'Condition survey and feasibility',
      'Structural and systems assessment',
      'Historic character and fabric review',
      'Phased construction documentation',
      'Contractor and tradesperson coordination',
      'Permit and inspection liaison',
    ],
  },
  {
    title: 'Furniture & Art',
    body: 'Furniture sourcing, custom pieces, collectible design, artwork, lighting, and styling.',
    scope: [
      'Furniture sourcing and custom commission',
      'Workshop liaison and prototype review',
      'Art advisory and collection planning',
      'Sculpture and object placement',
      'Lighting and fixture selection',
      'Final styling and photography direction',
    ],
  },
  {
    title: 'Hospitality',
    body: 'Boutique hotels, restaurants, private clubs, and intimate hospitality environments.',
    scope: [
      'Brand and spatial concept',
      'Guest journey and adjacency planning',
      'FF&E specification for durability',
      'Front-of-house and back-of-house coordination',
      'Art and identity commissions',
      'Opening and post-opening support',
    ],
  },
] as const

export const engagement = [
  {
    phase: 'First conversation',
    detail: 'An unhurried meeting at the studio or on site. We want to understand the property and the people before proposing anything.',
  },
  {
    phase: 'Proposal and fee',
    detail: 'A written scope, a stage-by-stage fee, and an honest note on what we think the project needs. If we are not right for it, we will say so.',
  },
  {
    phase: 'Engagement',
    detail: 'Design through construction and installation. Fixed stages, defined deliverables, and a standing point of contact throughout.',
  },
] as const

export const projectTypes = [
  'Apartment',
  'Townhouse',
  'Private Residence',
  'Vacation Home',
  'Hospitality',
  'Commercial',
  'Other',
] as const

export const budgetOptions = [
  '$100k–$250k',
  '$250k–$500k',
  '$500k–$1M',
  '$1M+',
  'Not sure yet',
] as const