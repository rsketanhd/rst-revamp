import { SlidersHorizontal } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Select } from '../ui'

export type SchedulerFiltersBarProps = {
  lastUpdatedOn: string
  lastUpdatedOptions: string[]
  onLastUpdatedChange: (value: string) => void
  tag: string
  tagOptions: string[]
  onTagChange: (value: string) => void
  candidateHiding: string
  hidingOptions: string[]
  onCandidateHidingChange: (value: string) => void
  onMoreFilters?: () => void
  className?: string
}

/**
 * Interview Scheduler filter strip — Last Updated, Tags, Candidate Hiding, More Filters.
 */
export function SchedulerFiltersBar({
  lastUpdatedOn,
  lastUpdatedOptions,
  onLastUpdatedChange,
  tag,
  tagOptions,
  onTagChange,
  candidateHiding,
  hidingOptions,
  onCandidateHidingChange,
  onMoreFilters,
  className,
}: SchedulerFiltersBarProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[#F2F1F6] px-3 py-3.5 sm:px-5 sm:py-4',
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-5 xl:gap-6">
        <div className="min-w-0 flex-1">
          <Select
            label="Last Updated On"
            options={lastUpdatedOptions}
            value={lastUpdatedOn}
            placeholder="Select"
            onChange={(e) => onLastUpdatedChange(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="min-w-0 flex-1">
          <Select
            label="Tags"
            options={tagOptions}
            value={tag}
            placeholder="Select Tags"
            onChange={(e) => onTagChange(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="min-w-0 flex-1">
          <Select
            label="Candidate Hiding"
            options={hidingOptions}
            value={candidateHiding}
            placeholder="Select Candidate"
            onChange={(e) => onCandidateHidingChange(e.target.value)}
            className="bg-white"
          />
        </div>

        <button
          type="button"
          onClick={onMoreFilters}
          className={cn(
            'inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-md border border-[#2D2061] bg-white px-4 sm:w-auto',
            'text-sm font-semibold text-[#2D2061] transition-colors hover:bg-[#f7f6fb]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/25',
          )}
        >
          <SlidersHorizontal
            className="size-4 shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          More Filters
        </button>
      </div>
    </div>
  )
}
