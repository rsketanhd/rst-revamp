import type { ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { ReportDateRangeField } from './ReportDateRangeField'
import { cn } from '../../lib/cn'

export type ReportFiltersBarProps = {
  lastStatusChange: string
  jobCreationDate: string
  dateRangeOptions: Array<{ value: string; label: string }>
  onLastStatusChange: (value: string) => void
  onJobCreationDateChange: (value: string) => void
  lastStatusLabel?: string
  jobCreationLabel?: string
  /** Optional controls between date fields and Additional filters (e.g. checkboxes). */
  middle?: ReactNode
  additionalFilterCount?: number
  onAdditionalFilters?: () => void
  className?: string
}

/**
 * Global report filter strip — date ranges + additional filters CTA.
 */
export function ReportFiltersBar({
  lastStatusChange,
  jobCreationDate,
  dateRangeOptions,
  onLastStatusChange,
  onJobCreationDateChange,
  lastStatusLabel = 'Last status change',
  jobCreationLabel = 'Job creation date',
  middle,
  additionalFilterCount = 0,
  onAdditionalFilters,
  className,
}: ReportFiltersBarProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[#F2F1F6] px-4 py-4 sm:px-5',
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-5">
        <div className="min-w-0 flex-1">
          <ReportDateRangeField
            id="report-last-status-change"
            label={lastStatusLabel}
            value={lastStatusChange}
            options={dateRangeOptions}
            onChange={onLastStatusChange}
          />
        </div>
        <div className="min-w-0 flex-1">
          <ReportDateRangeField
            id="report-job-creation-date"
            label={jobCreationLabel}
            value={jobCreationDate}
            options={dateRangeOptions}
            onChange={onJobCreationDateChange}
          />
        </div>

        {middle ? (
          <div className="flex shrink-0 flex-wrap items-center gap-4 pb-0.5 lg:min-h-11">
            {middle}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onAdditionalFilters}
          className={cn(
            'relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-[#2D2061] bg-white px-4',
            'text-sm font-semibold text-[#2D2061] transition-colors hover:bg-[#f7f6fb]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/25',
          )}
        >
          <SlidersHorizontal
            className="size-4 shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          Additional filters
          {additionalFilterCount > 0 ? (
            <span className="absolute -right-2 -top-2 inline-flex size-5 items-center justify-center rounded-full bg-[#3B82F6] text-[10px] font-bold text-white">
              {additionalFilterCount}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  )
}
