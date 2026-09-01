import { Briefcase, Clock, MapPin } from 'lucide-react'
import type { MyJob } from '../../data/myJobs'
import { cn } from '../../lib/cn'

export type MyJobCardProps = {
  job: MyJob
  selected?: boolean
  compact?: boolean
  onSelect?: (job: MyJob) => void
  className?: string
}

/**
 * My Jobs — selectable job card for list and suggested jobs strip.
 */
export function MyJobCard({
  job,
  selected = false,
  compact = false,
  onSelect,
  className,
}: MyJobCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(job)}
      className={cn(
        'w-full rounded-lg border text-left transition-colors',
        compact ? 'px-3 py-3' : 'px-4 py-4',
        selected
          ? 'border-[#2D2061] bg-[#2D2061] text-white shadow-sm'
          : 'border-[#E8E6F0] bg-white text-[#2D2061] hover:border-[#2D2061]/30 hover:bg-[#FAFAFC]',
        className,
      )}
    >
      <div className="flex flex-wrap gap-1.5">
        <JobTag label={job.jobType} selected={selected} />
        <JobTag label={job.workMode} selected={selected} />
      </div>

      <h3
        className={cn(
          'mt-2 font-bold leading-snug',
          compact ? 'text-sm' : 'text-[15px]',
        )}
      >
        {job.title}
      </h3>
      <p
        className={cn(
          'mt-0.5 text-xs font-semibold uppercase tracking-wide',
          selected ? 'text-white/85' : 'text-[#6B6B80]',
        )}
      >
        {job.company}
      </p>

      <div
        className={cn(
          'mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs',
          selected ? 'text-white/80' : 'text-[#8B8B9E]',
        )}
      >
        <span className="inline-flex items-center gap-1">
          <Briefcase className="size-3.5 shrink-0" strokeWidth={1.75} />
          {job.experience}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} />
          {job.location}
        </span>
      </div>

      {!compact ? (
        <p
          className={cn(
            'mt-3 inline-flex items-center gap-1 text-xs',
            selected ? 'text-white/75' : 'text-[#A0A0B2]',
          )}
        >
          <Clock className="size-3.5 shrink-0" strokeWidth={1.75} />
          {job.postedAgo}
        </p>
      ) : null}
    </button>
  )
}

function JobTag({ label, selected }: { label: string; selected: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold',
        selected
          ? 'border border-white/30 bg-white/15 text-white'
          : 'border border-[#E0DDEA] bg-[#F7F6FA] text-[#6B6B80]',
      )}
    >
      {label}
    </span>
  )
}
