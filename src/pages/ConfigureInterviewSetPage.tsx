import { useMemo, useState, type DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'
import {
  AppTopBar,
  Button,
  RadioGroup,
  Select,
  StepsWizard,
  SuccessMessage,
  toast,
} from '../components/ui'
import { PageHeader } from '../components/layout'
import { StepHeader } from '../components/jobs/create/StepChrome'
import { JOBS } from '../data/jobs'
import {
  CreateRoundPanel,
  NEW_ROUND_DEFAULTS,
  type PanelRound,
  type RoundValues,
} from '../components/interviews/two-way/CreateRoundPanel'
import {
  TwoWayRoundCard,
  type PanelMember,
} from '../components/interviews/two-way/TwoWayRoundCard'
import { getPlatformUsers } from '../data/users'

const STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'rounds', label: 'Rounds' },
  { id: 'review', label: 'Review' },
]
const LAST_STEP = STEPS.length - 1

/** Demo working hours for panel members */
const WORKING_HOURS = [
  'Mon–Fri 10:00–18:00',
  'Mon–Fri 11:00–20:00',
  'Mon–Fri 09:00–17:00',
  'Sun–Thu 08:00–16:00',
]
const LIST_PATH = '/e2e-interviews/two-way/interview-sets'

const ORGANISER_OPTIONS = [
  { value: 'Recruiter', label: 'Recruiter' },
  { value: 'Hiring Manager', label: 'Hiring Manager' },
]

/**
 * Two-Way Interviews → Interview Sets → Configure Interview Set.
 * Same wizard layout as Create (One-Way) Interview: Details → Rounds → Review.
 */
export function ConfigureInterviewSetPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [jobCode, setJobCode] = useState('')
  const [organiser, setOrganiser] = useState('Recruiter')
  const [rounds, setRounds] = useState<PanelRound[]>([])
  /** Round being edited in the side panel; 'new' when creating */
  const [roundPanel, setRoundPanel] = useState<PanelRound | 'new' | null>(null)
  /** Expanded round cards (all collapsed initially) */
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [dragId, setDragId] = useState<string | null>(null)
  const people = useMemo<PanelMember[]>(
    () =>
      getPlatformUsers().map((u, i) => ({
        name: u.name,
        email: u.email,
        hours: `${WORKING_HOURS[i % WORKING_HOURS.length]} (GMT+04:00) Asia/Dubai`,
      })),
    [],
  )
  const [jobError, setJobError] = useState('')
  const [success, setSuccess] = useState(false)

  const jobOptions = useMemo(
    () =>
      JOBS.filter((job) => job.status === 'active').map((job) => ({
        value: job.code,
        label: job.title,
      })),
    [],
  )
  const jobTitle = jobOptions.find((j) => j.value === jobCode)?.label ?? ''

  function goTo(next: number) {
    setStep(next)
    setMaxReached((max) => Math.max(max, next))
  }

  function handleContinue() {
    if (step === 0 && !jobCode) {
      setJobError('Select a job.')
      return
    }
    if (step === 1 && rounds.length === 0) {
      toast.error('Create at least one round to continue.', { title: 'Rounds' })
      return
    }
    if (step >= LAST_STEP) {
      setSuccess(true)
      return
    }
    goTo(step + 1)
  }

  function saveRound(values: RoundValues) {
    if (roundPanel === 'new') {
      setRounds((current) => [
        ...current,
        { id: `panel-round-${Date.now()}`, ...NEW_ROUND_DEFAULTS, ...values },
      ])
      toast.success(`“${values.name}” created.`, { title: 'Rounds' })
    } else if (roundPanel) {
      setRounds((current) =>
        current.map((r) => (r.id === roundPanel.id ? { ...r, ...values } : r)),
      )
      toast.success(`“${values.name}” updated.`, { title: 'Rounds' })
    }
    setRoundPanel(null)
  }

  function patchRound(id: string, patch: Partial<PanelRound>) {
    setRounds((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function handleRoundAction(round: PanelRound, action: 'edit' | 'duplicate' | 'remove') {
    if (action === 'edit') {
      setRoundPanel(round)
      return
    }
    if (action === 'duplicate') {
      const taken = new Set(rounds.map((r) => r.name.toLowerCase()))
      let name = `${round.name} (Copy)`
      for (let n = 2; taken.has(name.toLowerCase()); n += 1) name = `${round.name} (Copy ${n})`
      setRounds((current) => {
        const index = current.findIndex((r) => r.id === round.id)
        const copy = { ...round, id: `panel-round-${Date.now()}`, name }
        return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]
      })
      toast.success(`Duplicated “${round.name}”.`, { title: 'Rounds' })
      return
    }
    setRounds((current) => current.filter((r) => r.id !== round.id))
    setExpandedIds((ids) => ids.filter((id) => id !== round.id))
    toast.success(`Removed “${round.name}”.`, { title: 'Rounds' })
  }

  function handleRoundDragOver(event: DragEvent, overId: string) {
    if (!dragId) return
    event.preventDefault()
    if (dragId === overId) return
    setRounds((current) => {
      const from = current.findIndex((r) => r.id === dragId)
      const to = current.findIndex((r) => r.id === overId)
      if (from < 0 || to < 0) return current
      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  function resetWizard() {
    setStep(0)
    setMaxReached(0)
    setJobCode('')
    setOrganiser('Recruiter')
    setRounds([])
    setExpandedIds([])
    setJobError('')
    setSuccess(false)
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col bg-white">
      <AppTopBar />

      {success ? (
        <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-8">
          <SuccessMessage
            title="Interview Set Configured Successfully!"
            primaryAction={{
              label: 'View All Interview Sets',
              onClick: () => navigate(LIST_PATH),
            }}
            secondaryAction={{ label: 'Configure Another', onClick: resetWizard }}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="flex min-h-0 flex-1 flex-col px-8 pt-8">
            <header className="shrink-0 border-b border-[#eceaf3] bg-white pb-3">
              <button
                type="button"
                onClick={() => navigate(LIST_PATH)}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
              >
                <ArrowLeft className="size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                Go Back
              </button>
              <PageHeader
                className="mt-1"
                title="Configure Panel"
                subtitle="Set up the job, rounds and panel for this two-way interview set."
              />
            </header>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
              <aside className="relative z-20 w-full shrink-0 overflow-visible border-b border-[#eceaf3] bg-white pt-3 pb-2 lg:w-[15rem] lg:border-b-0 lg:border-r lg:border-[#E4E3EC] lg:pt-3 xl:w-[15.75rem]">
                <StepsWizard
                  steps={STEPS}
                  currentStep={step}
                  completedThrough={maxReached}
                  onStepClick={(index) => {
                    if (index <= maxReached) goTo(index)
                  }}
                />
              </aside>

              <div className="relative z-0 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white py-3 pl-6 pr-0 scrollbar-none">
                {step === 0 ? (
                  <div key="details" className="animate-fade-up">
                    <StepHeader
                      title="Panel details"
                      description="Set up the basics for this interview panel."
                    />
                    <div className="flex flex-col gap-5">
                      <Select
                        id="panel-job"
                        label="Job"
                        requiredMark
                        options={jobOptions}
                        value={jobCode}
                        onChange={(e) => {
                          setJobCode(e.target.value)
                          setJobError('')
                        }}
                        placeholder="Select job"
                        error={jobError || undefined}
                      />
                      <RadioGroup
                        label="Who organises the interviews"
                        name="panel-organiser"
                        value={organiser}
                        onChange={setOrganiser}
                        options={ORGANISER_OPTIONS}
                      />
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div key="rounds" className="animate-fade-up">
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-[#2D2061]">Rounds</h2>
                        <p className="mt-0.5 text-sm text-[#8B8B9E]">
                          Each round has its own panel, slot rules and status mapping.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setRoundPanel('new')}
                        className="!h-10 shrink-0 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
                      >
                        Create new round
                      </Button>
                    </div>

                    {rounds.length === 0 ? (
                      <p className="rounded-xl border border-[#E4E1EE] bg-white px-4 py-4 text-sm text-[#6B6B80]">
                        No rounds yet. Create the first round.
                      </p>
                    ) : null}

                    {rounds.length > 0 ? (
                      <ol className="flex flex-col gap-3">
                        {rounds.map((round, index) => (
                          <li key={round.id}>
                            <TwoWayRoundCard
                              round={round}
                              number={index + 1}
                              expanded={expandedIds.includes(round.id)}
                              onToggleExpanded={() =>
                                setExpandedIds((ids) =>
                                  ids.includes(round.id)
                                    ? ids.filter((id) => id !== round.id)
                                    : [...ids, round.id],
                                )
                              }
                              people={people}
                              onChange={(patch) => patchRound(round.id, patch)}
                              onAction={(action) => handleRoundAction(round, action)}
                              dragging={dragId === round.id}
                              onDragStart={() => setDragId(round.id)}
                              onDragOver={(e) => handleRoundDragOver(e, round.id)}
                              onDragEnd={() => setDragId(null)}
                            />
                          </li>
                        ))}
                      </ol>
                    ) : null}
                    <p className="mt-5 text-xs leading-relaxed text-[#6B6B80]">
                      Enable Two-Way AI on a round to have Jeeves join it; its interview plan and
                      summary are set in Interviews › Set up two-way after you save.
                    </p>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div key="review" className="animate-fade-up">
                    <StepHeader title="Review" description="Check the interview set before saving." />
                    <section className="mb-4 rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5">
                      <ReviewSectionHeader title="Panel details" onEdit={() => goTo(0)} />
                      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <ReviewField label="Job" value={jobTitle || '—'} />
                        <ReviewField label="Organiser" value={organiser} />
                        <ReviewField label="Rounds" value={String(rounds.length)} />
                      </dl>
                    </section>
                    <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5">
                      <ReviewSectionHeader title="Rounds" onEdit={() => goTo(1)} />
                      <ol className="flex flex-col gap-2">
                        {rounds.map((round, index) => (
                          <li
                            key={round.id}
                            className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-[#F5F5F8] px-3 py-2.5 text-sm"
                          >
                            <span className="font-semibold text-[#1A1A2E]">
                              {String(index + 1).padStart(2, '0')}. {round.name || 'Untitled round'}
                            </span>
                            <span className="text-[#6B6B80]">
                              {round.meetingPlatform} · {round.durationMins} minutes
                            </span>
                            {round.aiJoins ? (
                              <span className="inline-flex rounded-full bg-[#FDE7EF] px-2 py-0.5 text-[11px] font-semibold text-[#C2185B]">
                                Two-Way AI
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ol>
                    </section>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <footer className="z-30 shrink-0 border-t border-[#eceaf3] bg-white px-8 py-4">
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => (step === 0 ? navigate(LIST_PATH) : setStep(step - 1))}
                className="min-w-[6.5rem] border-[#2D2061]/40 text-[#2D2061] hover:bg-[#f7f6fb]"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleContinue}
                className="min-w-[6.5rem] !bg-[#2D2061] hover:!bg-[#241a52]"
              >
                {step >= LAST_STEP ? 'Save' : 'Continue'}
              </Button>
            </div>
          </footer>
        </div>
      )}
      <CreateRoundPanel
        open={roundPanel !== null}
        round={roundPanel === 'new' ? null : roundPanel}
        defaultName={`Round ${rounds.length + 1}`}
        takenNames={rounds.map((r) => r.name)}
        onClose={() => setRoundPanel(null)}
        onSave={saveRound}
      />
    </div>
  )
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-[#8B8B9E]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[#2D2061]">{value}</dd>
    </div>
  )
}

/** Review section title with an edit (pencil) button that jumps to that step. */
function ReviewSectionHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <header className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${title.toLowerCase()}`}
        title={`Edit ${title.toLowerCase()}`}
        className="inline-flex size-8 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F5F4FA]"
      >
        <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </header>
  )
}
