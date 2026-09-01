import { ChevronDown } from 'lucide-react'
import type { MyJob, MyJobsSortOption } from '../../data/myJobs'
import { MY_JOBS_SORT_OPTIONS } from '../../data/myJobs'
import { cn } from '../../lib/cn'
import { MyJobCard } from './MyJobCard'

export type MyJobsListPanelProps = {
  jobs: MyJob[]
  selectedJobId: string | null
  totalCount: number
  sortBy: MyJobsSortOption
  onSortChange: (value: MyJobsSortOption) => void
  onSelectJob: (job: MyJob) => void
  className?: string
}

/**
 * My Jobs — scrollable left column job list.
 */
export function MyJobsListPanel({
  jobs,
  selectedJobId,
  totalCount,
  sortBy,
  onSortChange,
  onSelectJob,
  className,
}: MyJobsListPanelProps) {
  return (
    <aside
      className={cn(
        'flex min-h-0 min-w-0 flex-col border-r border-[#E8E6F0] bg-white',
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E8E6F0] px-4 py-3">
        <p className="text-sm font-semibold text-[#2D2061]">
          Total {totalCount.toLocaleString()} Jobs
        </p>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value as MyJobsSortOption)
            }
            aria-label="Sort jobs"
            className="h-8 appearance-none rounded-md border border-[#E0DDEA] bg-white pl-2.5 pr-7 text-xs font-medium text-[#2D2061] focus:border-[#2D2061] focus:outline-none focus:ring-2 focus:ring-[#2D2061]/10"
          >
            {MY_JOBS_SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-[#8B8B9E]"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {jobs.length === 0 ? (
          <EmptyListState message="No jobs match your search or filters." />
        ) : (
          <ul className="flex flex-col gap-2.5">
            {jobs.map((job) => (
              <li key={job.id}>
                <MyJobCard
                  job={job}
                  selected={job.id === selectedJobId}
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

function EmptyListState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-4 py-10 text-center">
      <p className="text-sm text-[#8B8B9E]">{message}</p>
    </div>
  )
}
