export const CREATE_JOB_STEPS = [
  { id: 'createJob', label: 'Create Job' },
  { id: 'jobDetails', label: 'Job Details' },
  { id: 'jobAnalyzer', label: 'Job Analyzer' },
  { id: 'clientDetails', label: 'Client Details' },
  { id: 'jobBoards', label: 'Job Boards' },
  { id: 'review', label: 'Review' },
] as const

export type CreateMethod = 'copy' | 'scratch'

export type AnalyzerSource = 'old' | 'new'

export type AnalyzerCriteria = {
  id: string
  label: string
  source: AnalyzerSource
  value: string
  weight: number
  /** Optional pills / tags for skills-style rows */
  tags?: string[]
  /** Optional badge e.g. "Client" */
  badge?: string
  /** Hover tooltip copy for the info icon */
  info?: string
}

export type CreateJobFormState = {
  method: CreateMethod
  jobReqId: string
  jobTitle: string
  jobDescription: string

  // Job details
  primaryCity: string
  primaryState: string
  primaryCountry: string
  secondaryCity: string
  secondaryState: string
  secondaryCountry: string
  sameAsPrimary: boolean
  jobRadius: string
  experienceMin: number
  experienceMax: number
  client: string
  project: string
  department: string
  division: string
  band: string
  supportRecruiter: string
  startDate: string
  endDate: string
  maskRecruitment: boolean
  industry: string
  jobCategory: string
  jobSubCategory: string
  maskClassification: boolean
  locationRequirement: string
  jobType: string

  // Analyzer
  criteria: AnalyzerCriteria[]

  // Client details
  clientContact: string
  clientContactSecondary: string
  clientIndustry: string

  // Job boards
  rsPlusEnabled: boolean
  linkedInEnabled: boolean
  linkedInConnected: boolean
  linkedInKeywords: string
  linkedInLocations: string[]
  linkedInJobTitles: string[]
  linkedInLastSynced: string
  linkedInAllFilters: LinkedInAllFilters
  industries: string[]
  companies: string[]
  companyCurrent: boolean
  companyPast: boolean
  excludeCompanies: string[]
  locations: string[]
  rsPlusCandidatesCount: number

  // Review
  visibleOnCareerPage: boolean
}

export type LinkedInAllFilters = {
  connections: string[]
  followersOf: string[]
  profileLanguage: string[]
  connectionDegree: string
  openTo: string
  firstName: string[]
  lastName: string[]
  titleAdvanced: string[]
  companyKeyword: string[]
  schoolKeyword: string[]
}

export const emptyLinkedInAllFilters: LinkedInAllFilters = {
  connections: [],
  followersOf: [],
  profileLanguage: [],
  connectionDegree: '',
  openTo: '',
  firstName: [],
  lastName: [],
  titleAdvanced: [],
  companyKeyword: [],
  schoolKeyword: [],
}

export const defaultCreateJobForm: CreateJobFormState = {
  method: 'scratch',
  jobReqId: '',
  jobTitle: 'Head of Engineering',
  jobDescription: `Job Title: Head of Engineering
Department: Engineering / Technology
Industry: SaaS / Software Technology
Employment Type: Full-Time
Number of Positions: 2
Hiring Priority: High`,

  primaryCity: 'London',
  primaryState: '',
  primaryCountry: 'UK',
  secondaryCity: '',
  secondaryState: '',
  secondaryCountry: '',
  sameAsPrimary: false,
  jobRadius: '50 km',
  experienceMin: 3,
  experienceMax: 10,
  client: '',
  project: '',
  department: '',
  division: '',
  band: '',
  supportRecruiter: '',
  startDate: '',
  endDate: '',
  maskRecruitment: false,
  industry: '',
  jobCategory: '',
  jobSubCategory: '',
  maskClassification: false,
  locationRequirement: 'Hybrid',
  jobType: 'Full Time',

  criteria: [
    {
      id: 'jobTitle',
      label: 'Job Title',
      source: 'new',
      value: 'Software Developer',
      weight: 5,
      info: 'Official job title used for matching, boards, and candidate search.',
    },
    {
      id: 'jobPurpose',
      label: 'Job Purpose',
      source: 'new',
      value: 'Develop high-quality software solutions',
      weight: 25,
      info: 'High-level purpose of the role and its impact on the organization.',
    },
    {
      id: 'duties',
      label: 'Job Duties and Responsibilities',
      source: 'new',
      value:
        'Write clean, maintainable code; Collaborate with team members; Troubleshoot and debug applications; Perform code reviews; Participate in software development life cycle',
      weight: 50,
      info: 'Day-to-day responsibilities evaluated when scoring candidate fit.',
    },
    {
      id: 'skills',
      label: 'Must Have Skills',
      source: 'new',
      value: '',
      tags: ['Programming', 'Problem-solving'],
      badge: 'Client',
      weight: 25,
      info: 'Required skills that candidates must meet for shortlisting.',
    },
    {
      id: 'industry',
      label: 'Industry',
      source: 'new',
      value: 'Data Analysis',
      weight: 5,
      info: 'Primary industry context used for benchmarks and recommendations.',
    },
  ],

  clientContact: '',
  clientContactSecondary: '',
  clientIndustry: '',

  rsPlusEnabled: true,
  linkedInEnabled: false,
  linkedInConnected: false,
  linkedInKeywords: '',
  linkedInLocations: [],
  linkedInJobTitles: [],
  linkedInLastSynced: '',
  linkedInAllFilters: emptyLinkedInAllFilters,
  industries: [],
  companies: [],
  companyCurrent: true,
  companyPast: false,
  excludeCompanies: [],
  locations: ['Ahmedabad, Gujarat, India'],
  rsPlusCandidatesCount: 6,

  visibleOnCareerPage: true,
}
