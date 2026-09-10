import { Search, Send } from 'lucide-react'
import { cn } from '../../lib/cn'

export type MyApplicationsSearchBarProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

/**
 * Full-width search strip for My Applications.
 */
export function MyApplicationsSearchBar({
  value,
  onChange,
  className,
}: MyApplicationsSearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
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
          'h-11 w-full rounded-[5px] border border-[#E0DDEA] bg-white pl-11 pr-12 text-sm text-[#2D2061]',
          'placeholder:text-[#A0A0B2]',
          'transition-colors focus:border-[#2D2061] focus:outline-none focus:ring-2 focus:ring-[#2D2061]/10',
        )}
      />
      <span
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2D2061]"
        aria-hidden="true"
      >
        <Send className="size-4" strokeWidth={1.75} />
      </span>
    </div>
  )
}
