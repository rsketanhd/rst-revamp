import { Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '../../lib/cn'

export type MyApplicationsSearchBarProps = {
  value: string
  onChange: (value: string) => void
  onFilterClick?: () => void
  activeFilterCount?: number
  className?: string
}

/**
 * Full-width search strip for My Applications.
 */
export function MyApplicationsSearchBar({
  value,
  onChange,
  onFilterClick,
  activeFilterCount = 0,
  className,
}: MyApplicationsSearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type here to search"
        aria-label="Search applications"
        className={cn(
          'h-11 w-full rounded-lg border border-[#E0DDEA] bg-white pl-10 pr-12 text-sm text-[#2D2061]',
          'placeholder:text-[#A0A0B2]',
          'transition-colors focus:border-[#2D2061] focus:outline-none focus:ring-2 focus:ring-[#2D2061]/10',
        )}
      />
      <button
        type="button"
        onClick={onFilterClick}
        aria-label="Filter applications"
        className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F7F6FA]"
      >
        <SlidersHorizontal className="size-4" strokeWidth={1.75} />
        {activeFilterCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex size-4 items-center justify-center rounded-full bg-[#2D2061] text-[9px] font-bold leading-none text-white">
            {activeFilterCount}
          </span>
        ) : null}
      </button>
    </div>
  )
}
