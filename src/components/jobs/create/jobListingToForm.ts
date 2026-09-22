import { JOBS, type JobListing, type JobMetric, type JobStatus } from '../../../data/jobs'
import { getExtraJobs, upsertExtraJob } from '../../../data/jobStore'
import type { AiCreateJobNavState } from './aiCreateJobData'
import {
  defaultCreateJobForm,
  type CreateJobFormState,
} from './types'

function trimmedOr(value: string, fallback: string): string {
  return value.trim() || fallback
}

function locationFromForm(form: CreateJobFormState, fallback: string): string {
  return (
    [form.primaryCity, form.primaryState, form.primaryCountry]
      .filter(Boolean)
      .join(', ') || fallback
  )
}

const ZERO_METRICS: JobMetric[] = [
  { label: 'Applications', value: 0 },
  { label: 'Recommendations', value: 0 },
  { label: 'Total Views', value: 0 },
  { label: 'Interviews', value: 0 },
  { label: 'Offered', value: 0 },
]

/**
 * Map a jobs-list card into the create-job form shape for View/Edit panel.
 * Fills known listing fields; keeps analyzer / board defaults for demo completeness.
 */
export function jobListingToCreateForm(job: JobListing): CreateJobFormState {
  const locationParts = job.location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  const primaryCity = locationParts[0] ?? job.location
  const primaryState = locationParts.length > 2 ? locationParts[1] : ''
  const primaryCountry =
    locationParts.length >= 2
      ? (locationParts[locationParts.length - 1] ?? '')
      : ''

  return {
    ...defaultCreateJobForm,
    method: 'scratch',
    jobReqId: job.code,
    jobTitle: job.title,
    jobDescription: `Job Title: ${job.title}
Department: ${job.department}
Client: ${job.client}
Location: ${job.location}
Employment Type: ${job.jobType}
Openings: ${job.openings}
Lead Recruiter: ${job.recruiter}`,

    primaryCity,
    primaryState,
    primaryCountry,
    client: job.client,
    project: job.project,
    department: job.department,
    supportRecruiter: job.recruiter,
    startDate: job.createdAt,
    endDate: job.updatedAt,
    jobCategory: job.jobCategory,
    jobSubCategory: job.jobSubCategory,
    jobType: job.jobType,
    locationRequirement:
      job.location.toLowerCase() === 'remote' ? 'Remote' : 'Hybrid',

    criteria: defaultCreateJobForm.criteria.map((item) =>
      item.id === 'jobTitle'
        ? { ...item, value: job.title }
        : item,
    ),

    clientContact: job.recruiter,
    clientIndustry: job.jobCategory,

    rsPlusEnabled: true,
    linkedInEnabled: job.isMine,
    linkedInConnected: job.isMine,
    linkedInKeywords: job.title,
    linkedInLocations: [job.location],
    linkedInJobTitles: [job.title],
    linkedInLastSynced: job.lastActivity,
    locations: [job.location],
  }
}

/** Apply View/Edit form fields back onto the jobs-list card. */
export function applyCreateFormToListing(
  job: JobListing,
  form: CreateJobFormState,
): JobListing {
  return {
    ...job,
    code: trimmedOr(form.jobReqId, job.code),
    title: trimmedOr(form.jobTitle, job.title),
    location: locationFromForm(form, job.location),
    department: trimmedOr(form.department, job.department),
    recruiter: trimmedOr(form.supportRecruiter, job.recruiter),
    client: trimmedOr(form.client, job.client),
    project: trimmedOr(form.project, job.project),
    jobType: trimmedOr(form.jobType, job.jobType),
    jobCategory: trimmedOr(form.jobCategory, job.jobCategory),
    jobSubCategory: trimmedOr(form.jobSubCategory, job.jobSubCategory),
  }
}

function todayIsoDate(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** Build a new jobs-list card from the create-job wizard (draft or published). */
export function createListingFromForm(
  form: CreateJobFormState,
  status: JobStatus,
): JobListing {
  const now = Date.now()
  const isoDate = todayIsoDate()

  return {
    id: `job-${now}`,
    code: trimmedOr(form.jobReqId, `DFT${String(now).slice(-6)}`),
    title: trimmedOr(form.jobTitle, 'Untitled Job'),
    location: locationFromForm(form, '—'),
    department: trimmedOr(form.department, '—'),
    postedAgo: 'Just now',
    createdAt: isoDate,
    updatedAt: isoDate,
    recruiter: trimmedOr(form.supportRecruiter, '—'),
    openings: '01',
    lastActivity: 'Just now',
    status,
    isMine: true,
    client: trimmedOr(form.client, '—'),
    jobType: trimmedOr(form.jobType, '—'),
    jobCategory: trimmedOr(form.jobCategory, '—'),
    jobSubCategory: trimmedOr(form.jobSubCategory, '—'),
    brand: trimmedOr(form.industry, '—'),
    project: trimmedOr(form.project, '—'),
    metrics: ZERO_METRICS.map((metric) => ({ ...metric })),
  }
}

/** Persist a wizard/AI draft and return the stored listing. */
export function persistDraftListing(form: CreateJobFormState): JobListing {
  const listing = createListingFromForm(form, 'draft')
  upsertExtraJob(listing)
  return listing
}

function titleFromText(text: string): string {
  const firstLine = text.split('\n')[0]?.trim() ?? ''
  return firstLine.slice(0, 80)
}

function templateJobs(): JobListing[] {
  const extras = getExtraJobs()
  const extraIds = new Set(extras.map((job) => job.id))
  return [...extras, ...JOBS.filter((job) => !extraIds.has(job.id))]
}

/**
 * Seed the manual create wizard from Skip to Manual (prompt and/or similar job).
 * Copy picker is the default; a prompt with no selected job opens Upload JD.
 */
export function createFormFromAiNavState(
  state: AiCreateJobNavState | null,
): CreateJobFormState {
  if (!state) return defaultCreateJobForm

  const prompt = state.aiPrompt?.trim() ?? ''

  if (state.aiContinue) {
    return {
      ...defaultCreateJobForm,
      method: 'scratch',
      aiEntry: true,
      providedRole: prompt,
      jobTitle: defaultCreateJobForm.jobTitle,
      jobDescription: `Job Overview
${defaultCreateJobForm.jobDescription}`,
    }
  }
  const jobs = templateJobs()
  const match = state.similarJobId
    ? jobs.find((job) => job.id === state.similarJobId)
    : state.similarJobTitle
      ? jobs.find(
          (job) =>
            job.title.toLowerCase() === state.similarJobTitle?.toLowerCase(),
        )
      : undefined

  if (match) {
    const mapped = jobListingToCreateForm(match)
    return {
      ...mapped,
      method: 'copy',
      sourceJobId: match.id,
      jobDescription: prompt || mapped.jobDescription,
    }
  }

  if (state.similarJobTitle) {
    return {
      ...defaultCreateJobForm,
      method: 'copy',
      sourceJobId: state.similarJobId ?? state.similarJobTitle,
      jobTitle: state.similarJobTitle,
      department: state.similarJobDepartment ?? '',
      jobDescription: prompt || defaultCreateJobForm.jobDescription,
      primaryCity: '',
      primaryState: '',
      primaryCountry: '',
    }
  }

  if (prompt) {
    return {
      ...defaultCreateJobForm,
      method: 'upload',
      jobTitle: titleFromText(prompt),
      jobDescription: prompt,
    }
  }

  if (state.manualEntry) {
    return {
      ...defaultCreateJobForm,
      method: 'copy',
      sourceJobId: '',
    }
  }

  return defaultCreateJobForm
}

/** Persist an AI-prompt draft (title from the first line). */
export function persistDraftFromPrompt(description: string): JobListing {
  const trimmed = description.trim()
  return persistDraftListing({
    ...defaultCreateJobForm,
    method: 'scratch',
    jobTitle: titleFromText(trimmed),
    jobDescription: trimmed,
  })
}
