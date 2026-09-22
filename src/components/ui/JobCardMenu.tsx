import { useRef, useState, type ReactNode } from 'react'
import {
  Archive,
  CalendarClock,
  CalendarPlus,
  Copy,
  Eye,
  EyeOff,
  MessageCircleQuestion,
  RefreshCw,
  RotateCcw,
  Share2,
  SquarePen,
  Trash2,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { JobStatus } from '../../data/jobs'
import {
  ThreeDotsMenu,
  type ThreeDotsMenuItem,
} from './ThreeDotsMenu'
import { ShareJobPopover } from './ShareJobPopover'
import {
  ChangeStatusPopover,
  type ChangeableJobStatus,
} from './ChangeStatusPopover'

export type JobCardActionId =
  | 'viewEdit'
  | 'viewJob'
  | 'share'
  | 'interviewTeam'
  | 'oneWayQuestions'
  | 'mask'
  | 'changeStatus'
  | 'schedulePublish'
  | 'duplicate'
  | 'delete'
  | 'extendReopen'
  | 'reopen'
  | 'archive'

type JobCardActionItem = {
  id: JobCardActionId
  label: string
  icon: ThreeDotsMenuItem['icon']
  destructive?: boolean
}

export type JobCardMenuProps = {
  jobCode: string
  jobTitle: string
  listingStatus?: JobStatus
  currentStatus?: ChangeableJobStatus
  onAction?: (action: JobCardActionId) => void
  onStatusChange?: (status: ChangeableJobStatus) => void
}

function actionIcon(Icon: LucideIcon): ReactNode {
  return <Icon strokeWidth={1.75} aria-hidden="true" />
}

const icon: Record<JobCardActionId, ReactNode> = {
  viewEdit: actionIcon(SquarePen),
  viewJob: actionIcon(Eye),
  share: actionIcon(Share2),
  interviewTeam: actionIcon(Users),
  oneWayQuestions: actionIcon(MessageCircleQuestion),
  mask: actionIcon(EyeOff),
  changeStatus: actionIcon(RefreshCw),
  schedulePublish: actionIcon(CalendarClock),
  duplicate: actionIcon(Copy),
  delete: actionIcon(Trash2),
  extendReopen: actionIcon(CalendarPlus),
  reopen: actionIcon(RotateCcw),
  archive: actionIcon(Archive),
}

function menuItem(
  id: JobCardActionId,
  label: string,
  options?: Pick<JobCardActionItem, 'destructive'>,
): JobCardActionItem {
  return { id, label, icon: icon[id], ...options }
}

/** Shared action defs for the jobs ⋮ menu and bulk toolbar (active jobs). */
export const JOB_CARD_ACTIONS: JobCardActionItem[] = [
  menuItem('viewEdit', 'View/Edit Job'),
  menuItem('share', 'Share Job'),
  menuItem('interviewTeam', 'Add Interview Team'),
  menuItem('oneWayQuestions', 'Scheduled 1 way Questions'),
  menuItem('mask', 'Mask'),
  menuItem('changeStatus', 'Change Status'),
]

const DRAFT_JOB_CARD_ACTIONS: JobCardActionItem[] = [
  menuItem('viewEdit', 'View/Edit'),
  menuItem('schedulePublish', 'Schedule Publish'),
  menuItem('duplicate', 'Duplicate'),
  menuItem('delete', 'Delete', { destructive: true }),
]

const EXPIRED_JOB_CARD_ACTIONS: JobCardActionItem[] = [
  menuItem('viewJob', 'View Job'),
  menuItem('extendReopen', 'Extend & Reopen'),
  menuItem('duplicate', 'Duplicate'),
  menuItem('archive', 'Archive'),
]

const CLOSED_JOB_CARD_ACTIONS: JobCardActionItem[] = [
  menuItem('viewJob', 'View Job'),
  menuItem('reopen', 'Reopen'),
  menuItem('duplicate', 'Duplicate'),
  menuItem('archive', 'Archive'),
]

export function jobCardActionsForStatus(status: JobStatus): JobCardActionItem[] {
  switch (status) {
    case 'active':
      return JOB_CARD_ACTIONS
    case 'draft':
      return DRAFT_JOB_CARD_ACTIONS
    case 'expired':
      return EXPIRED_JOB_CARD_ACTIONS
    case 'closed':
      return CLOSED_JOB_CARD_ACTIONS
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

/**
 * Jobs-specific ⋮ menu (preset items by listing status).
 * Share Job opens the social share overlay (design: icon bar + right caret).
 */
export function JobCardMenu({
  jobCode,
  jobTitle,
  listingStatus = 'active',
  currentStatus = 'new',
  onAction,
  onStatusChange,
}: JobCardMenuProps) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)

  function handleItemSelect(id: string) {
    const action = id as JobCardActionId
    switch (action) {
      case 'share':
        setShareOpen(true)
        break
      case 'changeStatus':
        setStatusOpen(true)
        break
      case 'viewEdit':
      case 'viewJob':
      case 'interviewTeam':
      case 'oneWayQuestions':
      case 'mask':
      case 'schedulePublish':
      case 'duplicate':
      case 'delete':
      case 'extendReopen':
      case 'reopen':
      case 'archive':
        break
      default: {
        const _exhaustive: never = action
        return _exhaustive
      }
    }
    onAction?.(action)
  }

  return (
    <div ref={anchorRef} className="relative inline-flex">
      <ThreeDotsMenu
        triggerLabel={`More actions for ${jobCode} - ${jobTitle}`}
        items={jobCardActionsForStatus(listingStatus)}
        side="left"
        align="center"
        onItemSelect={handleItemSelect}
      />

      <ShareJobPopover
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        anchorRef={anchorRef}
        jobCode={jobCode}
        jobTitle={jobTitle}
      />

      <ChangeStatusPopover
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        anchorRef={anchorRef}
        value={currentStatus}
        onChange={(status) => onStatusChange?.(status)}
      />
    </div>
  )
}
