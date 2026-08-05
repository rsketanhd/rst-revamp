import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label: ReactNode
  error?: string
}

export function Checkbox({
  id,
  label,
  error,
  className,
  ...props
}: CheckboxProps) {
  const inputId = id ?? props.name

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-start gap-2.5"
      >
        <input
          id={inputId}
          type="checkbox"
          className={cn(
            'mt-0.5 size-4 shrink-0 rounded border-line text-brand-800',
            'focus:ring-2 focus:ring-brand-800/20 focus:ring-offset-0',
            'accent-brand-800',
            error && 'outline outline-1 outline-accent-500',
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        <span className="text-sm leading-snug text-ink">{label}</span>
      </label>
      {error ? (
        <p id={`${inputId}-error`} className="pl-6 text-xs text-accent-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}
