import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type DashboardPanelProps = {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

/**
 * White card shell used across recruiter dashboard sections.
 */
export function DashboardPanel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: DashboardPanelProps) {
  return (
    <section
      className={cn(
        'flex min-w-0 shrink-0 flex-col rounded-xl border border-[#E8E6F0] bg-white shadow-[0_1px_2px_rgba(45,32,97,0.04)]',
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0EEF5] px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#2D2061]">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-[#8B8B9E]">{subtitle}</p>
          ) : null}
        </div>
        {action ? (
          <div className="max-w-full shrink-0">{action}</div>
        ) : null}
      </header>
      <div className={cn('min-w-0 p-4 sm:p-5', bodyClassName)}>
        {children}
      </div>
    </section>
  )
}
