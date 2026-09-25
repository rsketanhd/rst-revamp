import { Check, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type AllowToggleCellProps = {
  /** Allowed (green ✓) vs blocked (white ×) */
  allowed: boolean
  onToggle: () => void
  /** Accessible name, e.g. "Open to Hired: allowed" */
  'aria-label': string
  disabled?: boolean
  className?: string
}

/**
 * Allow / block toggle cell for rule grids (e.g. Pipeline statuses per
 * stage, stage moves, status moves). Fills its table cell.
 */
export function AllowToggleCell({
  allowed,
  onToggle,
  'aria-label': ariaLabel,
  disabled = false,
  className,
}: AllowToggleCellProps) {
  return (
    <button
      type="button"
      aria-pressed={allowed}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'flex h-8 w-full min-w-16 items-center justify-center rounded-md border text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        allowed
          ? 'border-[#C8ECD5] bg-[#C8ECD5] text-[#0F6B32] hover:bg-[#B6E4C6]'
          : 'border-[#E4E3EA] bg-white text-[#A0A0B2] hover:bg-[#F7F7FA]',
        className,
      )}
    >
      {allowed ? (
        <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <X className="size-3" strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  )
}
