import { JOBS, type JobListing } from './jobs'

export type PipelineStageId =
  | 'applicant'
  | 'clientEndorsement'
  | 'clientInterview'
  | 'offered'
  | 'ediRsg'
  | 'ediPdg'
  | 'successfulPlacement'
  | 'declined'
  | 'rejected'

export type PipelineStage = {
  id: PipelineStageId
  label: string
  count: number
  /** Weekly delta; null = no change */
  weeklyChange: number | null
}

export type ApplicantStatus =
  | 'new'
  | 'clientEndorsement'
  | 'sendMail'
  | 'videoInterview'
  | 'interviewReady'

export type Applicant = {
  id: string
  name: string
  email: string
  experience: string
  location: string
  cvRelevancy: number
  nationality: string
  suitability: number
  updatedOn: string
  age: number
  status: ApplicantStatus
  stage: PipelineStageId
  source: string
}

export const APPLICANT_STATUS_META: Record<
  ApplicantStatus,
  { label: string; className: string; dotClassName: string }
> = {
  new: {
    label: 'New',
    className: 'bg-[#E3F0FF] text-[#1A6FD0]',
    dotClassName: 'bg-[#1A6FD0]',
  },
  sendMail: {
    label: 'Send Mail',
    className: 'bg-[#FFF0E0] text-[#D97706]',
    dotClassName: 'bg-[#D97706]',
  },
  interviewReady: {
    label: 'Interview Ready',
    className: 'bg-[#E7F8ED] text-[#15803D]',
    dotClassName: 'bg-[#15803D]',
  },
  videoInterview: {
    label: 'Video Interview Scheduled',
    className: 'bg-[#E0F7F5] text-[#0D9488]',
    dotClassName: 'bg-[#0D9488]',
  },
  clientEndorsement: {
    label: 'Client Endorsement',
    className: 'bg-[#EDE8F8] text-[#5B4B9E]',
    dotClassName: 'bg-[#5B4B9E]',
  },
}

/** Display order matches Set Status modal design */
export const APPLICANT_STATUS_OPTIONS: ApplicantStatus[] = [
  'new',
  'sendMail',
  'interviewReady',
  'videoInterview',
  'clientEndorsement',
]

export const SOURCE_OPTIONS = [
  'LinkedIn',
  'RS Plus',
  'Career Page',
  'Referral',
  'Agency',
]

const NAMES = [
  'Mukul Patil',
  'Sofia Malik',
  'James Okafor',
  'Priya Nair',
  'Chen Wei',
  'Amelia Brooks',
  'Carlos Rivera',
  'Hana Suzuki',
  'David Mensah',
  'Elena Petrova',
  'Arjun Mehta',
  'Laura Schmidt',
]

const EMAILS = [
  'mukul.patil@gmail.com',
  'sofia.malik@outlook.com',
  'james.okafor@yahoo.com',
  'priya.nair@gmail.com',
  'chen.wei@mail.com',
  'amelia.brooks@gmail.com',
  'carlos.rivera@hotmail.com',
  'hana.suzuki@gmail.com',
  'david.mensah@outlook.com',
  'elena.petrova@mail.com',
  'arjun.mehta@gmail.com',
  'laura.schmidt@yahoo.com',
]

const LOCATIONS = [
  'Pune, India',
  'Manila, PH',
  'Lagos, NG',
  'Bangalore, India',
  'Shanghai, CN',
  'London, UK',
  'Mexico City, MX',
  'Tokyo, JP',
  'Accra, GH',
  'Berlin, DE',
  'Mumbai, India',
  'Munich, DE',
]

const NATIONALITIES = [
  'Indian',
  'Filipino',
  'Nigerian',
  'Indian',
  'Chinese',
  'British',
  'Mexican',
  'Japanese',
  'Ghanaian',
  'German',
  'Indian',
  'German',
]

const STATUSES: ApplicantStatus[] = [
  'new',
  'clientEndorsement',
  'sendMail',
  'videoInterview',
  'interviewReady',
  'new',
  'clientEndorsement',
  'new',
  'interviewReady',
  'sendMail',
  'videoInterview',
  'clientEndorsement',
]

const STAGES: PipelineStageId[] = [
  'applicant',
  'clientEndorsement',
  'clientInterview',
  'offered',
  'ediRsg',
  'ediPdg',
  'successfulPlacement',
  'declined',
  'rejected',
]

export function getJobByCode(code: string): JobListing | undefined {
  const normalized = code.toLowerCase().replace(/-/g, '')
  return JOBS.find(
    (job) => job.code.toLowerCase().replace(/-/g, '') === normalized,
  )
}

export function getJobById(id: string): JobListing | undefined {
  return JOBS.find((job) => job.id === id)
}

/** Default pipeline counts matching design reference. */
export function getPipelineStages(job: JobListing): PipelineStage[] {
  const baseApps =
    job.metrics.find((m) => m.label === 'Applications')?.value ?? 40
  return [
    {
      id: 'applicant',
      label: 'Applicant',
      count: Math.max(baseApps * 4, 430),
      weeklyChange: 15,
    },
    {
      id: 'clientEndorsement',
      label: 'Client Endorsement',
      count: 160,
      weeklyChange: 15,
    },
    {
      id: 'clientInterview',
      label: 'Client Interview',
      count: 38,
      weeklyChange: 15,
    },
    {
      id: 'offered',
      label: 'Offered',
      count: 11,
      weeklyChange: 15,
    },
    {
      id: 'ediRsg',
      label: 'EDI RSG Documentation',
      count: 8,
      weeklyChange: null,
    },
    {
      id: 'ediPdg',
      label: 'EDI PDG Documentation',
      count: 25,
      weeklyChange: 5,
    },
    {
      id: 'successfulPlacement',
      label: 'Successful Placement',
      count: 25,
      weeklyChange: 5,
    },
    {
      id: 'declined',
      label: 'Declined',
      count: 25,
      weeklyChange: 5,
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: 25,
      weeklyChange: 5,
    },
  ]
}

export function getApplicantsForJob(jobCode: string): Applicant[] {
  const seed = jobCode.split('').reduce((s, c) => s + c.charCodeAt(0), 0)

  return Array.from({ length: 48 }, (_, index) => {
    const i = (index + seed) % NAMES.length
    const days = 1 + ((index + seed) % 20)
    const month = 3 + (index % 6)
    return {
      id: `${jobCode}-a${index + 1}`,
      name: NAMES[i],
      email: EMAILS[i],
      experience: index % 3 === 0 ? '7+ Years' : `${3 + (index % 6)} Years`,
      location: LOCATIONS[i],
      cvRelevancy: 2 + ((index + seed) % 4),
      nationality: NATIONALITIES[i],
      suitability: 72 + ((index * 7 + seed) % 28),
      updatedOn: `${String(days).padStart(2, '0')}/${String(month).padStart(2, '0')}/2026`,
      age: 24 + ((index + seed) % 18),
      status: STATUSES[index % STATUSES.length],
      stage: STAGES[index % STAGES.length],
      source: SOURCE_OPTIONS[index % SOURCE_OPTIONS.length],
    }
  })
}

export type JobActivityStatus = 'done' | 'failed' | 'pending'

export type JobActivityItem = {
  id: string
  label: string
  status: JobActivityStatus
  timestamp: string
}

export function getJobActivityItems(): JobActivityItem[] {
  return [
    {
      id: 'jobUpdate',
      label: 'Job Update',
      status: 'done',
      timestamp: 'Oct 24, 10:30 AM',
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      status: 'done',
      timestamp: 'Oct 24, 10:30 AM',
    },
    {
      id: 'jobBoards',
      label: 'Job Boards',
      status: 'failed',
      timestamp: 'Oct 24, 10:30 AM',
    },
    {
      id: 'scoreCalculation',
      label: 'Score Calculation',
      status: 'pending',
      timestamp: 'Oct 24, 10:30 AM',
    },
  ]
}
