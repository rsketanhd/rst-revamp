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
  /** Link validity, e.g. "1 day" */
  linkExpiration: string
  /** e.g. "03" */
  templatesCreated: string
  jobReqId: string
  recruiter: string
  /** Interview types used across the set's rounds (badges) */
  roundTypes: OneWayInterviewType[]
  /** Job location, e.g. "Ahmedabad, IN" */
  location: string
  rounds: number
  avatarEnabled: boolean
  /** Candidates who finished / were invited */
  completedCount: number
  invitedCount: number
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

const EXPIRATIONS = ['1 day', '2 days', '3 days', '5 days', '7 days']
const LOCATIONS = ['Ahmedabad, IN', 'Bengaluru, IN', 'Pune, IN', 'Mumbai, IN']

type BaseInterview = Omit<
  OneWayInterview,
  'roundTypes' | 'location' | 'rounds' | 'avatarEnabled' | 'completedCount' | 'invitedCount'
>

/** Fills the round / progress fields shown on the listing card. */
function withRoundDetails(item: BaseInterview, i: number): OneWayInterview {
  const templates = Number(item.templatesCreated) || 1
  const invited = 3 + (i % 5)
  return {
    ...item,
    roundTypes: i % 3 === 0 ? ['skill', 'competency'] : [item.type],
    location: LOCATIONS[i % LOCATIONS.length],
    rounds: Math.max(1, templates - (i % 2)),
    avatarEnabled: i % 2 === 1,
    invitedCount: invited,
    completedCount: i % 3 === 1 ? invited - 1 : invited,
  }
}

function buildInterviews(): OneWayInterview[] {
  // Design fixtures first (active), then additional rows for filters / inactive
  const fixtures: BaseInterview[] = [
    {
      id: 'ow-1',
      title: 'Associate Director SAP Finance Lead',
      type: 'skill',
      status: 'active',
      createdOn: '12 Jun 2026',
      updatedOn: '14 Jun 2026',
      linkExpiration: '1 day',
      templatesCreated: '04',
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
      linkExpiration: '2 days',
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
      linkExpiration: '3 days',
      templatesCreated: '03',
      jobReqId: 'RST1347',
      recruiter: 'Jane Cooper',
    },
  ]

  const extra = Array.from({ length: 8 }, (_, i): BaseInterview => {
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

  return [...fixtures, ...extra].map(withRoundDetails)
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
  /** Interview round this invite belongs to */
  roundId: string
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
      roundId: i % 5 === 4 ? 'round-2' : 'round-1',
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

export type OneWayRoundProgress = {
  id: string
  number: number
  /** e.g. "Skill-based" */
  type: string
  name: string
  invited: number
  completed: number
  /** Completed here but not yet invited to the next round */
  readyForNextRound: number
}

export type OneWayRoundSummary = {
  totalInvites: number
  candidates: number
  completedOverall: number
  rounds: OneWayRoundProgress[]
}

const ROUND_META = [
  { id: 'round-1', type: 'Skill-based', name: 'Skills Screen' },
  { id: 'round-2', type: 'Skill-based', name: 'Technical Deep Dive' },
]

/** Per-round invite progress, worked out from the interview's invites. */
export function getOneWayRoundSummary(invites: OneWayInvite[]): OneWayRoundSummary {
  const rounds = ROUND_META.map((meta, index) => {
    const inRound = invites.filter((i) => i.roundId === meta.id)
    const next = ROUND_META[index + 1]
    const invitedNext = new Set(
      next ? invites.filter((i) => i.roundId === next.id).map((i) => i.email) : [],
    )
    const completed = inRound.filter((i) => i.status === 'completed')
    return {
      ...meta,
      number: index + 1,
      invited: inRound.length,
      completed: completed.length,
      readyForNextRound: next
        ? new Set(completed.filter((i) => !invitedNext.has(i.email)).map((i) => i.email)).size
        : 0,
    }
  })
  return {
    totalInvites: invites.length,
    candidates: new Set(invites.map((i) => i.email)).size,
    completedOverall: invites.filter((i) => i.status === 'completed').length,
    rounds,
  }
}

export type InterviewSetQuestion = {
  id: string
  text: string
  prepMins: number
  answerMins: number
  /** Skill / topic the question checks */
  topic: string
}

export type InterviewSetTemplate = {
  id: string
  name: string
  language: string
  questions: InterviewSetQuestion[]
}

export type InterviewSetRound = {
  id: string
  name: string
  interviewType: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  avatarEnabled: boolean
  linkValidDays: number
  defaultTemplate: InterviewSetTemplate
  /** Used in order when a candidate is re-invited to this round */
  resendTemplates: InterviewSetTemplate[]
}

const q = (
  id: string,
  text: string,
  prepMins: number,
  answerMins: number,
  topic: string,
): InterviewSetQuestion => ({ id, text, prepMins, answerMins, topic })

/** Rounds and templates of an interview set (demo data, read-only view). */
export function getInterviewSetRounds(interviewId: string): InterviewSetRound[] {
  const slug = interviewId.toLowerCase()
  return [
    {
      id: `${slug}-r1`,
      name: 'Round 1',
      interviewType: 'Skill-based',
      difficulty: 'Medium',
      avatarEnabled: false,
      linkValidDays: 1,
      defaultTemplate: {
        id: `${slug}-t1`,
        name: 'devop-1',
        language: 'English',
        questions: [
          q(
            `${slug}-q1`,
            'Can you describe a time when you designed and implemented a CI/CD pipeline? What challenges did you face and how did you overcome them?',
            1,
            3,
            'CI/CD Implementation',
          ),
        ],
      },
      resendTemplates: [],
    },
    {
      id: `${slug}-r2`,
      name: 'Round 2',
      interviewType: 'Technical',
      difficulty: 'Hard',
      avatarEnabled: true,
      linkValidDays: 3,
      defaultTemplate: {
        id: `${slug}-t2`,
        name: 'devop-2',
        language: 'English',
        questions: [
          q(
            `${slug}-q2`,
            'How would you design infrastructure for a service that must survive the loss of an entire cloud region?',
            2,
            4,
            'High Availability',
          ),
          q(
            `${slug}-q3`,
            'Walk us through how you would troubleshoot a sudden spike in container restarts in production.',
            1,
            3,
            'Incident Response',
          ),
        ],
      },
      resendTemplates: [],
    },
    {
      id: `${slug}-r3`,
      name: 'Round 3',
      interviewType: 'Competency-based',
      difficulty: 'Medium',
      avatarEnabled: true,
      linkValidDays: 3,
      defaultTemplate: {
        id: `${slug}-t3`,
        name: 'devop-3',
        language: 'English',
        questions: [
          q(
            `${slug}-q4`,
            'Tell us about a time you had to push back on a release because of reliability concerns.',
            1,
            2,
            'Ownership',
          ),
        ],
      },
      resendTemplates: [],
    },
    {
      id: `${slug}-r4`,
      name: 'Round 4',
      interviewType: 'Culture fit',
      difficulty: 'Easy',
      avatarEnabled: false,
      linkValidDays: 5,
      defaultTemplate: {
        id: `${slug}-t4`,
        name: 'devop-4',
        language: 'English',
        questions: [
          q(
            `${slug}-q5`,
            'What does a healthy on-call culture look like to you?',
            1,
            2,
            'Team Collaboration',
          ),
        ],
      },
      resendTemplates: [],
    },
  ]
}
