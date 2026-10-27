import { cn } from '../../lib/cn'
import {
  formatTalentMetric,
  type TalentCrmMetric,
} from '../../data/talentCrm'

export type TalentCrmMetricCardsProps = {
  metrics: TalentCrmMetric[]
  className?: string
}

/**
 * Top KPI strip for Talent CRM — label, value, and month-over-month trend.
 */
export function TalentCrmMetricCards({
  metrics,
  className,
}: TalentCrmMetricCardsProps) {
  return (
    <section
      className={cn(
        'grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5',
        className,
      )}
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </section>
  )
}

function MetricCard({ metric }: { metric: TalentCrmMetric }) {
  const isUp = metric.change >= 0

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-[#E8EAF0] bg-[#F8FAFC] px-3.5 py-3 sm:px-4 sm:py-3.5">
      <p className="text-[11px] font-medium text-[#8B8B9E]">{metric.label}</p>
      <p className="text-[1.5rem] font-bold leading-none tabular-nums text-[#2D2061] sm:text-[1.625rem]">
        {formatTalentMetric(metric.value)}
      </p>
      <p
        className={cn(
          'text-[11px] font-medium tabular-nums',
          isUp ? 'text-[#2F9E6B]' : 'text-[#D14343]',
        )}
      >
        {isUp ? '+' : '−'}
        {Math.abs(metric.change)} {metric.changeLabel}
      </p>
    </div>
  )
}
