import type { JobListing } from './jobs'

export type ApprovalKind = 'job' | 'offer'

export type ApprovalInbox =
  | 'waiting-for-me'
  | 'submitted-by-me'
  | 'all-pending'
  | 'completed'

export type ApprovalRecord = {
  id: string
  kind: ApprovalKind
  title: string
  code: string
  fromStatus: string
  toStatus: string
  levelLabel: string
  ruleName: string
  waitingFor: string
  submittedAt: string
  submittedBy: string
  inbox: ApprovalInbox[]
  completed?: boolean
}

/** Build a JobListing for the shared Job View/Edit side panel from an approval row. */
export function jobListingFromApproval(record: ApprovalRecord): JobListing {
  const fromDraft = record.fromStatus.toLowerCase() === 'draft'
  return {
    id: `approval-job-${record.id}`,
    code: record.code,
    title: record.title,
    location: 'Bangalore, IN',
    department: 'Engineering',
    postedAgo: '1 day ago',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-19',
    recruiter: record.submittedBy,
    openings: '01',
    lastActivity: 'Just now',
    status: fromDraft ? 'draft' : 'active',
    isMine: true,
    client: 'Acme Corp',
    jobType: 'Full-time',
    jobCategory: 'Engineering',
    jobSubCategory: 'Backend',
    brand: 'Recruitment SMART',
    project: 'Project Alpha',
    metrics: [
      { label: 'Applications', value: 0 },
      { label: 'Recommendations', value: 0 },
      { label: 'Total Views', value: 0 },
      { label: 'Interviews', value: 0 },
      { label: 'Offered', value: 0 },
    ],
  }
}

export const APPROVAL_DELEGATION = {
  delegateName: 'Heli Shah',
  from: '2026-10-19',
  to: '2026-10-22',
} as const

/** Seed approvals matching the product Approvals inbox. */
export const INITIAL_APPROVALS: ApprovalRecord[] = [
  {
    id: 'apr-job-1',
    kind: 'job',
    title: 'Data Scientist',
    code: '1267-0010',
    fromStatus: 'Draft',
    toStatus: 'Active',
    levelLabel: 'L1/1',
    ruleName: 'Rule 2',
    waitingFor: 'ketan',
    submittedAt: '19 Oct 2026, 13:21',
    submittedBy: 'Heli Shah',
    inbox: ['waiting-for-me', 'all-pending'],
  },
  {
    id: 'apr-job-2',
    kind: 'job',
    title: 'Senior Frontend Engineer',
    code: '1267-0011',
    fromStatus: 'Draft',
    toStatus: 'Active',
    levelLabel: 'L1/1',
    ruleName: 'Rule 2',
    waitingFor: 'ketan',
    submittedAt: '19 Oct 2026, 13:21',
    submittedBy: 'Heli Shah',
    inbox: ['waiting-for-me', 'all-pending'],
  },
  {
    id: 'apr-job-3',
    kind: 'job',
    title: 'Product Designer',
    code: '1267-0012',
    fromStatus: 'Draft',
    toStatus: 'Active',
    levelLabel: 'L1/2',
    ruleName: 'Rule 1',
    waitingFor: 'Heli Shah',
    submittedAt: '18 Oct 2026, 16:05',
    submittedBy: 'ketan',
    inbox: ['submitted-by-me', 'all-pending'],
  },
  {
    id: 'apr-offer-1',
    kind: 'offer',
    title: 'Offer — Priya Nair',
    code: 'OFF-2041',
    fromStatus: 'Draft',
    toStatus: 'Pending send',
    levelLabel: 'L2/2',
    ruleName: 'Offer L2',
    waitingFor: '—',
    submittedAt: '15 Oct 2026, 09:12',
    submittedBy: 'Heli Shah',
    inbox: ['completed'],
    completed: true,
  },
  {
    id: 'apr-job-4',
    kind: 'job',
    title: 'Backend Engineer',
    code: '1267-0008',
    fromStatus: 'Draft',
    toStatus: 'Active',
    levelLabel: 'L1/1',
    ruleName: 'Rule 2',
    waitingFor: '—',
    submittedAt: '14 Oct 2026, 10:30',
    submittedBy: 'Heli Shah',
    inbox: ['completed'],
    completed: true,
  },
]

export type ApprovalKindFilter = 'all' | ApprovalKind

export function filterApprovals(
  records: ApprovalRecord[],
  inbox: ApprovalInbox,
  kind: ApprovalKindFilter,
): ApprovalRecord[] {
  return records.filter((record) => {
    const inInbox = record.inbox.includes(inbox)
    if (!inInbox) return false
    if (kind === 'all') return true
    return record.kind === kind
  })
}

export function countApprovalsByInbox(
  records: ApprovalRecord[],
  inbox: ApprovalInbox,
): number {
  return records.filter((record) => record.inbox.includes(inbox)).length
}

export function countApprovalsByKind(
  records: ApprovalRecord[],
  inbox: ApprovalInbox,
  kind: ApprovalKindFilter,
): number {
  return filterApprovals(records, inbox, kind).length
}
