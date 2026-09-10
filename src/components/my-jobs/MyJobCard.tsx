import { Briefcase, Clock, MapPin } from 'lucide-react'
import type { MyJob } from '../../data/myJobs'
import { cn } from '../../lib/cn'

export type MyJobCardProps = {
  job: MyJob
  selected?: boolean
  applied?: boolean
  onSelect?: (job: MyJob) => void
  className?: string
}

/**
 * All Jobs — selectable listing card.
 */
export function MyJobCard({
  job,
  selected = false,
  applied = false,
  onSelect,
  className,
}: MyJobCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(job)}
      className={cn(
        'w-full rounded-xl border px-3.5 py-3.5 text-left transition-colors',
        selected
          ? 'border-[#2D2061] bg-[#2D2061] text-white shadow-sm'
          : 'border-[#E8E6F0] bg-white text-[#2D2061] hover:border-[#2D2061]/25',
        className,
      )}
    >
      <div className="flex flex-wrap gap-1.5">
        <JobTag label={job.jobType} selected={selected} />
        <JobTag label={job.workMode} selected={selected} />
        {applied ? <AppliedTag /> : null}
      </div>

      <h3 className="mt-2.5 text-[15px] font-bold leading-snug">{job.title}</h3>
      {selected ? (
        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/80">
          {job.company}
        </p>
      ) : null}

      <div
        className={cn(
          'mt-2.5 flex flex-col gap-1 text-xs',
          selected ? 'text-white/85' : 'text-[#8B8B9E]',
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <Briefcase className="size-3.5 shrink-0" strokeWidth={1.75} />
          {job.experience}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} />
          {job.location}
        </span>
      </div>

      <p
        className={cn(
          'mt-3 inline-flex items-center gap-1.5 border-t pt-2.5 text-xs',
          selected
            ? 'border-white/25 text-white/80'
            : 'border-[#ECEAF3] text-[#A0A0B2]',
        )}
      >
        <Clock className="size-3.5 shrink-0" strokeWidth={1.75} />
        {job.postedAgo}
      </p>
    </button>
  )
}

function JobTag({ label, selected }: { label: string; selected: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-md px-2 text-[11px] font-semibold',
        selected
          ? 'bg-white text-[#2D2061]'
          : 'border border-[#E0DDEA] bg-[#F7F6FA] text-[#6B6B80]',
      )}
    >
      {label}
    </span>
  )
}

function AppliedTag() {
  return (
    <span className="inline-flex h-6 items-center rounded-md bg-[#E7F6EC] px-2 text-[11px] font-semibold text-[#1B7A3D]">
      Applied
    </span>
  )
}
