import { cn } from '../../lib/cn'
import { FilterCtaButton, RangeSlider, Select, StarRating } from '../ui'

export type CandidatesFiltersBarProps = {
  source: string
  sourceOptions: string[]
  onSourceChange: (value: string) => void
  tag: string
  tagOptions: string[]
  onTagChange: (value: string) => void
  cvRelevancy: number
  onCvRelevancyChange: (value: number) => void
  suitability: [number, number]
  onSuitabilityChange: (value: [number, number]) => void
  onMoreFilters?: () => void
  /** Applied more-filters count shown on the More Filters CTA. */
  moreFilterCount?: number
  className?: string
}

/**
 * Candidates page filter strip — Source, Tags, CV Relevancy, Suitability, More Filters.
 */
export function CandidatesFiltersBar({
  source,
  sourceOptions,
  onSourceChange,
  tag,
  tagOptions,
  onTagChange,
  cvRelevancy,
  onCvRelevancyChange,
  suitability,
  onSuitabilityChange,
  onMoreFilters,
  moreFilterCount = 0,
  className,
}: CandidatesFiltersBarProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[#F2F1F6] px-4 py-4 sm:px-5 sm:py-4',
        className,
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-5 xl:gap-6">
        <div className="min-w-0 flex-1">
          <Select
            label="Source"
            options={sourceOptions}
            value={source}
            placeholder="Select"
            onChange={(e) => onSourceChange(e.target.value)}
            className="bg-white"
          />
        </div>

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

        <div className="flex shrink-0 flex-col gap-2">
          <span className="text-xs font-medium text-[#5c5878]">
            CV Relevancy
          </span>
          <div className="flex h-11 items-center">
            <StarRating
              value={cvRelevancy}
              interactive
              size="lg"
              onChange={onCvRelevancyChange}
              aria-label="Filter by CV relevancy"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:min-w-[12rem] lg:max-w-sm">
          <RangeSlider
            label="Suitability (0-95%)"
            valueLabel=""
            unit="%"
            min={0}
            max={95}
            step={1}
            value={suitability}
            onChange={onSuitabilityChange}
            accent="suitability"
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
