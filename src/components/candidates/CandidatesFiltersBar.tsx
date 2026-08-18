import { SlidersHorizontal } from 'lucide-react'
import { cn } from '../../lib/cn'
import { RangeSlider, Select, StarRating } from '../ui'

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

        <button
          type="button"
          onClick={onMoreFilters}
          className={cn(
            'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-[#2D2061] bg-white px-4',
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
