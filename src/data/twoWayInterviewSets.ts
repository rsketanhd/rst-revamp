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

export function getTwoWayInterviewSets(): TwoWayInterviewSet[] {
  return SETS.map((set) => ({ ...set }))
}
