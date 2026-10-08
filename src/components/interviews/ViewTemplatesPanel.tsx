import { useMemo, useState } from 'react'
import { Button, SidePanel } from '../ui'
import { SettingsUnderlineTabs } from '../settings/SettingsUnderlineTabs'
import {
  getInterviewSetRounds,
  type InterviewSetTemplate,
} from '../../data/oneWayInterviews'

export type ViewTemplatesPanelProps = {
  open: boolean
  onClose: () => void
  interview: { id: string; title: string } | null
  /** Opens Edit Interview Set (footer button) */
  onEditInterviewSet: () => void
}

/**
 * One-Way Interviews → ⋮ → View Templates (read-only).
 * One tab per round: round settings, default template, resend order.
 */
export function ViewTemplatesPanel({
  open,
  onClose,
  interview,
  onEditInterviewSet,
}: ViewTemplatesPanelProps) {
  const rounds = useMemo(
    () => (interview ? getInterviewSetRounds(interview.id) : []),
    [interview],
  )
  const [roundId, setRoundId] = useState('')
  const [shownFor, setShownFor] = useState<string | null>(null)

  // Start on Round 1 whenever a different interview is opened
  if (open && interview && interview.id !== shownFor) {
    setShownFor(interview.id)
    setRoundId(rounds[0]?.id ?? '')
  }

  const round = rounds.find((r) => r.id === roundId) ?? rounds[0]

  return (
    <SidePanel
      open={open && Boolean(interview)}
      onClose={onClose}
      title={interview ? `Templates for ${interview.title}` : 'Templates'}
      widthClassName="w-full max-w-[52rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-md border-[#d5d2e2] bg-white px-5 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={onEditInterviewSet}
            className="!h-10 !rounded-md !bg-[#2D2061] px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Edit Interview Set
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {rounds.length > 0 ? (
          <SettingsUnderlineTabs
            aria-label="Rounds"
            value={round?.id ?? ''}
            onChange={setRoundId}
            className="flex-wrap"
            options={rounds.map((r) => ({
              value: r.id,
              label: `${r.name} (${1 + r.resendTemplates.length})`,
            }))}
          />
        ) : null}

        {round ? (
          <>
            <dl key={round.id} className="grid animate-fade-up grid-cols-2 gap-4 rounded-lg bg-[#F5F5F9] px-4 py-3.5 sm:grid-cols-5">
              <Detail label="Round" value={round.name} />
              <Detail label="Interview type" value={round.interviewType} />
              <Detail label="Difficulty level" value={round.difficulty} />
              <Detail label="Avatar" value={round.avatarEnabled ? 'Enabled' : 'Disabled'} />
              <Detail
                label="Link valid for"
                value={`${round.linkValidDays} ${round.linkValidDays === 1 ? 'day' : 'days'}`}
              />
            </dl>

            <section>
              <SectionLabel>Default template</SectionLabel>
              <TemplateCard template={round.defaultTemplate} badge="Default" />
            </section>

            <section>
              <SectionLabel>Resend order</SectionLabel>
              {round.resendTemplates.length === 0 ? (
                <p className="flex min-h-[5.5rem] items-center justify-center rounded-lg border border-dashed border-[#DAD6E6] px-4 py-8 text-center text-[13px] font-medium text-[#2D2061]">
                  No resend templates for this round.
                </p>
              ) : (
                <ol className="flex flex-col gap-3">
                  {round.resendTemplates.map((template, i) => (
                    <li key={template.id}>
                      <TemplateCard template={template} badge={`Resend ${i + 1}`} />
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        ) : null}
      </div>
    </SidePanel>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-[#8B8B9E]">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[#1A1A2E]">{value}</dd>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
      {children}
    </h3>
  )
}

function TemplateCard({
  template,
  badge,
}: {
  template: InterviewSetTemplate
  badge: string
}) {
  const count = template.questions.length
  const mins = template.questions.reduce((sum, q) => sum + q.prepMins + q.answerMins, 0)
  return (
    <article className="rounded-lg border border-[#E4E1EE] bg-white p-3.5">
      <header className="mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="rounded-md bg-[#F3EEF9] px-2 py-0.5 text-xs font-medium text-[#5B3E8F]">
          {badge}
        </span>
        <h4 className="text-sm font-bold text-[#1A1A2E]">{template.name}</h4>
        <span className="text-xs text-[#8B8B9E]">
          · {template.language}, {count} {count === 1 ? 'question' : 'questions'}, {mins} mins
        </span>
      </header>
      <ol className="flex flex-col gap-2">
        {template.questions.map((question, i) => (
          <li key={question.id} className="flex items-start gap-3 rounded-md bg-[#F5F5F8] px-3 py-2.5">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[#2D2061] text-[10px] font-bold text-white">
              Q{i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] leading-snug text-[#1A1A2E]">{question.text}</p>
              <p className="mt-0.5 text-[11px] text-[#8B8B9E]">
                Preparation {question.prepMins} min, answer {question.answerMins} mins ·{' '}
                {question.topic}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}
