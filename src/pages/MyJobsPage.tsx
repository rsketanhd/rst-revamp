import { useEffect, useMemo, useRef, useState } from 'react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  MyJobDetailsSection,
  MyJobFitCriteriaPanel,
  MyJobsFiltersBar,
  MyJobsFiltersPanel,
  MyJobsListPanel,
  MyJobsSearchBar,
  ResumeUploadSection,
  type ResumeUploadSectionHandle,
} from '../components/my-jobs'
import {
  countMyJobsFilters,
  emptyMyJobsFilters,
  filterMyJobs,
  getMyJobs,
  getSuggestedJobs,
  MY_JOBS_FILTER_OPTIONS,
  sortMyJobs,
  type MyJob,
  type MyJobsFilters,
  type MyJobsSortOption,
} from '../data/myJobs'

const DEMO_TOTAL_JOBS = 1045

/**
 * Candidate portal — My Jobs browse with resume-based matching.
 */
export function MyJobsPage() {
  const allJobs = useMemo(() => getMyJobs(), [])
  const resumeUploadRef = useRef<ResumeUploadSectionHandle>(null)
  const [resumeFileName, setResumeFileName] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [appliedLocationQuery, setAppliedLocationQuery] = useState('')
  const [filters, setFilters] = useState<MyJobsFilters>(emptyMyJobsFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<MyJobsSortOption>('relevance')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    () => allJobs[0]?.id ?? null,
  )

  const hasResume = resumeFileName !== null
  const activeFilterCount = countMyJobsFilters(filters)

  const filteredJobs = useMemo(() => {
    const results = filterMyJobs(
      allJobs,
      appliedQuery,
      appliedLocationQuery,
      filters,
      hasResume,
    )
    return sortMyJobs(results, sortBy)
  }, [allJobs, appliedQuery, appliedLocationQuery, filters, hasResume, sortBy])

  const selectedJob = useMemo(
    () => filteredJobs.find((job) => job.id === selectedJobId) ?? null,
    [filteredJobs, selectedJobId],
  )

  const suggestedJobs = useMemo(
    () =>
      selectedJob
        ? getSuggestedJobs(filteredJobs, selectedJob.id)
        : [],
    [filteredJobs, selectedJob],
  )

  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedJobId(null)
      return
    }

    const stillVisible = filteredJobs.some((job) => job.id === selectedJobId)
    if (!stillVisible) {
      setSelectedJobId(filteredJobs[0]?.id ?? null)
    }
  }, [filteredJobs, selectedJobId])

  function handleResumeUpload(file: File) {
    setResumeFileName(file.name)
  }

  function handleResumeRemove() {
    setResumeFileName(null)
  }

  function handleSearch() {
    setAppliedQuery(query)
    setAppliedLocationQuery(locationQuery)
  }

  function handleClearAllFilters() {
    setFilters(emptyMyJobsFilters)
  }

  function handleInlineFilterChange(patch: Partial<MyJobsFilters>) {
    setFilters((current) => ({ ...current, ...patch }))
  }

  function handleSelectJob(job: MyJob) {
    setSelectedJobId(job.id)
  }

  return (
    <>
      <PageContainer
        className="overflow-hidden"
        contentClassName="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden"
      >
        <PageHeader
          title="My Jobs"
          subtitle="Browse and manage jobs relevant to your profile."
        />

        <ResumeUploadSection
          ref={resumeUploadRef}
          className="mt-5 shrink-0"
          fileName={resumeFileName}
          onUpload={handleResumeUpload}
          onRemove={handleResumeRemove}
        />

        <div className="mt-3 shrink-0 space-y-2.5 rounded-lg bg-[#F5F6FF] p-3 sm:p-4">
          <MyJobsSearchBar
            query={query}
            locationQuery={locationQuery}
            onQueryChange={setQuery}
            onLocationChange={setLocationQuery}
            onSearch={handleSearch}
          />

          <MyJobsFiltersBar
            jobType={filters.jobType}
            companySize={filters.companySize}
            salaryRange={filters.salaryRange}
            jobTypeOptions={MY_JOBS_FILTER_OPTIONS.jobType}
            companySizeOptions={MY_JOBS_FILTER_OPTIONS.companySize}
            salaryRangeOptions={MY_JOBS_FILTER_OPTIONS.salaryRange}
            onJobTypeChange={(value) =>
              handleInlineFilterChange({ jobType: value })
            }
            onCompanySizeChange={(value) =>
              handleInlineFilterChange({ companySize: value })
            }
            onSalaryRangeChange={(value) =>
              handleInlineFilterChange({ salaryRange: value })
            }
            onAllFiltersClick={() => setFiltersOpen(true)}
            onClearAll={handleClearAllFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <div className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden rounded-lg border border-[#E8E6F0] bg-white lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)_minmax(280px,340px)]">
          <MyJobsListPanel
            className="max-h-[28rem] lg:max-h-none"
            jobs={filteredJobs}
            selectedJobId={selectedJobId}
            totalCount={DEMO_TOTAL_JOBS}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onSelectJob={handleSelectJob}
          />

          <MyJobDetailsSection
            className="max-h-[28rem] border-t border-[#E8E6F0] lg:max-h-none lg:border-t-0"
            job={selectedJob}
            suggestedJobs={suggestedJobs}
            onSelectJob={handleSelectJob}
          />

          <MyJobFitCriteriaPanel
            className="max-h-[28rem] border-t border-[#E8E6F0] lg:max-h-none lg:border-t-0"
            job={selectedJob}
            hasResume={hasResume}
            onUploadResume={() => resumeUploadRef.current?.openFilePicker()}
          />
        </div>
      </PageContainer>

      <MyJobsFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={setFilters}
      />
    </>
  )
}
