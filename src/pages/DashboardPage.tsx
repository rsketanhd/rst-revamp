import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  Search,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { Button } from '../components/ui'
import { computeJobStats, formatStat, JOBS } from '../data/jobs'
import { cn } from '../lib/cn'

const QUICK_LINKS = [
  {
    to: '/jobs',
    label: 'Jobs',
    description: 'View and manage active job postings.',
    icon: Briefcase,
  },
  {
    to: '/candidates',
    label: 'Candidates',
    description: 'Browse your talent pipeline.',
    icon: Users,
  },
  {
    to: '/candidate-discovery',
    label: 'Candidate Discovery',
    description: 'Find matches with AI-assisted search.',
    icon: Search,
  },
  {
    to: '/jeeves-ai',
    label: 'Jeeves AI',
    description: 'Review applicants and recommendations.',
    icon: Sparkles,
  },
  {
    to: '/e2e-interviews/one-way',
    label: 'One-Way Interviews',
    description: 'Configure and track async interviews.',
    icon: Video,
  },
] as const

/**
 * Home overview — separate from the Jobs module list.
 */
export function DashboardPage() {
  const navigate = useNavigate()
  const stats = useMemo(() => computeJobStats(JOBS), [])
  const recentJobs = useMemo(
    () => JOBS.filter((job) => job.status === 'active' && job.isMine).slice(0, 5),
    [],
  )

  const statCards = [
    { label: 'Active Jobs', value: stats.activeJobs },
    { label: 'Total Applicants', value: stats.totalApplicants },
    { label: 'Recommendations', value: stats.totalRecommendations },
    { label: 'Total Offers', value: stats.totalOffers },
  ]

  return (
    <PageContainer contentClassName="gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Dashboard"
          subtitle="Your recruitment overview across jobs, candidates, and interviews."
        />
        <Button
          type="button"
          onClick={() => navigate('/jobs/new')}
          className="!h-10 shrink-0 bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
        >
          Create New Job
        </Button>
      </div>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#E8E6F0] bg-white px-4 py-4 shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8B8B9E]">
              {card.label}
            </p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-[#2D2061]">
              {formatStat(card.value)}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-[#E8E6F0] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-[#2D2061]">My Active Jobs</h2>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D2061] hover:underline"
            >
              View all
              <ArrowRight className="size-3.5" strokeWidth={2.25} />
            </Link>
          </div>
          <ul className="divide-y divide-[#F0EEF5]">
            {recentJobs.map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => navigate('/jobs')}
                  className="flex w-full items-start justify-between gap-3 py-3 text-left first:pt-0 last:pb-0 hover:bg-[#FAFAFC]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#2D2061]">
                      {job.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8B8B9E]">
                      {job.code} · {job.location}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-[#8B8B9E]">
                    {job.postedAgo}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[#E8E6F0] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-sm font-bold text-[#2D2061]">Quick links</h2>
          <ul className="flex flex-col gap-2">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border border-transparent px-2.5 py-2.5 transition-colors',
                      'hover:border-[#E8E6F0] hover:bg-[#F7F6FA]',
                    )}
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F0EEF5] text-[#2D2061]">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[#2D2061]">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#8B8B9E]">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </PageContainer>
  )
}
