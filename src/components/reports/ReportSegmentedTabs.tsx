import { cn } from '../../lib/cn'

export type ReportSegmentedTabsOption<T extends string> = {
  value: T
  label: string
}

export type ReportSegmentedTabsProps<T extends string> = {
  value: T
  options: Array<ReportSegmentedTabsOption<T>>
  onChange: (value: T) => void
  className?: string
  'aria-label'?: string
}

/**
 * Rectangular segmented tabs used on report chart panels (not pill style).
 */
export function ReportSegmentedTabs<T extends string>({
  value,
  options,
  onChange,
  className,
  'aria-label': ariaLabel,
}: ReportSegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex max-w-full flex-wrap overflow-hidden rounded-md border border-[#E0DDEA] bg-white',
        className,
      )}
    >
      {options.map((option, index) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 py-2 text-xs font-semibold transition-colors sm:px-3.5 sm:text-[13px]',
              index > 0 && 'border-l border-[#E0DDEA]',
              active
                ? 'bg-[#2D2061] text-white'
                : 'bg-white text-[#4A4A5A] hover:bg-[#F7F6FA]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
