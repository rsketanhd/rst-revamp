import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ReportDateRangeFieldProps = {
  id: string
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
  className?: string
}

/**
 * Labeled date-range select used in report filter bars.
 */
export function ReportDateRangeField({
  id,
  label,
  value,
  options,
  onChange,
  className,
}: ReportDateRangeFieldProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-xs font-medium text-[#5C5878]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-11 w-full appearance-none rounded-md border border-[#ddd9e8] bg-white px-3.5 pr-9 text-sm text-[#2D2061]',
            'outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#A0A0B2]"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
