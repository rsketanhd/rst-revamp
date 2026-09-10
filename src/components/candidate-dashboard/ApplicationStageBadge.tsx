import {
  type LucideIcon,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  FileCheck,
} from 'lucide-react'
import {
  applicationStageLabel,
  type ApplicationPipelineStageId,
} from '../../data/myApplications'
import { cn } from '../../lib/cn'

function stageIcon(stageId: ApplicationPipelineStageId): LucideIcon {
  switch (stageId) {
    case 'submitted':
      return Check
    case 'under-review':
      return Clock
    case 'interview':
      return CalendarDays
    case 'offered':
      return FileCheck
    case 'hired':
      return BadgeCheck
    default: {
      const _exhaustive: never = stageId
      return _exhaustive
    }
  }
}

export type ApplicationStageBadgeProps = {
  stageId: ApplicationPipelineStageId
  className?: string
}

/**
 * Dark navy status pill used on the candidate dashboard applied-job rows.
 */
export function ApplicationStageBadge({
  stageId,
  className,
}: ApplicationStageBadgeProps) {
  const Icon = stageIcon(stageId)

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#2D2061] px-2.5 py-1 text-[11px] font-semibold leading-none text-white',
        className,
      )}
    >
      <Icon className="size-3 shrink-0" strokeWidth={2.25} aria-hidden="true" />
      <span className="truncate">{applicationStageLabel(stageId)}</span>
    </span>
  )
}
