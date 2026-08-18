import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type PageHeaderProps = {
  /** Main page title (h1) */
  title: string
  /** Supporting line under the title */
  subtitle?: string
  /** Optional CTAs or trailing controls (right-aligned on larger screens) */
  actions?: ReactNode
  className?: string
  /** Extra classes on the title text */
  titleClassName?: string
  /** Extra classes on the subtitle text */
  subtitleClassName?: string
}

/**
 * Shared page title block — use on every authenticated list/settings screen.
 * Keeps title + subtitle typography identical across Jobs, Candidates, Settings, etc.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  className,
  titleClassName,
  subtitleClassName,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4',
        className,
      )}
    >
      <div className="min-w-0">
        <h1
          className={cn(
            'text-[1.375rem] font-bold leading-tight tracking-tight text-[#2D2061] sm:text-[1.5rem]',
            titleClassName,
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              'mt-0.5 text-sm font-normal text-[#8B8B9E]',
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {actions}
        </div>
      ) : null}
    </header>
  )
}
