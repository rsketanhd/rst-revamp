import { cn } from '../../lib/cn'
import type { ReportHighlightStat as HighlightStat } from '../../data/jobStatisticsOverview'

export type ReportHighlightStatCardProps = {
  stat: HighlightStat
  className?: string
}

/**
 * Highlight stat tile — label left, value right (report chart summaries).
 */
export function ReportHighlightStatCard({
  stat,
  className,
}: ReportHighlightStatCardProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#E8E6F0] bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(45,32,97,0.06)]',
        className,
      )}
    >
      <p className="min-w-0 truncate text-sm font-medium text-[#9B97AE]">
        {stat.label}
      </p>
      <p className="shrink-0 text-sm font-semibold tabular-nums text-[#6B5B95]">
        {stat.value}
      </p>
    </div>
  )
}

export type ReportHighlightStatRowProps = {
  items: HighlightStat[]
  className?: string
}

export function ReportHighlightStatRow({
  items,
  className,
}: ReportHighlightStatRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 sm:grid-cols-2',
        items.length <= 4
          ? 'xl:grid-cols-4'
          : items.length <= 5
            ? 'xl:grid-cols-5'
            : items.length <= 6
              ? 'xl:grid-cols-6'
              : 'xl:grid-cols-7',
        className,
      )}
    >
      {items.map((stat) => (
        <ReportHighlightStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  )
}
