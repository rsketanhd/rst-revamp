import { ReportMetricCard } from './ReportMetricCard'
import { cn } from '../../lib/cn'

export type ReportMetricGridItem = {
  id: string
  label: string
  value: string
  description?: string
}

export type ReportMetricGridProps = {
  items: ReportMetricGridItem[]
  className?: string
}

/**
 * Responsive metric card row with optional descriptions.
 */
export function ReportMetricGrid({ items, className }: ReportMetricGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6',
        className,
      )}
    >
      {items.map((item) => (
        <ReportMetricCard
          key={item.id}
          label={item.label}
          value={item.value}
          description={item.description}
        />
      ))}
    </div>
  )
}
