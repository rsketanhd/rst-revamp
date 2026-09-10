import type { RecommendedJob } from '../../data/myJobs'
import { cn } from '../../lib/cn'
import { Switch } from '../ui'
import { RecommendedJobCard } from './RecommendedJobCard'

export type RecommendedJobsSectionProps = {
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  jobs: RecommendedJob[]
  totalMatchCount: number
  onSelectJob: (job: RecommendedJob) => void
  className?: string
}

/**
 * All Jobs — recommended-jobs banner with show/hide toggle.
 */
export function RecommendedJobsSection({
  expanded,
  onExpandedChange,
  jobs,
  totalMatchCount,
  onSelectJob,
  className,
}: RecommendedJobsSectionProps) {
  const matchCount = expanded ? jobs.length : totalMatchCount
  const toggleLabel = expanded
    ? 'Hide recommended jobs'
    : 'Show recommended jobs'

  return (
    <section
      className={cn('rounded-xl bg-[#F4F5FB] px-4 py-3.5 sm:px-5', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <h2 className="text-sm font-bold text-[#2D2061]">
            Recommended for you
          </h2>
          <p className="text-xs text-[#8B8B9E] sm:text-sm">
            {matchCount} jobs match your resume and preferences
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-[#6B6B80] sm:text-sm">{toggleLabel}</span>
          <Switch
            checked={expanded}
            onCheckedChange={onExpandedChange}
            aria-label={toggleLabel}
          />
        </div>
      </div>

      {expanded && jobs.length > 0 ? (
        <div className="-mx-1 mt-3.5 overflow-x-auto px-1 pb-0.5">
          <div className="flex gap-3">
            {jobs.map((job) => (
              <RecommendedJobCard
                key={job.id}
                job={job}
                onSelect={onSelectJob}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
