import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children'
> & {
  label?: string
  requiredMark?: boolean
  error?: string
  options: Array<SelectOption | string>
  placeholder?: string
}

function normalizeOptions(
  options: Array<SelectOption | string>,
): SelectOption[] {
  return options.map((option) =>
    typeof option === 'string'
      ? { value: option, label: option }
      : option,
  )
}

/**
 * Labeled native select used across create flows and filters.
 */
export function Select({
  id,
  label,
  requiredMark = false,
  error,
  options,
  placeholder = 'Select',
  className,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name
  const items = normalizeOptions(options)

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={selectId}
          className="text-xs font-medium text-[#2D2061]"
        >
          {label}
          {requiredMark ? (
            <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'h-11 w-full appearance-none rounded-md border border-[#ddd9e8] bg-white px-3 pr-9 text-sm text-[#2D2061]',
            'outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
            !props.value && 'text-[#A0A0B2]',
            error && 'border-[#E53935] focus:border-[#E53935] focus:ring-[#E53935]/15',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && selectId ? `${selectId}-error` : undefined}
          {...props}
        >
          <option value="">{placeholder}</option>
          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#A0A0B2]"
          aria-hidden="true"
        />
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="text-xs text-[#E53935]">
          {error}
        </p>
      ) : null}
    </div>
  )
}
