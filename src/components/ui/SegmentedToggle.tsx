import { cn } from '../../lib/cn'

export type SegmentedToggleOption<T extends string> = {
  value: T
  label: string
}

export type SegmentedToggleProps<T extends string> = {
  value: T
  options: Array<SegmentedToggleOption<T>>
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
  /** Accessible name for the control group */
  'aria-label'?: string
}

/**
 * Compact two/three-option pill toggle (e.g. Old / New on Job Analyzer).
 */
export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SegmentedToggleProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex shrink-0 rounded-full border border-[#E0DFE8] bg-[#F4F4F8] p-0.5',
        disabled && 'opacity-50',
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded-full px-2.5 text-[11px] font-semibold transition-colors',
              active
                ? 'bg-[#2D2061] text-white shadow-sm'
                : 'text-[#8B8FA3] hover:text-[#2D2061]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
