import { cn } from '../../lib/cn'
import { FilterCtaButton, Select } from '../ui'

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
  /** Applied more-filters count shown on the More Filters CTA. */
  moreFilterCount?: number
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
  moreFilterCount = 0,
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

        <FilterCtaButton
          label="More Filters"
          count={moreFilterCount}
          onClick={onMoreFilters}
          className="!h-11 w-full !rounded-md !border-[#2D2061] !font-semibold sm:w-auto"
        />
      </div>
    </div>
  )
}
