import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '../../lib/cn'

export type FilterCtaButtonProps = {
  /** Button label when no filters are applied. */
  label?: ReactNode
  /** Number of applied filter criteria. When > 0, the CTA shows this count. */
  count?: number
  /** Optional leading icon (defaults to sliders). */
  icon?: ReactNode
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

const COUNT_BADGE =
  'inline-flex min-w-5 items-center justify-center rounded-full bg-[#2D2061] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white'

/**
 * Shared Filter / Filter By / More Filters CTA.
 * When `count > 0`, the control shows the selected-filter count beside the label.
 */
export function FilterCtaButton({
  label = 'Filter By',
  count = 0,
  icon,
  className,
  type = 'button',
  'aria-label': ariaLabel,
  ...rest
}: FilterCtaButtonProps) {
  const active = count > 0
  const resolvedAriaLabel =
    ariaLabel ??
    (typeof label === 'string'
      ? active
        ? `${label}, ${count} selected`
        : label
      : active
        ? `Filters, ${count} selected`
        : 'Filters')

  return (
    <button
      type={type}
      aria-label={resolvedAriaLabel}
      className={cn(
        'relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors',
        'border-[#2D2061]/25 bg-white text-[#2D2061] shadow-[0_1px_2px_rgba(45,32,97,0.04)] hover:bg-[#faf9fd]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/25',
        active && 'border-[#2D2061]/40',
        className,
      )}
      {...rest}
    >
      {icon ?? (
        <SlidersHorizontal
          className="size-4 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      )}
      <span className="min-w-0 truncate">{label}</span>
      {active ? <span className={COUNT_BADGE}>{count}</span> : null}
    </button>
  )
}

export { COUNT_BADGE as FILTER_CTA_COUNT_BADGE }
