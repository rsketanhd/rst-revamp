import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { cn } from '../lib/cn'
import {
  computeJobStats,
  filterJobs,
  formatStat,
  JOBS,
  type JobStatus,
} from '../data/jobs'
import {
  FilterSortPanel,
  JobCardMenu,
  Tooltip,
  countActiveFilters,
  emptyFilterSortValues,
  type FilterSortValues,
} from '../components/ui'

type JobScope = 'my' | 'all'

/** Jobs rendered per lazy-load page. */
const PAGE_SIZE = 5

export function DashboardPage() {
  const [status, setStatus] = useState<JobStatus>('active')
  const [scope, setScope] = useState<JobScope>('my')
  const [postedOn, setPostedOn] = useState('')
  const [updatedOn, setUpdatedOn] = useState('')
  const [recruiterQuery, setRecruiterQuery] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [syncing, setSyncing] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<FilterSortValues>(
    emptyFilterSortValues,
  )
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadingLockRef = useRef(false)

  const activeFilterCount = countActiveFilters(appliedFilters)

  const scopeJobs = useMemo(
    () => JOBS.filter((job) => (scope === 'my' ? job.isMine : true)),
    [scope],
  )

  const stats = useMemo(() => computeJobStats(scopeJobs), [scopeJobs])

  const filteredJobs = useMemo(
    () =>
      filterJobs(JOBS, {
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

  function toggleSelect(id: string) {
    setSelected((current) => ({ ...current, [id]: !current[id] }))
  }

  async function handleSync() {
    setSyncing(true)
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    setSyncing(false)
  }

  const statCards = [
    { label: 'Active Jobs', value: stats.activeJobs },
    { label: 'Total Applicants', value: stats.totalApplicants },
    { label: 'Total Recommendations', value: stats.totalRecommendations },
    { label: 'Total Offers', value: stats.totalOffers },
  ]

  return (
    <div className="flex min-h-full w-full min-w-0 flex-col bg-white">
      <div className="flex h-shell-header shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#ececf1] bg-[#F5F5F8] px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleSync}
          className="inline-flex items-center gap-2 text-sm text-[#6B6B80] transition-colors hover:text-[#2D2061]"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(45,32,97,0.06)]">
            <RefreshCw
              className={cn('size-3.5 text-[#6B6B80]', syncing && 'animate-spin')}
              aria-hidden="true"
            />
          </span>
          <span>
            Last Sync :{' '}
            <span className="font-medium text-[#4A4A60]">
              08/14/2023 9:23 PM
            </span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex size-9 items-center justify-center rounded-full bg-transparent text-[#6B6B80] transition-colors hover:bg-white/80"
          >
            <Bell className="size-5" strokeWidth={1.75} />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#E53935] ring-2 ring-[#F5F5F8]" />
          </button>
          <button
            type="button"
            aria-label="User profile"
            className="size-9 overflow-hidden rounded-full bg-[#C9C4DE] shadow-[0_0_0_1px_rgba(45,32,97,0.08)]"
          >
            <span className="flex h-full w-full items-center justify-center text-[11px] font-bold text-[#2D2061]">
              KS
            </span>
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-white p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[1.625rem] font-bold leading-tight tracking-tight text-[#2D2061] sm:text-[1.75rem]">
              Job Management
            </h1>
            <p className="mt-1 text-sm font-normal text-[#8B8B9E]">
              Monitor and optimize your job postings performance
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#241a52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/30"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Create New Job
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F7F9] px-4 py-3.5 shadow-[0_1px_3px_rgba(45,32,97,0.05)]"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#626889]">
                {stat.label}
              </p>
              <p className="text-[1.5rem] font-bold leading-none tabular-nums text-[#706BB0]">
                {formatStat(stat.value)}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-xl bg-[#F2F1F6] p-3 sm:p-4">
          <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.35fr)_auto]">
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

            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="relative inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#2D2061]/25 bg-white px-4 text-sm font-medium text-[#2D2061] shadow-[0_1px_2px_rgba(45,32,97,0.04)] transition-colors hover:bg-[#faf9fd] xl:w-auto xl:min-w-[8.75rem]"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              More Filters
              {activeFilterCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#2D2061] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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

          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl
              value={status}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              onChange={setStatus}
            />
            <SegmentedControl
              value={scope}
              options={[
                { value: 'my', label: 'My Jobs' },
                { value: 'all', label: 'All Jobs' },
              ]}
              onChange={setScope}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {visibleJobs.map((job) => (
            <article
              key={job.id}
              className="rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)]"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(selected[job.id])}
                    onChange={() => toggleSelect(job.id)}
                    className="mt-1 size-4 shrink-0 rounded border-line accent-[#2D2061]"
                    aria-label={`Select ${job.code}`}
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-bold text-[#2D2061]">
                      {job.code} - {job.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
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

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                      <Detail label="Recruiter" value={job.recruiter} />
                      <Detail label="No. of Openings" value={job.openings} />
                      <Detail label="Last Activity" value={job.lastActivity} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-5 xl:flex-none">
                    {job.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="min-w-[4.5rem] rounded-lg border border-line bg-surface-soft px-2 py-2 text-center"
                      >
                        <p className="text-base font-bold leading-none tabular-nums text-[#2D2061]">
                          {metric.value}
                        </p>
                        <p className="mt-1 text-[10px] leading-tight text-muted">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <JobCardMenu
                    jobCode={job.code}
                    jobTitle={job.title}
                    onAction={(action) => {
                      console.info('job action', job.code, action)
                    }}
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

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}) {
  return (
    <div className="inline-flex rounded-full border border-line bg-surface p-0.5">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
              active
                ? 'bg-[#2D2061] text-white'
                : 'text-[#2D2061]/70 hover:text-[#2D2061]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
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
