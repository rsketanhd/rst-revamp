import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { SearchSelect, type SearchSelectOption } from './SearchSelect'

export type MultiSelectProps = {
  label?: string
  requiredMark?: boolean
  value: string[]
  onChange: (value: string[]) => void
  options: Array<SearchSelectOption | string>
  placeholder?: string
  helperText?: ReactNode
  maxSelections?: number
  disabled?: boolean
  className?: string
}

/**
 * Labeled multi-select dropdown/search chips field (uses SearchSelect).
 */
export function MultiSelect({
  label,
  requiredMark = false,
  value,
  onChange,
  options,
  placeholder = 'Search and select',
  helperText,
  maxSelections,
  disabled = false,
  className,
}: MultiSelectProps) {
  function handleChange(next: string[]) {
    if (maxSelections !== undefined && next.length > maxSelections) {
      onChange(next.slice(0, maxSelections))
      return
    }
    onChange(next)
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      {label ? (
        <span className="text-xs font-medium text-[#2D2061]">
          {label}
          {requiredMark ? (
            <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <SearchSelect
        value={value}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
      />
      {helperText ? (
        <div className="text-xs text-[#8B8B9E]">{helperText}</div>
      ) : null}
    </div>
  )
}
