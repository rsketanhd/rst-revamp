export type JobStatus = 'active' | 'inactive'

export type JobMetric = {
  label: string
  value: number
}

export type JobListing = {
  id: string
  code: string
  title: string
  location: string
  department: string
  postedAgo: string
  /** YYYY-MM-DD — used by Posted On filter */
  createdAt: string
  /** YYYY-MM-DD — used by Updated On filter */
  updatedAt: string
  recruiter: string
  openings: string
  lastActivity: string
  status: JobStatus
  /** true = appears under My Jobs */
  isMine: boolean
  client: string
  jobType: string
  jobCategory: string
  jobSubCategory: string
  brand: string
  project: string
  metrics: JobMetric[]
}

const TITLES = [
  'UI/UX Designer',
  'Frontend Developer',
  'Product Manager',
  'Data Analyst',
  'Backend Engineer',
  'HR Specialist',
  'DevOps Engineer',
  'QA Engineer',
  'Sales Executive',
  'Marketing Manager',
  'Mobile Developer',
  'Business Analyst',
]

const LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Remote',
  'London, UK',
  'Bangalore, IN',
  'Chicago, IL',
  'Seattle, WA',
]

const DEPARTMENTS = [
  'Design',
  'Engineering',
  'Product',
  'Analytics',
  'People Ops',
  'Sales',
  'Marketing',
]

const RECRUITERS = [
  'Sarah Johnson',
  'Michael Chen',
  'Priya Shah',
  'David Park',
  'Aisha Khan',
  'James Wilson',
  'Elena Rossi',
]

const CLIENTS = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella Health',
  'Stark Industries',
  'Wayne Enterprises',
]

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
const CATEGORIES = ['Engineering', 'Design', 'Product', 'Sales', 'Marketing']
const SUB_CATEGORIES = ['Frontend', 'Backend', 'UI/UX', 'Research']
const BRANDS = ['Recruitment SMART', 'RS Talent', 'RS Plus']
const PROJECTS = ['Project Alpha', 'Project Beta', 'Project Gamma']

const RELATIVE_TIMES = [
  '2 mins ago',
  '15 mins ago',
  '30 mins ago',
  '1 hour ago',
  '3 hours ago',
  '1 day ago',
  '2 days ago',
  '1 week ago',
]

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function buildMetrics(seed: number): JobMetric[] {
  const applications = 12 + ((seed * 17) % 90)
  const recommendations = 2 + ((seed * 7) % 28)
  const views = 30 + ((seed * 23) % 160)
  const interviews = 1 + ((seed * 5) % 18)
  const offered = (seed * 3) % 6
  return [
    { label: 'Applications', value: applications },
    { label: 'Recommendations', value: recommendations },
    { label: 'Total Views', value: views },
    { label: 'Interviews', value: interviews },
    { label: 'Offered', value: offered },
  ]
}

/** Demo catalog — large enough to exercise lazy loading + filters. */
export const JOBS: JobListing[] = Array.from({ length: 36 }, (_, index) => {
  const n = index + 1
  const title = TITLES[index % TITLES.length]
  const day = pad2(1 + (index % 28))
  const month = pad2(1 + (index % 8))
  const createdAt = `2024-${month}-${day}`
  const updatedDay = pad2(1 + ((index + 3) % 28))
  const updatedAt = `2024-${pad2(1 + ((index + 1) % 8))}-${updatedDay}`
  const status: JobStatus = index % 4 === 0 ? 'inactive' : 'active'
  const isMine = index % 3 !== 2

  return {
    id: String(n),
    code: `RST${1340 + n}`,
    title,
    location: LOCATIONS[index % LOCATIONS.length],
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    postedAgo: RELATIVE_TIMES[index % RELATIVE_TIMES.length],
    createdAt,
    updatedAt,
    recruiter: RECRUITERS[index % RECRUITERS.length],
    openings: pad2(1 + (index % 6)),
    lastActivity: RELATIVE_TIMES[(index + 2) % RELATIVE_TIMES.length],
    status,
    isMine,
    client: CLIENTS[index % CLIENTS.length],
    jobType: JOB_TYPES[index % JOB_TYPES.length],
    jobCategory: CATEGORIES[index % CATEGORIES.length],
    jobSubCategory: SUB_CATEGORIES[index % SUB_CATEGORIES.length],
    brand: BRANDS[index % BRANDS.length],
    project: PROJECTS[index % PROJECTS.length],
    metrics: buildMetrics(n),
  }
})

export type JobStats = {
  activeJobs: number
  totalApplicants: number
  totalRecommendations: number
  totalOffers: number
}

function metricTotal(jobs: JobListing[], label: string): number {
  return jobs.reduce((sum, job) => {
    const metric = job.metrics.find((item) => item.label === label)
    return sum + (metric?.value ?? 0)
  }, 0)
}

/** KPI cards — based on jobs in the current My/All scope (not Active/Inactive list filter). */
export function computeJobStats(jobs: JobListing[]): JobStats {
  return {
    activeJobs: jobs.filter((job) => job.status === 'active').length,
    totalApplicants: metricTotal(jobs, 'Applications'),
    totalRecommendations: metricTotal(jobs, 'Recommendations'),
    totalOffers: metricTotal(jobs, 'Offered'),
  }
}

export type JobListFilters = {
  status: JobStatus
  scope: 'my' | 'all'
  recruiterQuery: string
  postedOn: string
  updatedOn: string
  jobReqIds: string[]
  jobTitles: string[]
  leadRecruiters: string[]
  locations: string[]
  clients: string[]
  jobType: string
  jobCategory: string
  jobSubCategory: string
  brand: string
  project: string
}

export function filterJobs(
  jobs: JobListing[],
  filters: JobListFilters,
): JobListing[] {
  const recruiterQ = filters.recruiterQuery.trim().toLowerCase()

  return jobs.filter((job) => {
    if (job.status !== filters.status) return false
    if (filters.scope === 'my' && !job.isMine) return false

    if (recruiterQ && !job.recruiter.toLowerCase().includes(recruiterQ)) {
      return false
    }
    if (filters.postedOn && job.createdAt !== filters.postedOn) return false
    if (filters.updatedOn && job.updatedAt !== filters.updatedOn) return false

    if (
      filters.jobReqIds.length > 0 &&
      !filters.jobReqIds.includes(job.code)
    ) {
      return false
    }
    if (
      filters.jobTitles.length > 0 &&
      !filters.jobTitles.includes(job.title)
    ) {
      return false
    }
    if (
      filters.leadRecruiters.length > 0 &&
      !filters.leadRecruiters.includes(job.recruiter)
    ) {
      return false
    }
    if (
      filters.locations.length > 0 &&
      !filters.locations.includes(job.location)
    ) {
      return false
    }
    if (
      filters.clients.length > 0 &&
      !filters.clients.includes(job.client)
    ) {
      return false
    }
    if (filters.jobType && job.jobType !== filters.jobType) return false
    if (filters.jobCategory && job.jobCategory !== filters.jobCategory) {
      return false
    }
    if (
      filters.jobSubCategory &&
      job.jobSubCategory !== filters.jobSubCategory
    ) {
      return false
    }
    if (filters.brand && job.brand !== filters.brand) return false
    if (filters.project && job.project !== filters.project) return false

    return true
  })
}

export function formatStat(value: number): string {
  return String(value)
}
