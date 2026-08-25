import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type ReportChartPanelProps = {
  title: string
  toolbar?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Bordered chart card with header strip — reusable across report screens.
 */
export function ReportChartPanel({
  title,
  toolbar,
  children,
  className,
}: ReportChartPanelProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-[#E4E1EE] bg-white',
        className,
      )}
    >
      <header className="border-b border-[#ECEAF3] bg-[#F7F6FA] px-4 py-3.5 sm:px-5">
        <h2 className="text-base font-bold text-[#2D2061]">{title}</h2>
      </header>
      <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-5">
        {toolbar ? (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {toolbar}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
