import { cn } from '../../lib/cn'

export type ReportKpiCardProps = {
  label: string
  value: string
  className?: string
}

/**
 * Compact KPI tile used on report detail screens.
 */
export function ReportKpiCard({ label, value, className }: ReportKpiCardProps) {
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
    </div>
  )
}
