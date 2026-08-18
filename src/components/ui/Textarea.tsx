import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  requiredMark?: boolean
  error?: string
  /** Optional action rendered opposite the label (e.g. AI generate link) */
  labelAction?: ReactNode
  helperText?: string
}

/**
 * Labeled multi-line text field.
 */
export function Textarea({
  id,
  label,
  requiredMark = false,
  error,
  labelAction,
  helperText,
  className,
  rows = 6,
  ...props
}: TextareaProps) {
  const fieldId = id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      {label || labelAction ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {label ? (
            <label
              htmlFor={fieldId}
              className="text-xs font-medium text-[#2D2061]"
            >
              {label}
              {requiredMark ? (
                <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
                  *
                </span>
              ) : null}
            </label>
          ) : (
            <span />
          )}
          {labelAction}
        </div>
      ) : null}

      <textarea
        id={fieldId}
        rows={rows}
        className={cn(
          'w-full resize-y rounded-md border border-[#ddd9e8] bg-white px-3 py-2.5 text-sm text-[#2D2061]',
          'placeholder:text-[#A0A0B2]',
          'outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
          error && 'border-[#E53935] focus:border-[#E53935] focus:ring-[#E53935]/15',
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error && fieldId
            ? `${fieldId}-error`
            : helperText && fieldId
              ? `${fieldId}-help`
              : undefined
        }
        {...props}
      />

      {helperText && !error ? (
        <p id={`${fieldId}-help`} className="text-xs text-[#8B8B9E]">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p id={`${fieldId}-error`} className="text-xs text-[#E53935]">
          {error}
        </p>
      ) : null}
    </div>
  )
}
