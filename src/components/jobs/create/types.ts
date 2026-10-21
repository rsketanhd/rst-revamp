export const CREATE_JOB_STEPS = [
  { id: 'createJob', label: 'Create Job' },
  { id: 'jobDetails', label: 'Job Details' },
  { id: 'jobAnalyzer', label: 'Job Analyzer' },
  { id: 'clientDetails', label: 'Client Details' },
  { id: 'jobBoards', label: 'Job Boards' },
  { id: 'review', label: 'Review' },
] as const

export type CreateMethod = 'copy' | 'scratch' | 'upload'

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

/** Suggested alternate titles shown on the Job Title analyzer card. */
export const JOB_TITLE_SUGGESTIONS = [
  'Data Scientist',
  'Data Science Specialist',
  'Data Science Professional',
  'Data Science Analyst',
  'Data Science Researcher',
  'Data Science Consultant',
  'Data Science Expert',
  'Data Science Practitioner',
] as const

/**
 * Build the Job Title chip list — primary title first, then related suggestions.
 */
export function jobTitleAnalyzerTags(primaryTitle = ''): string[] {
  const primary = primaryTitle.trim()
  const suggestions = [...JOB_TITLE_SUGGESTIONS]
  if (!primary) return suggestions
  const rest = suggestions.filter(
    (title) => title.toLowerCase() !== primary.toLowerCase(),
  )
  return [primary, ...rest]
}

export type CreateJobFormState = {
  method: CreateMethod
  /** Catalog job copied on step 1; empty until one is selected */
  sourceJobId: string
  /** Continue from the AI side panel — role banner plus the job form */
  aiEntry: boolean
  /** Prompt shown in “Your provided job role”; empty after Clear Search */
  providedRole: string
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
  /** Criteria that lower a candidate’s score. */
  penaltyCriteria: AnalyzerCriteria[]

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
  method: 'copy',
  sourceJobId: '',
  aiEntry: false,
  providedRole: '',
  jobReqId: '',
  jobTitle: 'Data Scientist',
  jobDescription: `Job Title: Data Scientist
Department: Data / Analytics
Industry: Data Science
Employment Type: Full-Time
Number of Positions: 2
Hiring Priority: High`,

  primaryCity: 'Jaipur',
  primaryState: '',
  primaryCountry: 'India',
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
  industry: 'Data Science',
  jobCategory: '',
  jobSubCategory: '',
  maskClassification: false,
  locationRequirement: 'Hybrid',
  jobType: 'Full Time',

  criteria: [
    {
      id: 'jobTitle',
      label: 'Job Title',
      source: 'old',
      value: 'Data Scientist',
      weight: 10,
      tags: [...JOB_TITLE_SUGGESTIONS],
      info: 'Official job title used for matching, boards, and candidate search.',
    },
    {
      id: 'duties',
      label: 'Job Duties and Responsibilities',
      source: 'new',
      value:
        'Develop and implement data models and algorithms, analyze large datasets, collaborate with cross-functional teams, and mentor junior data scientists.',
      weight: 20,
      info: 'Day-to-day responsibilities evaluated when scoring candidate fit.',
    },
    {
      id: 'qualifications',
      label: 'Required Qualifications',
      source: 'new',
      value:
        'Degrees: Bachelor, Master, PhD with Specialization: Data Science, Statistics, Mathematics, Computer Science.',
      weight: 10,
      info: 'Education and specialization requirements for this role.',
    },
    {
      id: 'skills',
      label: 'Must Have Skills',
      source: 'new',
      value: '',
      tags: [
        'Python',
        'R',
        'Machine Learning',
        'Statistical Modeling',
        'Data Visualization',
        'SQL',
        'Data Manipulation',
      ],
      weight: 25,
      info: 'Required skills that candidates must meet for shortlisting.',
    },
    {
      id: 'goodToHaveSkills',
      label: 'Good to have Skills',
      source: 'new',
      value: '',
      tags: [
        'Problem Solving',
        'Attention to Detail',
        'Communication',
        'Hadoop',
        'Spark',
        'AWS',
        'Azure',
        'Google Cloud',
        'Natural Language Processing',
        'Deep Learning',
        'Leadership',
        'Mentoring',
      ],
      weight: 10,
      info: 'Nice-to-have skills that strengthen a candidate’s fit score.',
    },
    {
      id: 'industry',
      label: 'Industry',
      source: 'new',
      value: 'Data Science',
      tags: ['Data Science'],
      weight: 10,
      info: 'Primary industry context used for benchmarks and recommendations.',
    },
    {
      id: 'location',
      label: 'Location',
      source: 'new',
      value: 'Jaipur, India',
      tags: ['Jaipur', 'India'],
      weight: 15,
      info: 'Preferred work location used when matching candidates.',
    },
  ],
  penaltyCriteria: [],

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
  locations: ['Jaipur, India'],
  rsPlusCandidatesCount: 6,

  visibleOnCareerPage: true,
}
