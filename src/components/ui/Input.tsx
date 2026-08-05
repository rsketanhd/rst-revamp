import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  requiredMark?: boolean
  error?: string
}

export function Input({
  id,
  label,
  requiredMark = false,
  error,
  className,
  ...props
}: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
        {requiredMark ? (
          <span className="ml-0.5 text-accent-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-control border border-line bg-surface px-3.5 text-sm text-ink',
          'placeholder:text-subtle',
          'transition-colors focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/10',
          error && 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/15',
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-accent-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}
