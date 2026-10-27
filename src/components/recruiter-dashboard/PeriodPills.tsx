import { cn } from '../../lib/cn'

export type PeriodOption<T extends string> = {
  value: T
  label: string
}

export type PeriodPillsProps<T extends string> = {
  value: T
  options: ReadonlyArray<PeriodOption<T>>
  onChange: (value: T) => void
  'aria-label'?: string
  className?: string
}

/**
 * Compact period filter pills used on dashboard section headers.
 */
export function PeriodPills<T extends string>({
  value,
  options,
  onChange,
  'aria-label': ariaLabel,
  className,
}: PeriodPillsProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex max-w-full flex-wrap gap-1 rounded-lg bg-[#F4F5F8] p-1',
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
              'rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors sm:px-3',
              active
                ? 'bg-[#2D2061] text-white shadow-sm'
                : 'text-[#6B6B80] hover:bg-white hover:text-[#2D2061]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
