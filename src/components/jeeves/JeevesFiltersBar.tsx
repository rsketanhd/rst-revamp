import { cn } from '../../lib/cn'
import { FilterCtaButton, Select } from '../ui'

export type JeevesFiltersBarProps = {
  lastUpdatedOn: string
  onLastUpdatedOnChange: (value: string) => void
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
 * Jeeves AI list filter strip — Last Updated, Tags, Candidate Hiding, More Filters.
 */
export function JeevesFiltersBar({
  lastUpdatedOn,
  onLastUpdatedOnChange,
  tag,
  tagOptions,
  onTagChange,
  candidateHiding,
  hidingOptions,
  onCandidateHidingChange,
  onMoreFilters,
  moreFilterCount = 0,
  className,
}: JeevesFiltersBarProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[#F2F1F6] px-4 py-4 sm:px-5 sm:py-4',
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-5">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-[#5c5878]">
            Last Updated On
          </span>
          <input
            type="date"
            value={lastUpdatedOn}
            onChange={(e) => onLastUpdatedOnChange(e.target.value)}
            className="h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </label>

        <div className="min-w-0 flex-1">
          <Select
            label="Tags"
            options={tagOptions}
            value={tag}
            placeholder="Select"
            onChange={(e) => onTagChange(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="min-w-0 flex-1">
          <Select
            label="Candidate Hiding"
            options={hidingOptions}
            value={candidateHiding}
            placeholder="Select"
            onChange={(e) => onCandidateHidingChange(e.target.value)}
            className="bg-white"
          />
        </div>

        <FilterCtaButton
          label="More Filters"
          count={moreFilterCount}
          onClick={onMoreFilters}
          className="!h-11 !rounded-md !border-[#2D2061] !font-semibold"
        />
      </div>
    </div>
  )
}
