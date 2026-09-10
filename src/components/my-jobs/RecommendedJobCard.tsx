import { Briefcase, MapPin } from 'lucide-react'
import type { RecommendedJob } from '../../data/myJobs'
import { cn } from '../../lib/cn'

export type RecommendedJobCardProps = {
  job: RecommendedJob
  onSelect?: (job: RecommendedJob) => void
  className?: string
}

/**
 * Compact recommended-job tile shown in the All Jobs banner.
 */
export function RecommendedJobCard({
  job,
  onSelect,
  className,
}: RecommendedJobCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(job)}
      className={cn(
        'flex w-[13.75rem] shrink-0 flex-col rounded-xl border border-[#E8E6F0] bg-white px-3.5 py-3.5 text-left',
        'transition-colors hover:border-[#2D2061]/30',
        className,
      )}
    >
      <h3 className="text-sm font-bold leading-snug text-[#2D2061]">{job.title}</h3>
      <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#8B8B9E]">
        <Briefcase className="size-3.5 shrink-0" strokeWidth={1.75} />
        {job.experience}
      </p>
      <p className="mt-1 inline-flex min-w-0 items-center gap-1.5 text-xs text-[#8B8B9E]">
        <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{job.location}</span>
      </p>
      <p className="mt-3 rounded-md bg-[#F8E7F2] px-2 py-1.5 text-[11px] leading-snug text-[#2D2061]">
        {job.matchSummary}
      </p>
    </button>
  )
}
