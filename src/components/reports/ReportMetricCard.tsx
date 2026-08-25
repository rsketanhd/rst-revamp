import { cn } from '../../lib/cn'

export type ReportMetricCardProps = {
  label: string
  value: string
  description?: string
  className?: string
}

/**
 * Report KPI card with optional supporting description under the value.
 */
export function ReportMetricCard({
  label,
  value,
  description,
  className,
}: ReportMetricCardProps) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-xl border border-[#E8E6F0] bg-white px-3.5 py-3.5',
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold tabular-nums text-[#2D2061] sm:text-2xl">
        {value}
      </p>
      {description ? (
        <p className="mt-1 text-[11px] leading-snug text-[#8B8B9E]">
          {description}
        </p>
      ) : null}
    </div>
  )
}
