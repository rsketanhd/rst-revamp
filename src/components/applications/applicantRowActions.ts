import type { ThreeDotsMenuItem } from '../ui/ThreeDotsMenu'
import type { BulkActionItem } from '../ui/BulkActionsBar'

export type ApplicantRowActionId =
  | 'candidateDetails'
  | 'schedule1WayInterview'
  | 'schedule2WayInterview'
  | 'viewJobTracker'
  | 'viewDocuments'
  | 'downloadCv'

export type ApplicantBulkActionId =
  | 'downloadCv'
  | 'schedule1WayInterview'
  | 'schedule2WayInterview'

/** Shared ⋮ menu items for applicant/candidate data tables. */
export const APPLICANT_ROW_ACTIONS: Array<{
  id: ApplicantRowActionId
  label: string
}> = [
  { id: 'candidateDetails', label: 'Candidate Details' },
  { id: 'schedule1WayInterview', label: 'Schedule 1 Way Interview' },
  { id: 'schedule2WayInterview', label: 'Schedule 2 Way Interview' },
  { id: 'viewJobTracker', label: 'View Job Tracker' },
  { id: 'viewDocuments', label: 'View Documents' },
  { id: 'downloadCv', label: 'Download CV' },
]

/** Bulk bar actions when table rows are selected. */
export const APPLICANT_BULK_ACTIONS: Array<{
  id: ApplicantBulkActionId
  label: string
}> = [
  { id: 'downloadCv', label: 'Download CV' },
  { id: 'schedule1WayInterview', label: 'Schedule 1 Way Interview' },
  { id: 'schedule2WayInterview', label: 'Schedule 2 Way Interview' },
]

export function getApplicantRowMenuItems(): ThreeDotsMenuItem[] {
  return APPLICANT_ROW_ACTIONS.map((item) => ({
    id: item.id,
    label: item.label,
  }))
}

export function getApplicantBulkActions(): BulkActionItem[] {
  return APPLICANT_BULK_ACTIONS.map((item) => ({
    id: item.id,
    label: item.label,
  }))
}
