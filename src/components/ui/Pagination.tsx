import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'

export type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Optional window of page numbers to show around the current page */
  siblingCount?: number
  className?: string
}

function buildPageList(
  page: number,
  totalPages: number,
  siblingCount: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 1) return [1]

  const totalButtons = siblingCount * 2 + 5
  if (totalPages <= totalButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const left = Math.max(2, page - siblingCount)
  const right = Math.min(totalPages - 1, page + siblingCount)
  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < totalPages - 1

  const pages: Array<number | 'ellipsis'> = [1]
  if (showLeftEllipsis) pages.push('ellipsis')
  for (let p = left; p <= right; p += 1) pages.push(p)
  if (showRightEllipsis) pages.push('ellipsis')
  pages.push(totalPages)
  return pages
}

/**
 * Shared pagination control — numbered pages with Back / Next.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const safeTotal = Math.max(1, totalPages)
  const safePage = Math.min(Math.max(1, page), safeTotal)
  const pages = buildPageList(safePage, safeTotal, siblingCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex max-w-full flex-wrap items-center justify-center gap-1 sm:justify-end sm:gap-1.5',
        className,
      )}
    >
      <button
        type="button"
        disabled={safePage <= 1}
        onClick={() => onPageChange(safePage - 1)}
        className={cn(
          'inline-flex h-9 items-center gap-1 rounded-md border border-[#d5d2e2] bg-white px-2.5 text-sm font-medium text-[#2D2061] transition-colors sm:px-3',
          'hover:bg-[#f7f6fb] disabled:cursor-not-allowed disabled:opacity-45',
        )}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Back</span>
      </button>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`e-${index}`}
            className="inline-flex h-9 min-w-8 items-center justify-center text-sm text-[#8B8B9E] sm:min-w-9"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === safePage ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              'inline-flex h-9 min-w-8 items-center justify-center rounded-md px-1.5 text-sm font-semibold transition-colors sm:min-w-9 sm:px-2',
              item === safePage
                ? 'bg-[#2D2061] text-white'
                : 'border border-[#d5d2e2] bg-white text-[#2D2061] hover:bg-[#f7f6fb]',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={safePage >= safeTotal}
        onClick={() => onPageChange(safePage + 1)}
        className={cn(
          'inline-flex h-9 items-center gap-1 rounded-md border border-[#d5d2e2] bg-white px-2.5 text-sm font-medium text-[#2D2061] transition-colors sm:px-3',
          'hover:bg-[#f7f6fb] disabled:cursor-not-allowed disabled:opacity-45',
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
