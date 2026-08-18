import { useId } from 'react'
import { cn } from '../../lib/cn'

export type SwitchProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  id?: string
  /**
   * Track color when checked. Defaults to brand navy.
   * Use for danger/magenta accents (e.g. team panel loops).
   */
  checkedTrackClassName?: string
}

/**
 * On/off toggle switch (career page visibility, feature flags, etc.).
 */
export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
  id,
  checkedTrackClassName = 'bg-[#2D2061]',
}: SwitchProps) {
  const autoId = useId()
  const switchId = id ?? autoId

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        className,
      )}
    >
      {label || description ? (
        <div className="min-w-0 flex-1">
          {label ? (
            <label
              htmlFor={switchId}
              className="text-sm font-semibold text-[#2D2061]"
            >
              {label}
            </label>
          ) : null}
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/30 focus-visible:ring-offset-2',
          checked ? checkedTrackClassName : 'bg-[#d5d2e2]',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span
          className={cn(
            'inline-block size-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[1.35rem]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}
