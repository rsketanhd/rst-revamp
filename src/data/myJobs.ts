export type MyJobFitLevel = 'excellent' | 'good' | 'fair' | 'low'

/** Palette colors from the match score gradient design. */
export const MATCH_SCORE_COLORS: Record<MyJobFitLevel, string> = {
  excellent: '#008000',
  good: '#008080',
  fair: '#D4AF37',
  low: '#E57373',
}

export type MatchScoreMeta = {
  score: number
  level: MyJobFitLevel
  label: string
  color: string
}

export function getMatchScoreMeta(score: number): MatchScoreMeta {
  const normalized = Math.max(0, Math.min(100, Math.round(score)))

  if (normalized >= 85) {
    return {
      score: normalized,
      level: 'excellent',
      label: 'Excellent Fit',
      color: MATCH_SCORE_COLORS.excellent,
    }
  }

  if (normalized >= 65) {
    return {
      score: normalized,
      level: 'good',
      label: 'Good Fit',
      color: MATCH_SCORE_COLORS.good,
    }
  }

  if (normalized >= 45) {
    return {
      score: normalized,
      level: 'fair',
      label: 'Fair Fit',
      color: MATCH_SCORE_COLORS.fair,
    }
  }

  return {
    score: normalized,
    level: 'low',
    label: 'Low Fit',
    color: MATCH_SCORE_COLORS.low,
  }
}

export type MyJobQualification = {
  id: string
  text: string
  matched: boolean
}

export type MyJobComparison = {
  id: string
  label: string
  percentage: number
  description: string
  tone: 'positive' | 'neutral' | 'warning'
}

export type MyJobFocusItem = {
  id: string
  text: string
}

export type MyJobFitCriteria = {
  qualifications: MyJobQualification[]
  comparisons: MyJobComparison[]
  focusItems: MyJobFocusItem[]
}

export type MyJobDescriptionSection = {
  id: string
  title: string
  items: string[]
}

export type MyJob = {
  id: string
  title: string
  company: string
  jobType: string
  workMode: string
  experience: string
  location: string
  postedAgo: string
  companySize: string
  salaryRange: string
  relevanceScore: number
  resumeMatchScore: number
  descriptionSections: MyJobDescriptionSection[]
  fitCriteria: MyJobFitCriteria
}

export type MyJobsFilters = {
  jobType: string
  companySize: string
  salaryRange: string
  workMode: string
  experience: string
}

export type MyJobsSortOption = 'relevance' | 'posted' | 'match'

export const emptyMyJobsFilters: MyJobsFilters = {
  jobType: '',
  companySize: '',
  salaryRange: '',
  workMode: '',
  experience: '',
}

const SHARED_DESCRIPTION: MyJobDescriptionSection[] = [
  {
    id: 'what-youll-do',
    title: "What you'll do",
    items: [
      'Responsible for setting the wholesale commercial strategies for all countries and accounts in the designated Region.',
      'Set the cost targets into managed markets and establish cost baseline rates and floor prices for monthly pricing and target sell rates.',
      'Provide commercial support and oversight to all wholesale services, like voice, roaming and IPX in the region and for the designated accounts.',
      'Manage the routing of traffic to optimise quality for our customers, fulfil all deal commitments.',
      'Own and drive profitable business growth and International Services evolution products',
      'Delivery of margin goal for designated region and services',
    ],
  },
  {
    id: 'what-you-bring',
    title: 'What you will bring to the team',
    items: [
      'At least 10 years experience in international voice/roaming /IPX/wholesale services',
      'Background in voice, roaming and IPX negotiations and delivery of cost and margin targets',
      'Knowledge of sanctions, regulatory and tax framework as it applies to international wholesale services',
      'Intermediate People Manager Skills',
      'Strong resilience and Proactive',
      'Business or Mathematics Degree',
    ],
  },
  {
    id: 'what-you-bring-2',
    title: 'What you will bring to the team',
    items: [
      'At least 10 years experience in international voice/roaming /IPX/wholesale services',
      'Background in voice, roaming and IPX negotiations and delivery of cost and margin targets',
      'Knowledge of sanctions, regulatory and tax framework as it applies to international wholesale services',
      'Strong resilience and Proactive',
      'Business or Mathematics Degree',
    ],
  },
]

const SR_PRODUCT_FIT: MyJobFitCriteria = {
  qualifications: [
    { id: 'q1', text: '5+ years of experience in UI/UX design', matched: true },
    { id: 'q2', text: 'Proficiency in Figma and design systems', matched: true },
    { id: 'q3', text: 'Portfolio with product design case studies', matched: true },
    { id: 'q4', text: 'Experience with user research methods', matched: true },
    { id: 'q5', text: 'Knowledge of accessibility standards (WCAG)', matched: true },
  ],
  comparisons: [
    {
      id: 'c1',
      label: 'Same Education Background',
      percentage: 85,
      description:
        '85% of applicants have a B.Tech in Computer Science, same as you',
      tone: 'positive',
    },
    {
      id: 'c2',
      label: 'Alumni Network',
      percentage: 20,
      description:
        '20% of applicants are from IIT Kharagpur alumni like you',
      tone: 'warning',
    },
  ],
  focusItems: [
    { id: 'f1', text: 'Highlight Cloud Certifications' },
    { id: 'f2', text: 'Emphasize Agile Methodology' },
    { id: 'f3', text: 'Showcase Design System Experience' },
    { id: 'f4', text: 'Include Mobile App Design Projects' },
  ],
}

const JUNIOR_PRODUCT_FIT: MyJobFitCriteria = {
  qualifications: [
    { id: 'q1', text: '2+ years of experience in UI/UX design', matched: true },
    { id: 'q2', text: 'Proficiency in Figma', matched: true },
    { id: 'q3', text: 'Basic portfolio with design projects', matched: true },
    { id: 'q4', text: 'Understanding of user-centered design', matched: false },
    { id: 'q5', text: 'Experience with design systems', matched: false },
  ],
  comparisons: [
    {
      id: 'c1',
      label: 'Same Education Background',
      percentage: 72,
      description: '72% of applicants share a similar educational background',
      tone: 'positive',
    },
    {
      id: 'c2',
      label: 'Portfolio Quality',
      percentage: 45,
      description: '45% of applicants have comparable portfolio depth',
      tone: 'neutral',
    },
  ],
  focusItems: [
    { id: 'f1', text: 'Build a stronger case study portfolio' },
    { id: 'f2', text: 'Highlight internship or freelance work' },
    { id: 'f3', text: 'Emphasize collaboration skills' },
  ],
}

const PRODUCT_UI_FIT: MyJobFitCriteria = {
  qualifications: [
    { id: 'q1', text: '5+ years of UI design experience', matched: true },
    { id: 'q2', text: 'Strong visual design skills', matched: true },
    { id: 'q3', text: 'Experience with component libraries', matched: true },
    { id: 'q4', text: 'Cross-platform design experience', matched: true },
    { id: 'q5', text: 'Leadership in design reviews', matched: false },
  ],
  comparisons: [
    {
      id: 'c1',
      label: 'Same Education Background',
      percentage: 78,
      description: '78% of applicants have a design or CS background',
      tone: 'positive',
    },
    {
      id: 'c2',
      label: 'Years of Experience',
      percentage: 60,
      description: '60% of applicants have 5+ years of experience',
      tone: 'neutral',
    },
  ],
  focusItems: [
    { id: 'f1', text: 'Showcase visual design excellence' },
    { id: 'f2', text: 'Include metrics from past projects' },
    { id: 'f3', text: 'Highlight cross-functional leadership' },
  ],
}

export const MY_JOBS: MyJob[] = [
  {
    id: 'job-1',
    title: 'Sr. Product Designer (UI/UX)',
    company: 'AMAZON INDIA LTD',
    jobType: 'Full Time',
    workMode: 'On Site',
    experience: '5-10 Years',
    location: 'Ahmedabad, Gujrat, India',
    postedAgo: 'Posted 1 Day ago',
    companySize: '10000+',
    salaryRange: '15-25 LPA',
    relevanceScore: 98,
    resumeMatchScore: 95,
    descriptionSections: SHARED_DESCRIPTION,
    fitCriteria: SR_PRODUCT_FIT,
  },
  {
    id: 'job-2',
    title: 'Junior Product Designer',
    company: 'AMAZON INDIA LTD',
    jobType: 'Part Time',
    workMode: 'Remote',
    experience: '0-2 Years',
    location: 'Bangalore, Karnataka, India',
    postedAgo: 'Posted 3 Days ago',
    companySize: '10000+',
    salaryRange: '6-12 LPA',
    relevanceScore: 82,
    resumeMatchScore: 78,
    descriptionSections: SHARED_DESCRIPTION,
    fitCriteria: JUNIOR_PRODUCT_FIT,
  },
  {
    id: 'job-3',
    title: 'Product Designer (UI)',
    company: 'AMAZON INDIA LTD',
    jobType: 'Full Time',
    workMode: 'Hybrid',
    experience: '3-5 Years',
    location: 'Hyderabad, Telangana, India',
    postedAgo: 'Posted 1 Week ago',
    companySize: '10000+',
    salaryRange: '12-20 LPA',
    relevanceScore: 90,
    resumeMatchScore: 88,
    descriptionSections: SHARED_DESCRIPTION,
    fitCriteria: PRODUCT_UI_FIT,
  },
  {
    id: 'job-4',
    title: 'Lead Product Designer',
    company: 'AMAZON INDIA LTD',
    jobType: 'Contract',
    workMode: 'On Site',
    experience: '7+ Years',
    location: 'Bengaluru, Karnataka, India',
    postedAgo: 'Posted 2 Weeks ago',
    companySize: '10000+',
    salaryRange: '20-30 LPA',
    relevanceScore: 85,
    resumeMatchScore: 80,
    descriptionSections: SHARED_DESCRIPTION,
    fitCriteria: SR_PRODUCT_FIT,
  },
  {
    id: 'job-5',
    title: 'UX Design Intern',
    company: 'AMAZON INDIA LTD',
    jobType: 'Internship',
    workMode: 'Remote',
    experience: '0-2 Years',
    location: 'Remote',
    postedAgo: 'Posted 4 Days ago',
    companySize: '10000+',
    salaryRange: '3-6 LPA',
    relevanceScore: 68,
    resumeMatchScore: 62,
    descriptionSections: SHARED_DESCRIPTION,
    fitCriteria: JUNIOR_PRODUCT_FIT,
  },
  {
    id: 'job-6',
    title: 'Junior UX Designer',
    company: 'AMAZON INDIA LTD',
    jobType: 'Full Time',
    workMode: 'Hybrid',
    experience: '1 Year',
    location: 'Hyderabad, Telangana, India',
    postedAgo: 'Posted 5 Days ago',
    companySize: '10000+',
    salaryRange: '6-12 LPA',
    relevanceScore: 74,
    resumeMatchScore: 71,
    descriptionSections: SHARED_DESCRIPTION,
    fitCriteria: JUNIOR_PRODUCT_FIT,
  },
]

export const MY_JOBS_FILTER_OPTIONS = {
  jobType: ['Full Time', 'Part Time', 'Contract', 'Internship'],
  companySize: ['1-50', '51-200', '201-1000', '1000-5000', '5000-10000', '10000+'],
  salaryRange: ['3-6 LPA', '6-12 LPA', '12-20 LPA', '15-25 LPA', '20-30 LPA', '30+ LPA'],
  workMode: ['On Site', 'Remote', 'Hybrid'],
  experience: [
    '1 Year',
    '0-2 Years',
    '2-5 Years',
    '3-5 Years',
    '5-10 Years',
    '7+ Years',
    '8-12 Years',
  ],
}

export const MY_JOBS_SORT_OPTIONS: Array<{ id: MyJobsSortOption; label: string }> =
  [
    { id: 'relevance', label: 'Relevance' },
    { id: 'match', label: 'Match Score' },
    { id: 'posted', label: 'Most Recent' },
  ]

export function getMyJobs(): MyJob[] {
  return MY_JOBS.map((job) => ({
    ...job,
    descriptionSections: job.descriptionSections.map((section) => ({
      ...section,
      items: [...section.items],
    })),
    fitCriteria: {
      ...job.fitCriteria,
      qualifications: job.fitCriteria.qualifications.map((item) => ({ ...item })),
      comparisons: job.fitCriteria.comparisons.map((item) => ({ ...item })),
      focusItems: job.fitCriteria.focusItems.map((item) => ({ ...item })),
    },
  }))
}

export function getMyJobById(id: string): MyJob | undefined {
  return getMyJobs().find((job) => job.id === id)
}

export function countMyJobsFilters(filters: MyJobsFilters): number {
  let count = 0
  if (filters.jobType) count += 1
  if (filters.companySize) count += 1
  if (filters.salaryRange) count += 1
  if (filters.workMode) count += 1
  if (filters.experience) count += 1
  return count
}

export const RESUME_MATCH_MIN_SCORE = 45

export function filterMyJobs(
  jobs: MyJob[],
  query: string,
  locationQuery: string,
  filters: MyJobsFilters,
  hasResume: boolean,
): MyJob[] {
  const normalizedQuery = query.trim().toLowerCase()
  const normalizedLocation = locationQuery.trim().toLowerCase()

  return jobs.filter((job) => {
    if (hasResume && job.resumeMatchScore < RESUME_MATCH_MIN_SCORE) {
      return false
    }

    if (filters.jobType && job.jobType !== filters.jobType) return false
    if (filters.companySize && job.companySize !== filters.companySize) {
      return false
    }
    if (filters.salaryRange && job.salaryRange !== filters.salaryRange) {
      return false
    }
    if (filters.workMode && job.workMode !== filters.workMode) return false
    if (filters.experience && job.experience !== filters.experience) {
      return false
    }

    if (normalizedLocation) {
      const locationHaystack = `${job.location} ${job.workMode}`.toLowerCase()
      if (!locationHaystack.includes(normalizedLocation)) return false
    }

    if (!normalizedQuery) return true

    const haystack = [
      job.title,
      job.company,
      job.jobType,
      job.workMode,
      job.experience,
      job.location,
      job.salaryRange,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery)
  })
}

export function sortMyJobs(
  jobs: MyJob[],
  sortBy: MyJobsSortOption,
): MyJob[] {
  const sorted = [...jobs]

  switch (sortBy) {
    case 'relevance':
      return sorted.sort((a, b) => b.relevanceScore - a.relevanceScore)
    case 'match':
      return sorted.sort((a, b) => b.resumeMatchScore - a.resumeMatchScore)
    case 'posted':
      return sorted.sort((a, b) => {
        const daysA = parsePostedDays(a.postedAgo)
        const daysB = parsePostedDays(b.postedAgo)
        return daysA - daysB
      })
    default: {
      const _exhaustive: never = sortBy
      return _exhaustive
    }
  }
}

function parsePostedDays(postedAgo: string): number {
  const match = postedAgo.match(/(\d+)\s*(Day|Week|Month)/i)
  if (!match) return Number.MAX_SAFE_INTEGER
  const value = Number(match[1])
  const unit = match[2].toLowerCase()
  if (unit.startsWith('week')) return value * 7
  if (unit.startsWith('month')) return value * 30
  return value
}

export function getSuggestedJobs(
  jobs: MyJob[],
  selectedJobId: string,
  limit = 3,
): MyJob[] {
  return jobs.filter((job) => job.id !== selectedJobId).slice(0, limit)
}

export const RECOMMENDED_MATCH_TOTAL = 24

export const DEFAULT_RECOMMENDED_MATCH_SUMMARY =
  'Matches 5 of 6 skills · Riyadh · your preferred salary band'

const RECOMMENDED_JOB_IDS = [
  'job-1',
  'job-2',
  'job-3',
  'job-4',
  'job-6',
] as const

export type RecommendedJob = MyJob & {
  matchSummary: string
}

export function getRecommendedJobs(jobs: MyJob[]): RecommendedJob[] {
  return RECOMMENDED_JOB_IDS.flatMap((id) => {
    const job = jobs.find((item) => item.id === id)
    if (!job) return []
    return [{ ...job, matchSummary: DEFAULT_RECOMMENDED_MATCH_SUMMARY }]
  })
}
