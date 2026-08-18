import { SlidersHorizontal } from 'lucide-react'
import { cn } from '../../lib/cn'
import { RangeSlider, Select, StarRating } from '../ui'

export type ApplicationFiltersBarProps = {
  source: string
  sourceOptions: string[]
  onSourceChange: (value: string) => void
  cvRelevancy: number
  onCvRelevancyChange: (value: number) => void
  suitability: [number, number]
  onSuitabilityChange: (value: [number, number]) => void
  onMoreFilters?: () => void
  className?: string
}

/**
 * Applications page filter strip — light gray bar matching product design:
 * Source select, CV relevancy stars, suitability range, More Filters.
 */
export function ApplicationFiltersBar({
  source,
  sourceOptions,
  onSourceChange,
  cvRelevancy,
  onCvRelevancyChange,
  suitability,
  onSuitabilityChange,
  onMoreFilters,
  className,
}: ApplicationFiltersBarProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[#F2F1F6] px-3 py-3.5 sm:px-5 sm:py-4',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:gap-5 md:grid md:grid-cols-2 md:items-end lg:flex lg:flex-row lg:items-end lg:gap-8">
        {/* Source */}
        <div className="min-w-0 w-full flex-1 lg:max-w-none">
          <Select
            label="Source"
            options={sourceOptions}
            value={source}
            placeholder="Select"
            onChange={(e) => onSourceChange(e.target.value)}
            className="bg-white"
          />
        </div>

        {/* CV Relevancy — stars only, no bordered field */}
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

        {/* Suitability */}
        <div className="min-w-0 w-full flex-1 md:col-span-2 lg:col-span-1 lg:min-w-[14rem] lg:max-w-sm">
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

        {/* More Filters */}
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
