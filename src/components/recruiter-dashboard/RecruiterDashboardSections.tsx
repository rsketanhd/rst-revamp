import { useMemo, useState } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'
import {
  BarChart3,
  CalendarDays,
  LayoutGrid,
  List,
  Maximize2,
  Pencil,
  Table2,
  UserRound,
} from 'lucide-react'
import {
  ACTIVITY_STATUS_SLICES,
  ACTIVITY_TABS,
  CANDIDATE_ENGAGEMENT_RATE,
  LATEST_APPLICANTS,
  LICENSE_DONUT,
  LICENSE_SEGMENTS,
  PIPELINE_JOB_OPTIONS,
  PLATFORM_ENGAGEMENT_KPIS,
  PLATFORM_ENGAGEMENT_SEGMENTS,
  RECRUITER_DASHBOARD_KPIS,
  STATUS_TONE_CLASS,
  getActiveCandidateKpis,
  getActiveCandidates,
  getActivitiesForTab,
  getGrowthTrends,
  getJobOverviewRows,
  getPipelineForJob,
  getVelocityStats,
  sumSliceValues,
  type ActivityTabId,
  type PipelineJobId,
  type StatusTone,
  type UpcomingActivity,
} from '../../data/recruiterDashboard'
import { VerticalBarChart } from '../reports/charts/VerticalBarChart'
import { Modal, toast } from '../ui'
import { cn } from '../../lib/cn'
import { DashboardPanel } from './DashboardPanel'
import { MiniDonut } from './MiniDonut'
import { PeriodPills } from './PeriodPills'
import { Sparkline } from './Sparkline'

const JOB_FILTERS = [
  { value: 'full', label: 'Full Time' },
  { value: 'part', label: 'Part Time/Contract' },
  { value: 'all', label: 'All Support Recruiter' },
] as const

const VELOCITY_PERIODS = [
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '1y', label: '1 Year' },
] as const

const TREND_PERIODS = [
  { value: 'week', label: 'Weekly' },
  { value: '1m', label: '1 Month' },
  { value: '3m', label: '3 Month' },
  { value: 'year', label: '1 Year' },
] as const

const ENGAGE_PERIODS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
] as const

const CANDIDATE_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active Jobs' },
  { value: 'closed', label: 'Closed Jobs' },
  { value: 'paused', label: 'Paused Jobs' },
] as const

type FilterValue<T extends ReadonlyArray<{ value: string }>> = T[number]['value']

function notify(message: string, title: string): void {
  toast.success(message, { title })
}

function goTo(
  navigate: NavigateFunction,
  href: string,
  message: string,
  title: string,
): void {
  notify(message, title)
  navigate(href)
}

function applyFilter<T extends string>(
  setValue: (value: T) => void,
  next: T,
  message: string,
  title: string,
): void {
  setValue(next)
  notify(message, title)
}

function InitialsAvatar({
  initials,
  tone,
  size = 'sm',
}: {
  initials: string
  tone: string
  size?: 'sm' | 'md'
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full font-bold text-[#2D2061]',
        size === 'sm' ? 'size-8 text-[11px]' : 'size-9 text-xs',
      )}
      style={{ backgroundColor: tone }}
    >
      {initials}
    </span>
  )
}

function StatusBadge({
  label,
  tone,
  variant = 'pill',
}: {
  label: string
  tone: StatusTone
  variant?: 'pill' | 'badge'
}) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5',
        variant === 'badge'
          ? 'text-[10px] font-bold uppercase tracking-[0.04em]'
          : 'inline-flex text-[11px] font-semibold',
        STATUS_TONE_CLASS[tone],
      )}
    >
      {label}
    </span>
  )
}

function ChangeLabel({
  change,
  positive,
}: {
  change: string
  positive: boolean
}) {
  return (
    <span
      className={cn(
        'text-[11px] font-semibold',
        positive ? 'text-[#1F8F57]' : 'text-[#C44B7A]',
      )}
    >
      {change}
    </span>
  )
}

function ColorLegend({
  items,
}: {
  items: Array<{ id: string; label: string; value: number; color: string }>
}) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
      {items.map((item) => (
        <li
          key={item.id}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#5C5878]"
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          {item.label}
          <span className="tabular-nums text-[#2D2061]">{item.value}</span>
        </li>
      ))}
    </ul>
  )
}

function periodLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value
}

function ActivityItemActions({
  item,
  navigate,
  stretch = false,
}: {
  item: UpcomingActivity
  navigate: NavigateFunction
  stretch?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() =>
          goTo(
            navigate,
            item.href,
            `${item.actionLabel}: ${item.title}`,
            'Activity',
          )
        }
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#F3DFB5] bg-[#FFF8EB] px-3 text-[12px] font-semibold text-[#B56A00] hover:bg-[#FFF1D6]',
          stretch && 'flex-1 justify-center',
        )}
      >
        <Pencil className="size-3" strokeWidth={2} />
        {item.actionLabel}
      </button>
      {item.candidateId ? (
        <button
          type="button"
          onClick={() =>
            goTo(
              navigate,
              `/candidates/${item.candidateId}`,
              'Opening candidate profile.',
              'Candidate',
            )
          }
          className="grid size-8 place-items-center rounded-full bg-[#2D2061] text-white hover:bg-[#241A52]"
          aria-label={`Open profile for ${item.title}`}
        >
          <UserRound className="size-3.5" strokeWidth={2} />
        </button>
      ) : null}
    </div>
  )
}

export function DashboardKpiStrip() {
  const navigate = useNavigate()

  return (
    <section className="grid shrink-0 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {RECRUITER_DASHBOARD_KPIS.map((kpi) => (
        <button
          key={kpi.id}
          type="button"
          onClick={() =>
            goTo(navigate, kpi.href, `Opening ${kpi.label}.`, 'Dashboard')
          }
          className="rounded-xl border border-[#E8E6F0] bg-white px-3.5 py-3.5 text-left shadow-[0_1px_2px_rgba(45,32,97,0.04)] transition-colors hover:border-[#2D2061] hover:bg-[#FAFAFC]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#8B8B9E]">
            {kpi.label}
          </p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums text-[#2D2061]">
            {kpi.value}
          </p>
        </button>
      ))}
    </section>
  )
}

export function LatestApplicantsPanel() {
  const navigate = useNavigate()

  return (
    <DashboardPanel
      title="Latest Applicants"
      subtitle="Showing latest applications."
      bodyClassName="p-0 sm:p-0"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[18rem] border-collapse text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-[#F0EEF5] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8B8B9E]">
              <th className="px-4 py-2.5 sm:px-5">Name</th>
              <th className="px-3 py-2.5">Applied Jobs</th>
              <th className="px-4 py-2.5 sm:px-5">Status</th>
            </tr>
          </thead>
          <tbody>
            {LATEST_APPLICANTS.map((row) => (
              <tr key={row.id} className="border-b border-[#F7F6FA] last:border-0">
                <td className="px-4 py-3 sm:px-5" colSpan={3}>
                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        navigate,
                        `/candidates/${row.candidateId}`,
                        `Opening ${row.name}.`,
                        'Candidate',
                      )
                    }
                    className="grid w-full grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] items-center gap-3 text-left hover:bg-[#FAFAFC]"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <InitialsAvatar
                        initials={row.initials}
                        tone={row.avatarTone}
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-[#1F1D4F]">
                          {row.name}
                        </span>
                        <span className="block truncate text-[11px] text-[#8B8B9E]">
                          {row.appliedAt}
                        </span>
                      </span>
                    </span>
                    <span className="truncate text-[#4B4A66]">{row.jobTitle}</span>
                    <StatusBadge label={row.status} tone={row.statusTone} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  )
}

export function RecruiterJobOverviewPanel() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterValue<typeof JOB_FILTERS>>('full')
  const rows = useMemo(() => getJobOverviewRows(filter), [filter])

  return (
    <DashboardPanel
      title="Recruiter Job Overview"
      subtitle="Job overview against job role."
      action={
        <PeriodPills
          value={filter}
          options={JOB_FILTERS}
          onChange={(next) =>
            applyFilter(
              setFilter,
              next,
              `Showing ${periodLabel(JOB_FILTERS, next)} recruiters.`,
              'Job overview',
            )
          }
          aria-label="Job role filter"
        />
      }
    >
      {rows.length === 0 ? (
        <p className="text-sm text-[#8B8B9E]">No recruiters for this filter.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={() =>
                  goTo(
                    navigate,
                    '/jobs',
                    `Opening jobs for ${row.name}.`,
                    'Jobs',
                  )
                }
                className="flex w-full flex-wrap items-center gap-3 rounded-xl border border-[#F0EEF5] bg-[#FAFAFC] px-3 py-2.5 text-left transition-colors hover:border-[#2D2061]"
              >
                <InitialsAvatar
                  initials={row.initials}
                  tone={row.avatarTone}
                  size="md"
                />
                <p className="min-w-0 flex-1 text-sm font-semibold text-[#1F1D4F]">
                  {row.name}
                </p>
                <div className="flex flex-wrap gap-3 text-[11px] font-semibold">
                  <span className="text-[#1F8F57]">Active {row.active}</span>
                  <span className="text-[#2D2061]">Hired {row.hired}</span>
                  <span className="text-[#8B8B9E]">Rejected {row.rejected}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  )
}

export function ActivityStatusPanel() {
  const navigate = useNavigate()

  return (
    <DashboardPanel
      title="Activity Status"
      subtitle="Description about your recruitment."
      action={
        <button
          type="button"
          onClick={() =>
            goTo(navigate, '/jobs', 'Opening job list.', 'Jobs')
          }
          className="text-xs font-semibold text-[#2D2061] hover:underline"
        >
          View jobs
        </button>
      }
    >
      <button
        type="button"
        onClick={() =>
          goTo(navigate, '/jobs', 'Opening jobs by status.', 'Jobs')
        }
        className="w-full rounded-xl text-left transition-opacity hover:opacity-90"
      >
        <MiniDonut
          slices={ACTIVITY_STATUS_SLICES}
          centerValue={String(sumSliceValues(ACTIVITY_STATUS_SLICES))}
          centerLabel="Total Jobs"
        />
      </button>
    </DashboardPanel>
  )
}

export function HiringVelocityPanel() {
  const [period, setPeriod] =
    useState<FilterValue<typeof VELOCITY_PERIODS>>('30d')
  const stats = useMemo(() => getVelocityStats(period), [period])

  return (
    <DashboardPanel
      title="Hiring Velocity and Efficiency Stats"
      subtitle="Track how quickly roles move from open to filled."
      action={
        <PeriodPills
          value={period}
          options={VELOCITY_PERIODS}
          onChange={(next) =>
            applyFilter(
              setPeriod,
              next,
              `Velocity updated for ${periodLabel(VELOCITY_PERIODS, next)}.`,
              'Hiring velocity',
            )
          }
          aria-label="Hiring velocity period"
        />
      }
      bodyClassName="grid gap-3 p-4 sm:grid-cols-3 sm:p-5"
    >
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="rounded-xl border border-[#F0EEF5] bg-[#FAFAFC] px-4 py-4"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8B8B9E]">
            {stat.label}
          </p>
          <p
            className="mt-2 text-3xl font-bold tabular-nums"
            style={{ color: stat.accent }}
          >
            {stat.value}
          </p>
          <p className="mt-1 text-xs font-semibold text-[#4B4A66]">
            {stat.unit}
          </p>
          <p className="mt-2 text-[11px] leading-snug text-[#8B8B9E]">
            {stat.hint}
          </p>
        </div>
      ))}
    </DashboardPanel>
  )
}

export function SystemLicensePanel() {
  const navigate = useNavigate()
  const totalSeats = sumSliceValues(LICENSE_SEGMENTS)

  return (
    <DashboardPanel
      title="System License Sector Utilization"
      subtitle="Seat usage across your organization."
      action={
        <button
          type="button"
          onClick={() =>
            goTo(navigate, '/settings', 'Opening settings.', 'Licenses')
          }
          className="text-xs font-semibold text-[#2D2061] hover:underline"
        >
          Manage
        </button>
      }
    >
      <div className="mb-4">
        <div className="flex h-3 overflow-hidden rounded-full bg-[#F0EEF5]">
          {LICENSE_SEGMENTS.map((segment) => (
            <button
              key={segment.id}
              type="button"
              className="h-full transition-opacity hover:opacity-80"
              style={{
                width: `${(segment.value / totalSeats) * 100}%`,
                backgroundColor: segment.color,
              }}
              title={`${segment.label}: ${segment.value}`}
              aria-label={`${segment.label}: ${segment.value}`}
              onClick={() =>
                notify(`${segment.label}: ${segment.value} seats.`, 'License')
              }
            />
          ))}
        </div>
        <div className="mt-3">
          <ColorLegend items={LICENSE_SEGMENTS} />
        </div>
      </div>
      <MiniDonut
        slices={LICENSE_DONUT}
        centerValue={String(totalSeats)}
        centerLabel="Seats"
      />
    </DashboardPanel>
  )
}

export function PlatformEngagementPanel() {
  const navigate = useNavigate()

  return (
    <DashboardPanel
      title="Platform Activity & Engagement"
      subtitle="How teams use SniperAI day to day."
      action={
        <button
          type="button"
          onClick={() =>
            goTo(navigate, '/reports', 'Opening reports.', 'Engagement')
          }
          className="text-xs font-semibold text-[#2D2061] hover:underline"
        >
          View reports
        </button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {PLATFORM_ENGAGEMENT_KPIS.map((kpi) => (
          <button
            key={kpi.id}
            type="button"
            onClick={() =>
              notify(`${kpi.label}: ${kpi.value}`, 'Engagement')
            }
            className="rounded-xl border border-[#F0EEF5] bg-[#FAFAFC] px-3 py-3 text-left transition-colors hover:border-[#2D2061]"
          >
            <p className="text-[11px] font-semibold text-[#8B8B9E]">
              {kpi.label}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-[#2D2061]">
              {kpi.value}
            </p>
            <p className="mt-0.5 text-[11px] text-[#8B8B9E]">{kpi.hint}</p>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[12px]">
          <span className="font-semibold text-[#4B4A66]">
            Candidate Engagement
          </span>
          <span className="font-bold text-[#2D2061]">
            {CANDIDATE_ENGAGEMENT_RATE}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#F0EEF5]">
          <div
            className="h-full rounded-full bg-[#6D5BD0]"
            style={{ width: `${CANDIDATE_ENGAGEMENT_RATE}%` }}
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[#F0EEF5]">
        <table className="w-full min-w-[16rem] text-left text-[12px]">
          <thead className="bg-[#FAFAFC] text-[11px] uppercase tracking-[0.04em] text-[#8B8B9E]">
            <tr>
              <th className="px-3 py-2 font-semibold">Segment</th>
              <th className="px-3 py-2 font-semibold">Active</th>
              <th className="px-3 py-2 font-semibold">New</th>
            </tr>
          </thead>
          <tbody>
            {PLATFORM_ENGAGEMENT_SEGMENTS.map((row) => (
              <tr key={row.id} className="border-t border-[#F0EEF5]">
                <td className="px-3 py-2 font-semibold text-[#1F1D4F]">
                  {row.segment}
                </td>
                <td className="px-3 py-2 tabular-nums text-[#2D2061]">
                  {row.active}
                </td>
                <td className="px-3 py-2 tabular-nums text-[#1F8F57]">
                  {row.newCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  )
}

export function GrowthTrendsPanel() {
  const [period, setPeriod] = useState<FilterValue<typeof TREND_PERIODS>>('1m')
  const trends = useMemo(() => getGrowthTrends(period), [period])

  return (
    <DashboardPanel
      title="Recruitment & Growth Trends"
      subtitle="Monitor posting, application, and talent-pool momentum."
      action={
        <PeriodPills
          value={period}
          options={TREND_PERIODS}
          onChange={(next) =>
            applyFilter(
              setPeriod,
              next,
              `Trends updated for ${periodLabel(TREND_PERIODS, next)}.`,
              'Growth trends',
            )
          }
          aria-label="Growth trends period"
        />
      }
      bodyClassName="grid gap-3 p-4 sm:grid-cols-3 sm:p-5"
    >
      {trends.map((trend) => (
        <div
          key={trend.id}
          className="rounded-xl border border-[#F0EEF5] bg-[#FAFAFC] px-4 py-3.5"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-[#2D2061]">{trend.title}</p>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                trend.changePositive
                  ? 'bg-[#E3F5EA] text-[#1F8F57]'
                  : 'bg-[#FDF2F5] text-[#C44B7A]',
              )}
            >
              {trend.change}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#8B8B9E]">{trend.value}</p>
          <Sparkline
            points={trend.points}
            color={trend.color}
            className="mt-3"
          />
        </div>
      ))}
    </DashboardPanel>
  )
}

export function PipelineBreakdownPanel() {
  const [jobId, setJobId] = useState<PipelineJobId>('all')
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const [maximized, setMaximized] = useState(false)
  const pipeline = useMemo(() => getPipelineForJob(jobId), [jobId])

  function setPipelineView(next: 'chart' | 'table', announce = true) {
    setView(next)
    if (announce) notify(`Switched to ${next} view.`, 'Pipeline')
  }

  const chart = (
    <VerticalBarChart
      items={pipeline.bars.map((item) => ({
        id: item.id,
        label: item.label,
        value: item.value,
      }))}
      yMax={Math.max(...pipeline.bars.map((item) => item.value), 1)}
      yLabel="Candidates"
      barColor="#6D5BD0"
      barThickness={14}
    />
  )

  const table = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-left text-[12.5px]">
        <thead className="bg-[#FAFAFC] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8B8B9E]">
          <tr>
            <th className="px-3 py-2">Stage</th>
            <th className="px-3 py-2">Candidates</th>
          </tr>
        </thead>
        <tbody>
          {pipeline.bars.map((item) => (
            <tr key={item.id} className="border-t border-[#F0EEF5]">
              <td className="px-3 py-2 font-semibold text-[#1F1D4F]">
                {item.label}
              </td>
              <td className="px-3 py-2 tabular-nums font-semibold text-[#2D2061]">
                {item.value.toLocaleString('en-US')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <section className="min-w-0 shrink-0 rounded-xl border border-[#E8E6F0] bg-white shadow-[0_1px_2px_rgba(45,32,97,0.04)]">
      <div className="rounded-t-xl bg-[#2D2061] px-4 py-4 text-white sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold">
              Candidate Pipeline Stage Breakdown
            </h2>
            <p className="mt-0.5 text-xs text-white/70">
              Total pipeline statistics across all active recruitments.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 text-xs text-white/80">
            <span className="sr-only">Select Job ID</span>
            <select
              className="h-8 rounded-lg border-0 bg-white px-2.5 text-[12px] font-semibold text-[#2D2061] outline-none"
              value={jobId}
              aria-label="Select Job ID"
              onChange={(event) =>
                applyFilter(
                  setJobId,
                  event.target.value as PipelineJobId,
                  `Pipeline filtered to ${periodLabel(
                    PIPELINE_JOB_OPTIONS,
                    event.target.value,
                  )}.`,
                  'Pipeline',
                )
              }
            >
              {PIPELINE_JOB_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
          <div>
            <p className="text-3xl font-bold tabular-nums">{pipeline.total}</p>
            <p className="text-xs text-white/70">Total Candidates Across</p>
          </div>
          {pipeline.metrics.map((metric) => (
            <div key={metric.id}>
              <p
                className="text-lg font-bold tabular-nums"
                style={{ color: metric.color }}
              >
                {metric.value}
              </p>
              <p className="text-[11px] text-white/70">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-[#F0EEF5] px-4 py-3 sm:px-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#2D2061]">
            Candidate Pipeline Breakdown By Stage
          </h3>
          <div className="flex items-center gap-1 text-[#8B8B9E]">
            <button
              type="button"
              onClick={() => setPipelineView('table')}
              className={cn(
                'grid size-7 place-items-center rounded-md hover:bg-[#F4F5F8]',
                view === 'table' && 'bg-[#F0EEF5] text-[#2D2061]',
              )}
              aria-label="Table view"
              aria-pressed={view === 'table'}
            >
              <Table2 className="size-3.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setPipelineView('chart')}
              className={cn(
                'grid size-7 place-items-center rounded-md hover:bg-[#F4F5F8]',
                view === 'chart' && 'bg-[#F0EEF5] text-[#2D2061]',
              )}
              aria-label="Chart view"
              aria-pressed={view === 'chart'}
            >
              <BarChart3 className="size-3.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setMaximized(true)}
              className="grid size-7 place-items-center rounded-md hover:bg-[#F4F5F8]"
              aria-label="Maximize chart"
            >
              <Maximize2 className="size-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
        {view === 'chart' ? chart : table}
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5 sm:p-5">
        {pipeline.stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            onClick={() =>
              notify(
                `${stage.title}: ${stage.count} candidates.`,
                'Pipeline stage',
              )
            }
            className="relative rounded-xl border border-[#F0EEF5] bg-white px-3.5 py-3 text-left transition-colors hover:border-[#2D2061]"
          >
            <span
              className="absolute right-3 top-3 size-2 rounded-full"
              style={{ backgroundColor: stage.color }}
              aria-hidden="true"
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#8B8B9E]">
              Step {stage.step}
            </p>
            <p className="mt-1 text-[12.5px] font-semibold leading-snug text-[#1F1D4F]">
              {stage.title}
            </p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="text-xl font-bold tabular-nums text-[#2D2061]">
                {stage.count}
              </p>
              <ChangeLabel
                change={stage.change}
                positive={stage.changePositive}
              />
            </div>
          </button>
        ))}
      </div>

      <Modal
        open={maximized}
        onClose={() => setMaximized(false)}
        title="Candidate Pipeline Breakdown By Stage"
        className="max-w-5xl"
        contentClassName="space-y-3"
      >
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setPipelineView('chart', false)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold',
              view === 'chart'
                ? 'bg-[#2D2061] text-white'
                : 'bg-[#F4F5F8] text-[#4B4A66]',
            )}
          >
            <BarChart3 className="size-3.5" />
            Chart
          </button>
          <button
            type="button"
            onClick={() => setPipelineView('table', false)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold',
              view === 'table'
                ? 'bg-[#2D2061] text-white'
                : 'bg-[#F4F5F8] text-[#4B4A66]',
            )}
          >
            <Table2 className="size-3.5" />
            Table
          </button>
        </div>
        {view === 'chart' ? chart : table}
      </Modal>
    </section>
  )
}

export function ActiveCandidatesPanel() {
  const navigate = useNavigate()
  const [period, setPeriod] =
    useState<FilterValue<typeof ENGAGE_PERIODS>>('week')
  const [filter, setFilter] =
    useState<FilterValue<typeof CANDIDATE_FILTERS>>('all')
  const kpis = useMemo(() => getActiveCandidateKpis(period), [period])
  const rows = useMemo(() => getActiveCandidates(filter), [filter])

  return (
    <DashboardPanel
      title="Active Candidate Tracking & Engagement"
      subtitle="See who is engaged, retained, and ready to move."
      action={
        <PeriodPills
          value={period}
          options={ENGAGE_PERIODS}
          onChange={(next) =>
            applyFilter(
              setPeriod,
              next,
              `Engagement updated for ${periodLabel(ENGAGE_PERIODS, next)}.`,
              'Engagement',
            )
          }
          aria-label="Engagement period"
        />
      }
      bodyClassName="space-y-4 p-4 sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <button
            key={kpi.id}
            type="button"
            onClick={() => notify(`${kpi.label}: ${kpi.value}`, 'Engagement')}
            className={cn(
              'rounded-xl px-4 py-3.5 text-left transition-opacity hover:opacity-90',
              kpi.className,
            )}
          >
            <p className="text-[11px] font-semibold opacity-80">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{kpi.value}</p>
          </button>
        ))}
      </div>

      <PeriodPills
        value={filter}
        options={CANDIDATE_FILTERS}
        onChange={(next) =>
          applyFilter(
            setFilter,
            next,
            `Showing ${periodLabel(CANDIDATE_FILTERS, next)}.`,
            'Candidates',
          )
        }
        aria-label="Candidate status filter"
      />

      <div className="overflow-x-auto rounded-xl border border-[#F0EEF5]">
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-[#8B8B9E]">
            No candidates match this filter.
          </p>
        ) : (
          <table className="w-full min-w-[48rem] border-collapse text-left text-[12.5px]">
            <thead className="bg-[#FAFAFC] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8B8B9E]">
              <tr>
                <th className="px-4 py-2.5">Candidate</th>
                <th className="px-3 py-2.5">Role</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Department</th>
                <th className="px-3 py-2.5">Score</th>
                <th className="px-4 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[#F0EEF5]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <InitialsAvatar
                        initials={row.initials}
                        tone={row.avatarTone}
                      />
                      <div>
                        <p className="font-semibold text-[#1F1D4F]">
                          {row.name}
                        </p>
                        <p className="text-[11px] text-[#8B8B9E]">
                          {row.lastActivity}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-[#4B4A66]">{row.role}</p>
                    <p className="text-[11px] text-[#8B8B9E]">{row.company}</p>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge label={row.status} tone={row.statusTone} />
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-[#F4F5F8] px-2 py-0.5 text-[11px] font-semibold text-[#4B4A66]">
                      {row.department}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-[#E3F5EA] px-2 py-0.5 text-[11px] font-semibold text-[#1F8F57]">
                      {row.score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        goTo(
                          navigate,
                          `/candidates/${row.candidateId}`,
                          `Opening ${row.name}.`,
                          'Candidate',
                        )
                      }
                      className="inline-flex h-8 items-center rounded-lg bg-[#2D2061] px-3 text-[12px] font-semibold text-white hover:bg-[#241A52]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardPanel>
  )
}

export function UpcomingActivitiesPanel() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<ActivityTabId>(ACTIVITY_TABS[0].id)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const activities = useMemo(() => getActivitiesForTab(tab), [tab])
  const allSelected =
    activities.length > 0 && selected.size === activities.length

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelected(
      allSelected
        ? new Set()
        : new Set(activities.map((item) => item.id)),
    )
  }

  function setActivitiesView(next: 'list' | 'grid') {
    const label = next === 'list' ? 'List' : 'Grid'
    applyFilter(setViewMode, next, `${label} view enabled.`, 'Activities')
  }

  return (
    <DashboardPanel
      title="Activities"
      subtitle="Track activities across your platform."
      action={
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActivitiesView('list')}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold',
              viewMode === 'list'
                ? 'bg-[#2D2061] text-white'
                : 'bg-[#F4F5F8] text-[#6B6B80]',
            )}
            aria-pressed={viewMode === 'list'}
          >
            <List className="size-3.5" strokeWidth={1.75} />
            List
          </button>
          <button
            type="button"
            onClick={() => setActivitiesView('grid')}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold',
              viewMode === 'grid'
                ? 'bg-[#2D2061] text-white'
                : 'bg-[#F4F5F8] text-[#6B6B80]',
            )}
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className="size-3.5" strokeWidth={1.75} />
            Grid
          </button>
        </div>
      }
      bodyClassName="space-y-4 p-4 sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {ACTIVITY_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id)
              setSelected(new Set())
              notify(`Showing ${item.label} activities.`, 'Activities')
            }}
            className={cn(
              'rounded-xl border px-3.5 py-3 text-left transition-colors',
              tab === item.id
                ? 'border-[#2D2061] bg-[#F7F6FA]'
                : 'border-[#F0EEF5] bg-white hover:border-[#D8D4E8]',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-2xl font-bold tabular-nums text-[#1F1D4F]">
                {item.count}
              </p>
              <CalendarDays
                className={cn('size-4', item.accent)}
                strokeWidth={1.75}
              />
            </div>
            <p className={cn('mt-1 text-sm font-semibold', item.accent)}>
              {item.label}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-[#8B8B9E]">
              {item.hint}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={selectAll}
          className="text-xs font-semibold text-[#2D2061] hover:underline"
        >
          {allSelected ? 'Clear selection' : 'Select all'}
        </button>
        {selected.size > 0 ? (
          <button
            type="button"
            onClick={() => {
              notify(`${selected.size} activities marked done.`, 'Activities')
              setSelected(new Set())
            }}
            className="inline-flex h-8 items-center rounded-lg bg-[#2D2061] px-3 text-[12px] font-semibold text-white hover:bg-[#241A52]"
          >
            Complete selected ({selected.size})
          </button>
        ) : null}
      </div>

      {activities.length === 0 ? (
        <p className="rounded-xl border border-[#F0EEF5] px-4 py-6 text-sm text-[#8B8B9E]">
          No activities in this category.
        </p>
      ) : viewMode === 'grid' ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {activities.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-[#F0EEF5] px-4 py-3.5"
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => toggleSelected(item.id)}
                  className="mt-1 size-4 shrink-0 rounded border-[#D5D2E2] text-[#2D2061]"
                  aria-label={`Select ${item.title}`}
                />
                <div className="min-w-0 flex-1">
                  <StatusBadge
                    label={item.badge}
                    tone={item.badgeTone}
                    variant="badge"
                  />
                  <p className="mt-1.5 text-sm font-semibold text-[#1F1D4F]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-[#8B8B9E]">{item.meta}</p>
                  <p className="mt-2 text-xs font-medium text-[#6B6B80]">
                    {item.when}
                  </p>
                </div>
              </div>
              <ActivityItemActions item={item} navigate={navigate} stretch />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-[#F0EEF5] overflow-hidden rounded-xl border border-[#F0EEF5]">
          {activities.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggleSelected(item.id)}
                className="mt-1 size-4 shrink-0 rounded border-[#D5D2E2] text-[#2D2061] sm:mt-0"
                aria-label={`Select ${item.title}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={item.badge}
                    tone={item.badgeTone}
                    variant="badge"
                  />
                  <p className="text-sm font-semibold text-[#1F1D4F]">
                    {item.title}
                  </p>
                </div>
                <p className="mt-1 text-xs text-[#8B8B9E]">{item.meta}</p>
              </div>
              <p className="shrink-0 text-xs font-medium text-[#6B6B80]">
                {item.when}
              </p>
              <div className="shrink-0">
                <ActivityItemActions item={item} navigate={navigate} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  )
}
