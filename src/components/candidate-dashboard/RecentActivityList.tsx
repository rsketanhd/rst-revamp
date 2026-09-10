import { type LucideIcon, CalendarDays, FileText } from 'lucide-react'
import type {
  CandidateActivityItem,
  CandidateActivityKind,
} from '../../data/candidateDashboard'
import { cn } from '../../lib/cn'

function activityIcon(kind: CandidateActivityKind): LucideIcon {
  switch (kind) {
    case 'interview':
      return CalendarDays
    case 'applied':
    case 'progressed':
    case 'rejected':
      return FileText
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}

export type RecentActivityListProps = {
  items: CandidateActivityItem[]
}

/**
 * Recent pipeline activity on the candidate dashboard.
 */
export function RecentActivityList({ items }: RecentActivityListProps) {
  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-[#2D2061]">Recent Activity</h2>
      <div className="rounded-xl border border-[#E8E6F0] bg-white px-4 py-2 sm:px-5">
        <ul>
          {items.map((item) => {
            const Icon = activityIcon(item.kind)
            return (
              <li
                key={item.id}
                className="flex items-start gap-3 border-b border-[#F0EEF5] py-3 last:border-b-0"
              >
                <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F4F5F8] text-[#2D2061]">
                  <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      'text-sm font-semibold text-[#2D2061]',
                      item.kind === 'rejected' && 'text-[#6B6B80]',
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8B8B9E]">
                    {item.detail
                      ? `${item.timeLabel} • ${item.detail}`
                      : item.timeLabel}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
