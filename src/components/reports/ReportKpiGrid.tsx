import { ReportKpiCard } from './ReportKpiCard'
import type { ReportKpi } from '../../data/jobStatisticsOverview'
import { cn } from '../../lib/cn'

export type ReportKpiGridProps = {
  items: ReportKpi[]
  className?: string
}

/**
 * Responsive KPI card row for report dashboards.
 */
export function ReportKpiGrid({ items, className }: ReportKpiGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7',
        className,
      )}
    >
      {items.map((item) => (
        <ReportKpiCard key={item.id} label={item.label} value={item.value} />
      ))}
    </div>
  )
}
