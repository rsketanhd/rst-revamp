import { Briefcase, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { ReportItem } from '../../data/reports'

export type ReportCardProps = {
  report: ReportItem
  onSelect?: (report: ReportItem) => void
  className?: string
}

/**
 * Clickable report entry — icon, title, description, and chevron.
 */
export function ReportCard({ report, onSelect, className }: ReportCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(report)}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border border-[#E4E1EE] bg-white px-3.5 py-3.5 text-left transition-colors',
        'hover:border-[#D0CCE0] hover:bg-[#FAFAFC]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/20',
        className,
      )}
    >
      <span
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#A8A8B8] text-white"
        aria-hidden="true"
      >
        <Briefcase className="size-5" strokeWidth={1.75} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-[#2D2061]">
          {report.title}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-[#8B8B9E]">
          {report.description}
        </span>
      </span>

      <ChevronRight
        className="size-4 shrink-0 text-[#B0B0BE]"
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  )
}
