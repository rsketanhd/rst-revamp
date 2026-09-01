import { cn } from '../../lib/cn'

export type SettingsUnderlineTabOption<T extends string> = {
  value: T
  label: string
}

export type SettingsUnderlineTabsProps<T extends string> = {
  value: T
  options: Array<SettingsUnderlineTabOption<T>>
  onChange: (value: T) => void
  className?: string
  'aria-label'?: string
}

/**
 * Underline tab switcher used on Settings module panels (e.g. Talent CRM).
 */
export function SettingsUnderlineTabs<T extends string>({
  value,
  options,
  onChange,
  className,
  'aria-label': ariaLabel = 'Section tabs',
}: SettingsUnderlineTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-6 border-b border-[#E8E6F0]',
        className,
      )}
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
              '-mb-px border-b-2 pb-2.5 text-sm transition-colors',
              active
                ? 'border-[#2D2061] font-semibold text-[#2D2061]'
                : 'border-transparent font-medium text-[#8B8B9E] hover:text-[#2D2061]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
