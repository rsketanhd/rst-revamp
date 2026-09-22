import type { JobListing } from './jobs'

const STORAGE_KEY = 'rst_extra_jobs'

function sessionStore(): Storage | null {
  return typeof sessionStorage === 'undefined' ? null : sessionStorage
}

function readStore(): JobListing[] {
  const raw = sessionStore()?.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as JobListing[]) : []
  } catch {
    return []
  }
}

function writeStore(jobs: JobListing[]): void {
  sessionStore()?.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

function saveJob(job: JobListing, mode: 'upsert' | 'patch'): void {
  const jobs = readStore()
  const index = jobs.findIndex((item) => item.id === job.id)
  if (index >= 0) {
    jobs[index] = job
  } else if (mode === 'upsert') {
    jobs.unshift(job)
  } else {
    return
  }
  writeStore(jobs)
}

/** Jobs created in this session (drafts and newly posted listings). */
export function getExtraJobs(): JobListing[] {
  return readStore()
}

export function upsertExtraJob(job: JobListing): JobListing {
  saveJob(job, 'upsert')
  return job
}

/** Update a session job in place; no-op for catalog jobs that are not stored. */
export function patchExtraJob(job: JobListing): void {
  saveJob(job, 'patch')
}

/** Remove a session job; no-op when the id is not in the extra-jobs store. */
export function removeExtraJob(jobId: string): void {
  writeStore(readStore().filter((item) => item.id !== jobId))
}
