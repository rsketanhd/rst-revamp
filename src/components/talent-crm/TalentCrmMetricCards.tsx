import { cn } from '../../lib/cn'
import {
  formatTalentMetric,
  type TalentCrmMetric,
} from '../../data/talentCrm'

export type TalentCrmMetricCardsProps = {
  metrics: TalentCrmMetric[]
  className?: string
  /**
   * `stack` — label / value / change (Talent Pool).
   * `inline` — label + change on the left, value on the right (Campaigns).
   */
  layout?: 'stack' | 'inline'
}

const CARD_SHELL =
  'rounded-lg border border-[#E8EAF0] bg-[#F8FAFC] px-3.5 py-3 sm:px-4 sm:py-3.5'

/**
 * Top KPI strip for Talent CRM — label, value, and month-over-month trend.
 */
export function TalentCrmMetricCards({
  metrics,
  className,
  layout = 'stack',
}: TalentCrmMetricCardsProps) {
  return (
    <section
      className={cn(
        'grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5',
        className,
      )}
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} layout={layout} />
      ))}
    </section>
  )
}

function MetricCard({
  metric,
  layout,
}: {
  metric: TalentCrmMetric
  layout: 'stack' | 'inline'
}) {
  const isUp = metric.change >= 0
  const changeClass = isUp ? 'text-[#2F9E6B]' : 'text-[#D14343]'
  const changeDisplay = `${isUp ? '+' : '−'}${Math.abs(metric.change)}${metric.changeSuffix ?? ''} ${metric.changeLabel}`
  const valueDisplay = `${formatTalentMetric(metric.value)}${metric.valueSuffix ?? ''}`

  const label = (
    <p className="text-[14px] font-medium uppercase tracking-[0.02em] text-[#626889]">
      {metric.label}
    </p>
  )
  const change = (
    <p className={cn('text-[11px] font-medium tabular-nums', changeClass)}>
      {changeDisplay}
    </p>
  )
  const value = (
    <p className="text-[1.5rem] font-bold leading-none tabular-nums text-[#2D2061] sm:text-[1.625rem]">
      {valueDisplay}
    </p>
  )

  if (layout === 'inline') {
    return (
      <div className={cn(CARD_SHELL, 'flex items-center justify-between gap-3')}>
        <div className="flex min-w-0 flex-col gap-1">
          {label}
          {change}
        </div>
        <div className="shrink-0">{value}</div>
      </div>
    )
  }

  return (
    <div className={cn(CARD_SHELL, 'flex flex-col gap-1.5')}>
      {label}
      {value}
      {change}
    </div>
  )
}
