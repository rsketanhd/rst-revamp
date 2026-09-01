import { cn } from '../../lib/cn'

export type SettingsPointerTabOption<T extends string> = {
  value: T
  label: string
}

export type SettingsPointerTabsProps<T extends string> = {
  value: T
  options: Array<SettingsPointerTabOption<T>>
  onChange: (value: T) => void
  className?: string
  'aria-label'?: string
}

/**
 * Filled tab switcher with a downward pointer under the active tab
 * (Column & Filter Visibility design).
 */
export function SettingsPointerTabs<T extends string>({
  value,
  options,
  onChange,
  className,
  'aria-label': ariaLabel = 'View tabs',
}: SettingsPointerTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('inline-flex items-end gap-0', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative inline-flex h-9 min-w-[5.5rem] items-center justify-center border px-4 text-sm font-semibold transition-colors first:rounded-l-md last:rounded-r-md',
              active
                ? 'z-[1] border-[#2D2061] bg-[#2D2061] text-white'
                : 'border-[#E0DDEA] bg-white text-[#8B8B9E] hover:text-[#2D2061]',
              !active && options.indexOf(option) > 0 && '-ml-px',
            )}
          >
            {option.label}
            {active ? (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-x-[6px] border-t-[7px] border-x-transparent border-t-[#2D2061]"
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
