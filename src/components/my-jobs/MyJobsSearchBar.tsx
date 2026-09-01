import { MapPin, Search } from 'lucide-react'
import { cn } from '../../lib/cn'

export type MyJobsSearchBarProps = {
  query: string
  locationQuery: string
  onQueryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSearch: () => void
  className?: string
}

/**
 * My Jobs — skills search, location, and Search Jobs action (single row).
 */
export function MyJobsSearchBar({
  query,
  locationQuery,
  onQueryChange,
  onLocationChange,
  onSearch,
  className,
}: MyJobsSearchBarProps) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSearch()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(9rem,13rem)_auto] sm:items-center',
        className,
      )}
    >
      <div className="relative min-w-0">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Describe your ideal job or skills"
          aria-label="Search jobs by skills"
          className={cn(
            'h-10 w-full rounded-md border border-[#E0DDEA] bg-white pl-9 pr-3 text-sm text-[#2D2061]',
            'placeholder:text-[#A0A0B2]',
            'transition-colors focus:border-[#2D2061] focus:outline-none focus:ring-2 focus:ring-[#2D2061]/10',
          )}
        />
      </div>

      <div className="relative min-w-0">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="search"
          value={locationQuery}
          onChange={(event) => onLocationChange(event.target.value)}
          placeholder="Location or Remote"
          aria-label="Filter by location"
          className={cn(
            'h-10 w-full rounded-md border border-[#E0DDEA] bg-white pl-9 pr-3 text-sm text-[#2D2061]',
            'placeholder:text-[#A0A0B2]',
            'transition-colors focus:border-[#2D2061] focus:outline-none focus:ring-2 focus:ring-[#2D2061]/10',
          )}
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#241a52] sm:min-w-[7.5rem]"
      >
        Search Jobs
      </button>
    </form>
  )
}
