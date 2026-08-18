export type SchedulerStatus =
  | 'new'
  | 'pending'
  | 'interviewReady'
  | 'scheduled'
  | 'submittedToClient'

export type SchedulerListScope = 'applicants' | 'recommendations'

export type SchedulerTab = 'bookCandidates' | 'teamPanel'

export type InterviewStageSlot = {
  /** ISO-ish display when scheduled, e.g. "2026-04-27 @ 07:30" */
  scheduledAt: string | null
}

export type SchedulerCandidate = {
  id: string
  name: string
  reqReference: string
  mobile: string
  status: SchedulerStatus
  tags: string[]
  list: SchedulerListScope
  /** Last updated display / filter key */
  lastUpdatedOn: string
  technicalRound: InterviewStageSlot
  hrScreening: InterviewStageSlot
  firstInterview: InterviewStageSlot
  secondInterview: InterviewStageSlot
  hidden: boolean
}

export const SCHEDULER_STATUS_META: Record<
  SchedulerStatus,
  { label: string; className: string }
> = {
  new: {
    label: 'New',
    className: 'bg-[#EEE8FA] text-[#5B4B9E]',
  },
  pending: {
    label: 'Pending',
    className: 'bg-[#E8EDF5] text-[#5A6A8A]',
  },
  interviewReady: {
    label: 'Interview Ready',
    className: 'bg-[#E3F0FF] text-[#1A6FD0]',
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-[#DFF0FC] text-[#0B7DB8]',
  },
  submittedToClient: {
    label: 'Submitted to Client',
    className: 'bg-[#EEE8FA] text-[#5B4B9E]',
  },
}

export const SCHEDULER_STATUS_OPTIONS: SchedulerStatus[] = [
  'new',
  'pending',
  'interviewReady',
  'scheduled',
  'submittedToClient',
]

export const SCHEDULER_TAG_OPTIONS = [
  'Senior',
  'Priority',
  'Referral',
  'Relocation',
  'Contract',
  'Hot Talent',
]

export const SCHEDULER_UPDATED_OPTIONS = [
  'Today',
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
]

export const SCHEDULER_HIDING_OPTIONS = [
  'Show all',
  'Hidden only',
  'Visible only',
]

const slot = (scheduledAt: string | null = null): InterviewStageSlot => ({
  scheduledAt,
})

export const SCHEDULER_CANDIDATES: SchedulerCandidate[] = [
  {
    id: 'sch-1',
    name: 'Mukul Patil',
    reqReference: 'VID-002',
    mobile: '+91 98765 43210',
    status: 'new',
    tags: ['Senior', 'Priority'],
    list: 'applicants',
    lastUpdatedOn: 'Today',
    technicalRound: slot('2026-04-27 @ 07:30'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-2',
    name: 'Anita Sharma',
    reqReference: 'VID-003',
    mobile: '+91 91234 56780',
    status: 'pending',
    tags: ['Referral'],
    list: 'applicants',
    lastUpdatedOn: 'Last 7 days',
    technicalRound: slot('2026-04-28 @ 10:00'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-3',
    name: 'James Okafor',
    reqReference: 'VID-004',
    mobile: '+44 7700 900123',
    status: 'interviewReady',
    tags: ['Hot Talent'],
    list: 'applicants',
    lastUpdatedOn: 'Last 7 days',
    technicalRound: slot('2026-04-29 @ 14:15'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-4',
    name: 'Priya Nair',
    reqReference: 'VID-005',
    mobile: '+91 99887 66554',
    status: 'scheduled',
    tags: ['Senior'],
    list: 'applicants',
    lastUpdatedOn: 'Last 30 days',
    technicalRound: slot('2026-05-02 @ 09:00'),
    hrScreening: slot('2026-04-20 @ 11:00'),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-5',
    name: 'Chen Wei',
    reqReference: 'VID-006',
    mobile: '+65 8123 4567',
    status: 'submittedToClient',
    tags: ['Contract'],
    list: 'applicants',
    lastUpdatedOn: 'Last 30 days',
    technicalRound: slot('2026-04-25 @ 16:30'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-6',
    name: 'Amelia Brooks',
    reqReference: 'VID-007',
    mobile: '+1 415 555 0198',
    status: 'new',
    tags: ['Priority'],
    list: 'applicants',
    lastUpdatedOn: 'Today',
    technicalRound: slot('2026-04-27 @ 07:30'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-7',
    name: 'Carlos Rivera',
    reqReference: 'VID-008',
    mobile: '+52 55 1234 5678',
    status: 'pending',
    tags: ['Relocation'],
    list: 'applicants',
    lastUpdatedOn: 'Last 7 days',
    technicalRound: slot('2026-04-28 @ 12:00'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: true,
  },
  {
    id: 'sch-8',
    name: 'Sofia Malik',
    reqReference: 'VID-009',
    mobile: '+971 50 123 4567',
    status: 'interviewReady',
    tags: ['Hot Talent', 'Senior'],
    list: 'applicants',
    lastUpdatedOn: 'Last 90 days',
    technicalRound: slot('2026-05-01 @ 08:45'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-9',
    name: 'Daniel Kim',
    reqReference: 'VID-010',
    mobile: '+82 10 1234 5678',
    status: 'scheduled',
    tags: ['Referral'],
    list: 'applicants',
    lastUpdatedOn: 'Last 30 days',
    technicalRound: slot('2026-04-30 @ 15:00'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-10',
    name: 'Laura Jensen',
    reqReference: 'VID-011',
    mobile: '+45 20 12 34 56',
    status: 'submittedToClient',
    tags: ['Contract'],
    list: 'applicants',
    lastUpdatedOn: 'Last 30 days',
    technicalRound: slot('2026-04-26 @ 11:30'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r1',
    name: 'Noah Ellis',
    reqReference: 'VID-101',
    mobile: '+1 212 555 0144',
    status: 'new',
    tags: ['Hot Talent'],
    list: 'recommendations',
    lastUpdatedOn: 'Today',
    technicalRound: slot(null),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r2',
    name: 'Aisha Khan',
    reqReference: 'VID-102',
    mobile: '+44 7911 123456',
    status: 'pending',
    tags: ['Senior'],
    list: 'recommendations',
    lastUpdatedOn: 'Last 7 days',
    technicalRound: slot(null),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r3',
    name: 'Leo Martins',
    reqReference: 'VID-103',
    mobile: '+55 11 98765 4321',
    status: 'interviewReady',
    tags: ['Priority'],
    list: 'recommendations',
    lastUpdatedOn: 'Last 7 days',
    technicalRound: slot('2026-05-03 @ 10:00'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r4',
    name: 'Yuki Tanaka',
    reqReference: 'VID-104',
    mobile: '+81 90 1234 5678',
    status: 'scheduled',
    tags: ['Referral'],
    list: 'recommendations',
    lastUpdatedOn: 'Last 30 days',
    technicalRound: slot('2026-05-04 @ 13:00'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r5',
    name: 'Olivia Grant',
    reqReference: 'VID-105',
    mobile: '+61 412 345 678',
    status: 'new',
    tags: ['Relocation'],
    list: 'recommendations',
    lastUpdatedOn: 'Today',
    technicalRound: slot(null),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r6',
    name: 'Hassan Ali',
    reqReference: 'VID-106',
    mobile: '+971 55 987 6543',
    status: 'pending',
    tags: ['Contract'],
    list: 'recommendations',
    lastUpdatedOn: 'Last 7 days',
    technicalRound: slot(null),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r7',
    name: 'Emma Vogel',
    reqReference: 'VID-107',
    mobile: '+49 151 23456789',
    status: 'interviewReady',
    tags: ['Senior', 'Priority'],
    list: 'recommendations',
    lastUpdatedOn: 'Last 30 days',
    technicalRound: slot('2026-05-05 @ 09:30'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r8',
    name: 'Raj Mehta',
    reqReference: 'VID-108',
    mobile: '+91 90123 45678',
    status: 'scheduled',
    tags: ['Hot Talent'],
    list: 'recommendations',
    lastUpdatedOn: 'Last 30 days',
    technicalRound: slot('2026-05-06 @ 16:00'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r9',
    name: 'Nina Petrova',
    reqReference: 'VID-109',
    mobile: '+7 916 123 45 67',
    status: 'submittedToClient',
    tags: ['Referral'],
    list: 'recommendations',
    lastUpdatedOn: 'Last 90 days',
    technicalRound: slot('2026-04-22 @ 12:00'),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
  {
    id: 'sch-r10',
    name: 'Thomas Dubois',
    reqReference: 'VID-110',
    mobile: '+33 6 12 34 56 78',
    status: 'new',
    tags: ['Priority'],
    list: 'recommendations',
    lastUpdatedOn: 'Today',
    technicalRound: slot(null),
    hrScreening: slot(null),
    firstInterview: slot(null),
    secondInterview: slot(null),
    hidden: false,
  },
]

export function getSchedulerCandidates(): SchedulerCandidate[] {
  return SCHEDULER_CANDIDATES
}

export type SchedulerMoreFilters = {
  status: string
  reqReference: string
  tag: string
}

export const emptySchedulerMoreFilters: SchedulerMoreFilters = {
  status: '',
  reqReference: '',
  tag: '',
}

export function countSchedulerMoreFilters(value: SchedulerMoreFilters): number {
  return Object.values(value).filter((v) => Boolean(v && String(v).trim())).length
}
