import Link from 'next/link'
import { cn } from '@/lib/cn'

export type Crumb = {
  label: string
  /** Omitted on the final crumb, which is the current page. */
  href?: string
}

/**
 * Breadcrumb trail. The final crumb is the current page and is rendered as
 * plain text rather than a link, which is both the convention and the
 * accessible one — a control that links to the page you are already on is
 * noise for screen reader users.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  // Two crumbs with the same label are almost always a mistake — "Studio /
  // Studio" happens whenever a page's own name repeats its parent's. It also
  // collides as a React key, so warn in development rather than shipping a
  // duplicate key error to the console of a static export nobody reads.
  if (process.env.NODE_ENV !== 'production') {
    const seen = new Set<string>()
    for (const item of items) {
      if (seen.has(item.label)) {
        console.warn(
          `Breadcrumbs: duplicate label "${item.label}". A crumb should not repeat its parent — ` +
            'this renders as "A / A" and collides as a React key.',
        )
      }
      seen.add(item.label)
    }
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('font-sans text-[10px]', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 uppercase tracking-[var(--tracking-meta)] text-stone">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            // Keyed by position as well as label. A trail is ordered and static
            // — it never reorders or re-renders into a different shape — so an
            // index is a stable identity here, and it keeps a duplicate label
            // from becoming a duplicate-key error.
            <li key={`${i}-${item.label}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast && (
                <span aria-hidden className="text-stone/50">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
