import { cn } from '../../lib/cn'

export type SegmentedControlOption<T extends string> = {
  value: T
  label: string
}

export type SegmentedControlProps<T extends string> = {
  value: T
  options: Array<SegmentedControlOption<T>>
  onChange: (value: T) => void
  className?: string
  /** Accessible name for the control group */
  'aria-label'?: string
}

/**
 * Pill segmented switcher used on Jobs (Active / Inactive) and similar lists.
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex rounded-full border border-line bg-surface p-0.5',
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'min-w-0 flex-none rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:px-3.5',
              active
                ? 'bg-[#2D2061] text-white'
                : 'text-[#2D2061]/70 hover:text-[#2D2061]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
