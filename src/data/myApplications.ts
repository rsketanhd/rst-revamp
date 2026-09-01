export type ApplicationPipelineStageId =
  | 'submitted'
  | 'under-review'
  | 'interview'
  | 'offered'
  | 'hired'

export type ApplicationTimelineStatus = 'completed' | 'current' | 'upcoming'

export type ApplicationTimelineStage = {
  id: ApplicationPipelineStageId
  label: string
  status: ApplicationTimelineStatus
  date?: string
}

export type MyApplication = {
  id: string
  jobTitle: string
  location: string
  jobType: string
  experience: string
  department: string
  dateApplied: string
  lastUpdated: string
  currentStageId: ApplicationPipelineStageId
}

export const APPLICATION_PIPELINE_STAGES: Array<{
  id: ApplicationPipelineStageId
  label: string
}> = [
  { id: 'submitted', label: 'Application Submitted' },
  { id: 'under-review', label: 'Under Review' },
  { id: 'interview', label: 'Interview' },
  { id: 'offered', label: 'Offered' },
  { id: 'hired', label: 'Hired' },
]

const STAGE_DATES: Record<ApplicationPipelineStageId, string> = {
  submitted: 'Feb 2, 2019',
  'under-review': 'Feb 5, 2019',
  interview: 'Feb 12, 2019',
  offered: 'Feb 20, 2019',
  hired: 'Mar 1, 2019',
}

export const MY_APPLICATIONS: MyApplication[] = [
  {
    id: 'app-1',
    jobTitle: 'Networking Engineer',
    location: 'New York, NY',
    jobType: 'Hybrid',
    experience: '2-5 Years',
    department: 'Support',
    dateApplied: 'Feb 2, 2019',
    lastUpdated: '3 days ago',
    currentStageId: 'under-review',
  },
  {
    id: 'app-2',
    jobTitle: 'UI/UX Designer',
    location: 'Washington',
    jobType: 'Remote',
    experience: '4-5 Years',
    department: 'UI/UX Design',
    dateApplied: 'Feb 2, 2019',
    lastUpdated: '3 days ago',
    currentStageId: 'interview',
  },
  {
    id: 'app-3',
    jobTitle: 'Data Scientist',
    location: 'New York, NY',
    jobType: 'Full Time',
    experience: '0-2 Years',
    department: 'Data Science',
    dateApplied: 'Feb 2, 2019',
    lastUpdated: '3 days ago',
    currentStageId: 'submitted',
  },
]

export function getMyApplications(): MyApplication[] {
  return MY_APPLICATIONS.map((application) => ({ ...application }))
}

export function getMyApplicationById(id: string): MyApplication | undefined {
  return MY_APPLICATIONS.find((application) => application.id === id)
}

export function buildApplicationTimeline(
  currentStageId: ApplicationPipelineStageId,
): ApplicationTimelineStage[] {
  const currentIndex = APPLICATION_PIPELINE_STAGES.findIndex(
    (stage) => stage.id === currentStageId,
  )

  return APPLICATION_PIPELINE_STAGES.map((stage, index) => {
    let status: ApplicationTimelineStatus = 'upcoming'
    if (index < currentIndex) status = 'completed'
    else if (index === currentIndex) status = 'current'

    return {
      id: stage.id,
      label: stage.label,
      status,
      date:
        status === 'completed' || status === 'current'
          ? STAGE_DATES[stage.id]
          : undefined,
    }
  })
}

export function filterMyApplications(
  applications: MyApplication[],
  query: string,
  filters: MyApplicationFilters = emptyMyApplicationFilters,
): MyApplication[] {
  const normalized = query.trim().toLowerCase()

  return applications.filter((application) => {
    if (!matchesMyApplicationFilters(application, filters)) return false
    if (!normalized) return true

    const haystack = [
      application.jobTitle,
      application.location,
      application.jobType,
      application.experience,
      application.department,
      application.dateApplied,
      application.lastUpdated,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalized)
  })
}

export type MyApplicationFilters = {
  jobType: string
  experience: string
  department: string
  location: string
  status: ApplicationPipelineStageId | ''
}

export const emptyMyApplicationFilters: MyApplicationFilters = {
  jobType: '',
  experience: '',
  department: '',
  location: '',
  status: '',
}

export type MyApplicationFilterOptions = {
  jobType: string[]
  experience: string[]
  department: string[]
  location: string[]
}

export function getMyApplicationFilterOptions(
  applications: MyApplication[],
): MyApplicationFilterOptions {
  const unique = (values: string[]) => [...new Set(values)].sort()

  return {
    jobType: unique(applications.map((application) => application.jobType)),
    experience: unique(applications.map((application) => application.experience)),
    department: unique(applications.map((application) => application.department)),
    location: unique(applications.map((application) => application.location)),
  }
}

export function countMyApplicationFilters(
  filters: MyApplicationFilters,
): number {
  let count = 0
  if (filters.jobType) count += 1
  if (filters.experience) count += 1
  if (filters.department) count += 1
  if (filters.location) count += 1
  if (filters.status) count += 1
  return count
}

export function matchesMyApplicationFilters(
  application: MyApplication,
  filters: MyApplicationFilters,
): boolean {
  if (filters.jobType && application.jobType !== filters.jobType) return false
  if (filters.experience && application.experience !== filters.experience) {
    return false
  }
  if (filters.department && application.department !== filters.department) {
    return false
  }
  if (filters.location && application.location !== filters.location) {
    return false
  }
  if (filters.status && application.currentStageId !== filters.status) {
    return false
  }

  return true
}
