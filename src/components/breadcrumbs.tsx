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
  return (
    <nav aria-label="Breadcrumb" className={cn('font-sans text-[10px]', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 uppercase tracking-[var(--tracking-meta)] text-stone">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-2">
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
