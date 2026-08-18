/**
 * Mock data for One-Way Interviews list.
 */

export type OneWayStatus = 'active' | 'inactive'
export type OneWayInterviewType = 'skill' | 'competency'

export type OneWayInterview = {
  id: string
  title: string
  type: OneWayInterviewType
  status: OneWayStatus
  createdOn: string
  updatedOn: string
  /** e.g. "50 mins" */
  linkExpiration: string
  /** e.g. "03" */
  templatesCreated: string
  jobReqId: string
  recruiter: string
}

export const ONE_WAY_TYPE_META: Record<
  OneWayInterviewType,
  { label: string; className: string }
> = {
  skill: {
    label: 'Skill Based',
    className: 'bg-[#5B9FF5] text-white',
  },
  competency: {
    label: 'Competency Based',
    className: 'bg-[#9B8AD4] text-white',
  },
}

const TITLES = [
  'Associate Director SAP Finance Lead',
  'Fullstack Developer',
  'Software Developer',
  'Senior Product Manager',
  'Data Analyst',
  'UX Designer',
  'Backend Engineer',
  'HR Business Partner',
]

const EXPIRATIONS = ['50 mins', '30 mins', '45 mins', '60 mins', '90 mins']

function buildInterviews(): OneWayInterview[] {
  // Design fixtures first (active), then additional rows for filters / inactive
  const fixtures: OneWayInterview[] = [
    {
      id: 'ow-1',
      title: 'Associate Director SAP Finance Lead',
      type: 'skill',
      status: 'active',
      createdOn: '12 Jun 2026',
      updatedOn: '14 Jun 2026',
      linkExpiration: '50 mins',
      templatesCreated: '03',
      jobReqId: 'RST1345',
      recruiter: 'Jane Cooper',
    },
    {
      id: 'ow-2',
      title: 'Fullstack Developer',
      type: 'competency',
      status: 'active',
      createdOn: '12 Jun 2026',
      updatedOn: '14 Jun 2026',
      linkExpiration: '50 mins',
      templatesCreated: '03',
      jobReqId: 'RST1346',
      recruiter: 'Alex Morgan',
    },
    {
      id: 'ow-3',
      title: 'Software Developer',
      type: 'skill',
      status: 'active',
      createdOn: '12 Jun 2026',
      updatedOn: '14 Jun 2026',
      linkExpiration: '50 mins',
      templatesCreated: '03',
      jobReqId: 'RST1347',
      recruiter: 'Jane Cooper',
    },
  ]

  const extra = Array.from({ length: 8 }, (_, i) => {
    const day = 10 + (i % 18)
    return {
      id: `ow-${i + 4}`,
      title: TITLES[(i + 3) % TITLES.length],
      type: (i % 2 === 0 ? 'skill' : 'competency') as OneWayInterview['type'],
      status: (i % 3 === 0 ? 'inactive' : 'active') as OneWayStatus,
      createdOn: `${day} Jun 2026`,
      updatedOn: `${Math.min(day + 2, 28)} Jun 2026`,
      linkExpiration: EXPIRATIONS[i % EXPIRATIONS.length],
      templatesCreated: String((i % 5) + 1).padStart(2, '0'),
      jobReqId: `RST${1348 + i}`,
      recruiter: i % 2 === 0 ? 'Jane Cooper' : 'Alex Morgan',
    }
  })

  return [...fixtures, ...extra]
}

const ALL = buildInterviews()

export function getOneWayInterviews(): OneWayInterview[] {
  return ALL.map((item) => ({ ...item }))
}

export function getOneWayInterviewById(id: string): OneWayInterview | undefined {
  const found = ALL.find((item) => item.id === id)
  return found ? { ...found } : undefined
}

export type OneWayInviteStatus =
  | 'invited'
  | 'completed'
  | 'incomplete'
  | 'expired'
  | 'cancelled'

export type OneWayInvite = {
  id: string
  name: string
  email: string
  templateName: string
  templateType: 'Default' | 'Resend'
  invitedOn: string
  status: OneWayInviteStatus
  expiringOn: string
  /** Present when status is completed */
  completedOn?: string
  /** 0–5 star score when completed */
  rating?: number
}

export const ONE_WAY_INVITE_STATUS_META: Record<
  OneWayInviteStatus,
  { label: string; className: string }
> = {
  invited: {
    label: 'Invited',
    className: 'text-[#1A6FD0]',
  },
  completed: {
    label: 'Completed',
    className: 'text-[#15803D]',
  },
  incomplete: {
    label: 'Incomplete',
    className: 'text-[#B45309]',
  },
  expired: {
    label: 'Expired',
    className: 'text-[#6B6B80]',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'text-[#DC2626]',
  },
}

const INVITEE_NAMES = [
  'Alexandra Martinez',
  'Sarah Johnson',
  'Henry Walker',
  'Priya Nair',
  'James Okafor',
  'Chen Wei',
  'Amelia Brooks',
  'Carlos Rivera',
  'Sofia Malik',
  'Daniel Kim',
  'Laura Jensen',
  'Noah Ellis',
  'Aisha Khan',
  'Leo Martins',
  'Yuki Tanaka',
  'Olivia Grant',
  'Hassan Ali',
  'Emma Vogel',
  'Raj Mehta',
  'Nina Petrova',
  'Thomas Dubois',
  'Mukul Patil',
  'Anita Sharma',
  'Marc Andre',
  'Heli Shah',
]

const STATUSES_CYCLE: OneWayInviteStatus[] = [
  'invited',
  'completed',
  'incomplete',
  'expired',
  'cancelled',
  'invited',
  'incomplete',
  'invited',
  'completed',
  'incomplete',
]

function buildInvitesForInterview(interviewId: string): OneWayInvite[] {
  // Stable counts matching design sample proportions (~25)
  return INVITEE_NAMES.map((name, i) => {
    const status = STATUSES_CYCLE[i % STATUSES_CYCLE.length]
    const day = 10 + (i % 18)
    const emailSlug = name.toLowerCase().replace(/\s+/g, '.')
    const templateName =
      i % 3 === 0
        ? 'Interview Template 1'
        : i % 3 === 1
          ? 'Interview Template 2'
          : 'Interview Template 3'
    const base: OneWayInvite = {
      id: `${interviewId}-inv-${i + 1}`,
      name,
      email: `${emailSlug}@email.com`,
      templateName,
      templateType: (i % 4 === 0 ? 'Resend' : 'Default') as
        | 'Default'
        | 'Resend',
      invitedOn: `${day} Nov, 2025`,
      status,
      expiringOn: `${Math.min(day + 7, 28)} Nov, 2025`,
    }
    if (status === 'completed') {
      return {
        ...base,
        completedOn: `${Math.min(day + 2, 28)} Nov, 2025`,
        rating: 2,
      }
    }
    return base
  })
}

const INVITES_CACHE = new Map<string, OneWayInvite[]>()

export function getOneWayInvites(interviewId: string): OneWayInvite[] {
  let rows = INVITES_CACHE.get(interviewId)
  if (!rows) {
    rows = buildInvitesForInterview(interviewId)
    INVITES_CACHE.set(interviewId, rows)
  }
  return rows.map((row) => ({ ...row }))
}

export function getOneWayInviteStatusCounts(
  invites: OneWayInvite[],
): Record<'all' | OneWayInviteStatus, number> {
  return {
    all: invites.length,
    invited: invites.filter((i) => i.status === 'invited').length,
    completed: invites.filter((i) => i.status === 'completed').length,
    incomplete: invites.filter((i) => i.status === 'incomplete').length,
    expired: invites.filter((i) => i.status === 'expired').length,
    cancelled: invites.filter((i) => i.status === 'cancelled').length,
  }
}

export type OneWayFilterValues = {
  type: string
  jobReqId: string
  recruiter: string
  sortBy: 'createdOn' | 'updatedOn' | 'title'
}

export function emptyOneWayFilters(): OneWayFilterValues {
  return {
    type: '',
    jobReqId: '',
    recruiter: '',
    sortBy: 'updatedOn',
  }
}

export function countOneWayFilters(values: OneWayFilterValues): number {
  let n = 0
  if (values.type) n += 1
  if (values.jobReqId) n += 1
  if (values.recruiter) n += 1
  return n
}
