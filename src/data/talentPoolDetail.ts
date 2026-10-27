export type TalentPoolCandidateStage =
  | 'lead'
  | 'engaged'
  | 'screening'
  | 'qualified'
  | 'rejected'

export type TalentPoolPipelineStage = {
  id: TalentPoolCandidateStage
  label: string
  count: number
  weeklyChange: number | null
}

export type TalentPoolCandidateBadge =
  | 'verified'
  | 'star'
  | 'graduate'
  | 'profile'

export type TalentPoolCandidate = {
  id: string
  name: string
  email: string
  stage: TalentPoolCandidateStage
  experience: string
  location: string
  nationality: string
  updatedOn: string
  badges: TalentPoolCandidateBadge[]
  source: string
}

export const TALENT_POOL_STAGE_LABEL: Record<TalentPoolCandidateStage, string> =
  {
    lead: 'Lead',
    engaged: 'Engaged',
    screening: 'Screening',
    qualified: 'Qualified',
    rejected: 'Rejected',
  }

/** Pipeline counts from the Talent Pool details design. */
export const TALENT_POOL_PIPELINE: TalentPoolPipelineStage[] = [
  { id: 'lead', label: 'Lead', count: 430, weeklyChange: null },
  { id: 'engaged', label: 'Engaged', count: 8, weeklyChange: null },
  { id: 'screening', label: 'Screening', count: 3, weeklyChange: null },
  { id: 'qualified', label: 'Qualified', count: 2, weeklyChange: null },
  { id: 'rejected', label: 'Rejected', count: 5, weeklyChange: null },
]

const LEAD_CANDIDATES: TalentPoolCandidate[] = [
  {
    id: 'tpc-1',
    name: 'John Huber',
    email: 'mail@email.com',
    stage: 'lead',
    experience: '7+ Years',
    location: 'New York, USA',
    nationality: 'Filipino',
    updatedOn: '02/09/2025',
    badges: ['verified', 'star', 'graduate', 'profile'],
    source: 'Referral',
  },
  {
    id: 'tpc-2',
    name: 'Sofia Malik',
    email: 'sofia.malik@gmail.com',
    stage: 'lead',
    experience: '5 Years',
    location: 'Bangalore, India',
    nationality: 'Filipino',
    updatedOn: '04/10/2023',
    badges: ['verified', 'star', 'graduate'],
    source: 'LinkedIn',
  },
  {
    id: 'tpc-3',
    name: 'Aarav Joshi',
    email: 'aarav.joshi@gmail.com',
    stage: 'lead',
    experience: '4 Years',
    location: 'Mumbai, India',
    nationality: 'Filipino',
    updatedOn: '12/08/2023',
    badges: ['verified', 'star'],
    source: 'LinkedIn',
  },
  {
    id: 'tpc-4',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    stage: 'lead',
    experience: '8 Years',
    location: 'Hyderabad, India',
    nationality: 'Filipino',
    updatedOn: '01/12/2024',
    badges: ['verified'],
    source: 'Referral',
  },
  {
    id: 'tpc-5',
    name: 'Rahul Verma',
    email: 'rahul.verma@gmail.com',
    stage: 'lead',
    experience: '6 Years',
    location: 'Delhi, India',
    nationality: 'Filipino',
    updatedOn: '10/11/2023',
    badges: ['verified', 'star', 'profile'],
    source: 'Referral',
  },
  {
    id: 'tpc-6',
    name: 'Emily Chen',
    email: 'emily.chen@gmail.com',
    stage: 'lead',
    experience: '3 Years',
    location: 'Singapore',
    nationality: 'Singaporean',
    updatedOn: '15/03/2024',
    badges: ['verified', 'graduate'],
    source: 'LinkedIn',
  },
  {
    id: 'tpc-7',
    name: 'Omar Al-Farsi',
    email: 'omar.alfarsi@gmail.com',
    stage: 'lead',
    experience: '9 Years',
    location: 'Riyadh, Saudi Arabia',
    nationality: 'Saudi',
    updatedOn: '22/06/2024',
    badges: ['verified', 'star', 'graduate'],
    source: 'Referral',
  },
  {
    id: 'tpc-8',
    name: 'Layla Hassan',
    email: 'layla.hassan@gmail.com',
    stage: 'lead',
    experience: '5 Years',
    location: 'Jeddah, Saudi Arabia',
    nationality: 'Saudi',
    updatedOn: '08/01/2025',
    badges: ['star', 'profile'],
    source: 'LinkedIn',
  },
  {
    id: 'tpc-9',
    name: 'Daniel Okonkwo',
    email: 'daniel.okonkwo@gmail.com',
    stage: 'lead',
    experience: '6 Years',
    location: 'Dubai, UAE',
    nationality: 'Nigerian',
    updatedOn: '19/09/2024',
    badges: ['verified', 'graduate', 'profile'],
    source: 'Referral',
  },
  {
    id: 'tpc-10',
    name: 'Nora Berg',
    email: 'nora.berg@gmail.com',
    stage: 'lead',
    experience: '4 Years',
    location: 'Stockholm, Sweden',
    nationality: 'Swedish',
    updatedOn: '03/04/2024',
    badges: ['verified', 'star'],
    source: 'LinkedIn',
  },
  {
    id: 'tpc-11',
    name: 'Hassan Ali',
    email: 'hassan.ali@gmail.com',
    stage: 'lead',
    experience: '7 Years',
    location: 'Riyadh, Saudi Arabia',
    nationality: 'Egyptian',
    updatedOn: '11/07/2024',
    badges: ['verified'],
    source: 'Referral',
  },
  {
    id: 'tpc-12',
    name: 'Mei Lin',
    email: 'mei.lin@gmail.com',
    stage: 'lead',
    experience: '2 Years',
    location: 'Hong Kong',
    nationality: 'Chinese',
    updatedOn: '28/02/2025',
    badges: ['graduate', 'profile'],
    source: 'LinkedIn',
  },
]

const OTHER_STAGE_CANDIDATES: TalentPoolCandidate[] = [
  {
    id: 'tpc-e1',
    name: 'James Carter',
    email: 'james.carter@gmail.com',
    stage: 'engaged',
    experience: '6 Years',
    location: 'London, UK',
    nationality: 'British',
    updatedOn: '05/05/2024',
    badges: ['verified', 'star'],
    source: 'LinkedIn',
  },
  {
    id: 'tpc-e2',
    name: 'Fatima Noor',
    email: 'fatima.noor@gmail.com',
    stage: 'engaged',
    experience: '4 Years',
    location: 'Jeddah, Saudi Arabia',
    nationality: 'Saudi',
    updatedOn: '14/08/2024',
    badges: ['verified'],
    source: 'Referral',
  },
  {
    id: 'tpc-s1',
    name: 'Victor Lopez',
    email: 'victor.lopez@gmail.com',
    stage: 'screening',
    experience: '5 Years',
    location: 'Madrid, Spain',
    nationality: 'Spanish',
    updatedOn: '21/03/2024',
    badges: ['star', 'graduate'],
    source: 'LinkedIn',
  },
  {
    id: 'tpc-q1',
    name: 'Aisha Khan',
    email: 'aisha.khan@gmail.com',
    stage: 'qualified',
    experience: '8 Years',
    location: 'Riyadh, Saudi Arabia',
    nationality: 'Pakistani',
    updatedOn: '09/11/2024',
    badges: ['verified', 'star', 'graduate'],
    source: 'Referral',
  },
  {
    id: 'tpc-r1',
    name: 'Tom Bradley',
    email: 'tom.bradley@gmail.com',
    stage: 'rejected',
    experience: '3 Years',
    location: 'Chicago, USA',
    nationality: 'American',
    updatedOn: '17/01/2024',
    badges: ['profile'],
    source: 'LinkedIn',
  },
]

export const TALENT_POOL_CANDIDATES: TalentPoolCandidate[] = [
  ...LEAD_CANDIDATES,
  ...OTHER_STAGE_CANDIDATES,
]

export type TalentPoolCandidateFilters = {
  source: string
  nationality: string
}

export const emptyTalentPoolCandidateFilters: TalentPoolCandidateFilters = {
  source: '',
  nationality: '',
}

export function countTalentPoolCandidateFilters(
  filters: TalentPoolCandidateFilters,
): number {
  return [filters.source, filters.nationality].filter(Boolean).length
}

export function filterTalentPoolCandidates(
  rows: TalentPoolCandidate[],
  stageId: string,
  query: string,
  filters: TalentPoolCandidateFilters,
): TalentPoolCandidate[] {
  const needle = query.trim().toLowerCase()
  return rows.filter((row) => {
    if (row.stage !== stageId) return false
    if (filters.source && row.source !== filters.source) return false
    if (filters.nationality && row.nationality !== filters.nationality) {
      return false
    }
    if (!needle) return true
    return (
      row.name.toLowerCase().includes(needle) ||
      row.email.toLowerCase().includes(needle) ||
      row.location.toLowerCase().includes(needle) ||
      row.source.toLowerCase().includes(needle)
    )
  })
}
