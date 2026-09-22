import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { cn } from '../lib/cn'
import {
  coerceJobStatus,
  computeJobStats,
  filterJobs,
  formatStat,
  isJobStatusFilter,
  JOBS,
  JOB_STATUS_FILTER_OPTIONS,
  jobStatusPillOption,
  type JobListing,
  type JobStatusFilter,
} from '../data/jobs'
import { getExtraJobs, patchExtraJob, removeExtraJob, upsertExtraJob } from '../data/jobStore'
import {
  BulkActionsBar,
  FilterSortPanel,
  JobCardMenu,
  JOB_CARD_ACTIONS,
  jobCardActionsForStatus,
  AppTopBar,
  ConfirmDeleteModal,
  SegmentedControl,
  Tooltip,
  toast,
  countActiveFilters,
  emptyFilterSortValues,
  ChangeStatusPopover,
  JOB_CHANGE_STATUS_OPTIONS,
  jobChangeStatusLabel,
  StatusPillBadge,
  type FilterSortValues,
  type JobCardActionId,
  type ChangeableJobStatus,
} from '../components/ui'
import { JobViewEditPanel } from '../components/jobs/JobViewEditPanel'
import { AiCreateJobFlow } from '../components/jobs/create/AiCreateJobFlow'
import { applyCreateFormToListing } from '../components/jobs/create/jobListingToForm'
import { PageHeader } from '../components/layout'

type JobScope = 'my' | 'all'

/** Jobs rendered per lazy-load page. */
const PAGE_SIZE = 5

function defaultStageStatus(jobId: string): ChangeableJobStatus {
  const index = Math.max(0, Number.parseInt(jobId, 10) - 1)
  return (
    JOB_CHANGE_STATUS_OPTIONS[index % JOB_CHANGE_STATUS_OPTIONS.length]?.value ??
    'new'
  )
}

function stageStatusFor(
  jobId: string,
  overrides: Record<string, ChangeableJobStatus>,
): ChangeableJobStatus {
  return overrides[jobId] ?? defaultStageStatus(jobId)
}

function navStatusFilter(state: unknown): JobStatusFilter | undefined {
  const status = (state as { status?: unknown } | null)?.status
  return isJobStatusFilter(status) ? status : undefined
}

function jobsPhrase(count: number): string {
  return `${count} ${count === 1 ? 'job' : 'jobs'}`
}

function reopenActionTitle(action: 'extendReopen' | 'reopen'): string {
  switch (action) {
    case 'extendReopen':
      return 'Extended & reopened'
    case 'reopen':
      return 'Reopened'
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}

function cloneJob(job: JobListing): JobListing {
  return {
    ...job,
    status: coerceJobStatus(job.status),
    metrics: job.metrics.map((metric) => ({ ...metric })),
  }
}

function todayIsoDate(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function duplicateListing(job: JobListing, index = 0): JobListing {
  const now = Date.now() + index
  const isoDate = todayIsoDate()
  return {
    ...cloneJob(job),
    id: `job-${now}`,
    code: `DFT${String(now).slice(-6)}`,
    title: `${job.title} (Copy)`,
    status: 'draft',
    postedAgo: 'Just now',
    lastActivity: 'Just now',
    createdAt: isoDate,
    updatedAt: isoDate,
    isMine: true,
  }
}

function loadListedJobs(): JobListing[] {
  return [...getExtraJobs().map(cloneJob), ...JOBS.map(cloneJob)]
}

export function JobsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState<JobStatusFilter>(
    () => navStatusFilter(location.state) ?? 'all',
  )
  const [scope, setScope] = useState<JobScope>('my')
  const [postedOn, setPostedOn] = useState('')
  const [updatedOn, setUpdatedOn] = useState('')
  const [recruiterQuery, setRecruiterQuery] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<FilterSortValues>(
    emptyFilterSortValues,
  )
  const [jobs, setJobs] = useState<JobListing[]>(loadListedJobs)
  const [detailJob, setDetailJob] = useState<JobListing | null>(null)
  const [aiCreateOpen, setAiCreateOpen] = useState(false)
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false)
  const [pendingDeleteJobs, setPendingDeleteJobs] = useState<JobListing[]>([])
  const [stageStatuses, setStageStatuses] = useState<
    Record<string, ChangeableJobStatus>
  >({})
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadingLockRef = useRef(false)

  const activeFilterCount = countActiveFilters(appliedFilters)

  useEffect(() => {
    const nextStatus = navStatusFilter(location.state)
    if (!nextStatus) return
    setStatus(nextStatus)
    setJobs(loadListedJobs())
  }, [location.state])

  const scopeJobs = useMemo(
    () => jobs.filter((job) => (scope === 'my' ? job.isMine : true)),
    [jobs, scope],
  )

  const stats = useMemo(() => computeJobStats(scopeJobs), [scopeJobs])

  const filteredJobs = useMemo(
    () =>
      filterJobs(jobs, {
        status,
        scope,
        recruiterQuery,
        postedOn,
        updatedOn,
        jobReqIds: appliedFilters.jobReqId,
        jobTitles: appliedFilters.jobTitle,
        leadRecruiters: appliedFilters.leadRecruiter,
        locations: appliedFilters.location,
        clients: appliedFilters.client,
        jobType: appliedFilters.jobType,
        jobCategory: appliedFilters.jobCategory,
        jobSubCategory: appliedFilters.jobSubCategory,
        brand: appliedFilters.brand,
        project: appliedFilters.project,
      }),
    [
      status,
      scope,
      recruiterQuery,
      postedOn,
      updatedOn,
      appliedFilters,
      jobs,
    ],
  )

  // Reset pagination when any filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
    loadingLockRef.current = false
    setLoadingMore(false)
  }, [
    status,
    scope,
    recruiterQuery,
    postedOn,
    updatedOn,
    appliedFilters,
  ])

  const visibleJobs = useMemo(
    () => filteredJobs.slice(0, visibleCount),
    [filteredJobs, visibleCount],
  )

  const hasMore = visibleCount < filteredJobs.length
  const totalFound = filteredJobs.length

  const loadMore = useCallback(() => {
    if (loadingLockRef.current) return
    if (visibleCount >= filteredJobs.length) return

    loadingLockRef.current = true
    setLoadingMore(true)

    // Simulate network page fetch
    window.setTimeout(() => {
      setVisibleCount((current) =>
        Math.min(current + PAGE_SIZE, filteredJobs.length),
      )
      setLoadingMore(false)
      loadingLockRef.current = false
    }, 350)
  }, [filteredJobs.length, visibleCount])

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { root: null, rootMargin: '160px', threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadMore, visibleJobs.length])

  const selectedJobs = useMemo(
    () => filteredJobs.filter((job) => selected[job.id]),
    [filteredJobs, selected],
  )
  const selectedIds = selectedJobs.map((job) => job.id)
  const selectedCount = selectedIds.length
  const allFilteredSelected =
    filteredJobs.length > 0 && selectedCount === filteredJobs.length
  const someFilteredSelected = selectedCount > 0 && !allFilteredSelected

  const bulkStatusValue = useMemo((): ChangeableJobStatus => {
    const statuses = [
      ...new Set(
        selectedJobs.map((job) => stageStatusFor(job.id, stageStatuses)),
      ),
    ]
    return statuses.length === 1 ? statuses[0] : 'new'
  }, [selectedJobs, stageStatuses])

  function toggleSelect(id: string) {
    setSelected((current) => ({ ...current, [id]: !current[id] }))
  }

  function clearSelection() {
    setSelected({})
  }

  function handleSelectAll(checked: boolean) {
    if (!checked) {
      setSelected({})
      return
    }
    setSelected(
      Object.fromEntries(filteredJobs.map((job) => [job.id, true])),
    )
  }

  function openJobDetail(job: JobListing) {
    setDetailJob(job)
  }

  function applyStageStatus(ids: string[], nextStatus: ChangeableJobStatus) {
    setStageStatuses((current) => ({
      ...current,
      ...Object.fromEntries(ids.map((id) => [id, nextStatus])),
    }))
  }

  function replaceListing(next: JobListing) {
    patchExtraJob(next)
    setJobs((current) =>
      current.map((item) => (item.id === next.id ? next : item)),
    )
    setDetailJob((current) => (current?.id === next.id ? next : current))
  }

  function removeListings(targets: JobListing[]) {
    const ids = new Set(targets.map((job) => job.id))
    targets.forEach((job) => removeExtraJob(job.id))
    setJobs((current) => current.filter((job) => !ids.has(job.id)))
    setSelected((current) => {
      const next = { ...current }
      ids.forEach((id) => {
        delete next[id]
      })
      return next
    })
    setDetailJob((current) => (current && ids.has(current.id) ? null : current))
  }

  function reopenListing(job: JobListing) {
    const next: JobListing = {
      ...job,
      status: 'active',
      lastActivity: 'Just now',
      updatedAt: todayIsoDate(),
    }
    replaceListing(next)
    return next
  }

  function duplicateJobs(targets: JobListing[]) {
    const copies = targets.map((job, index) => duplicateListing(job, index))
    copies.forEach((copy) => upsertExtraJob(copy))
    setJobs((current) => [...copies, ...current])
    const count = copies.length
    toast.success(
      count === 1
        ? `“${copies[0]?.title}” created as draft.`
        : `${count} jobs duplicated as drafts.`,
      { title: 'Duplicated' },
    )
  }

  function handleJobStatusChange(jobId: string, nextStatus: ChangeableJobStatus) {
    const job = jobs.find((item) => item.id === jobId)
    applyStageStatus([jobId], nextStatus)
    toast.success(
      `“${job?.title ?? 'Job'}” is now ${jobChangeStatusLabel(nextStatus)}.`,
      { title: 'Status updated' },
    )
  }

  function handleJobAction(jobCode: string, action: JobCardActionId) {
    const job = jobs.find((item) => item.code === jobCode)
    if (!job) return

    switch (action) {
      case 'viewEdit':
      case 'viewJob':
        setDetailJob(job)
        return
      case 'changeStatus':
        return
      case 'schedulePublish':
        toast.success(`“${job.title}” is ready to schedule.`, {
          title: 'Schedule publish',
        })
        return
      case 'duplicate':
        duplicateJobs([job])
        return
      case 'delete':
        setPendingDeleteJobs([job])
        return
      case 'extendReopen':
      case 'reopen': {
        const next = reopenListing(job)
        toast.success(`“${next.title}” is active again.`, {
          title: reopenActionTitle(action),
        })
        return
      }
      case 'archive':
        removeListings([job])
        toast.success(`“${job.title}” was archived.`, { title: 'Archived' })
        return
      case 'share':
      case 'interviewTeam':
      case 'oneWayQuestions':
      case 'mask':
        console.info('job action', jobCode, action)
        return
      default: {
        const _exhaustive: never = action
        return _exhaustive
      }
    }
  }

  function handleBulkAction(actionId: string) {
    const action = actionId as JobCardActionId
    switch (action) {
      case 'viewEdit':
      case 'viewJob':
        if (selectedJobs.length === 1) {
          setDetailJob(selectedJobs[0])
        }
        return
      case 'changeStatus':
        setBulkStatusOpen(true)
        return
      case 'schedulePublish':
        toast.success(`${jobsPhrase(selectedCount)} ready to schedule.`, {
          title: 'Schedule publish',
        })
        return
      case 'duplicate':
        duplicateJobs(selectedJobs)
        clearSelection()
        return
      case 'delete':
        setPendingDeleteJobs(selectedJobs)
        return
      case 'extendReopen':
      case 'reopen':
        selectedJobs.forEach((job) => reopenListing(job))
        toast.success(`${jobsPhrase(selectedCount)} set to Active.`, {
          title: reopenActionTitle(action),
        })
        clearSelection()
        return
      case 'archive':
        removeListings(selectedJobs)
        toast.success(`${jobsPhrase(selectedCount)} archived.`, {
          title: 'Archived',
        })
        clearSelection()
        return
      case 'share':
      case 'interviewTeam':
      case 'oneWayQuestions':
      case 'mask':
        console.info('bulk job action', actionId, selectedIds)
        return
      default: {
        const _exhaustive: never = action
        return _exhaustive
      }
    }
  }

  function confirmPendingDelete() {
    const targets = pendingDeleteJobs
    if (targets.length === 0) return
    removeListings(targets)
    const count = targets.length
    toast.success(
      count === 1
        ? `“${targets[0]?.title}” was deleted.`
        : `${count} jobs were deleted.`,
      { title: 'Deleted' },
    )
    setPendingDeleteJobs([])
    clearSelection()
  }

  function handleBulkStatusSave(nextStatus: ChangeableJobStatus) {
    applyStageStatus(selectedIds, nextStatus)
    const count = selectedIds.length
    toast.success(
      `${jobsPhrase(count)} set to ${jobChangeStatusLabel(nextStatus)}.`,
      { title: 'Status updated' },
    )
    clearSelection()
  }

  function openApplications(jobCode: string) {
    navigate(`/jobs/${jobCode}/applications`)
  }

  const statCards = [
    { label: 'Active Jobs', value: stats.activeJobs },
    { label: 'Total Applicants', value: stats.totalApplicants },
    { label: 'Total Recommendations', value: stats.totalRecommendations },
    { label: 'Total Offers', value: stats.totalOffers },
  ]

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto bg-white">
      <AppTopBar />

      <div className="flex min-w-0 flex-1 flex-col bg-white p-4 sm:p-6 lg:p-8">
        <PageHeader
          className="mb-5 sm:mb-6"
          title="Job Management"
          subtitle="Monitor and optimize your job postings performance."
          actions={
            <button
              type="button"
              onClick={() => setAiCreateOpen(true)}
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#241a52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/30 sm:w-auto"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Create New Job
            </button>
          }
        />

        <div className="mb-5 grid grid-cols-1 gap-2.5 sm:mb-6 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F7F9] px-3 py-3 shadow-[0_1px_3px_rgba(45,32,97,0.05)] sm:px-4 sm:py-3.5"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#626889] sm:text-[11px]">
                {stat.label}
              </p>
              <p className="text-[1.25rem] font-bold leading-none tabular-nums text-[#706BB0] sm:text-[1.5rem]">
                {formatStat(stat.value)}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-5 rounded-xl bg-[#F2F1F6] p-3 sm:mb-6 sm:p-4">
          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.35fr)_auto]">
            <FilterField label="Posted On">
              <div className="relative">
                <input
                  type={postedOn ? 'date' : 'text'}
                  value={postedOn}
                  placeholder="Select Date"
                  onFocus={(event) => {
                    event.currentTarget.type = 'date'
                  }}
                  onBlur={(event) => {
                    if (!event.currentTarget.value) {
                      event.currentTarget.type = 'text'
                    }
                  }}
                  onChange={(event) => setPostedOn(event.target.value)}
                  className={cn(filterInputClass, 'pr-10')}
                />
                <CalendarDays
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
                  aria-hidden="true"
                />
              </div>
            </FilterField>

            <FilterField label="Updated On">
              <div className="relative">
                <input
                  type={updatedOn ? 'date' : 'text'}
                  value={updatedOn}
                  placeholder="Select Date"
                  onFocus={(event) => {
                    event.currentTarget.type = 'date'
                  }}
                  onBlur={(event) => {
                    if (!event.currentTarget.value) {
                      event.currentTarget.type = 'text'
                    }
                  }}
                  onChange={(event) => setUpdatedOn(event.target.value)}
                  className={cn(filterInputClass, 'pr-10')}
                />
                <CalendarDays
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
                  aria-hidden="true"
                />
              </div>
            </FilterField>

            <FilterField label="Recruiter Name">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={recruiterQuery}
                  onChange={(event) => setRecruiterQuery(event.target.value)}
                  placeholder="Search recruiter"
                  className={cn(filterInputClass, 'pl-9')}
                />
              </div>
            </FilterField>

            <div className="flex w-full min-w-0 items-center gap-2 xl:w-auto">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="relative inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-[#2D2061]/25 bg-white px-4 text-sm font-medium text-[#2D2061] shadow-[0_1px_2px_rgba(45,32,97,0.04)] transition-colors hover:bg-[#faf9fd] xl:min-w-[8.75rem] xl:flex-none"
              >
                <SlidersHorizontal className="size-4 shrink-0" aria-hidden="true" />
                More Filters
                {activeFilterCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#2D2061] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    setAppliedFilters((current) => ({
                      ...emptyFilterSortValues,
                      sortBy: current.sortBy,
                    }))
                  }
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg border border-transparent px-3 text-sm font-medium text-[#2D2061] underline-offset-2 transition-colors hover:bg-white/70 hover:underline"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-sm italic text-[#2D2061]/80">
            <span className="font-semibold not-italic tabular-nums">
              {totalFound}
            </span>{' '}
            {totalFound === 1 ? 'Job' : 'Jobs'} found
            {hasMore || loadingMore ? (
              <span className="not-italic text-[#8B8B9E]">
                {' '}
                · showing {visibleJobs.length}
              </span>
            ) : null}
          </p>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <SegmentedControl
              value={status}
              options={JOB_STATUS_FILTER_OPTIONS}
              onChange={setStatus}
              aria-label="Job status"
              className="w-full sm:w-auto"
            />
            <SegmentedControl
              value={scope}
              options={[
                { value: 'my', label: 'My Jobs' },
                { value: 'all', label: 'All Jobs' },
              ]}
              onChange={setScope}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <BulkActionsBar
            selectedCount={selectedCount}
            entityLabel="Jobs"
            actions={
              status === 'all'
                ? JOB_CARD_ACTIONS
                : jobCardActionsForStatus(status)
            }
            onAction={handleBulkAction}
            onClear={clearSelection}
            selectAll={{
              checked: allFilteredSelected,
              indeterminate: someFilteredSelected,
              onChange: handleSelectAll,
            }}
          />

          {visibleJobs.map((job) => (
            <article
              key={job.id}
              className="rounded-xl border border-line bg-surface p-3 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:p-4"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 gap-2.5 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(selected[job.id])}
                    onChange={() => toggleSelect(job.id)}
                    className="mt-1 size-4 shrink-0 rounded border-line accent-[#2D2061]"
                    aria-label={`Select ${job.code}`}
                  />

                  <div
                    className="min-w-0 flex-1 cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/25"
                    role="button"
                    tabIndex={0}
                    onClick={() => openJobDetail(job)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openJobDetail(job)
                      }
                    }}
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <h2 className="min-w-0 text-sm font-bold text-[#2D2061] transition-colors hover:text-[#241a52] hover:underline sm:truncate sm:text-base">
                        {job.code} - {job.title}
                      </h2>
                      <StatusPillBadge
                        option={jobStatusPillOption(job.status)}
                        className="shrink-0"
                      />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted sm:gap-x-4">
                      <MetaItem
                        icon={<MapPin className="size-3.5" />}
                        tooltip="Location"
                      >
                        {job.location}
                      </MetaItem>
                      <MetaItem
                        icon={<Building2 className="size-3.5" />}
                        tooltip="Department"
                      >
                        {job.department}
                      </MetaItem>
                      <MetaItem
                        icon={<Clock3 className="size-3.5" />}
                        tooltip="Created On"
                      >
                        {job.postedAgo}
                      </MetaItem>
                    </div>

                    <div className="mt-3 flex flex-col gap-1 text-xs sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-1">
                      <Detail label="Recruiter" value={job.recruiter} />
                      <Detail label="No. of Openings" value={job.openings} />
                      <Detail label="Last Activity" value={job.lastActivity} />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:items-center sm:gap-3">
                  <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 xl:flex-none">
                    {job.metrics.map((metric) => {
                      const isApplications = metric.label === 'Applications'
                      return (
                        <button
                          key={metric.label}
                          type="button"
                          disabled={!isApplications}
                          onClick={() => {
                            if (isApplications) openApplications(job.code)
                          }}
                          className={cn(
                            'min-w-0 rounded-lg border border-line bg-surface-soft px-2 py-2 text-center transition-colors sm:min-w-[4.5rem]',
                            isApplications
                              ? 'cursor-pointer hover:border-[#2D2061]/40 hover:bg-[#f5f3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/25'
                              : 'cursor-default',
                          )}
                          aria-label={
                            isApplications
                              ? `View applications for ${job.code}`
                              : undefined
                          }
                        >
                          <p className="text-sm font-bold leading-none tabular-nums text-[#2D2061] sm:text-base">
                            {metric.value}
                          </p>
                          <p className="mt-1 text-[10px] leading-tight text-muted">
                            {metric.label}
                          </p>
                        </button>
                      )
                    })}
                  </div>

                  <JobCardMenu
                    jobCode={job.code}
                    jobTitle={job.title}
                    listingStatus={job.status}
                    currentStatus={stageStatusFor(job.id, stageStatuses)}
                    onStatusChange={(nextStatus) =>
                      handleJobStatusChange(job.id, nextStatus)
                    }
                    onAction={(action) => handleJobAction(job.code, action)}
                  />
                </div>
              </div>
            </article>
          ))}

          {totalFound === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-surface-soft px-6 py-12 text-center">
              <Briefcase className="mx-auto size-8 text-muted" />
              <p className="mt-3 text-sm font-medium text-[#2D2061]">
                No jobs found for this filter.
              </p>
            </div>
          ) : null}

          {hasMore || loadingMore ? (
            <div
              ref={loadMoreRef}
              className="flex flex-col items-center justify-center gap-2 py-6"
              aria-live="polite"
            >
              {loadingMore ? (
                <>
                  <Loader2
                    className="size-5 animate-spin text-[#2D2061]"
                    aria-hidden="true"
                  />
                  <p className="text-xs text-[#8B8B9E]">Loading more jobs…</p>
                </>
              ) : (
                <p className="text-xs text-[#8B8B9E]">Scroll for more jobs</p>
              )}
            </div>
          ) : totalFound > 0 ? (
            <p className="py-4 text-center text-xs text-[#8B8B9E]">
              All {totalFound} jobs loaded
            </p>
          ) : null}
        </div>
      </div>

      <FilterSortPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={appliedFilters}
        onApply={setAppliedFilters}
      />

      <JobViewEditPanel
        open={Boolean(detailJob)}
        job={detailJob}
        onClose={() => setDetailJob(null)}
        onSave={(job, form) => {
          const next = applyCreateFormToListing(job, form)
          replaceListing(next)
          toast.success(`“${next.title}” was saved.`, {
            title: 'Job updated',
          })
        }}
      />

      <AiCreateJobFlow
        open={aiCreateOpen}
        onClose={() => setAiCreateOpen(false)}
      />

      <ChangeStatusPopover
        open={bulkStatusOpen}
        onClose={() => setBulkStatusOpen(false)}
        value={bulkStatusValue}
        onChange={handleBulkStatusSave}
      />

      <ConfirmDeleteModal
        open={pendingDeleteJobs.length > 0}
        onClose={() => setPendingDeleteJobs([])}
        onConfirm={confirmPendingDelete}
        itemName={
          pendingDeleteJobs.length === 1
            ? pendingDeleteJobs[0]?.title
            : `${pendingDeleteJobs.length} jobs`
        }
      />
    </div>
  )
}

const filterInputClass =
  'h-11 w-full rounded-lg border border-[#e0ddea] bg-white px-3 text-sm text-[#2D2061] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10 shadow-[0_1px_2px_rgba(45,32,97,0.03)]'

function FilterField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-[#2D2061]">{label}</span>
      {children}
    </label>
  )
}

function MetaItem({
  icon,
  tooltip,
  children,
}: {
  icon: ReactNode
  tooltip: string
  children: ReactNode
}) {
  return (
    <Tooltip content={tooltip}>
      <span
        tabIndex={0}
        className="inline-flex cursor-default items-center gap-1.5 outline-none"
      >
        <span className="text-[#2D2061]/55">{icon}</span>
        {children}
      </span>
    </Tooltip>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-muted">
      <span className="font-medium text-[#2D2061]/65">{label}: </span>
      <span className="font-semibold text-[#2D2061]">{value}</span>
    </p>
  )
}
