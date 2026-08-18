import { useRef, useState } from 'react'
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
import { ShareJobPopover } from './ShareJobPopover'

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

/** Shared action defs for the jobs ⋮ menu and bulk toolbar. */
export const JOB_CARD_ACTIONS: Array<{
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
 * Share Job opens the social share overlay (design: icon bar + right caret).
 */
export function JobCardMenu({
  jobCode,
  jobTitle,
  onAction,
}: JobCardMenuProps) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [shareOpen, setShareOpen] = useState(false)

  const items: ThreeDotsMenuItem[] = JOB_CARD_ACTIONS.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
  }))

  return (
    <div ref={anchorRef} className="relative inline-flex">
      <ThreeDotsMenu
        triggerLabel={`More actions for ${jobCode} - ${jobTitle}`}
        items={items}
        side="left"
        align="center"
        onItemSelect={(id) => {
          const action = id as JobCardActionId
          if (action === 'share') {
            setShareOpen(true)
          }
          onAction?.(action)
        }}
      />

      <ShareJobPopover
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        anchorRef={anchorRef}
        jobCode={jobCode}
        jobTitle={jobTitle}
      />
    </div>
  )
}
