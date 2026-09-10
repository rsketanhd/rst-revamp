import type { MyJob } from '../../data/myJobs'
import { cn } from '../../lib/cn'
import { MyJobCard } from './MyJobCard'

export type MyJobsListPanelProps = {
  jobs: MyJob[]
  selectedJobId: string | null
  appliedJobIds?: string[]
  totalCount: number
  onSelectJob: (job: MyJob) => void
  className?: string
}

/**
 * All Jobs — scrollable left-column listing.
 */
export function MyJobsListPanel({
  jobs,
  selectedJobId,
  appliedJobIds = [],
  totalCount,
  onSelectJob,
  className,
}: MyJobsListPanelProps) {
  return (
    <aside
      className={cn(
        'flex min-h-0 min-w-0 flex-col rounded-xl bg-[#F4F5F8] p-3',
        className,
      )}
    >
      <p className="shrink-0 px-1 pb-2.5 text-xs font-semibold text-[#8B8B9E]">
        Total {totalCount} Jobs
      </p>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#E0DDEA] bg-white px-4 py-10 text-center">
            <p className="text-sm text-[#8B8B9E]">
              No jobs match your search or filters.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {jobs.map((job) => (
              <li key={job.id}>
                <MyJobCard
                  job={job}
                  selected={job.id === selectedJobId}
                  applied={appliedJobIds.includes(job.id)}
                  onSelect={onSelectJob}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
