import {
  getPipelineStages,
  type PipelineStage,
} from './applications'
import { JOBS } from './jobs'

export type CandidateScope = 'my' | 'all'

export type PortalAccess = 'not-registered' | 'invited' | 'registered'

export type Candidate = {
  id: string
  candidateId: string
  name: string
  email: string
  phone: string
  linkedin: string
  country: string
  city: string
  designation: string
  portalAccess: PortalAccess
  source: string
  createdBy: string
  skills: string
  experienceYears: number
  profileCompletion: number
  incompleteFields: string[]
  currentCompany: string
  pastCompany: string
  tags: string[]
  currentJob: string
  pastJob: string
  applicationStatus: string
  associatedJob: string
  isMine: boolean
}

export const PORTAL_ACCESS_META: Record<
  PortalAccess,
  { label: string; className: string; dotClassName: string }
> = {
  'not-registered': {
    label: 'Not Registered/Not Invited',
    className: 'bg-[#FFF4D6] text-[#B45309]',
    dotClassName: 'bg-[#F5A524]',
  },
  invited: {
    label: 'Invited (15 Sep 2026)',
    className: 'bg-[#F3EEFF] text-[#6941C6]',
    dotClassName: 'bg-[#7F56D9]',
  },
  registered: {
    label: 'Registered & Active',
    className: 'bg-[#E7F8EF] text-[#027A48]',
    dotClassName: 'bg-[#12B76A]',
  },
}

export const PORTAL_ACCESS_OPTIONS: PortalAccess[] = [
  'not-registered',
  'invited',
  'registered',
]

export function portalAccessLabel(access: PortalAccess): string {
  switch (access) {
    case 'not-registered':
      return PORTAL_ACCESS_META['not-registered'].label
    case 'invited':
      return PORTAL_ACCESS_META.invited.label
    case 'registered':
      return PORTAL_ACCESS_META.registered.label
    default: {
      const exhaustive: never = access
      return exhaustive
    }
  }
}

const DESIGN_ROWS: Array<
  Pick<
    Candidate,
    | 'candidateId'
    | 'name'
    | 'email'
    | 'phone'
    | 'linkedin'
    | 'designation'
    | 'portalAccess'
  >
> = [
  {
    candidateId: 'C100123',
    name: 'Mukul Patil',
    email: 'mukul.patil@gmail.com',
    phone: '+91 98765 43210',
    linkedin: 'https://profilelink-01.com',
    designation: 'Sr. Full Stack Developer',
    portalAccess: 'not-registered',
  },
  {
    candidateId: 'C100124',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 91234 56789',
    linkedin: 'https://profilelink-02.com',
    designation: 'UI/UX Designer',
    portalAccess: 'invited',
  },
  {
    candidateId: 'C100125',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@example.com',
    phone: '+91 99876 54321',
    linkedin: 'https://profilelink-03.com',
    designation: 'Data Scientist',
    portalAccess: 'registered',
  },
  {
    candidateId: 'C100126',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    phone: '+91 98765 12345',
    linkedin: 'https://profilelink-04.com',
    designation: 'Product Manager',
    portalAccess: 'not-registered',
  },
  {
    candidateId: 'C100127',
    name: 'Karan Singh',
    email: 'karan.singh@example.com',
    phone: '+91 97654 32109',
    linkedin: 'https://profilelink-05.com',
    designation: 'DevOps Engineer',
    portalAccess: 'invited',
  },
  {
    candidateId: 'C100128',
    name: 'Pooja Gupta',
    email: 'pooja.gupta@example.com',
    phone: '+91 96543 21098',
    linkedin: 'https://profilelink-06.com',
    designation: 'Quality Assurance Analyst',
    portalAccess: 'registered',
  },
  {
    candidateId: 'C100129',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@example.com',
    phone: '+91 95432 10987',
    linkedin: 'https://profilelink-07.com',
    designation: 'Mobile App Developer',
    portalAccess: 'not-registered',
  },
  {
    candidateId: 'C100130',
    name: 'Divya Nair',
    email: 'divya.nair@example.com',
    phone: '+91 94321 09876',
    linkedin: 'https://profilelink-08.com',
    designation: 'Digital Marketing Specialist',
    portalAccess: 'invited',
  },
  {
    candidateId: 'C100131',
    name: 'Arjun Kapoor',
    email: 'arjun.kapoor@example.com',
    phone: '+91 93210 98765',
    linkedin: 'https://profilelink-09.com',
    designation: 'Cloud Architect',
    portalAccess: 'registered',
  },
  {
    candidateId: 'C100132',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    phone: '+91 92109 87654',
    linkedin: 'https://profilelink-10.com',
    designation: 'Business Analyst',
    portalAccess: 'registered',
  },
]

const EXTRA_NAMES = [
  'Aisha Khan',
  'Rohan Desai',
  'Neha Kulkarni',
  'Aditya Verma',
  'Ishita Banerjee',
  'Sanjay Rao',
  'Kavya Menon',
  'Harsh Malhotra',
  'Priya Nair',
  'Amit Joshi',
]

const EXTRA_DESIGNATIONS = [
  'Sr. Full Stack Developer',
  'UI/UX Designer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
  'Quality Assurance Analyst',
  'Mobile App Developer',
  'Digital Marketing Specialist',
  'Cloud Architect',
  'Business Analyst',
]

const CITIES = [
  'Pune',
  'Bengaluru',
  'Mumbai',
  'Hyderabad',
  'New Delhi',
  'Noida',
  'Kochi',
  'Chennai',
  'Jaipur',
  'Ahmedabad',
]

export const CANDIDATE_SOURCE_OPTIONS = [
  'LinkedIn',
  'Referral',
  'Job Board',
  'Career Site',
  'Agency',
]

export const CANDIDATE_CREATED_BY_OPTIONS = [
  'Sarah Johnson',
  'Michael Chen',
  'Aisha Khan',
  'Elena Rossi',
]

export const CANDIDATE_SKILL_OPTIONS = [
  'React',
  'TypeScript',
  'Python',
  'SQL',
  'Figma',
  'AWS',
  'Java',
  'Node.js',
]

export const CANDIDATE_COMPANY_OPTIONS = [
  'Acme Corp',
  'Northwind',
  'Globex',
  'Initech',
  'Umbrella',
]

export const CANDIDATE_TAG_OPTIONS = [
  'Hot Lead',
  'Remote',
  'Senior',
  'Referral',
  'Urgent',
  'Tech',
]

export const CANDIDATE_JOB_OPTIONS = [
  'Head of Engineering',
  'UI/UX Designer',
  'Frontend Developer',
  'Data Analyst',
  'Backend Engineer',
]

export const CANDIDATE_APPLICATION_STATUS_OPTIONS = [
  'New',
  'Client Endorsement',
  'Interview Ready',
  'Offered',
  'Rejected',
]

function phoneFor(index: number): string {
  const digits = String(9000000000 + index * 137).slice(0, 10)
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
}

/** Fields that can be missing from a candidate profile. Order matches the hover overlay. */
export const PROFILE_FIELDS = [
  'Phone Number',
  'Profile Pic',
  'Resume',
  'Gender',
  'Notice Period Days',
  'About Me',
  'Skills',
  'Education',
  'Experience',
  'Email',
  'City',
  'Designation',
] as const

/** First page of the candidates list — matches the Profile (%) column design. */
const DESIGN_PROFILE_PERCENTS = [25, 57, 65, 48, 56, 22, 22, 22, 22, 4]

const EXTRA_PROFILE_PERCENTS = [18, 33, 41, 52, 67, 74, 81, 12, 38, 90]

export function profilePercentFor(index: number): number {
  if (index < DESIGN_PROFILE_PERCENTS.length) {
    return DESIGN_PROFILE_PERCENTS[index] ?? 0
  }
  const extraIndex = index - DESIGN_PROFILE_PERCENTS.length
  return EXTRA_PROFILE_PERCENTS[extraIndex % EXTRA_PROFILE_PERCENTS.length] ?? 0
}

/** Fields still missing, so the completion ring and hover list stay in sync. */
export function incompleteProfileFields(percent: number, index: number): string[] {
  const missingCount = Math.min(
    PROFILE_FIELDS.length,
    Math.max(0, Math.round(((100 - percent) / 100) * PROFILE_FIELDS.length)),
  )
  if (missingCount === 0) return []
  if (index === 0) return [...PROFILE_FIELDS.slice(0, missingCount)]
  const start = index % PROFILE_FIELDS.length
  return [
    ...PROFILE_FIELDS.slice(start),
    ...PROFILE_FIELDS.slice(0, start),
  ].slice(0, missingCount)
}

function toCandidate(
  row: (typeof DESIGN_ROWS)[number],
  index: number,
): Candidate {
  const skill = CANDIDATE_SKILL_OPTIONS[index % CANDIDATE_SKILL_OPTIONS.length]
  const currentJob =
    CANDIDATE_JOB_OPTIONS[index % CANDIDATE_JOB_OPTIONS.length]
  const profileCompletion = profilePercentFor(index)
  return {
    id: row.candidateId,
    ...row,
    country: 'India',
    city: CITIES[index % CITIES.length],
    isMine: true,
    source: CANDIDATE_SOURCE_OPTIONS[index % CANDIDATE_SOURCE_OPTIONS.length],
    createdBy:
      CANDIDATE_CREATED_BY_OPTIONS[index % CANDIDATE_CREATED_BY_OPTIONS.length],
    skills: skill,
    experienceYears: 3 + (index % 3),
    profileCompletion,
    incompleteFields: incompleteProfileFields(profileCompletion, index),
    currentCompany:
      CANDIDATE_COMPANY_OPTIONS[index % CANDIDATE_COMPANY_OPTIONS.length],
    pastCompany:
      CANDIDATE_COMPANY_OPTIONS[(index + 2) % CANDIDATE_COMPANY_OPTIONS.length],
    tags: [
      CANDIDATE_TAG_OPTIONS[index % CANDIDATE_TAG_OPTIONS.length],
      CANDIDATE_TAG_OPTIONS[(index + 2) % CANDIDATE_TAG_OPTIONS.length],
    ],
    currentJob,
    pastJob: CANDIDATE_JOB_OPTIONS[(index + 1) % CANDIDATE_JOB_OPTIONS.length],
    applicationStatus:
      CANDIDATE_APPLICATION_STATUS_OPTIONS[
        index % CANDIDATE_APPLICATION_STATUS_OPTIONS.length
      ],
    associatedJob: currentJob,
    linkedin:
      row.linkedin ||
      `https://profilelink-${String(index + 1).padStart(2, '0')}.com`,
  }
}

/** Demo catalog — first page matches the Candidates list design. */
export function getCandidates(): Candidate[] {
  const seeded = DESIGN_ROWS.map((row, index) => toCandidate(row, index))
  const extras = Array.from({ length: 90 }, (_, offset) => {
    const index = offset + DESIGN_ROWS.length
    const name = EXTRA_NAMES[offset % EXTRA_NAMES.length]
    const [first = 'candidate', last = 'user'] = name.toLowerCase().split(' ')
    const portalAccess =
      PORTAL_ACCESS_OPTIONS[offset % PORTAL_ACCESS_OPTIONS.length]
    return toCandidate(
      {
        candidateId: `C${100123 + index}`,
        name,
        email: `${first}.${last}${offset}@example.com`,
        phone: phoneFor(index),
        linkedin: `https://profilelink-${String(index + 1).padStart(2, '0')}.com`,
        designation: EXTRA_DESIGNATIONS[offset % EXTRA_DESIGNATIONS.length],
        portalAccess,
      },
      index,
    )
  })
  return [...seeded, ...extras]
}

/** Global candidates pipeline counts (design reference). */
export function getCandidatesPipelineStages(): PipelineStage[] {
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
  return getPipelineStages(sample).filter((stage) => stage.id !== 'rejected')
}

export type CandidatesMoreFilters = {
  experience: [number, number]
  source: string
  createdBy: string
  skills: string
  companies: string
  companyCurrent: boolean
  companyPast: boolean
  tags: string[]
  job: string
  jobCurrent: boolean
  jobPast: boolean
  applicationStatus: string
}

export const DEFAULT_EXPERIENCE: [number, number] = [3, 5]

export const emptyCandidatesMoreFilters: CandidatesMoreFilters = {
  experience: DEFAULT_EXPERIENCE,
  source: '',
  createdBy: '',
  skills: '',
  companies: '',
  companyCurrent: true,
  companyPast: false,
  tags: [],
  job: '',
  jobCurrent: true,
  jobPast: false,
  applicationStatus: '',
}

export function countCandidateFilters(filters: CandidatesMoreFilters): number {
  let count = 0
  if (
    filters.experience[0] !== DEFAULT_EXPERIENCE[0] ||
    filters.experience[1] !== DEFAULT_EXPERIENCE[1]
  ) {
    count += 1
  }
  if (filters.source) count += 1
  if (filters.createdBy) count += 1
  if (filters.skills) count += 1
  if (filters.companies) count += 1
  if (filters.tags.length > 0) count += 1
  if (filters.job) count += 1
  if (filters.applicationStatus) count += 1
  return count
}
