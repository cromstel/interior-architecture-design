export type ImageRatio = 'landscape' | 'portrait' | 'square' | 'wide'

export type ImageChunk = {
  src: string
  alt: string
  ratio: ImageRatio
}

export type ProjectNote = {
  heading: string
  body: string
}

export type Project = {
  slug: string
  index: string
  title: string
  location: string
  category: string
  year: string
  area: string
  intro: string
  summary: string
  hero: ImageChunk
  chapters: ImageChunk[]
  details: ImageChunk[]
  finalImage: ImageChunk
  notes: ProjectNote[]
  prevSlug: string
  nextSlug: string
  seo: { title: string; description: string }
}

  const img = (slug: string, name: string, alt: string, ratio: ImageRatio): ImageChunk => ({
    src: `/images/projects/${slug}/${name}.avif`,
    alt,
    ratio,
  })

export function projects(): Project[] {
  const raw = [
    {
      slug: 'mercer-street-loft',
      index: '01',
      title: 'Mercer Street Loft',
      location: 'SoHo, New York',
      category: 'Residential Interior',
      year: '2024',
      area: '4,200 sq ft',
      intro:
        'A full-floor SoHo loft returned to its original discipline — light, volume, and material — reconfigured around the life of a family that wanted the city inside their home.',
      summary:
        'A 4,200 sq ft full-floor loft in a late-nineteenth-century SoHo building, reworked around a single idea: that a home can feel vast and still feel intimate.',
      hero: img('mercer-street-loft', 'mercer-loft-hero', 'The main living volume of the Mercer Street Loft in SoHo, with light falling across oak and raw plaster.', 'landscape'),
      chapters: [
        img('mercer-street-loft', 'mercer-loft-living', 'A restrained seating arrangement in the Mercer Street Loft, pale plaster and soft daylight.', 'square'),
        img('mercer-street-loft', 'mercer-loft-kitchen', 'The Mercer Street Loft kitchen, light oak cabinetry framed against black steel windows.', 'landscape'),
        img('mercer-street-loft', 'mercer-loft-ceiling', 'The full-height gallery volume of the loft, original ceiling restored, light from above.', 'wide'),
      ],
      details: [
        img('mercer-street-loft', 'mercer-loft-marble-detail', 'A honed stone detail in the Mercer Street Loft, cool grey with fine veining.', 'landscape'),
        img('mercer-street-loft', 'mercer-loft-stair', 'A slender staircase joining the composition, cast oak treads against white plaster.', 'portrait'),
      ],
      finalImage: img('mercer-street-loft', 'mercer-loft-evening', 'The Mercer Street Loft at evening, lamps lit, the room settling toward night.', 'wide'),
      notes: [
        {
          heading: 'Original oak, reclaimed',
          body: 'The floors were lifted, book-matched, and re-laid in a single continuous sweep across the loft — an act the contractor compared to re-stringing an instrument. The patina of a century remains, but the surface reads as new.',
        },
        {
          heading: 'Volume treated as material',
          body: 'Ceilings were left at their full fourteen feet wherever possible. What was once a warren of rooms is now one continuous spatial field, divided only by light, cabinetry, and the rhythm of the columns that were always there.',
        },
        {
          heading: 'A palette that asks for nothing',
          body: 'Oak, lime plaster, honed stone, and steel. Nothing glossy, nothing competing. The richness of the room comes from the day — from the way light moves through it — rather than from anything applied to the surfaces.',
        },
      ],
    },
    {
      slug: 'west-11th-townhouse',
      index: '02',
      title: 'West 11th Townhouse',
      location: 'Greenwich Village, New York',
      category: 'Architecture + Interior Design',
      year: '2025',
      area: '6,800 sq ft',
      intro:
        'A nineteenth-century Greenwich Village townhouse reimagined as a quiet contemporary home while preserving the proportions, craftsmanship, and character of the original structure.',
      summary:
        'A full architectural and interior transformation of a nineteenth-century Greenwich Village townhouse — six floors of historic rooms made new, without losing the house they always were.',
      hero: img('west-11th-townhouse', 'west-11th-facade', 'The brownstone facade of the West 11th Townhouse in Greenwich Village, stoop and ironwork restored.', 'landscape'),
      chapters: [
        img('west-11th-townhouse', 'west-11th-staircase', 'The restored stair hall of the West 11th Townhouse, original oak rail and new architectural lighting.', 'portrait'),
        img('west-11th-townhouse', 'west-11th-kitchen', 'The West 11th Townhouse kitchen, painted cabinetry, marble, and warm plaster walls.', 'portrait'),
        img('west-11th-townhouse', 'west-11th-travertine-bath', 'A travertine-lined bath on the upper floors, honed stone and brass fixtures.', 'portrait'),
        img('west-11th-townhouse', 'west-11th-plaster-wall', 'Hand-finished lime plaster walls in the principal drawing room, light falling across the surface.', 'square'),
        img('west-11th-townhouse', 'west-11th-ceiling-molding', 'Original nineteenth-century ceiling molding, cleaned, repaired, and retained alongside new services.', 'portrait'),
        img('west-11th-townhouse', 'west-11th-millwork', 'Custom millwork in the library, painted oak fitted to the original room proportions.', 'portrait'),
      ],
      details: [
        img('west-11th-townhouse', 'west-11th-stoop', 'The restored stoop and entrance detail of the West 11th Townhouse.', 'portrait'),
        img('west-11th-townhouse', 'west-11th-hallway', 'A second-floor hallway, light traveling from the street through the full depth of the house.', 'landscape'),
        img('west-11th-townhouse', 'west-11th-stone-detail', 'A honed travertine detail at the stair landing, quiet and warm to the touch.', 'landscape'),
      ],
      finalImage: img('west-11th-townhouse', 'west-11th-garden-room', 'The rear garden room of the West 11th Townhouse, opening the historic house to its landscape.', 'wide'),
      notes: [
        {
          heading: 'Natural oak',
          body: 'The original floorboards were taken up, numbered, and relaid in a darker, quieter finish than the client expected — until the house was lived in. The oak needed time, and time was allowed.',
        },
        {
          heading: 'Travertine',
          body: 'Travertine is used where guests touch the house most: stair landings, bathroom walls, the entrance coatroom. Honed, never polished, so that the stone ages with use rather than against it.',
        },
        {
          heading: 'Plaster walls',
          body: 'The principal rooms were re-plastered by hand in lime. Heated floors behind plaster walls — walls that breathe, that take light softly, that hold the temperature of the room.',
        },
        {
          heading: 'Historic molding',
          body: 'Moldings were repaired in place rather than replaced. Where a run was missing, a plaster shop cast from the surviving original so the new length carries the same profile and shadow line.',
        },
        {
          heading: 'Custom millwork',
          body: 'Every built-in is bespoke. Cabinetry was drawn at full scale against the rooms they sit in — each piece tuned to the neighboring floors, moldings, and the height of the light.',
        },
        {
          heading: 'Natural light',
          body: 'The house was opened front to back on every floor. Foursouth-facing windows pull light to the garden wall; the stair hall borrows from the rooms around it, and the house moves with the sun.',
        },
        {
          heading: 'Material restraint',
          body: 'The discipline was subtraction: oak, travertine, plaster, and paint, applied generously but held to a strict family of materials. Whatever might compete with the architecture was left out.',
        },
      ],
    },
    {
      slug: 'park-avenue-residence',
      index: '03',
      title: 'Park Avenue Residence',
      location: 'Upper East Side, New York',
      category: 'Residential Interior',
      year: '2024',
      area: '5,100 sq ft',
      intro:
        'A pre-war co-operative on Park Avenue, remade from the inside out — its generous original rooms refined into a precise, light-filled home for living and entertaining.',
      summary:
        'A 5,100 sq ft pre-war apartment on the Upper East Side, its grand rooms re-proportioned and re-finished for a slower, quieter kind of urban life.',
      // No `-lg` sibling on disk, so the base 1200x1200 asset is the largest copy.
      hero: img('park-avenue-residence', 'park-avenue-living-room', 'The principal living room of the Park Avenue Residence, neutral walls and soft daylight.', 'square'),
      chapters: [
        img('park-avenue-residence', 'park-avenue-kitchen', 'The Park Avenue Residence kitchen, dark cabinetry and a single slab of marble.', 'landscape'),
        img('park-avenue-residence', 'park-avenue-hallway', 'A long gallery hallway in the Park Avenue Residence, works on the wall, light at the far end.', 'landscape'),
        img('park-avenue-residence', 'park-avenue-dining', 'The formal dining room, ceiling detail kept, the table set for evening.', 'wide'),
      ],
      details: [
        img('park-avenue-residence', 'park-avenue-marble-detail', 'A honed marble detail at the kitchen and entry sequence.', 'landscape'),
        img('park-avenue-residence', 'park-avenue-ceiling-detail', 'An original plaster ceiling medallion retained in the drawing room.', 'portrait'),
      ],
      finalImage: img('park-avenue-residence', 'park-avenue-evening', 'The Park Avenue Residence at night, the city drawing close, the rooms warm and low.', 'wide'),
      notes: [
        {
          heading: 'Prewar bones',
          body: 'The apartment’s greatest asset was its emptiness — rooms of genuinely large proportion and light that a co-operative rarely offers. The design began by taking everything away and revealing that.',
        },
        {
          heading: 'Marble, used once',
          body: 'A single movement of stone carries through the entry and kitchen — a rare book-matched marble chosen like a painting, installed like a document of the project’s restraint.',
        },
        {
          heading: 'Rooms for both',
          body: 'The plan keeps the formality of a Park Avenue apartment while absorbing a young family’s life — a library that becomes a playroom, a dining room that becomes a workspace, without either losing its character.',
        },
      ],
    },
    {
      slug: 'amagansett-house',
      index: '04',
      title: 'Amagansett House',
      location: 'The Hamptons, New York',
      category: 'Residential Architecture',
      year: '2023',
      area: '7,400 sq ft',
      intro:
        'A new house on a quiet Amagansett lane, drawn low across its field of beach grass — rooms organized around the light, the views, and the weather moving in off the Atlantic.',
      summary:
        'New residential architecture in the Hamptons — a 7,400 sq ft house composed as a single long gesture across its site, internal courtyards and deep overhangs doing the work of the old farmhouses.',
      hero: img('amagansett-house', 'amagansett-hero', 'The Amagansett House entrance hall, light flooding in from the garden beyond.', 'landscape'),
      chapters: [
        img('amagansett-house', 'amagansett-living', 'The main living space of the Amagansett House, light and pale materials, the landscape at every window.', 'landscape'),
        img('amagansett-house', 'amagansett-kitchen', 'The Amagansett House kitchen, light oak and black-framed glazing opening to the lawn.', 'landscape'),
        img('amagansett-house', 'amagansett-staircase', 'A light-filled stair in the Amagansett House, white oak treads against white walls.', 'portrait'),
      ],
      details: [
        img('amagansett-house', 'amagansett-stone-detail', 'A honed stone detail at the garden threshold of the Amagansett House.', 'portrait'),
        img('amagansett-house', 'amagansett-wood-detail', 'Warm wood paneling in the upstairs sitting room, catching afternoon light.', 'portrait'),
      ],
      finalImage: img('amagansett-house', 'amagansett-lawn', 'The garden side of the Amagansett House, the interior continuing into the landscape.', 'wide'),
      notes: [
        {
          heading: 'Light before plan',
          body: 'The plan was drawn twice — once in rooms, once in light. Each space is positioned for the best hours it can receive, so the house changes character from morning to evening without moving a single wall.',
        },
        {
          heading: 'A single line',
          body: 'Roof, floor, and garden wall are held on one continuous datum across the house, so that even at 7,400 sq ft the building reads as a single, calm gesture across its site.',
        },
        {
          heading: 'The coast adjusts the palette',
          body: 'Salt air shortens the life of materials and weathers them beautifully if chosen well. Oak, lime-wash, and stone were selected for how they will look in ten years on the water — not for how they look in the showroom.',
        },
      ],
    },
    {
      slug: 'wythe-residence',
      index: '05',
      title: 'Wythe Residence',
      location: 'Williamsburg, Brooklyn',
      category: 'Residential Interior',
      year: '2024',
      area: '3,600 sq ft',
      intro:
        'A converted industrial building on the Brooklyn waterfront, reorganized for one family — the rawness of the loft kept, softened where a home needs softness, and nothing more.',
      summary:
        'A 3,600 sq ft loft in a converted Williamsburg factory, where the industrial shell is respected and the domestic life inside is made warm, exact, and personal.',
      hero: img('wythe-residence', 'wythe-hero', 'The Wythe Residence kitchen, dark cabinetry and a broad stone island against the raw loft shell.', 'landscape'),
      chapters: [
        img('wythe-residence', 'wythe-living', 'The Wythe Residence living area, neutral seating within the loft volume.', 'square'),
        img('wythe-residence', 'wythe-kitchen', 'The light kitchen corner of the Wythe Residence, wood and steel.', 'landscape'),
        img('wythe-residence', 'wythe-open-room', 'The double-height volume at the center of the Wythe Residence, original columns retained.', 'wide'),
      ],
      details: [
        img('wythe-residence', 'wythe-stone-detail', 'A dark stone counter detail in the Wythe Residence, polished and dense.', 'landscape'),
        img('wythe-residence', 'wythe-stair', 'A steel and oak stair connecting the two levels of the Wythe Residence.', 'portrait'),
      ],
      finalImage: img('wythe-residence', 'wythe-evening', 'The Wythe Residence at dusk, the waterfront beyond the windows, the loft low and warm.', 'wide'),
      notes: [
        {
          heading: 'Kept the factory',
          body: 'Concrete, steel columns, and the rhythm of the original windows were treated as the architecture — finished where necessary, left raw where they could stay raw. The loft’s history is its character.',
        },
        {
          heading: 'Warmth without cover',
          body: 'The family wanted a home, not a gallery. Cabinetry, wool, stone, and timber bring warmth into the volume while the underlying industrial structure remains honest and uninterrupted.',
        },
        {
          heading: 'Rooms within the room',
          body: 'Rather than dividing the floor, function is arranged in low objects — a kitchen block, a seating plateau — so the eye still travels the full length of the loft, the way the space always worked.',
        },
      ],
    },
    {
      slug: 'hudson-house',
      index: '06',
      title: 'Hudson House',
      location: 'Hudson Valley, New York',
      category: 'Architecture + Interior Design',
      year: '2025',
      area: '5,900 sq ft',
      intro:
        'A weekend house in the Hudson Valley, rebuilt within the footprint of an old farmhouse — raised ceilings, winter light, and a house that turns its long windows to the river.',
      summary:
        'Architectural and interior renovation of a Hudson Valley farmhouse — 5,900 sq ft throughout and beside the original structure, uniting old timber and new, quiet architecture.',
      // `-lg` was shrunk to 2000px by scripts/shrink-oversized-avif.mjs.
      hero: img('hudson-house', 'hudson-house-living', 'The main room of the Hudson House, paneled walls and warm light.', 'landscape'),
      chapters: [
        img('hudson-house', 'hudson-house-fireplace', 'The fireplace wall of the Hudson House, the old hearth kept at the center of the room.', 'landscape'),
        img('hudson-house', 'hudson-house-kitchen', 'The Hudson House kitchen, painted oak and marble, tall windows to the orchard.', 'portrait'),
        img('hudson-house', 'hudson-house-stair', 'A white oak stair meeting the upper floor of the Hudson House.', 'landscape'),
      ],
      details: [
        img('hudson-house', 'hudson-house-stone-detail', 'A honed stone detail at the entry of the Hudson House.', 'landscape'),
        img('hudson-house', 'hudson-house-hallway', 'A quiet hallway in the Hudson House, light traveling between rooms.', 'landscape'),
      ],
      finalImage: img('hudson-house', 'hudson-house-orchard', 'The Hudson House against the orchard at golden hour.', 'wide'),
      notes: [
        {
          heading: 'Old timber, new structure',
          body: 'The original frame was kept where it stood, reinforced invisibly around the new work. Old and new beams share load and shadow so the house reads as one continuous building despite two centuries of changes.',
        },
        {
          heading: 'Winter light',
          body: 'The valley is dark in December and luminous in June. Windows were positioned for the low shadeless light of winter afternoons — the season the house is most lived in — and shaded deep for summer.',
        },
        {
          heading: 'A slow house',
          body: 'Nothing here is instant. The finishes were specified to soften and darken with use — plaster to take fingerprints, oak to patina, stone to warm underfoot. The house is meant to settle, and to improve.',
        },
      ],
    },
  ] as const satisfies Omit<Project, 'prevSlug' | 'nextSlug' | 'seo'>[]

  return raw.map((p, i, arr) => ({
    ...p,
    prevSlug: arr[(i - 1 + arr.length) % arr.length].slug,
    nextSlug: arr[(i + 1) % arr.length].slug,
    seo: {
      title: `${p.title} — Citgroup & Vale`,
      description: `${p.intro} ${p.index} · ${p.location} · ${p.category}.`,
    },
  }))
}

export function getProject(slug: string): Project | undefined {
  return projects().find((p) => p.slug === slug)
}