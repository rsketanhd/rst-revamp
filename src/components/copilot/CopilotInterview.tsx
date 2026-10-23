import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CircleDot, Loader2 } from 'lucide-react'
import { Select } from '../ui'
import { cn } from '../../lib/cn'
import {
  COPILOT_INTERVIEW_STEPS,
  COPILOT_LOCATION_OPTIONS,
  COPILOT_MATCHES,
  COPILOT_MODE_OPTIONS,
  COPILOT_NOTICE_OPTIONS,
  COPILOT_PROFILE,
  COPILOT_SKILL_OPTIONS,
  COPILOT_STATUS_OPTIONS,
  type CopilotInterviewStepId,
} from '../../data/copilotInterview'

export type CopilotInterviewProps = {
  onComplete: () => void
}

type ChatTurn =
  | { id: string; kind: 'bot'; htmlKey: CopilotInterviewStepId }
  | { id: string; kind: 'me'; text: string }
  | { id: string; kind: 'progress'; value: number }
  | { id: string; kind: 'typing' }

type InterviewAnswers = {
  skills: string[]
  locations: string[]
  mode: string
  status: string
  notice: string
  currency: string
  minPay: string
}

const INITIAL_ANSWERS: InterviewAnswers = {
  skills: [],
  locations: ['Riyadh'],
  mode: 'Hybrid',
  status: COPILOT_STATUS_OPTIONS[0],
  notice: '1 month',
  currency: 'SAR',
  minPay: '20,000',
}

function toggleItem(list: string[], item: string) {
  return list.includes(item)
    ? list.filter((value) => value !== item)
    : [...list, item]
}

export function CopilotInterview({ onComplete }: CopilotInterviewProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [completeness, setCompleteness] = useState(COPILOT_PROFILE.completeness)
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [controlsReady, setControlsReady] = useState(false)
  const [answers, setAnswers] = useState<InterviewAnswers>(INITIAL_ANSWERS)
  const stageRef = useRef<HTMLDivElement>(null)
  const step = COPILOT_INTERVIEW_STEPS[stepIndex]
  const progressSteps = COPILOT_INTERVIEW_STEPS.slice(0, -1)

  useEffect(() => {
    pushBot(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turns, controlsReady])

  function pushBot(index: number) {
    const next = COPILOT_INTERVIEW_STEPS[index]
    if (!next) return

    setControlsReady(false)
    const typingId = `typing-${index}`
    setTurns((current) => [...current, { id: typingId, kind: 'typing' }])

    window.setTimeout(() => {
      setTurns((current) => [
        ...current.filter((turn) => turn.id !== typingId),
        { id: `bot-${index}-${Date.now()}`, kind: 'bot', htmlKey: next.id },
      ])
      setControlsReady(true)
    }, 450)
  }

  function answer(text: string, gain: number) {
    setControlsReady(false)
    setTurns((current) => {
      const next: ChatTurn[] = [...current]
      if (text) {
        next.push({ id: `me-${Date.now()}`, kind: 'me', text })
      }
      if (gain > 0) {
        const nextComplete = Math.min(100, completeness + gain)
        next.push({
          id: `prog-${Date.now()}`,
          kind: 'progress',
          value: nextComplete,
        })
        setCompleteness(nextComplete)
      }
      return next
    })

    const nextIndex = stepIndex + 1
    setStepIndex(nextIndex)
    if (nextIndex < COPILOT_INTERVIEW_STEPS.length) {
      window.setTimeout(() => pushBot(nextIndex), 200)
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#F4F4FB]">
      <header className="flex items-center gap-4 border-b border-[#E6E5F2] bg-white px-6 py-4 sm:px-8">
        <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#5D5A8A] to-[#6B4DE6] text-white">
          <CircleDot className="size-5" strokeWidth={2} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#1F1D4F]">AI Copilot</p>
          <p className="text-xs text-[#4B4A66]">
            A 3-minute chat to set up your profile and find your first matches
          </p>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          {progressSteps.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                'h-1.5 w-7 rounded-full',
                index < stepIndex
                  ? 'bg-[#2D2061]'
                  : index === stepIndex
                    ? 'bg-[#6B4DE6]'
                    : 'bg-[#E6E5F2]',
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="text-sm font-medium text-[#4B4A66] transition-colors hover:text-[#1F1D4F]"
        >
          Skip for now
        </button>
      </header>

      <div
        ref={stageRef}
        className="mx-auto flex w-full min-h-0 max-w-[48rem] flex-1 flex-col gap-4 overflow-y-auto px-4 py-8 sm:px-6"
      >
        <ProgressBar value={completeness} />

        {turns.map((turn) => {
          switch (turn.kind) {
            case 'typing':
              return (
                <BotBubble key={turn.id}>
                  <TypingDots />
                </BotBubble>
              )
            case 'me':
              return (
                <div
                  key={turn.id}
                  className="flex items-start justify-end gap-3"
                >
                  <div className="max-w-[37.5rem] rounded-2xl rounded-br-sm bg-[#2D2061] px-4 py-3.5 text-sm leading-relaxed text-white">
                    {turn.text}
                  </div>
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2D2061] to-[#C0436A] text-[11px] font-semibold text-white">
                    {COPILOT_PROFILE.initials}
                  </div>
                </div>
              )
            case 'progress':
              return <ProgressBar key={turn.id} value={turn.value} />
            case 'bot':
              return (
                <BotBubble key={turn.id}>
                  <BotCopy stepId={turn.htmlKey} completeness={completeness} />
                </BotBubble>
              )
            default: {
              const exhaustive: never = turn
              return exhaustive
            }
          }
        })}

        {controlsReady && step ? (
          <div className="pl-12">
            <StepControls
              stepId={step.id}
              answers={answers}
              onAnswersChange={setAnswers}
              onAnswer={(text) => answer(text, step.gain)}
              onSkip={() => answer('', 0)}
              onFinish={onComplete}
            />
          </div>
        ) : null}
      </div>

      <footer className="px-6 py-4 text-center text-xs text-[#8A89A3]">
        Everything you say here is saved to{' '}
        <span className="font-semibold text-[#4B4A66]">My Profile</span> and you
        can change it any time.
      </footer>
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-[#4B4A66]">
      <span>Profile</span>
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#E6E5F2]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2D2061] to-[#6B4DE6] transition-[width] duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-semibold text-[#1F1D4F]">{value}%</span>
    </div>
  )
}

function BotBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#5D5A8A] to-[#6B4DE6] text-white">
        <CircleDot className="size-4" strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="max-w-[37.5rem] rounded-2xl rounded-bl-sm border border-[#E6E5F2] bg-white px-4 py-3.5 text-[15px] leading-relaxed text-[#1F1D4F] shadow-[0_1px_2px_rgba(31,29,79,0.06),0_6px_18px_rgba(31,29,79,0.05)]">
        {children}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-1">
      <Loader2 className="size-4 animate-spin text-[#8A89A3]" aria-hidden="true" />
      <span className="sr-only">AI Copilot is typing</span>
    </span>
  )
}

function Why({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-[12.5px] text-[#8A89A3]">{children}</p>
}

function BotCopy({
  stepId,
  completeness,
}: {
  stepId: CopilotInterviewStepId
  completeness: number
}) {
  switch (stepId) {
    case 'resume':
      return (
        <>
          <p>
            Hi {COPILOT_PROFILE.name}, I&apos;m your AI Copilot. I&apos;ll ask a
            few quick questions so I can find jobs that actually fit — about
            three minutes.
          </p>
          <p className="mt-2">
            First, here&apos;s what I read from your resume. Is this right?
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 rounded-[10px] bg-[#F4F4FB] px-3.5 py-3 text-sm">
            <Parsed label="Current title" value={COPILOT_PROFILE.title} />
            <Parsed label="Experience" value={COPILOT_PROFILE.years} />
            <Parsed label="Location" value={COPILOT_PROFILE.location} />
            <Parsed label="Education" value={COPILOT_PROFILE.education} />
            <div className="col-span-2">
              <Parsed
                label="Skills found"
                value={COPILOT_PROFILE.skills.join(', ')}
              />
            </div>
          </div>
        </>
      )
    case 'skills':
      return (
        <>
          <p>
            Great. Jobs in your field often ask for these too. Which do you
            have? Pick any that apply.
          </p>
          <Why>Why: skills are the biggest factor in your match score.</Why>
        </>
      )
    case 'role':
      return (
        <>
          <p>Are you working right now, and how soon could you start?</p>
          <Why>Why: employers here filter by notice period.</Why>
        </>
      )
    case 'pay':
      return (
        <p>
          What monthly salary are you aiming for? I&apos;ll only show jobs in
          range, and I never share this with employers.
        </p>
      )
    case 'where':
      return <p>Where would you work, and how?</p>
    case 'visa':
      return (
        <>
          <p>
            Last one — do you need visa or Iqama sponsorship to work in your
            chosen locations?
          </p>
          <Why>
            Why: it changes which employers can hire you, so I&apos;d rather
            know now than after an interview.
          </Why>
        </>
      )
    case 'matches':
      return (
        <>
          <p>
            Done — your profile is{' '}
            <span className="font-semibold">{completeness}% complete</span>
            {completeness < 100
              ? ", and I'll remind you about the rest later"
              : ''}
            . Based on what you told me, these roles match. Here are the top
            three:
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {COPILOT_MATCHES.map((match) => (
              <li
                key={match.title}
                className="grid grid-cols-[1fr_auto] gap-x-3 rounded-[10px] border border-[#E6E5F2] bg-white px-3 py-2.5"
              >
                <p className="text-sm font-semibold text-[#1F1D4F]">
                  {match.title}
                </p>
                <p className="row-span-2 self-center text-[15px] font-bold text-[#2F8F5B]">
                  {match.score}%
                </p>
                <p className="text-xs text-[#8A89A3]">{match.company}</p>
              </li>
            ))}
          </ul>
        </>
      )
    default: {
      const exhaustive: never = stepId
      return exhaustive
    }
  }
}

function Parsed({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <small className="block text-[11.5px] text-[#8A89A3]">{label}</small>
      <span className="text-[#1F1D4F]">{value}</span>
    </div>
  )
}

function Chip({
  children,
  active,
  variant = 'default',
  disabled,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  variant?: 'default' | 'primary' | 'skip'
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-2 text-[13.5px] font-medium transition-colors disabled:opacity-45',
        variant === 'primary' &&
          'border-[#6B4DE6] bg-[#6B4DE6] text-white hover:bg-[#5A3FD0]',
        variant === 'skip' &&
          'border-dashed border-[#CFCDE3] bg-white text-[#8A89A3]',
        variant === 'default' &&
          (active
            ? 'border-[#2D2061] bg-[#2D2061] text-white'
            : 'border-[#CFCDE3] bg-white text-[#1F1D4F] hover:border-[#5D5A8A] hover:bg-[#ECEAF7]'),
      )}
    >
      {children}
    </button>
  )
}

function ChipRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

function SaveSkipActions({
  onSave,
  onSkip,
  saveLabel = 'Save',
  skipLabel = 'Skip',
  saveDisabled,
}: {
  onSave: () => void
  onSkip: () => void
  saveLabel?: string
  skipLabel?: string
  saveDisabled?: boolean
}) {
  return (
    <ChipRow>
      <Chip variant="primary" disabled={saveDisabled} onClick={onSave}>
        {saveLabel}
      </Chip>
      <Chip variant="skip" onClick={onSkip}>
        {skipLabel}
      </Chip>
    </ChipRow>
  )
}

function StepControls({
  stepId,
  answers,
  onAnswersChange,
  onAnswer,
  onSkip,
  onFinish,
}: {
  stepId: CopilotInterviewStepId
  answers: InterviewAnswers
  onAnswersChange: (
    update: InterviewAnswers | ((current: InterviewAnswers) => InterviewAnswers),
  ) => void
  onAnswer: (text: string) => void
  onSkip: () => void
  onFinish: () => void
}) {
  function patch(partial: Partial<InterviewAnswers>) {
    onAnswersChange((current) => ({ ...current, ...partial }))
  }

  switch (stepId) {
    case 'resume':
      return (
        <ChipRow>
          <Chip variant="primary" onClick={() => onAnswer("Yes, that's right")}>
            Yes, that&apos;s right
          </Chip>
          <Chip onClick={() => onAnswer("Mostly — I'll fix details later")}>
            Mostly right, I&apos;ll fix details later
          </Chip>
          <Chip variant="skip" onClick={onSkip}>
            Skip
          </Chip>
        </ChipRow>
      )
    case 'skills':
      return (
        <div className="flex flex-col gap-2.5">
          <ChipRow>
            {COPILOT_SKILL_OPTIONS.map((skill) => (
              <Chip
                key={skill}
                active={answers.skills.includes(skill)}
                onClick={() =>
                  onAnswersChange((current) => ({
                    ...current,
                    skills: toggleItem(current.skills, skill),
                  }))
                }
              >
                {skill}
              </Chip>
            ))}
          </ChipRow>
          <SaveSkipActions
            saveLabel="Add selected"
            skipLabel="None of these"
            saveDisabled={answers.skills.length === 0}
            onSave={() => onAnswer(answers.skills.join(', '))}
            onSkip={() => onAnswer('None of these')}
          />
        </div>
      )
    case 'role':
      return (
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Select
              label="Current status"
              options={[...COPILOT_STATUS_OPTIONS]}
              value={answers.status}
              onChange={(e) => patch({ status: e.target.value })}
            />
            <Select
              label="Notice period"
              options={[...COPILOT_NOTICE_OPTIONS]}
              value={answers.notice}
              onChange={(e) => patch({ notice: e.target.value })}
            />
          </div>
          <SaveSkipActions
            onSave={() =>
              onAnswer(`${answers.status} · notice ${answers.notice}`)
            }
            onSkip={onSkip}
          />
        </div>
      )
    case 'pay':
      return (
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Select
              label="Currency"
              options={['SAR', 'AED', 'USD']}
              value={answers.currency}
              onChange={(e) => patch({ currency: e.target.value })}
            />
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xs font-medium text-[#2D2061]">
                Minimum per month
              </span>
              <input
                value={answers.minPay}
                onChange={(e) => patch({ minPay: e.target.value })}
                className="h-11 rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
              />
            </label>
          </div>
          <SaveSkipActions
            skipLabel="Prefer not to say"
            onSave={() =>
              onAnswer(`${answers.currency} ${answers.minPay}+ per month`)
            }
            onSkip={onSkip}
          />
        </div>
      )
    case 'where':
      return (
        <div className="flex flex-col gap-2.5">
          <ChipRow>
            {COPILOT_LOCATION_OPTIONS.map((location) => (
              <Chip
                key={location}
                active={answers.locations.includes(location)}
                onClick={() =>
                  onAnswersChange((current) => ({
                    ...current,
                    locations: toggleItem(current.locations, location),
                  }))
                }
              >
                {location}
              </Chip>
            ))}
          </ChipRow>
          <ChipRow>
            {COPILOT_MODE_OPTIONS.map((mode) => (
              <Chip
                key={mode}
                active={answers.mode === mode}
                onClick={() => patch({ mode })}
              >
                {mode}
              </Chip>
            ))}
          </ChipRow>
          <SaveSkipActions
            onSave={() =>
              onAnswer(
                `${answers.locations.join(', ') || 'Any'} · ${answers.mode}`,
              )
            }
            onSkip={onSkip}
          />
        </div>
      )
    case 'visa':
      return (
        <ChipRow>
          <Chip onClick={() => onAnswer("No, I'm eligible to work")}>
            No, I&apos;m eligible to work
          </Chip>
          <Chip onClick={() => onAnswer("Yes, I'd need sponsorship")}>
            Yes, I&apos;d need sponsorship
          </Chip>
          <Chip onClick={() => onAnswer('Depends on the country')}>
            Depends on the country
          </Chip>
          <Chip variant="skip" onClick={onSkip}>
            Skip
          </Chip>
        </ChipRow>
      )
    case 'matches':
      return (
        <ChipRow>
          <Chip variant="primary" onClick={onFinish}>
            Go to my dashboard
          </Chip>
          <Chip onClick={onFinish}>See all matches</Chip>
        </ChipRow>
      )
    default: {
      const exhaustive: never = stepId
      return exhaustive
    }
  }
}
