import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Info,
  Mail,
  MousePointer2,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { AiAssessmentSection } from '../components/interviews/assessment/AiAssessmentSection'
import { VideoResponsesSection } from '../components/interviews/assessment/VideoResponsesSection'
import { PageContainer } from '../components/layout'
import {
  Button,
  Select,
  SidePanel,
  StarRating,
  Textarea,
  toast,
} from '../components/ui'
import {
  MATCH_BAR_CLASS,
  PROCTOR_CARD_CLASS,
  SKILL_BAR_CLASS,
  SKILL_PERCENT_CLASS,
  SKILL_TAG_CLASS,
  getOneWayAssessment,
  type AssessmentMatchRow,
  type AssessmentProctorId,
  type AssessmentProctorMetric,
  type AssessmentSkillGroup,
  type OneWayAssessment,
} from '../data/oneWayAssessment'
import { getOneWayInvites } from '../data/oneWayInterviews'
import { cn } from '../lib/cn'

const DECISION_OPTIONS = [
  'Short List',
  'On Hold',
  'Reject',
  'Hire',
] as const

type DecisionOption = (typeof DECISION_OPTIONS)[number]

const CONTENT_TABS = [
  { id: 'video', label: 'Video Interview' },
  { id: 'ai', label: 'AI Assessment' },
] as const

type ContentTab = (typeof CONTENT_TABS)[number]['id']

const SKILL_SORT_OPTIONS = [
  'Relevance',
  'Match % High-Low',
  'Name A-Z',
] as const

type SkillSortOption = (typeof SKILL_SORT_OPTIONS)[number]

const PROCTOR_ICONS: Record<AssessmentProctorId, LucideIcon> = {
  copy: MousePointer2,
  refresh: RefreshCw,
  edit: ShieldCheck,
  focus: EyeOff,
  eyes: EyeOff,
  phone: Phone,
  ai: Bot,
}

const PROCTOR_HELP: Record<AssessmentProctorId, string> = {
  copy: 'Times the candidate used copy/paste during the interview.',
  refresh: 'Times the candidate refreshed the interview page.',
  edit: 'Times browser or device settings were changed mid-interview.',
  focus: 'Times the interview window lost focus.',
  eyes: 'Times eye-tracking detected the candidate looking away.',
  phone: 'Times a phone was detected in the camera frame.',
  ai: 'Times AI-assisted answering patterns were flagged.',
}

async function copyText(value: string, successMessage: string, title: string) {
  try {
    await navigator.clipboard.writeText(value)
    toast.success(successMessage, { title })
  } catch {
    toast.error('Could not copy to clipboard.', { title })
  }
}

const CARD_ACTION_CLASS =
  'mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#D5D2E2] text-[13px] font-semibold text-[#2D2061] hover:bg-[#F7F6FA]'

const CHIP_CLASS =
  'rounded-full bg-[#F4F5F8] px-2.5 py-0.5 text-[11px] font-semibold text-[#4B4A66]'

/** Collapsed Role-Based Assessment cards show this many tags before Show All. */
const SKILL_TAG_PREVIEW_COUNT = 3

/**
 * One-Way Interview → Completed → View Assessment.
 * Full assessment view in the main (right) content area.
 */
export function OneWayViewAssessmentPage() {
  const navigate = useNavigate()
  const { interviewId = '', inviteId = '' } = useParams()
  const assessment = getOneWayAssessment(interviewId, inviteId)

  const completedInvites = useMemo(
    () =>
      getOneWayInvites(interviewId).filter(
        (invite) => invite.status === 'completed',
      ),
    [interviewId],
  )
  const currentInviteIndex = completedInvites.findIndex(
    (invite) => invite.id === inviteId,
  )

  const [activeRound, setActiveRound] = useState(
    assessment?.rounds[0]?.id ?? 'r1',
  )
  const [contentTab, setContentTab] = useState<ContentTab>('video')
  const [skillQuery, setSkillQuery] = useState('')
  const [skillSort, setSkillSort] = useState<SkillSortOption>('Relevance')
  const [showAllSkills, setShowAllSkills] = useState(false)
  const [hmRating, setHmRating] = useState(assessment?.hmRating ?? 3)
  const [hmNotes, setHmNotes] = useState(assessment?.hmNotes ?? '')
  const [hmDecision, setHmDecision] = useState(
    assessment?.hmDecision ?? 'Short List',
  )
  const [recruiterStatus, setRecruiterStatus] = useState(
    assessment?.recruiterStatus ?? 'Short List',
  )
  const [detailPanel, setDetailPanel] = useState<'score' | 'cv' | null>(null)

  const backPath = `/e2e-interviews/one-way/${interviewId}`

  if (!assessment) {
    return (
      <PageContainer contentClassName="gap-4">
        <BackLink onClick={() => navigate(backPath)} />
        <div className="rounded-xl border border-dashed border-[#E0DDEA] bg-white px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#2D2061]">
            Assessment not found
          </p>
          <p className="mt-1 text-sm text-[#8B8B9E]">
            This invite may not be completed yet.
          </p>
        </div>
      </PageContainer>
    )
  }

  const skillQueryNormalized = skillQuery.trim().toLowerCase()
  const filteredGroups = assessment.skillGroups
    .map((group) => ({
      ...group,
      tags: skillQueryNormalized
        ? group.tags.filter((tag) =>
            tag.label.toLowerCase().includes(skillQueryNormalized),
          )
        : group.tags,
    }))
    .slice()
    .sort((a, b) => {
      switch (skillSort) {
        case 'Match % High-Low':
          return b.percent - a.percent
        case 'Name A-Z':
          return a.title.localeCompare(b.title)
        case 'Relevance':
          return 0
        default: {
          const _exhaustive: never = skillSort
          return _exhaustive
        }
      }
    })

  function resetHiringManagerForm() {
    setHmRating(assessment.hmRating)
    setHmNotes(assessment.hmNotes)
    setHmDecision(assessment.hmDecision as DecisionOption)
    toast.success('Hiring manager form reset.', { title: 'Assessment' })
  }

  function goToCompletedInvite(offset: number) {
    if (completedInvites.length === 0 || currentInviteIndex < 0) {
      toast.error('No other completed candidates available.', {
        title: 'Assessment',
      })
      return
    }
    const nextIndex =
      (currentInviteIndex + offset + completedInvites.length) %
      completedInvites.length
    const nextInvite = completedInvites[nextIndex]
    if (!nextInvite) return
    navigate(`/e2e-interviews/one-way/${interviewId}/assessment/${nextInvite.id}`)
    toast.success(`Opened ${nextInvite.name}.`, { title: 'Assessment' })
  }

  function handleShortList() {
    setHmDecision('Short List')
    setRecruiterStatus('Short List')
    toast.success(`${assessment.invite.name} moved to Short List.`, {
      title: 'Short List',
    })
  }

  function cycleSkillSort() {
    const index = SKILL_SORT_OPTIONS.indexOf(skillSort)
    const next =
      SKILL_SORT_OPTIONS[(index + 1) % SKILL_SORT_OPTIONS.length] ?? 'Relevance'
    setSkillSort(next)
    toast.success(`Sorted by ${next}.`, { title: 'Role-Based Assessment' })
  }

  return (
    <PageContainer contentClassName="gap-4 !bg-white sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackLink onClick={() => navigate(backPath)} />
        <div className="flex items-center gap-2">
          <IconNavButton
            label="Previous candidate"
            onClick={() => goToCompletedInvite(-1)}
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </IconNavButton>
          <IconNavButton
            label="Next candidate"
            tone="solid"
            onClick={() => goToCompletedInvite(1)}
          >
            <ChevronRight className="size-4" strokeWidth={2} />
          </IconNavButton>
        </div>
      </div>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-4">
          <div className="min-w-0 shrink-0 pr-2 lg:max-w-[14rem]">
            <p className="text-xl font-bold text-[#2D2061]">
              {assessment.invite.name}
            </p>
            <a
              href={`mailto:${assessment.invite.email}`}
              className="mt-1 flex items-center gap-1.5 truncate text-sm text-[#8B8B9E] hover:text-[#2D2061] hover:underline"
            >
              <Mail className="size-3.5 shrink-0" strokeWidth={1.75} />
              {assessment.invite.email}
            </a>
          </div>

          <MetaBox label="Job" value={assessment.jobLabel} />
          <MetaBox
            label="Recruiter"
            value={`${assessment.recruiterName} (${assessment.recruiterEmail})`}
          />

          <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={handleShortList}
              className="!h-9 !rounded-full !border-0 !bg-[#EEF1F6] px-5 text-sm font-semibold text-[#2D2061] hover:!bg-[#E4E8F0]"
            >
              Short List
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                void copyText(
                  window.location.href,
                  'Assessment link copied.',
                  'Share',
                )
              }
              className="!h-9 !rounded-md border-[#2D2061] !bg-white px-5 text-sm font-semibold text-[#2D2061] hover:!bg-[#F7F6FA]"
            >
              Share
            </Button>
          </div>
        </div>

        <div className="border-t border-[#E8E6F0] pt-4">
          <div className="flex flex-wrap gap-2">
            {assessment.rounds.map((round) => {
              const active = round.id === activeRound
              return (
                <button
                  key={round.id}
                  type="button"
                  onClick={() => {
                    setActiveRound(round.id)
                    toast.success(
                      round.expired
                        ? `${round.label} selected (expired round).`
                        : `Viewing ${round.label}.`,
                      { title: 'Round' },
                    )
                  }}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-[13px] font-semibold transition-colors',
                    active
                      ? 'border-[#2D2061] bg-[#2D2061] text-white'
                      : 'border-[#E0DDEA] bg-white text-[#4B4A66] hover:bg-[#F7F6FA]',
                  )}
                >
                  {round.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-[#E8E6F0] bg-[#F8FAFC] px-4 py-3.5 sm:px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8B8B9E]">
            Round Status
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D]">
            <CheckCircle2 className="size-4" strokeWidth={2} />
            {assessment.roundStatus}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2">
            <StarRating value={assessment.overallStars} size="md" />
            <span className="text-sm font-bold tabular-nums text-[#2D2061]">
              {assessment.overallStars}/5
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EEFF] px-3 py-1.5 text-[12px] font-semibold text-[#6D5BD0]">
            <Sparkles className="size-3.5" strokeWidth={1.75} />
            AI Score {assessment.aiScorePercent}%
          </span>
        </div>
      </div>

      <section className="rounded-xl border border-[#E8E6F0] bg-[#F8FAFC] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#2D2061]">
              Role-Based Assessment
            </h2>
            <p className="mt-1 text-xs text-[#8B8B9E]">
              Must have skills : {assessment.mustHaveMatched} · Good to have
              skills : {assessment.goodToHaveMatched}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex h-9 items-center gap-2 rounded-md border border-[#E0DDEA] bg-white px-2.5">
              <Search className="size-3.5 text-[#8B8B9E]" strokeWidth={1.75} />
              <input
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
                placeholder="Search"
                className="w-32 border-0 bg-transparent text-sm text-[#1F1D4F] outline-none placeholder:text-[#8B8B9E] sm:w-40"
              />
            </label>
            <button
              type="button"
              onClick={cycleSkillSort}
              className="inline-flex h-9 items-center gap-1 rounded-md border border-[#E0DDEA] bg-white px-3 text-[12px] font-semibold text-[#4B4A66]"
            >
              Sort By : {skillSort}
              <ChevronDown className="size-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <SkillGroupCard
              key={group.id}
              group={group}
              showAll={showAllSkills}
              previewCount={SKILL_TAG_PREVIEW_COUNT}
            />
          ))}
        </div>

        {filteredGroups.some(
          (group) => group.tags.length > SKILL_TAG_PREVIEW_COUNT,
        ) ? (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllSkills((open) => !open)}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2D2061] hover:underline"
            >
              {showAllSkills ? 'Show Less' : 'Show All'}
              <ChevronDown
                className={cn(
                  'size-3.5 transition-transform',
                  showAllSkills && 'rotate-180',
                )}
              />
            </button>
          </div>
        ) : null}
      </section>

      <div className="flex gap-5 border-b border-[#E8E6F0]">
        {CONTENT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setContentTab(tab.id)}
            className={cn(
              'border-b-2 px-0.5 pb-2.5 text-sm font-semibold transition-colors',
              contentTab === tab.id
                ? 'border-[#2D2061] text-[#2D2061]'
                : 'border-transparent text-[#8B8B9E] hover:text-[#2D2061]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {contentTab === 'video' ? (
        <>
          <section className="space-y-4 rounded-xl border border-[#E8E6F0] bg-[#F8FAFC] p-4 sm:p-5">
            <VideoResponsesSection
              durationLabel={assessment.interviewDuration}
              questions={assessment.questions}
              candidateName={assessment.invite.name}
            />
            <ProctoringDetailsSection items={assessment.proctoring} />
            <ReviewAndRatingSection
              assessment={assessment}
              recruiterStatus={recruiterStatus}
              hmRating={hmRating}
              hmNotes={hmNotes}
              hmDecision={hmDecision}
              onHmRatingChange={setHmRating}
              onHmNotesChange={setHmNotes}
              onHmDecisionChange={setHmDecision}
              onSave={() => {
                setRecruiterStatus(hmDecision)
                toast.success(
                  `Saved rating ${hmRating}/5 with status “${hmDecision}”.`,
                  { title: 'Assessment' },
                )
              }}
              onReset={resetHiringManagerForm}
            />
          </section>

          <ResumeJdMatchSection
            assessment={assessment}
            onOpenScore={() => setDetailPanel('score')}
            onOpenCv={() => setDetailPanel('cv')}
            onOpenJob={() => {
              toast.success('Opening job in SAI.', { title: 'Job' })
              navigate('/jobs')
            }}
          />
        </>
      ) : (
        <AiAssessmentSection data={assessment.aiAssessment} />
      )}

      <SidePanel
        open={detailPanel === 'score'}
        onClose={() => setDetailPanel(null)}
        title="Score Explanation"
        widthClassName="w-full max-w-[28rem]"
      >
        <div className="space-y-4 text-sm text-[#4B4A66]">
          <p>
            Overall resume match for {assessment.invite.name} is{' '}
            <span className="font-bold text-[#1F8F57]">
              {assessment.resumeMatchPercent}%
            </span>
            .
          </p>
          <ul className="space-y-3">
            {assessment.matchRows.map((row) => (
              <li key={row.id}>
                <p className="font-semibold text-[#2D2061]">
                  {row.label} · {row.percent}%
                </p>
                <p className="mt-0.5 text-[13px]">
                  {row.percent >= 80
                    ? 'Strong alignment with the job requirements.'
                    : row.percent >= 60
                      ? 'Partial alignment; review gaps before advancing.'
                      : 'Weak alignment; consider clarifying with the candidate.'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </SidePanel>

      <SidePanel
        open={detailPanel === 'cv'}
        onClose={() => setDetailPanel(null)}
        title="Full CV"
        widthClassName="w-full max-w-[28rem]"
      >
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-[12px] font-semibold text-[#8B8B9E]">Candidate</p>
            <p className="mt-0.5 font-semibold text-[#2D2061]">
              {assessment.invite.name}
            </p>
            <p className="text-[#8B8B9E]">{assessment.invite.email}</p>
          </div>
          <SummaryField
            label="Current Role"
            value={assessment.cvSummary.currentRole}
          />
          <SummaryField
            label="Experience"
            value={assessment.cvSummary.experience}
          />
          <SummaryField
            label="Education"
            value={assessment.cvSummary.education}
          />
          <SummaryField label="Top Skills">
            <ChipList items={assessment.cvSummary.skills} />
          </SummaryField>
        </div>
      </SidePanel>
    </PageContainer>
  )
}

function ProctoringDetailsSection({
  items,
}: {
  items: AssessmentProctorMetric[]
}) {
  return (
    <section>
      <h2 className="text-base font-bold text-[#2D2061]">Proctoring Details</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
        {items.map((item) => {
          const Icon = PROCTOR_ICONS[item.id]
          return (
            <div
              key={item.id}
              className={cn(
                'relative rounded-xl px-3 py-3',
                PROCTOR_CARD_CLASS[item.tone],
              )}
            >
              <button
                type="button"
                aria-label={`${item.label} info`}
                onClick={() =>
                  toast.success(PROCTOR_HELP[item.id], {
                    title: item.label,
                  })
                }
                className="absolute right-2 top-2 rounded p-0.5 opacity-50 hover:opacity-100"
              >
                <Info className="size-3" strokeWidth={1.75} />
              </button>
              <Icon className="size-4" strokeWidth={1.75} />
              <p className="mt-2 text-xl font-bold tabular-nums">{item.value}</p>
              <p className="mt-0.5 text-[11px] font-semibold opacity-90">
                {item.label}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ReviewAndRatingSection({
  assessment,
  recruiterStatus,
  hmRating,
  hmNotes,
  hmDecision,
  onHmRatingChange,
  onHmNotesChange,
  onHmDecisionChange,
  onSave,
  onReset,
}: {
  assessment: OneWayAssessment
  recruiterStatus: string
  hmRating: number
  hmNotes: string
  hmDecision: string
  onHmRatingChange: (value: number) => void
  onHmNotesChange: (value: string) => void
  onHmDecisionChange: (value: DecisionOption) => void
  onSave: () => void
  onReset: () => void
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-[#2D2061]">Review & Rating</h2>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.55fr)] lg:items-start">
        <div className="rounded-xl border border-[#E8E6F0] bg-white p-4 sm:p-5">
          <h3 className="text-sm font-bold text-[#2D2061]">Recruiter Rating</h3>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-[#8B8B9E]">Rating</p>
            <StarRating
              value={assessment.recruiterRating}
              size="md"
              className="mt-1.5"
            />
            <p className="mt-5 text-[11px] font-semibold text-[#8B8B9E]">
              Current Status
            </p>
            <p className="mt-1 text-sm font-bold text-[#1F1D4F]">
              {recruiterStatus}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#E8E6F0] bg-white p-4 sm:p-5">
          <h3 className="text-sm font-bold text-[#2D2061]">
            Hiring Manager Rating
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[12px] font-semibold text-[#8B8B9E]">
                Give Rating
              </p>
              <StarRating
                value={hmRating}
                interactive
                size="lg"
                onChange={onHmRatingChange}
                aria-label="Hiring manager rating"
              />
            </div>
            <Textarea
              label="Assessment Notes"
              value={hmNotes}
              onChange={(e) => onHmNotesChange(e.target.value)}
              placeholder="Enter Assessment Notes"
              rows={4}
            />
            <Select
              label="Decision Status"
              options={[...DECISION_OPTIONS]}
              value={hmDecision}
              onChange={(e) =>
                onHmDecisionChange(e.target.value as DecisionOption)
              }
              className="bg-white"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={onSave}
                className="!h-10 !rounded-md !bg-[#2D2061] px-5 text-white hover:!bg-[#241A52]"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                className="!h-10 !rounded-md border-[#2D2061] px-5 text-[#2D2061]"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ResumeJdMatchSection({
  assessment,
  onOpenScore,
  onOpenCv,
  onOpenJob,
}: {
  assessment: OneWayAssessment
  onOpenScore: () => void
  onOpenCv: () => void
  onOpenJob: () => void
}) {
  return (
    <section className="grid gap-4 rounded-xl border border-[#E8E6F0] bg-[#F8FAFC] p-4 sm:grid-cols-3 sm:p-5 lg:grid-cols-3">
      <article className="flex flex-col rounded-xl border border-[#E8E6F0] bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold text-[#2D2061]">
            Resume & JD Match
          </h2>
          <span className="text-xl font-bold tabular-nums text-[#1F8F57]">
            {assessment.resumeMatchPercent}%
          </span>
        </div>
        <ul className="mt-4 flex flex-1 flex-col gap-3">
          {assessment.matchRows.map((row) => (
            <MatchBarRow key={row.id} row={row} />
          ))}
        </ul>
        <button
          type="button"
          onClick={onOpenScore}
          className={CARD_ACTION_CLASS}
        >
          View Score Explanation
        </button>
      </article>

      <article className="flex flex-col rounded-xl border border-[#E8E6F0] bg-white p-4 sm:p-5">
        <h2 className="text-base font-bold text-[#2D2061]">CV Summary</h2>
        <dl className="mt-4 flex-1 space-y-3 text-[13px]">
          <SummaryField
            label="Current Role"
            value={assessment.cvSummary.currentRole}
          />
          <SummaryField
            label="Experience"
            value={assessment.cvSummary.experience}
          />
          <SummaryField
            label="Education"
            value={assessment.cvSummary.education}
          />
          <SummaryField label="Top Skills">
            <ChipList items={assessment.cvSummary.skills} />
          </SummaryField>
        </dl>
        <button type="button" onClick={onOpenCv} className={CARD_ACTION_CLASS}>
          View Full CV
        </button>
      </article>

      <article className="flex flex-col rounded-xl border border-[#E8E6F0] bg-white p-4 sm:p-5">
        <h2 className="text-base font-bold text-[#2D2061]">Job Description</h2>
        <dl className="mt-4 flex-1 space-y-3 text-[13px]">
          <SummaryField
            label="Job Title"
            value={assessment.jobDescription.title}
          />
          <SummaryField
            label="Department"
            value={assessment.jobDescription.department}
          />
          <SummaryField
            label="Location"
            value={assessment.jobDescription.location}
          />
          <SummaryField label="Key Requirements">
            <ChipList items={assessment.jobDescription.requirements} />
          </SummaryField>
        </dl>
        <button
          type="button"
          onClick={onOpenJob}
          className={CARD_ACTION_CLASS}
        >
          View Job in SAI
        </button>
      </article>
    </section>
  )
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D2061] hover:underline"
    >
      <ArrowLeft className="size-4" strokeWidth={2} />
      Go Back
    </button>
  )
}

function MetaBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-[#E0DDEA] bg-[#F8FAFC] px-3.5 py-2.5">
      <p className="text-[11px] font-medium text-[#8B8B9E]">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-[#2D2061]">
        {value}
      </p>
    </div>
  )
}

function IconNavButton({
  label,
  onClick,
  tone = 'outline',
  children,
}: {
  label: string
  onClick: () => void
  tone?: 'outline' | 'solid'
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'grid size-8 place-items-center rounded-md',
        tone === 'solid'
          ? 'border border-[#2D2061] bg-[#2D2061] text-white hover:bg-[#241A52]'
          : 'border border-[#E0DDEA] bg-white text-[#2D2061] hover:bg-[#F0EEF5]',
      )}
    >
      {children}
    </button>
  )
}

function SkillGroupCard({
  group,
  showAll,
  previewCount,
}: {
  group: AssessmentSkillGroup
  showAll: boolean
  previewCount: number
}) {
  const hiddenCount = Math.max(0, group.tags.length - previewCount)
  const tags = showAll ? group.tags : group.tags.slice(0, previewCount)

  return (
    <article className="rounded-xl border border-[#E8E6F0] bg-white p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-[#1F1D4F]">
          {group.title}
        </h3>
        <p
          className={cn(
            'shrink-0 text-sm font-bold tabular-nums',
            SKILL_PERCENT_CLASS[group.tone],
          )}
        >
          {group.percent}%
        </p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EDEAF6]">
        <div
          className={cn('h-full rounded-full', SKILL_BAR_CLASS[group.tone])}
          style={{ width: `${group.percent}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
              SKILL_TAG_CLASS[tag.tone],
            )}
          >
            {tag.label}
          </span>
        ))}
        {!showAll && hiddenCount > 0 ? (
          <span className="rounded-full bg-[#F0EEF5] px-2.5 py-0.5 text-[11px] font-semibold text-[#6B6B80]">
            +{hiddenCount} more
          </span>
        ) : null}
      </div>
    </article>
  )
}

function MatchBarRow({ row }: { row: AssessmentMatchRow }) {
  return (
    <li>
      <p className="mb-1.5 text-[12px] font-semibold text-[#4B4A66]">
        {row.label}
      </p>
      <div className="flex items-center gap-2.5">
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#EDEAF6]">
          <div
            className={cn('h-full rounded-full', MATCH_BAR_CLASS[row.tone])}
            style={{ width: `${row.percent}%` }}
          />
        </div>
        <span className="w-9 shrink-0 text-right text-[12px] font-bold tabular-nums text-[#2D2061]">
          {row.percent}%
        </span>
      </div>
    </li>
  )
}

function SummaryField({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: ReactNode
}) {
  return (
    <div>
      <dt className="text-[12px] font-semibold text-[#8B8B9E]">{label}</dt>
      {children ? (
        <dd className="mt-1.5">{children}</dd>
      ) : (
        <dd className="mt-0.5 font-medium text-[#1F1D4F]">{value}</dd>
      )}
    </div>
  )
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={CHIP_CLASS}>
          {item}
        </span>
      ))}
    </div>
  )
}
