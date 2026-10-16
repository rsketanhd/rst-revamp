/**
 * Two-Way interview sets (demo data): one set per job — rounds, panel,
 * booking slots and status mapping, and per round whether Two-Way AI joins.
 */

export type InterviewSetSetupStatus =
  | 'notSetUp'
  | 'pending'
  | 'partlySet'
  | 'configured'

export type TwoWayInterviewSet = {
  id: string
  jobTitle: string
  jobReqId: string
  location: string
  updatedOn: string
  setupStatus: InterviewSetSetupStatus
  active: boolean
  rounds: number
  /** Rounds fully configured */
  readyRounds: number
  scheduled: number
  organiser: string
  /** Rounds where Two-Way AI joins the interview */
  aiRounds: number
}

/** Round config used by Open / Edit Interview Set */
export type TwoWayInterviewSetRound = {
  id: string
  name: string
  meetingPlatform: string
  durationMins: number
  aiJoins: boolean
  active: boolean
  ready: boolean
  organiser: string | null
  mandatoryParticipants: string[]
  optionalParticipants: string[]
  fallbackTimezone: string
  gapMins: number
  slotsOpenAfterDays: number
  lookAheadDays: number
}

export const SETUP_STATUS_META: Record<
  InterviewSetSetupStatus,
  { label: string; className: string }
> = {
  partlySet: { label: 'Partly set', className: 'bg-[#FDF3D7] text-[#B7791F]' },
  pending: { label: 'Pending', className: 'bg-[#FDEEDC] text-[#C2610C]' },
  configured: { label: 'Configured', className: 'bg-[#E3F5EA] text-[#15803D]' },
  notSetUp: { label: 'Not set up', className: 'bg-[#EEEEF2] text-[#6B6B80]' },
}

const SETS: TwoWayInterviewSet[] = [
  {
    id: 'tw-1',
    jobTitle: 'Data Analyst',
    jobReqId: 'RST-210',
    location: 'Dubai, UAE',
    updatedOn: '03 Oct 2026',
    setupStatus: 'partlySet',
    active: true,
    rounds: 4,
    readyRounds: 3,
    scheduled: 3,
    organiser: 'Recruiter',
    aiRounds: 2,
  },
  {
    id: 'tw-2',
    jobTitle: 'Graduate Engineer Trainee',
    jobReqId: 'RST-214',
    location: 'Abu Dhabi, UAE',
    updatedOn: '27 Sep 2026',
    setupStatus: 'pending',
    active: true,
    rounds: 2,
    readyRounds: 0,
    scheduled: 0,
    organiser: 'Hiring Manager',
    aiRounds: 0,
  },
  {
    id: 'tw-3',
    jobTitle: 'Customer Service Associate',
    jobReqId: 'RST-219',
    location: 'Abu Dhabi, UAE',
    updatedOn: '27 Sep 2026',
    setupStatus: 'configured',
    active: true,
    rounds: 2,
    readyRounds: 2,
    scheduled: 5,
    organiser: 'Recruiter',
    aiRounds: 0,
  },
  {
    id: 'tw-4',
    jobTitle: 'HR Generalist',
    jobReqId: 'RST-226',
    location: 'Abu Dhabi, UAE',
    updatedOn: '27 Sep 2026',
    setupStatus: 'notSetUp',
    active: true,
    rounds: 0,
    readyRounds: 0,
    scheduled: 0,
    organiser: 'Recruiter',
    aiRounds: 0,
  },
  {
    id: 'tw-5',
    jobTitle: 'Senior Accountant',
    jobReqId: 'RST-198',
    location: 'Dubai, UAE',
    updatedOn: '12 Sep 2026',
    setupStatus: 'configured',
    active: false,
    rounds: 3,
    readyRounds: 3,
    scheduled: 7,
    organiser: 'Hiring Manager',
    aiRounds: 1,
  },
  {
    id: 'tw-6',
    jobTitle: 'Sales Executive',
    jobReqId: 'RST-187',
    location: 'Sharjah, UAE',
    updatedOn: '30 Aug 2026',
    setupStatus: 'partlySet',
    active: false,
    rounds: 2,
    readyRounds: 1,
    scheduled: 2,
    organiser: 'Recruiter',
    aiRounds: 0,
  },
]

const ROUND_DEFAULTS = {
  active: true,
  organiser: null as string | null,
  mandatoryParticipants: [] as string[],
  optionalParticipants: [] as string[],
  fallbackTimezone: '(GMT+04:00) Asia/Dubai',
  gapMins: 30,
  slotsOpenAfterDays: 0,
  lookAheadDays: 7,
}

function round(
  partial: Pick<
    TwoWayInterviewSetRound,
    'id' | 'name' | 'meetingPlatform' | 'durationMins' | 'aiJoins' | 'ready'
  >,
): TwoWayInterviewSetRound {
  return { ...ROUND_DEFAULTS, ...partial }
}

/** Demo rounds keyed by interview-set id */
const ROUNDS_BY_SET: Record<string, TwoWayInterviewSetRound[]> = {
  'tw-1': [
    round({
      id: 'tw-1-r1',
      name: 'Technical Round',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 60,
      aiJoins: true,
      ready: true,
    }),
    round({
      id: 'tw-1-r2',
      name: 'Case Study',
      meetingPlatform: 'Zoom',
      durationMins: 45,
      aiJoins: false,
      ready: true,
    }),
    round({
      id: 'tw-1-r3',
      name: 'Hiring Manager Round',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 45,
      aiJoins: true,
      ready: true,
    }),
    round({
      id: 'tw-1-r4',
      name: 'Final Round',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 30,
      aiJoins: false,
      ready: false,
    }),
  ],
  'tw-2': [
    round({
      id: 'tw-2-r1',
      name: 'Screening Call',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 30,
      aiJoins: false,
      ready: false,
    }),
    round({
      id: 'tw-2-r2',
      name: 'Technical Round',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 60,
      aiJoins: false,
      ready: false,
    }),
  ],
  'tw-3': [
    round({
      id: 'tw-3-r1',
      name: 'Screening Call',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 30,
      aiJoins: false,
      ready: true,
    }),
    round({
      id: 'tw-3-r2',
      name: 'Hiring Manager Round',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 45,
      aiJoins: false,
      ready: true,
    }),
  ],
  'tw-4': [],
  'tw-5': [
    round({
      id: 'tw-5-r1',
      name: 'Technical Round',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 60,
      aiJoins: true,
      ready: true,
    }),
    round({
      id: 'tw-5-r2',
      name: 'Case Study',
      meetingPlatform: 'Zoom',
      durationMins: 45,
      aiJoins: false,
      ready: true,
    }),
    round({
      id: 'tw-5-r3',
      name: 'Hiring Manager Round',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 45,
      aiJoins: false,
      ready: true,
    }),
  ],
  'tw-6': [
    round({
      id: 'tw-6-r1',
      name: 'Screening Call',
      meetingPlatform: 'Google Meet',
      durationMins: 30,
      aiJoins: false,
      ready: true,
    }),
    round({
      id: 'tw-6-r2',
      name: 'Hiring Manager Round',
      meetingPlatform: 'Microsoft Teams',
      durationMins: 45,
      aiJoins: false,
      ready: false,
    }),
  ],
}

export function getTwoWayInterviewSets(): TwoWayInterviewSet[] {
  return SETS.map((set) => ({ ...set }))
}

export function getTwoWayInterviewSetById(
  id: string,
): TwoWayInterviewSet | undefined {
  const set = SETS.find((s) => s.id === id)
  return set ? { ...set } : undefined
}

export function getTwoWayInterviewSetRounds(
  setId: string,
): TwoWayInterviewSetRound[] {
  return (ROUNDS_BY_SET[setId] ?? []).map((r) => ({ ...r }))
}

/** Label for the “Two-way on N rounds” badge; null when no AI rounds. */
export function aiRoundsBadgeLabel(aiRounds: number): string | null {
  if (aiRounds <= 0) return null
  const unit = aiRounds === 1 ? 'round' : 'rounds'
  return `Two-way on ${aiRounds} ${unit}`
}

/** Default round when scheduling invites (first ready round, else first). */
export function defaultScheduleRoundId(
  rounds: TwoWayInterviewSetRound[],
): string {
  return rounds.find((r) => r.ready)?.id ?? rounds[0]?.id ?? ''
}
