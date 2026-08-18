import {
  APPLICANT_STATUS_META,
  APPLICANT_STATUS_OPTIONS,
  SOURCE_OPTIONS,
  getPipelineStages,
  type ApplicantStatus,
  type PipelineStage,
  type PipelineStageId,
} from './applications'
import { JOBS } from './jobs'

export type CandidateScope = 'my' | 'all'

export type Candidate = {
  id: string
  name: string
  reqId: string
  status: ApplicantStatus
  updatedOn: string
  source: string
  suitability: number
  cvRelevancy: number
  profileLink: string
  stage: PipelineStageId
  tags: string[]
  isMine: boolean
}

export {
  APPLICANT_STATUS_META as CANDIDATE_STATUS_META,
  APPLICANT_STATUS_OPTIONS as CANDIDATE_STATUS_OPTIONS,
  SOURCE_OPTIONS as CANDIDATE_SOURCE_OPTIONS,
}

export const CANDIDATE_TAG_OPTIONS = [
  'Hot Lead',
  'Remote',
  'Senior',
  'Referral',
  'Urgent',
  'Tech',
]

const NAMES = [
  'Mukul Patil',
  'Anita Sharma',
  'Rahul Mehta',
  'Sofia Malik',
  'James Okafor',
  'Priya Nair',
  'Chen Wei',
  'Amelia Brooks',
  'Carlos Rivera',
  'Hana Suzuki',
  'David Kim',
  'Elena Rossi',
]

const TABLE_SOURCES = [
  'Application',
  'System Update',
  'Mobile App',
  'LinkedIn',
  'RS Plus',
  'Referral',
]

const STATUSES: ApplicantStatus[] = [
  'new',
  'clientEndorsement',
  'videoInterview',
  'interviewReady',
  'sendMail',
  'new',
  'clientEndorsement',
  'sendMail',
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

/** Global candidates pipeline counts (design reference). */
export function getCandidatesPipelineStages(): PipelineStage[] {
  // Reuse structure/labels from job applications pipeline helpers
  const sample = JOBS[0]
  if (!sample) {
    return [
      { id: 'applicant', label: 'Applicant', count: 430, weeklyChange: 15 },
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
      { id: 'offered', label: 'Offered', count: 11, weeklyChange: 15 },
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
      { id: 'declined', label: 'Declined', count: 25, weeklyChange: 5 },
    ]
  }
  return getPipelineStages(sample).filter((s) => s.id !== 'rejected')
}

/** Demo catalog large enough for pagination + filters. */
export function getCandidates(): Candidate[] {
  return Array.from({ length: 100 }, (_, index) => {
    const name = NAMES[index % NAMES.length]
    const tagA = CANDIDATE_TAG_OPTIONS[index % CANDIDATE_TAG_OPTIONS.length]
    const tagB =
      CANDIDATE_TAG_OPTIONS[(index + 2) % CANDIDATE_TAG_OPTIONS.length]
    const month = 1 + (index % 12)
    const day = 1 + (index % 28)

    return {
      id: `cand-${index + 1}`,
      name,
      reqId: `REQ-${1020 + (index % 40)}`,
      status: STATUSES[index % STATUSES.length],
      updatedOn: `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/2025`,
      source: TABLE_SOURCES[index % TABLE_SOURCES.length],
      suitability: 72 + ((index * 7) % 28),
      cvRelevancy: 2 + (index % 4),
      profileLink: `https://profilelink-${String((index % 20) + 1).padStart(2, '0')}.com`,
      stage: STAGES[index % STAGES.length],
      tags: [tagA, tagB],
      isMine: index % 3 !== 2,
    }
  })
}

export type CandidatesMoreFilters = {
  cvUpdatedDate: string
  cvScore: string
  source: string
  status: string
  tag: string
}

export const emptyCandidatesMoreFilters: CandidatesMoreFilters = {
  cvUpdatedDate: '',
  cvScore: '',
  source: '',
  status: '',
  tag: '',
}
