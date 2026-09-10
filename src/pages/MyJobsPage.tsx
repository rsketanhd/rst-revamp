import { useEffect, useMemo, useState } from 'react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  MyJobDetailsSection,
  MyJobsFiltersBar,
  MyJobsFiltersPanel,
  MyJobsListPanel,
  MyJobsSearchBar,
  RecommendedJobsSection,
} from '../components/my-jobs'
import {
  countMyJobsFilters,
  emptyMyJobsFilters,
  filterMyJobs,
  getMyJobs,
  getRecommendedJobs,
  RECOMMENDED_MATCH_TOTAL,
  MY_JOBS_FILTER_OPTIONS,
  type MyJob,
  type MyJobsFilters,
} from '../data/myJobs'

const DEMO_TOTAL_JOBS = 1045

/**
 * Candidate portal — All Jobs browse.
 */
export function MyJobsPage() {
  const allJobs = useMemo(() => getMyJobs(), [])
  const [query, setQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [appliedLocationQuery, setAppliedLocationQuery] = useState('')
  const [filters, setFilters] = useState<MyJobsFilters>(emptyMyJobsFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [showRecommended, setShowRecommended] = useState(false)
  const [savedJobIds, setSavedJobIds] = useState<string[]>([])
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    () => allJobs[0]?.id ?? null,
  )

  const activeFilterCount = countMyJobsFilters(filters)

  const filteredJobs = useMemo(
    () =>
      filterMyJobs(
        allJobs,
        appliedQuery,
        appliedLocationQuery,
        filters,
        false,
      ),
    [allJobs, appliedQuery, appliedLocationQuery, filters],
  )

  const selectedJob = useMemo(
    () => filteredJobs.find((job) => job.id === selectedJobId) ?? null,
    [filteredJobs, selectedJobId],
  )

  const recommendedJobs = useMemo(
    () => getRecommendedJobs(allJobs),
    [allJobs],
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

  function handleToggleSave(job: MyJob) {
    setSavedJobIds((current) =>
      current.includes(job.id)
        ? current.filter((id) => id !== job.id)
        : [...current, job.id],
    )
  }

  function handleToggleApply(job: MyJob) {
    setAppliedJobIds((current) =>
      current.includes(job.id)
        ? current.filter((id) => id !== job.id)
        : [...current, job.id],
    )
  }

  return (
    <>
      <PageContainer
        className="overflow-hidden"
        contentClassName="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden"
      >
        <PageHeader
          title="All Jobs"
          subtitle="Browse and manage jobs relevant to your profile."
        />

        <div className="mt-5 shrink-0 space-y-2.5">
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

        <RecommendedJobsSection
          className="mt-4 shrink-0"
          expanded={showRecommended}
          onExpandedChange={setShowRecommended}
          jobs={recommendedJobs}
          totalMatchCount={RECOMMENDED_MATCH_TOTAL}
          onSelectJob={handleSelectJob}
        />

        <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)]">
          <MyJobsListPanel
            className="max-h-[28rem] lg:max-h-none"
            jobs={filteredJobs}
            selectedJobId={selectedJobId}
            appliedJobIds={appliedJobIds}
            totalCount={DEMO_TOTAL_JOBS}
            onSelectJob={handleSelectJob}
          />

          <MyJobDetailsSection
            className="max-h-[28rem] lg:max-h-none"
            job={selectedJob}
            saved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
            applied={selectedJob ? appliedJobIds.includes(selectedJob.id) : false}
            onToggleSave={handleToggleSave}
            onToggleApply={handleToggleApply}
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
