import {
  formatCompensationAed,
  type OfferRecord,
  type OfferStatus,
} from './offers'

export type OfferApprovalStatus = 'approved' | 'pending'

export type OfferApprover = {
  name: string
  role: string
  initials: string
  status: OfferApprovalStatus
  date?: string
}

export type OfferDocument = {
  name: string
  description: string
}

export type OfferTimelineStatus = 'completed' | 'current' | 'upcoming'

export type OfferTimelineStep = {
  id: string
  label: string
  status: OfferTimelineStatus
}

export type OfferActivityItem = {
  title: string
  meta: string
}

export type OfferViewModel = {
  subtitle: string
  hiringManager: string
  department: string
  location: string
  employmentType: string
  baseSalaryAed: number
  bonusAed: number
  totalMonthlyAed: number
  annualizedAed: number
  disbursementSchedule: string
  approvers: OfferApprover[]
  documents: OfferDocument[]
  timeline: OfferTimelineStep[]
  activity: OfferActivityItem[]
  versionLabel: string
  versionAmount: string
  versionEffectiveDate: string
}

const DEFAULT_JOB_META = {
  department: 'Engineering',
  location: 'Dubai, UAE',
  employmentType: 'Full-Time',
}

const JOB_DEPARTMENT: Record<string, string> = {
  'Data Platform Engineer': 'Engineering',
  'Senior Software Engineer': 'Engineering',
  'Product Manager': 'Product',
  'UX Designer': 'Design',
  'Data Analyst': 'Analytics',
  'DevOps Engineer': 'Engineering',
  'Marketing Lead': 'Marketing',
}

const APPROVER_PEOPLE: Array<Pick<OfferApprover, 'name' | 'role' | 'initials'>> =
  [
    { name: 'Sarah Connor', role: 'Hiring Manager', initials: 'SC' },
    { name: 'David Miller', role: 'HR Director', initials: 'DM' },
    { name: 'Elena Rostova', role: 'Finance Head', initials: 'ER' },
  ]

const APPROVAL_DATES = ['8 Mar 2026', '9 Mar 2026', '10 Mar 2026'] as const

const AVATAR_TONES = [
  'bg-[#EDE7F6] text-[#5E35B1]',
  'bg-[#E3F2FD] text-[#1565C0]',
  'bg-[#FCE4EC] text-[#AD1457]',
] as const

const COMPLETED_TIMELINE_PREFIX: OfferTimelineStep[] = [
  { id: 'draft', label: 'Draft Created', status: 'completed' },
  { id: 'approval', label: 'Internal Approval', status: 'completed' },
  { id: 'sent', label: 'Sent to Candidate', status: 'completed' },
]

export function offerAvatarClass(index: number): string {
  return AVATAR_TONES[index % AVATAR_TONES.length]
}

function fileSlug(job: string): string {
  return job.replace(/\s+/g, '_')
}

function jobMeta(job: string) {
  return {
    ...DEFAULT_JOB_META,
    department: JOB_DEPARTMENT[job] ?? DEFAULT_JOB_META.department,
  }
}

function candidateResponseLabel(status: OfferStatus): string {
  switch (status) {
    case 'draft':
      return 'Candidate Response'
    case 'sent':
      return 'Candidate Response (Awaiting Candidate Signature)'
    case 'accepted':
      return 'Candidate Response (Offer Accepted)'
    case 'declined':
      return 'Candidate Response (Offer Declined)'
    case 'withdrawn':
      return 'Candidate Response (Offer Withdrawn)'
    case 'expired':
      return 'Candidate Response (Offer Expired)'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

function responseStep(
  status: OfferStatus,
  timelineStatus: OfferTimelineStatus,
): OfferTimelineStep {
  return {
    id: 'response',
    label: candidateResponseLabel(status),
    status: timelineStatus,
  }
}

function buildTimeline(status: OfferStatus): OfferTimelineStep[] {
  switch (status) {
    case 'draft':
      return [
        { id: 'draft', label: 'Draft Created', status: 'current' },
        { id: 'approval', label: 'Internal Approval', status: 'upcoming' },
        { id: 'sent', label: 'Sent to Candidate', status: 'upcoming' },
        responseStep(status, 'upcoming'),
      ]
    case 'sent':
      return [...COMPLETED_TIMELINE_PREFIX, responseStep(status, 'current')]
    case 'accepted':
    case 'declined':
    case 'withdrawn':
    case 'expired':
      return [...COMPLETED_TIMELINE_PREFIX, responseStep(status, 'completed')]
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

function buildApprovers(status: OfferStatus): OfferApprover[] {
  switch (status) {
    case 'draft':
      return APPROVER_PEOPLE.map((person) => ({
        ...person,
        status: 'pending',
      }))
    case 'sent':
      return [
        { ...APPROVER_PEOPLE[0], status: 'approved', date: APPROVAL_DATES[0] },
        { ...APPROVER_PEOPLE[1], status: 'approved', date: APPROVAL_DATES[1] },
        { ...APPROVER_PEOPLE[2], status: 'pending' },
      ]
    case 'accepted':
    case 'declined':
    case 'withdrawn':
    case 'expired':
      return APPROVER_PEOPLE.map((person, index) => ({
        ...person,
        status: 'approved',
        date: APPROVAL_DATES[index],
      }))
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

function buildActivity(offer: OfferRecord): OfferActivityItem[] {
  const actor = 'Recruiter'
  const draftMeta = `${offer.joiningDate} • ${actor}`
  const sentMeta = offer.sentOn
    ? `${offer.sentOn}, 11:33:26 AM • ${actor}`
    : draftMeta
  const draft: OfferActivityItem = {
    title: 'Offer Draft Created',
    meta: draftMeta,
  }
  const sent: OfferActivityItem = {
    title: 'Offer Sent to Candidate via Email',
    meta: sentMeta,
  }

  switch (offer.status) {
    case 'draft':
      return [draft]
    case 'sent':
      return [
        sent,
        { title: 'Internal Approval Completed', meta: sentMeta },
        draft,
      ]
    case 'accepted':
      return [
        { title: 'Candidate Accepted Offer', meta: sentMeta },
        sent,
        { title: 'Internal Approval Completed', meta: draftMeta },
      ]
    case 'declined':
      return [
        { title: 'Candidate Declined Offer', meta: sentMeta },
        sent,
        draft,
      ]
    case 'withdrawn':
      return [
        { title: 'Offer Withdrawn by Recruiter', meta: sentMeta },
        sent,
        draft,
      ]
    case 'expired':
      return [
        { title: 'Offer Expired Without Response', meta: sentMeta },
        sent,
        draft,
      ]
    default: {
      const _exhaustive: never = offer.status
      return _exhaustive
    }
  }
}

/**
 * Demo view-model for the View Offer side panel, derived from a listing row.
 */
export function getOfferViewModel(offer: OfferRecord): OfferViewModel {
  const meta = jobMeta(offer.job)
  const bonusAed = 1000
  const totalMonthlyAed = offer.compensationAed + bonusAed
  const slug = fileSlug(offer.job)

  return {
    subtitle: `${offer.job} • ${meta.department} • ${meta.location} • ${meta.employmentType}`,
    hiringManager: APPROVER_PEOPLE[0].name,
    department: meta.department,
    location: meta.location,
    employmentType: meta.employmentType,
    baseSalaryAed: offer.compensationAed,
    bonusAed,
    totalMonthlyAed,
    annualizedAed: totalMonthlyAed * 12,
    disbursementSchedule: 'Monthly (End of Cycle)',
    approvers: buildApprovers(offer.status),
    documents: [
      {
        name: `${slug}_Offer_Draft_v1.pdf`,
        description: 'PDF Document • Standard HR Package',
      },
      {
        name: `${slug}_Employment_Agreement.pdf`,
        description: 'PDF Document • Legal Annex',
      },
    ],
    timeline: buildTimeline(offer.status),
    activity: buildActivity(offer),
    versionLabel: 'Version 1.0 (Current Active)',
    versionAmount: formatCompensationAed(totalMonthlyAed),
    versionEffectiveDate: offer.sentOn || offer.joiningDate,
  }
}
