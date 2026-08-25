import type { JobListing } from '../../../data/jobs'
import {
  defaultCreateJobForm,
  type CreateJobFormState,
} from './types'

/**
 * Map a jobs-list card into the create-job form shape for View/Edit panel.
 * Fills known listing fields; keeps analyzer / board defaults for demo completeness.
 */
export function jobListingToCreateForm(job: JobListing): CreateJobFormState {
  const locationParts = job.location
    .split(',')
    .map((part: string) => part.trim())
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
  const location =
    [form.primaryCity, form.primaryState, form.primaryCountry]
      .filter(Boolean)
      .join(', ') || job.location

  return {
    ...job,
    code: form.jobReqId.trim() || job.code,
    title: form.jobTitle.trim() || job.title,
    location,
    department: form.department.trim() || job.department,
    recruiter: form.supportRecruiter.trim() || job.recruiter,
    client: form.client.trim() || job.client,
    project: form.project.trim() || job.project,
    jobType: form.jobType.trim() || job.jobType,
    jobCategory: form.jobCategory.trim() || job.jobCategory,
    jobSubCategory: form.jobSubCategory.trim() || job.jobSubCategory,
  }
}
