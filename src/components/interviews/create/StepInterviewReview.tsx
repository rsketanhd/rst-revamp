import { Info, Pencil } from 'lucide-react'
import type { CreateOneWayInterviewForm } from './types'
import type { InterviewTemplateOption } from './StepInterviewTemplate'
import type { TemplateQuestion } from './CreateTemplatePanel'
import { cn } from '../../../lib/cn'

type Props = {
  value: CreateOneWayInterviewForm
  jobLabels: string[]
  template: InterviewTemplateOption | null
  onEditDetails?: () => void
  onEditTemplate?: () => void
}

function isTelephonicInterview(interviewType?: string) {
  return (interviewType ?? '').toLowerCase().includes('telephonic')
}

/**
 * Step 03 — Review interview + selected template before create.
 */
export function StepInterviewReview({
  value,
  jobLabels,
  template,
  onEditDetails,
  onEditTemplate,
}: Props) {
  const jobTitle = jobLabels.length > 0 ? jobLabels.join(', ') : '—'
  const description = value.description.trim() || '—'
  const language = template?.language || 'English'
  const questions = template?.questions ?? []
  const questionCount = String(questions.length).padStart(2, '0')
  const telephonic = isTelephonicInterview(value.interviewType)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-[#2D2061]">Review</h2>
        <p className="mt-0.5 text-sm text-[#8B8B9E]">
          Set up the questions for the interview template
        </p>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-[#D4DCF0] bg-[#EEF2FA] px-3.5 py-3">
        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2D2061] text-white">
          <Info className="size-3" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <p className="text-sm leading-snug text-[#2D2061]">
          Interview will be in{' '}
          <span className="font-semibold">{language}</span> as you have selected{' '}
          <span className="font-semibold">{language}</span> template.
        </p>
      </div>

      {/* Interview Details */}
      <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5">
        <header className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-[#2D2061]">Interview Details</h3>
          {onEditDetails ? (
            <button
              type="button"
              onClick={onEditDetails}
              aria-label="Edit interview details"
              className="inline-flex size-8 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F5F4FA]"
            >
              <Pencil className="size-4" strokeWidth={1.75} />
            </button>
          ) : null}
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DetailField label="Interview Type" value={value.interviewType || '—'} />
          <DetailField
            label="Link Expiration Duration"
            value={value.linkExpiration || '—'}
          />
          <DetailField label="Job Title" value={jobTitle} />
        </div>

        <div className="mt-4 border-t border-[#F0EEF5] pt-4">
          <p className="text-xs font-medium text-[#8B8B9E]">
            Interview Descriptions
          </p>
          <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-[#2D2061]">
            {description}
          </p>
        </div>
      </section>

      {/* Template Details */}
      <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5">
        <header className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-[#2D2061]">Template Details</h3>
          {onEditTemplate ? (
            <button
              type="button"
              onClick={onEditTemplate}
              aria-label="Edit template details"
              className="inline-flex size-8 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F5F4FA]"
            >
              <Pencil className="size-4" strokeWidth={1.75} />
            </button>
          ) : null}
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DetailField label="Template Name" value={template?.name || '—'} />
          <DetailField label="Template Type" value={template?.type || '—'} />
          <DetailField
            label="Template Language"
            value={template?.language || '—'}
          />
        </div>

        <div className="mt-4 border-t border-[#F0EEF5] pt-4">
          {telephonic ? (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-[#2D2061]">
                  Screening &amp; Logistics ({questionCount})
                </p>
                <span className="inline-flex rounded-full bg-[#F5C56B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-[#5C3D0A]">
                  Fit Score
                </span>
                {template?.screeningEnabled === false ? (
                  <span className="text-xs font-medium text-[#8B8B9E]">
                    Disabled
                  </span>
                ) : null}
              </div>
              <p className="mb-3 text-xs text-[#8B8B9E]">
                Drawn from the shared screening library. Answers write back to the
                candidate record.
              </p>
            </>
          ) : (
            <p className="mb-3 text-sm font-bold text-[#2D2061]">
              Template Questions ({questionCount})
            </p>
          )}

          {questions.length === 0 ? (
            <p className="rounded-lg bg-[#F7F7FA] px-3.5 py-4 text-sm text-[#8B8B9E]">
              No questions added to this template yet.
            </p>
          ) : telephonic ? (
            <ul className="flex flex-col gap-2">
              {questions.map((question, index) => (
                <li
                  key={question.id}
                  className="rounded-lg bg-[#F5F5F8] px-3 py-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#2D2061] text-[10px] font-bold text-white">
                      Q{index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug text-[#2D2061]">
                        {question.text.trim() || 'Untitled question'}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6B6B80]">
                        <span>
                          Type:{' '}
                          <span className="font-semibold text-[#2D2061]">
                            {question.questionType ?? 'Yes/No'}
                          </span>
                        </span>
                        <span>
                          Accepts when:{' '}
                          <span className="font-semibold text-[#2D2061]">
                            {formatAcceptsWhen(question)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col gap-2">
              {questions.map((question, index) => (
                <li
                  key={question.id}
                  className="flex flex-col gap-2 rounded-lg bg-[#F5F5F8] px-3 py-2.5 sm:flex-row sm:items-center sm:gap-3"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:items-center">
                    <span className="inline-flex h-7 w-8 shrink-0 items-center justify-center rounded-md bg-[#2D2061] text-[11px] font-bold text-white">
                      Q{index + 1}
                    </span>
                    <p className="min-w-0 text-sm leading-snug text-[#2D2061]">
                      {question.text.trim() || 'Untitled question'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-4 pl-10 text-[11px] leading-tight text-[#8B8B9E] sm:flex-col sm:items-end sm:gap-0.5 sm:pl-0 sm:text-right">
                    <p>
                      <span className="font-medium text-[#6B6B80]">Prep Time</span>{' '}
                      <span className="tabular-nums text-[#2D2061]">
                        {formatTimeDisplay(question.prep)} mins
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-[#6B6B80]">Ans Time</span>{' '}
                      <span className="tabular-nums text-[#2D2061]">
                        {formatTimeDisplay(question.answer)} mins
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function formatAcceptsWhen(question: TemplateQuestion): string {
  const type = question.questionType ?? 'Yes/No'
  switch (type) {
    case 'Range': {
      const from = question.acceptRangeFrom?.trim() || '—'
      const to = question.acceptRangeTo?.trim() || '—'
      return `${from} to ${to}`
    }
    case 'Yes/No':
    case 'Single Choice':
    case 'Multi-Select':
      return question.acceptValue?.trim() || '—'
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[#8B8B9E]">{label}</p>
      <p className={cn('mt-1 text-sm font-semibold text-[#2D2061]')}>{value}</p>
    </div>
  )
}

function formatTimeDisplay(raw: string): string {
  const value = raw.trim()
  if (!value) return '00:00'
  if (/^\d{1,2}:\d{2}$/.test(value)) {
    const [m, s] = value.split(':')
    return `${m.padStart(2, '0')}:${s}`
  }
  if (/^\d+$/.test(value)) {
    return `${value.padStart(2, '0')}:00`
  }
  return value
}
