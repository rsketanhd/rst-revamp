import { formatDashboardStat, type CandidateDashboardStat } from '../../data/candidateDashboard'

export type CandidateStatCardsProps = {
  stats: CandidateDashboardStat[]
}

/**
 * Top KPI tiles on the candidate dashboard (label left, padded value right).
 */
export function CandidateStatCards({ stats }: CandidateStatCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="flex items-center justify-between gap-4 rounded-xl bg-[#F4F5F8] px-5 py-4"
        >
          <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
            {stat.label}
          </p>
          <p className="shrink-0 text-2xl font-bold tabular-nums text-[#2D2061]">
            {formatDashboardStat(stat.value)}
          </p>
        </div>
      ))}
    </section>
  )
}
