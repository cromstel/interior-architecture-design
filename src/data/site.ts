export const navLinks = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Studio', href: '/#studio' },
  { label: 'Services', href: '/#services' },
  { label: 'Journal', href: '/#journal' },
  { label: 'Contact', href: '/#contact' },
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

export const press = [
  { publication: 'Architectural Digest', year: '2026' },
  { publication: 'Dezeen', year: '2025' },
  { publication: 'Dwell', year: '2025' },
  { publication: 'The Local Project', year: '2024' },
  { publication: 'Wallpaper*', year: '2024' },
] as const

export const testimonials = [
  {
    quote:
      '“They understood that we wanted the apartment to feel refined without ever feeling precious. The finished home feels completely natural to us.”',
    attribution: 'Daniel & Emily Carter',
    place: 'Tribeca, New York',
  },
  {
    quote:
      '“The studio managed to preserve everything we loved about the townhouse while completely changing the way we live inside it.”',
    attribution: 'Michael Reynolds',
    place: 'Greenwich Village, New York',
  },
  {
    quote:
      '“Every decision felt considered. Materials, lighting, furniture, and architecture all feel like they belong together.”',
    attribution: 'Sarah Mitchell',
    place: 'Brooklyn, New York',
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