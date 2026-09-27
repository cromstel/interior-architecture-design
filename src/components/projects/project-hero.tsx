import type { Project } from '@/data/projects'
import { site } from '@/data/config'
import { lg } from '@/lib/image-variants'
import { ProjectHeroBanner } from '@/components/projects/project-hero-banner'

/**
 * Server component: resolves the `-lg` hero variant on disk (client-safe
 * boundary) and binds the banner to its metadata ledger. The hairline rule
 * below runs edge to edge so the full-bleed photograph and its ledger read as
 * a single field rather than a banner followed by a separate text block.
 */
export function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="relative">
      <ProjectHeroBanner
        src={lg(project.hero.src)}
        alt={project.hero.alt}
        index={project.index}
        title={project.title}
        location={project.location}
        width={project.hero.width}
        height={project.hero.height}
      />

      <div className="border-t border-ink/10">
        <div className="max-w-7xl px-6 py-8 md:px-10 md:py-12">
          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <MetaCell label="Location" value={project.location} className="hidden md:block" />
            <MetaCell label="Category" value={project.category} />
            <MetaCell label="Year" value={project.year} />
            <MetaCell label="Area" value={project.area} />
            <MetaCell label="Studio" value={site.name} className="hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  )
}

function MetaCell({
  label,
  value,
  className = '',
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <p className="meta-label">{label}</p>
      <p className="mt-2 font-sans text-sm font-normal leading-relaxed text-ink">{value}</p>
    </div>
  )
}
