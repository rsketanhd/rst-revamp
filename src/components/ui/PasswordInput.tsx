import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/cn'

export type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label: string
  requiredMark?: boolean
  error?: string
}

export function PasswordInput({
  id,
  label,
  requiredMark = false,
  error,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
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

      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={cn(
            'h-11 w-full rounded-control border border-line bg-surface px-3.5 pr-11 text-sm text-ink',
            'placeholder:text-subtle',
            'transition-colors focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/10',
            error &&
              'border-accent-500 focus:border-accent-500 focus:ring-accent-500/15',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-subtle transition-colors hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-800/20"
        >
          {visible ? (
            <EyeOff className="size-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Eye className="size-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-accent-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}
