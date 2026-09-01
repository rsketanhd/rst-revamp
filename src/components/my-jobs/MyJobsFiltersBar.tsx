import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export type MyJobsFiltersBarProps = {
  jobType: string
  companySize: string
  salaryRange: string
  jobTypeOptions: string[]
  companySizeOptions: string[]
  salaryRangeOptions: string[]
  onJobTypeChange: (value: string) => void
  onCompanySizeChange: (value: string) => void
  onSalaryRangeChange: (value: string) => void
  onAllFiltersClick: () => void
  onClearAll: () => void
  activeFilterCount?: number
  className?: string
}

/**
 * My Jobs — inline gray filter dropdown row.
 */
export function MyJobsFiltersBar({
  jobType,
  companySize,
  salaryRange,
  jobTypeOptions,
  companySizeOptions,
  salaryRangeOptions,
  onJobTypeChange,
  onCompanySizeChange,
  onSalaryRangeChange,
  onAllFiltersClick,
  onClearAll,
  activeFilterCount = 0,
  className,
}: MyJobsFiltersBarProps) {
  const hasActiveFilters = activeFilterCount > 0

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        className,
      )}
    >
      <FilterDropdown
        label="Job Type"
        value={jobType}
        options={jobTypeOptions}
        onChange={onJobTypeChange}
      />
      <FilterDropdown
        label="Company Size"
        value={companySize}
        options={companySizeOptions}
        onChange={onCompanySizeChange}
      />
      <FilterDropdown
        label="Salary Range"
        value={salaryRange}
        options={salaryRangeOptions}
        onChange={onSalaryRangeChange}
      />

      <button
        type="button"
        onClick={onAllFiltersClick}
        className={cn(
          'relative inline-flex h-9 items-center gap-1 rounded-md border border-[#E0DDEA] bg-white px-3 text-sm font-medium text-[#2D2061]',
          'transition-colors hover:bg-[#FAFAFC]',
        )}
      >
        All Filters
        <ChevronDown className="size-3.5 text-[#6B6B80]" strokeWidth={2} />
        {activeFilterCount > 0 ? (
          <span className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full bg-[#2D2061] text-[9px] font-bold text-white">
            {activeFilterCount}
          </span>
        ) : null}
      </button>

      <button
        type="button"
        disabled={!hasActiveFilters}
        onClick={onClearAll}
        className="px-1 text-sm font-medium text-[#2D2061] transition-colors hover:text-[#241a52] disabled:cursor-default disabled:text-[#A0A0B2]"
      >
        Clear All
      </button>
    </div>
  )
}

type FilterDropdownProps = {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className={cn(
          'h-9 appearance-none rounded-md border border-[#E0DDEA] bg-white pl-3 pr-8 text-sm font-medium text-[#2D2061]',
          'transition-colors hover:bg-[#FAFAFC] focus:border-[#2D2061] focus:outline-none focus:ring-2 focus:ring-[#2D2061]/10',
          value && 'border-[#2D2061]/25 bg-white',
        )}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#6B6B80]"
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  )
}
