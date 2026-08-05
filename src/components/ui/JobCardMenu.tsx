import {
  EyeOff,
  MessageCircleQuestion,
  Share2,
  SquarePen,
  Users,
} from 'lucide-react'
import {
  ThreeDotsMenu,
  type ThreeDotsMenuItem,
} from './ThreeDotsMenu'

export type JobCardActionId =
  | 'viewEdit'
  | 'share'
  | 'interviewTeam'
  | 'oneWayQuestions'
  | 'mask'

export type JobCardMenuProps = {
  jobCode: string
  jobTitle: string
  onAction?: (action: JobCardActionId) => void
}

const JOB_MENU_META: Array<{
  id: JobCardActionId
  label: string
  icon: ThreeDotsMenuItem['icon']
}> = [
  {
    id: 'viewEdit',
    label: 'View/Edit Job',
    icon: <SquarePen strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: 'share',
    label: 'Share Job',
    icon: <Share2 strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: 'interviewTeam',
    label: 'Add Interview Team',
    icon: <Users strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: 'oneWayQuestions',
    label: 'Scheduled 1 way Questions',
    icon: <MessageCircleQuestion strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: 'mask',
    label: 'Mask',
    icon: <EyeOff strokeWidth={1.75} aria-hidden="true" />,
  },
]

/**
 * Jobs-specific ⋮ menu (preset items).
 * For other screens, use `ThreeDotsMenu` with your own `items`.
 */
export function JobCardMenu({
  jobCode,
  jobTitle,
  onAction,
}: JobCardMenuProps) {
  const items: ThreeDotsMenuItem[] = JOB_MENU_META.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
  }))

  return (
    <ThreeDotsMenu
      triggerLabel={`More actions for ${jobCode} - ${jobTitle}`}
      items={items}
      side="left"
      align="center"
      onItemSelect={(id) => onAction?.(id as JobCardActionId)}
    />
  )
}
