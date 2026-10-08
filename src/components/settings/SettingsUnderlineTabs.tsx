import { useLayoutEffect, useRef, useState } from 'react'
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
  const listRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)

  // Slide the underline to the active tab
  useLayoutEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!list || !active) return
    const measure = () => setIndicator({ left: active.offsetLeft, width: active.offsetWidth })
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [value, options.length])

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'relative flex items-center gap-6 border-b border-[#E8E6F0]',
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
              'pb-2.5 text-sm',
              active
                ? 'font-semibold text-[#2D2061]'
                : 'font-medium text-[#8B8B9E] hover:text-[#2D2061]',
            )}
          >
            {option.label}
          </button>
        )
      })}
      {indicator ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px h-0.5 rounded-full bg-[#2D2061] transition-[left,width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ left: indicator.left, width: indicator.width }}
        />
      ) : null}
    </div>
  )
}
