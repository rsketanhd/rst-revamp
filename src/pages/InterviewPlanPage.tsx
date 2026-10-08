import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Briefcase,
  Check,
  CircleHelp,
  FileText,
  Puzzle,
  ScrollText,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'
import { PageContainer } from '../components/layout'
import { Button } from '../components/ui'
import { SettingsUnderlineTabs } from '../components/settings/SettingsUnderlineTabs'
import { cn } from '../lib/cn'
import {
  QUESTION_CATEGORY_LABELS,
  getInterviewPlan,
  type QuestionBankCategory,
} from '../data/interviewPlans'

const LIST_PATH = '/e2e-interviews/two-way/interviews'

/** VISTA values — shown bold in deep navy before their question */
const VISTA_VALUES = ['Vision', 'Integrity', 'Service', 'Teamwork', 'Agility']

/**
 * Two-Way Interviews → Interviews → Interview plan: what Jeeves prepared
 * for the interview (resume fit, job context, question bank).
 */
export function InterviewPlanPage() {
  const navigate = useNavigate()
  const { interviewId = '' } = useParams()
  const plan = getInterviewPlan(interviewId)
  const [category, setCategory] = useState<QuestionBankCategory>('technical')

  if (!plan) {
    return (
      <PageContainer>
        <p className="text-sm text-[#5C5870]">This interview plan could not be found.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 !rounded-md"
          onClick={() => navigate(LIST_PATH)}
        >
          Back to Interviews
        </Button>
      </PageContainer>
    )
  }

  const { interview } = plan
  const [date, time] = (interview.slot ?? '—').split(' · ')

  return (
    <PageContainer contentClassName="gap-5">
      <button
        type="button"
        onClick={() => navigate(LIST_PATH)}
        className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-[#5C5870] transition-colors hover:text-[#2D2061]"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
        Go Back
      </button>

      {/* Candidate banner — same gradient as the candidate profile banner */}
      <section className="overflow-hidden rounded-xl bg-[linear-gradient(100deg,#D45B86_0%,#8E3D78_38%,#3A2A6A_68%,#1B1744_100%)] text-white shadow-[0_8px_24px_rgba(45,32,97,0.12)]">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-4">
            <span
              className="inline-flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-[#F3D5C4] text-xl font-semibold text-[#6B3A4A]"
              aria-hidden="true"
            >
              {interview.candidate.charAt(0)}
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight">{interview.candidate}</h1>
              <p className="mt-0.5 text-sm text-white/90">
                {interview.job} | {interview.email}
              </p>
            </div>
          </div>
          <dl className="flex shrink-0 divide-x divide-white/25">
            <div className="pr-5">
              <dt className="text-[11px] text-white/75">Interview date</dt>
              <dd className="mt-0.5 text-sm font-bold">{date}</dd>
            </div>
            <div className="pl-5">
              <dt className="text-[11px] text-white/75">Interview time</dt>
              <dd className="mt-0.5 text-sm font-bold">{time ?? '—'}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Resume */}
      <SectionTitle icon={<FileText className="size-4" strokeWidth={1.75} />}>Resume</SectionTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Fit Score" icon={<Target className="size-4" strokeWidth={1.75} />}>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <ScoreRing value={plan.overallFit} label="Overall" />
            <ul className="flex w-full min-w-0 flex-1 flex-col gap-2">
              {plan.criteria.map((c) => (
                <li key={c.label} className="grid grid-cols-[9.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-xs">
                  <span className="truncate text-[#4A4760]">{c.label}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-[#EEEDF5]">
                    <span
                      className="block h-full rounded-full bg-[#15A05B]"
                      style={{ width: `${c.score}%` }}
                    />
                  </span>
                  <span className="text-right font-bold tabular-nums text-[#1A1A2E]">{c.score}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title="Strength & Weakness" icon={<TrendingUp className="size-4" strokeWidth={1.75} />}>
          <ListBlock heading="Strength" tone="green" items={plan.strengths} />
          <ListBlock heading="Weakness" tone="grey" items={plan.weaknesses} className="mt-3" />
        </Card>

      </div>

      {/* Skill matching + resume summary: full width, stacked at every size */}
      <div className="-mt-1 grid grid-cols-1 gap-4">
        <Card title="Skill Matching" icon={<Puzzle className="size-4" strokeWidth={1.75} />}>
          <ul className="flex flex-wrap gap-1.5">
            {plan.skills.map((skill) => (
              <li
                key={skill.name}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                  skill.matched ? 'bg-[#E6F6EC] text-[#15803D]' : 'bg-[#F0EFF4] text-[#6B6B80]',
                )}
              >
                {skill.matched ? (
                  <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  <X className="size-3" strokeWidth={2.5} aria-hidden="true" />
                )}
                {skill.name}
                <span className="sr-only">{skill.matched ? '(matched)' : '(missing)'}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Resume Summary" icon={<ScrollText className="size-4" strokeWidth={1.75} />}>
          <p className="text-sm leading-relaxed text-[#4A4760]">{plan.resumeSummary}</p>
        </Card>
      </div>

      {/* Job information */}
      <SectionTitle icon={<Briefcase className="size-4" strokeWidth={1.75} />}>Job Information</SectionTitle>
      <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-[9rem_minmax(0,1fr)]">
          <dt className="text-[#8B8B9E]">Description</dt>
          <dd className="text-[#1A1A2E]">{plan.jobDescription}</dd>
          <dt className="text-[#8B8B9E]">Job Requirement</dt>
          <dd className="text-[#1A1A2E]">{plan.jobRequirement}</dd>
        </dl>
      </section>

      {/* Question bank */}
      <SectionTitle icon={<CircleHelp className="size-4" strokeWidth={1.75} />}>
        AI-Generated Question Bank
      </SectionTitle>
      <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5">
        <SettingsUnderlineTabs
          aria-label="Question categories"
          value={category}
          onChange={setCategory}
          options={(Object.keys(QUESTION_CATEGORY_LABELS) as QuestionBankCategory[]).map((key) => ({
            value: key,
            label: `${QUESTION_CATEGORY_LABELS[key]} (${plan.questions[key].length})`,
          }))}
        />
        <ol key={category} className="mt-4 flex animate-fade-up list-decimal flex-col gap-2 pl-5 text-sm text-[#1A1A2E] marker:text-[#8B8B9E]">
          {plan.questions[category].map((question) => (
            <li key={question} className="pl-1">
              <QuestionText text={question} />
            </li>
          ))}
        </ol>
      </section>
    </PageContainer>
  )
}

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <h2 className="-mb-1 flex items-center gap-2 text-base font-semibold text-[#2D2061]">
      <span className="text-[#6D5BD0]" aria-hidden="true">
        {icon}
      </span>
      {children}
    </h2>
  )
}

function Card({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1A1A2E]">
        <span className="text-[#6D5BD0]" aria-hidden="true">
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function ListBlock({
  heading,
  tone,
  items,
  className,
}: {
  heading: string
  tone: 'green' | 'grey'
  items: string[]
  className?: string
}) {
  return (
    <div className={className}>
      <p
        className={cn(
          'rounded-md px-3 py-2 text-sm font-semibold',
          tone === 'green' ? 'bg-[#E6F6EC] text-[#15803D]' : 'bg-[#F0EFF4] text-[#4A4760]',
        )}
      >
        {heading}
      </p>
      <ul className="mt-2 flex list-disc flex-col gap-1 pl-8 text-sm text-[#4A4760]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

/** Circular score ring with the value in the middle. */
function ScoreRing({ value, label }: { value: number; label: string }) {
  const r = 42
  const circumference = 2 * Math.PI * r
  return (
    <div
      role="img"
      aria-label={`${label} fit ${value}%`}
      className="relative size-32 shrink-0"
    >
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#EEEDF5" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#15A05B"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] text-[#8B8B9E]">{label}</span>
        <span className="text-2xl font-bold tabular-nums text-[#1F1B4D]">{value}%</span>
      </div>
    </div>
  )
}

/** "Vision: …" → bold navy VISTA value, then the question. */
function QuestionText({ text }: { text: string }) {
  const match = text.match(/^(\w+):\s*(.*)$/)
  if (!match || !VISTA_VALUES.includes(match[1])) return <>{text}</>
  return (
    <>
      <span className="font-bold text-[#141E4F]">{match[1]}:</span> {match[2]}
    </>
  )
}
