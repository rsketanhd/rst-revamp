import { Download, Mail, Plus } from 'lucide-react'
import type { BulkActionItem } from '../ui/BulkActionsBar'

export type CandidateBulkActionId =
  | 'cvDownload'
  | 'csvDownload'
  | 'sendMail'
  | 'addToJob'

/** Candidates bulk toolbar actions (design labels + icons). */
export const CANDIDATE_BULK_ACTIONS: Array<{
  id: CandidateBulkActionId
  label: string
}> = [
  { id: 'cvDownload', label: 'CV Download' },
  { id: 'csvDownload', label: 'CSV Download' },
  { id: 'sendMail', label: 'Send Mail' },
  { id: 'addToJob', label: 'Add to Job' },
]

function actionIcon(id: CandidateBulkActionId) {
  switch (id) {
    case 'cvDownload':
    case 'csvDownload':
      return <Download strokeWidth={1.75} aria-hidden="true" />
    case 'sendMail':
      return <Mail strokeWidth={1.75} aria-hidden="true" />
    case 'addToJob':
      return <Plus strokeWidth={1.75} aria-hidden="true" />
    default: {
      const _exhaustive: never = id
      return _exhaustive
    }
  }
}

export function getCandidateBulkActions(): BulkActionItem[] {
  return CANDIDATE_BULK_ACTIONS.map((item) => ({
    id: item.id,
    label: item.label,
    icon: actionIcon(item.id),
  }))
}
