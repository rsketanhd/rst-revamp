import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'

export type StarRatingProps = {
  value: number
  max?: number
  interactive?: boolean
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  'aria-label'?: string
}

/**
 * Star rating — gold filled stars; unfilled use white fill + light grey outline.
 */
export function StarRating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 'sm',
  className,
  'aria-label': ariaLabel,
}: StarRatingProps) {
  const starSize =
    size === 'lg' ? 'size-6' : size === 'md' ? 'size-[18px]' : 'size-3.5'
  const stroke = size === 'sm' ? 1.75 : 1.5
  const gap = size === 'lg' ? 'gap-1' : size === 'md' ? 'gap-0.5' : 'gap-px'

  return (
    <div
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={ariaLabel ?? `${value} of ${max} stars`}
      className={cn('inline-flex items-center', gap, className)}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1
        const filled = starValue <= value
        const star = (
          <Star
            className={cn(
              starSize,
              filled
                ? 'fill-[#F5C518] text-[#F5C518]'
                : 'fill-white text-[#C8C5D6]',
            )}
            strokeWidth={stroke}
            aria-hidden="true"
          />
        )

        if (!interactive) {
          return <span key={starValue}>{star}</span>
        }

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={starValue === value}
            aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
            onClick={() => onChange?.(starValue === value ? 0 : starValue)}
            className="rounded p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#2D2061]/30"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}
