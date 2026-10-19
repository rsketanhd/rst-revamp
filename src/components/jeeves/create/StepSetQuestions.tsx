import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import {
  Button,
  Checkbox,
  ConfirmDeleteModal,
  Input,
  Select,
  SidePanel,
  Textarea,
  toast,
} from '../../ui'
import { StepHeader } from '../../jobs/create/StepChrome'
import { cn } from '../../../lib/cn'
import {
  ASSESSMENT_KIND_LABEL,
  ASSESSMENT_KIND_OPTIONS,
  BELOW_PASS_OPTIONS,
  DEFAULT_ASSESSMENT_POINTS,
  FIELD_TOKENS,
  KNOCKOUT_OPTIONS,
  QUESTION_LIMIT,
  QUESTIONS_STEP_DESCRIPTION,
  QUESTION_TYPE_LABEL,
  QUESTION_TYPE_OPTIONS,
  STANDARD_QUESTIONS,
  SUGGEST_FROM_JOB_OPTIONS,
  bestPossibleScore,
  createBlankQuestion,
  isScoredAssessmentKind,
  kindBannerCopy,
  responseTypeHint,
  suggestedQuestionsForJob,
  type AssessmentQuestionKind,
  type BelowPassAction,
  type CreatePreInterviewSetForm,
  type KnockoutAnswer,
  type PreInterviewQuestion,
  type PreInterviewQuestionType,
} from './types'

const TOAST_TITLE = 'Pre-Interview Set'

const OUTLINE_ACTION_CLASS =
  '!h-9 !rounded-[8px] !border-[#D5D2E2] !px-3 !text-xs !font-semibold !text-[#2D2061]'

const SUGGEST_JOB_BUTTON_CLASS =
  '!h-9 !rounded-[8px] !border-[#D5D2E2] !bg-[#F0EDF8] !px-3 !text-xs !font-semibold !text-[#2D2061] hover:!bg-[#E8E4F4]'

const PRIMARY_ACTION_CLASS =
  '!h-9 !rounded-[8px] !bg-[#2D2061] !px-3 !text-xs !font-semibold text-white hover:!bg-[#241a52] disabled:!opacity-50'

type QuestionDraft = Omit<PreInterviewQuestion, 'id'>

type Props = {
  value: CreatePreInterviewSetForm
  onChange: (patch: Partial<CreatePreInterviewSetForm>) => void
}

function showLimitToast(): void {
  toast.error(`Limit of ${QUESTION_LIMIT} questions reached.`, {
    title: TOAST_TITLE,
  })
}

function emptyDraft(isAssessment: boolean): QuestionDraft {
  return {
    text: '',
    type: 'yes-no',
    knockout: 'none',
    mandatory: false,
    enabled: true,
    points: DEFAULT_ASSESSMENT_POINTS,
    assessmentKind: isAssessment ? 'knowledge' : 'info',
  }
}

function toDraft(question: PreInterviewQuestion): QuestionDraft {
  return {
    text: question.text,
    type: question.type,
    knockout: question.knockout,
    mandatory: question.mandatory,
    enabled: question.enabled,
    points: question.points,
    assessmentKind: question.assessmentKind,
  }
}

/**
 * Step 02 — Questions for Create Pre-Interview Set.
 */
export function StepSetQuestions({ value, onChange }: Props) {
  const isAssessment = value.kind === 'assessment'
  const [jobMenuOpen, setJobMenuOpen] = useState(false)
  const [standardMenuOpen, setStandardMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<QuestionDraft>(() =>
    emptyDraft(isAssessment),
  )
  const [draftError, setDraftError] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const jobMenuRef = useRef<HTMLDivElement>(null)

  const enabledCount = value.questions.filter((q) => q.enabled).length
  const atLimit = value.questions.length >= QUESTION_LIMIT
  const banner = kindBannerCopy(value.kind)
  const pendingDelete = value.questions.find((q) => q.id === pendingDeleteId)
  const isEditing = editingId !== null
  const typeHint = responseTypeHint(draft.type)
  const totalPoints = bestPossibleScore(value.questions)

  function patchQuestions(
    updater: (questions: PreInterviewQuestion[]) => PreInterviewQuestion[],
  ): void {
    onChange({ questions: updater(value.questions) })
  }

  function insertIntroToken(token: string): void {
    const current = value.intro
    onChange({ intro: `${current}${current ? ' ' : ''}${token}` })
  }

  function insertClosingToken(token: string): void {
    const current = value.closing
    onChange({ closing: `${current}${current ? ' ' : ''}${token}` })
  }

  function patchDraft(patch: Partial<QuestionDraft>): void {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function openEditPanel(question: PreInterviewQuestion): void {
    setEditingId(question.id)
    setDraft(toDraft(question))
    setDraftError('')
    setPanelOpen(true)
  }

  function openAddPanel(): void {
    if (atLimit) {
      showLimitToast()
      return
    }
    if (isAssessment) {
      const next = createBlankQuestion('assessment')
      patchQuestions((questions) => [...questions, next])
      openEditPanel(next)
      return
    }
    setEditingId(null)
    setDraft(emptyDraft(false))
    setDraftError('')
    setPanelOpen(true)
  }

  function closePanel(): void {
    setPanelOpen(false)
    setEditingId(null)
    setDraftError('')
  }

  function savePanel(): void {
    if (!draft.text.trim() && !isAssessment) {
      setDraftError('Question text is required')
      return
    }

    const fields: QuestionDraft = {
      ...draft,
      text: draft.text.trim(),
      knockout: draft.type === 'yes-no' ? draft.knockout : 'none',
      points: Math.max(0, Number(draft.points) || 0),
    }

    if (editingId) {
      patchQuestions((questions) =>
        questions.map((item) =>
          item.id === editingId ? { ...item, ...fields } : item,
        ),
      )
      toast.success('Question updated.', { title: TOAST_TITLE })
    } else {
      if (atLimit) {
        showLimitToast()
        return
      }
      patchQuestions((questions) => [
        ...questions,
        { id: `q-${Date.now()}`, ...fields },
      ])
      toast.success('Question added.', { title: TOAST_TITLE })
    }

    closePanel()
  }

  useEffect(() => {
    if (!jobMenuOpen) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (jobMenuRef.current?.contains(target)) return
      setJobMenuOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setJobMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [jobMenuOpen])

  function addStandardQuestion(
    standard: (typeof STANDARD_QUESTIONS)[number],
  ): void {
    if (atLimit) {
      showLimitToast()
      return
    }
    const next = { ...standard, id: `q-${Date.now()}` }
    patchQuestions((questions) => [...questions, next])
    setStandardMenuOpen(false)
    openEditPanel(next)
    toast.success('Standard question added.', { title: TOAST_TITLE })
  }

  function suggestFromJob(jobTitle: string): void {
    if (atLimit) {
      showLimitToast()
      setJobMenuOpen(false)
      return
    }

    const remaining = QUESTION_LIMIT - value.questions.length
    const suggestions = suggestedQuestionsForJob(jobTitle)
      .slice(0, remaining)
      .map((item, index) => ({
        ...item,
        id: `q-${Date.now()}-${index}`,
      }))

    if (suggestions.length === 0) {
      showLimitToast()
      setJobMenuOpen(false)
      return
    }

    patchQuestions((questions) => [...questions, ...suggestions])
    setJobMenuOpen(false)
    toast.success(`Suggested questions from “${jobTitle}”.`, {
      title: 'Suggest from a job',
    })
  }

  function moveQuestion(id: string, direction: -1 | 1): void {
    patchQuestions((questions) => {
      const index = questions.findIndex((item) => item.id === id)
      const target = index + direction
      if (index < 0 || target < 0 || target >= questions.length) return questions
      const next = [...questions]
      const [row] = next.splice(index, 1)
      next.splice(target, 0, row)
      return next
    })
  }

  function confirmDeleteQuestion(): void {
    if (!pendingDeleteId) return
    patchQuestions((questions) =>
      questions.filter((item) => item.id !== pendingDeleteId),
    )
    if (editingId === pendingDeleteId) closePanel()
    setPendingDeleteId(null)
    toast.success('Question removed.', { title: TOAST_TITLE })
  }

  const questionsSummary = isAssessment
    ? `Showing ${value.questions.length} question${value.questions.length === 1 ? '' : 's'} total · ${enabledCount} switched on · limit ${QUESTION_LIMIT} · best possible score ${totalPoints} points`
    : `Showing ${value.questions.length} questions total · ${enabledCount} switched on · limit ${QUESTION_LIMIT}`

  return (
    <div>
      <StepHeader title="Questions" description={QUESTIONS_STEP_DESCRIPTION} />

      <div
        role="note"
        className={cn(
          'mb-5 flex flex-wrap items-start gap-2 rounded-[8px] border px-3.5 py-3 text-xs leading-relaxed',
          banner.tone === 'assessment'
            ? 'border-[#F3D0DC] bg-[#FCEEF3] text-[#8B3A55]'
            : 'border-[#E4DEF5] bg-[#F3F0FA] text-[#4C3D8A]',
        )}
      >
        <span
          className={cn(
            'inline-flex shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
            banner.tone === 'assessment'
              ? 'bg-[#F3D0DC] text-[#9B2C4A]'
              : 'bg-[#E4DEF5] text-[#2D2061]',
          )}
        >
          {banner.tag}
        </span>
        <span>{banner.text}</span>
      </div>

      <MessageField
        id="pre-interview-intro"
        label="Intro / greeting message"
        value={value.intro}
        onChange={(intro) => onChange({ intro })}
        onInsertToken={insertIntroToken}
        showFieldTokens
        className="mb-5"
      />

      <div className="mb-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[#2D2061]">
            {isAssessment ? 'Assessment questions' : 'Chatbot questions'}
          </h4>
          <div className="relative flex flex-wrap items-center gap-2">
            {!isAssessment ? (
              <>
                <div className="relative" ref={jobMenuRef}>
                  <Button
                    type="button"
                    variant="outline"
                    aria-expanded={jobMenuOpen}
                    aria-haspopup="menu"
                    onClick={() => {
                      setStandardMenuOpen(false)
                      setJobMenuOpen((open) => !open)
                    }}
                    className={SUGGEST_JOB_BUTTON_CLASS}
                  >
                    <Sparkles
                      className="size-3.5"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    Suggest from a job
                  </Button>
                  {jobMenuOpen ? (
                    <div
                      role="menu"
                      aria-label="Suggest from a job"
                      className="absolute right-full top-1/2 z-30 mr-2 w-56 -translate-y-1/2 rounded-md border border-[#E4E1EE] bg-white py-1 shadow-[0_8px_24px_rgba(45,32,97,0.14)]"
                    >
                      {SUGGEST_FROM_JOB_OPTIONS.map((jobTitle) => (
                        <button
                          key={jobTitle}
                          type="button"
                          role="menuitem"
                          onClick={() => suggestFromJob(jobTitle)}
                          className="block w-full px-3.5 py-2 text-left text-sm text-[#2D2061] hover:bg-[#F7F6FB]"
                        >
                          {jobTitle}
                        </button>
                      ))}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-full top-1/2 -ml-px size-0 -translate-y-1/2 border-y-[7px] border-l-[8px] border-y-transparent border-l-[#E4E1EE]"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-full top-1/2 size-0 -translate-y-1/2 border-y-[6px] border-l-[7px] border-y-transparent border-l-white"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setJobMenuOpen(false)
                      setStandardMenuOpen((open) => !open)
                    }}
                    className={OUTLINE_ACTION_CLASS}
                  >
                    <Plus
                      className="size-3.5"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    Add standard question…
                    <ChevronDown
                      className="size-3.5"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                  </Button>
                  {standardMenuOpen ? (
                    <div className="absolute right-0 z-20 mt-1 w-72 rounded-[8px] border border-[#E4E1EE] bg-white p-1 shadow-lg">
                      {STANDARD_QUESTIONS.map((item) => (
                        <button
                          key={item.text}
                          type="button"
                          onClick={() => addStandardQuestion(item)}
                          className="block w-full rounded-md px-3 py-2 text-left text-xs text-[#2D2061] hover:bg-[#F7F8FB]"
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
            <Button
              type="button"
              onClick={openAddPanel}
              disabled={atLimit}
              className={PRIMARY_ACTION_CLASS}
            >
              <Plus className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
              Add Question
            </Button>
          </div>
        </div>

        {value.questions.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-[#E0DDEA] bg-white">
            <p className="px-4 py-8 text-center text-sm text-[#8B8B9E]">
              No questions yet. Use Add Question.
            </p>
            <div className="border-t border-[#EEEDF3] bg-[#F7F8FB] px-4 py-2.5 text-[11px] text-[#8B8B9E]">
              {questionsSummary}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col gap-3">
              {value.questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  isLast={index === value.questions.length - 1}
                  isAssessment={isAssessment}
                  onEdit={() => openEditPanel(question)}
                  onMoveUp={() => moveQuestion(question.id, -1)}
                  onMoveDown={() => moveQuestion(question.id, 1)}
                  onDelete={() => setPendingDeleteId(question.id)}
                />
              ))}
            </ul>
            <p className="text-[11px] text-[#8B8B9E]">{questionsSummary}</p>
          </div>
        )}
      </div>

      {isAssessment ? (
        <div className="mb-5 rounded-[10px] border border-[#E4E1EE] bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h4 className="mb-3 text-sm font-bold text-[#2D2061]">Pass mark</h4>
              <Checkbox
                id="require-pass-mark"
                checked={value.requirePassMark}
                onChange={(e) =>
                  onChange({ requirePassMark: e.target.checked })
                }
                label="Require a pass mark"
              />
              <div className="mt-3 flex items-center gap-2">
                <input
                  id="pass-mark-percent"
                  type="number"
                  min={0}
                  max={100}
                  value={value.passMarkPercent}
                  disabled={!value.requirePassMark}
                  aria-label="Pass mark percent"
                  onChange={(e) =>
                    onChange({
                      passMarkPercent: Math.min(
                        100,
                        Math.max(0, Number(e.target.value) || 0),
                      ),
                    })
                  }
                  className="h-10 w-20 rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10 disabled:opacity-50"
                />
                <span className="text-sm text-[#6B6B80]">% to pass</span>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold text-[#2D2061]">
                If below the pass mark
              </h4>
              <Select
                id="below-pass-action"
                options={BELOW_PASS_OPTIONS}
                value={value.belowPassAction}
                disabled={!value.requirePassMark}
                onChange={(e) =>
                  onChange({
                    belowPassAction: e.target.value as BelowPassAction,
                  })
                }
              />
            </div>
          </div>
        </div>
      ) : null}

      <MessageField
        id="pre-interview-closing"
        label="Closing / thank-you messages"
        value={value.closing}
        onChange={(closing) => onChange({ closing })}
        onInsertToken={insertClosingToken}
        showFieldTokens={!isAssessment}
        className="mb-2"
      />

      <SidePanel
        open={panelOpen}
        onClose={closePanel}
        title={isEditing ? 'Edit Question' : 'Add Question'}
        widthClassName="w-full max-w-[28rem]"
        footer={
          <>
            <Button type="button" variant="outline" onClick={closePanel}>
              Cancel
            </Button>
            <Button type="button" onClick={savePanel}>
              {isEditing ? 'Save' : 'Add Question'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Textarea
            id="side-question-text"
            label="Question text"
            value={draft.text}
            onChange={(e) => {
              patchDraft({ text: e.target.value })
              setDraftError('')
            }}
            rows={3}
            error={draftError}
            placeholder={isAssessment ? 'New question' : undefined}
          />

          {isAssessment ? (
            <>
              <Select
                id="side-assessment-kind"
                label="Question type"
                options={ASSESSMENT_KIND_OPTIONS}
                value={draft.assessmentKind}
                onChange={(e) =>
                  patchDraft({
                    assessmentKind: e.target.value as AssessmentQuestionKind,
                  })
                }
              />
              {isScoredAssessmentKind(draft.assessmentKind) ? (
                <Input
                  id="side-question-points"
                  label="Points"
                  type="number"
                  min={0}
                  value={String(draft.points)}
                  onChange={(e) =>
                    patchDraft({
                      points: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                />
              ) : null}
            </>
          ) : null}

          <div>
            <Select
              id="side-question-type"
              label="Response type"
              options={QUESTION_TYPE_OPTIONS}
              value={draft.type}
              onChange={(e) =>
                patchDraft({
                  type: e.target.value as PreInterviewQuestionType,
                  knockout: 'none',
                })
              }
            />
            {typeHint ? (
              <p className="mt-1.5 text-xs text-[#8B8B9E]">{typeHint}</p>
            ) : null}
          </div>

          {!isAssessment ? (
            <>
              <div>
                <p className="mb-1.5 text-xs font-medium text-[#2D2061]">
                  Saved to
                </p>
                <p className="text-sm leading-relaxed text-[#6B6B80]">
                  Chat answers only (a column in the Jeeves AI list).
                </p>
              </div>

              <div>
                <Select
                  id="side-question-knockout"
                  label="Knockout answer"
                  labelTooltip="What happens after a knockout is set in Settings > Jeeves AI > General."
                  options={KNOCKOUT_OPTIONS}
                  value={draft.knockout}
                  onChange={(e) =>
                    patchDraft({ knockout: e.target.value as KnockoutAnswer })
                  }
                  disabled={draft.type !== 'yes-no'}
                />
                <p className="mt-1.5 text-xs text-[#8B8B9E]">
                  What happens after a knockout is set in Settings &gt; Jeeves AI
                  &gt; General.
                </p>
              </div>
            </>
          ) : null}

          <div className="flex flex-col gap-3">
            <Checkbox
              id="side-question-mandatory"
              checked={draft.mandatory}
              onChange={(e) => patchDraft({ mandatory: e.target.checked })}
              label="Mandatory"
            />
            <Checkbox
              id="side-question-ask"
              checked={draft.enabled}
              onChange={(e) => patchDraft({ enabled: e.target.checked })}
              label="Ask this question"
            />
          </div>
        </div>
      </SidePanel>

      <ConfirmDeleteModal
        open={Boolean(pendingDeleteId)}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDeleteQuestion}
        itemName={pendingDelete?.text.trim() || 'question'}
      />
    </div>
  )
}

function QuestionCard({
  question,
  index,
  isLast,
  isAssessment,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  question: PreInterviewQuestion
  index: number
  isLast: boolean
  isAssessment: boolean
  onEdit: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}) {
  const title =
    question.text.trim() || (isAssessment ? 'New question' : 'Untitled question')

  return (
    <li className="rounded-[10px] border border-[#E4E1EE] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(45,32,97,0.04)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EEEDF3] text-[11px] font-semibold text-[#6B6B80]">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p
              className={cn(
                'min-w-0 flex-1 text-sm font-medium',
                question.text.trim()
                  ? 'text-[#1A1A2E]'
                  : 'text-[#8B8B9E]',
              )}
            >
              {title}
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {isAssessment ? (
                <>
                  <span className="rounded-full bg-[#F0EFF4] px-2.5 py-0.5 text-[10px] font-semibold text-[#6B6B80]">
                    {ASSESSMENT_KIND_LABEL[question.assessmentKind]}
                  </span>
                  {isScoredAssessmentKind(question.assessmentKind) ? (
                    <span className="rounded-full bg-[#E7F6EF] px-2.5 py-0.5 text-[10px] font-semibold text-[#1F7A54]">
                      {question.points} pts
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="rounded-full bg-[#F0EFF4] px-2.5 py-0.5 text-[10px] font-semibold text-[#6B6B80]">
                  {QUESTION_TYPE_LABEL[question.type]}
                </span>
              )}
              <IconAction
                label={`Move question ${index + 1} up`}
                disabled={index === 0}
                onClick={onMoveUp}
              >
                <ChevronUp className="size-3.5" strokeWidth={2.25} />
              </IconAction>
              <IconAction
                label={`Move question ${index + 1} down`}
                disabled={isLast}
                onClick={onMoveDown}
              >
                <ChevronDown className="size-3.5" strokeWidth={2.25} />
              </IconAction>
              <IconAction
                label={`Delete question ${index + 1}`}
                onClick={onDelete}
              >
                <Trash2 className="size-3.5" strokeWidth={2} />
              </IconAction>
              <IconAction
                label={`Edit question ${index + 1}`}
                onClick={onEdit}
              >
                <Pencil className="size-3.5" strokeWidth={2} />
              </IconAction>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

function MessageField({
  id,
  label,
  value,
  onChange,
  onInsertToken,
  showFieldTokens,
  className,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  onInsertToken: (token: string) => void
  showFieldTokens?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <Textarea
        id={id}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
      {showFieldTokens ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-[#8B8B9E]">Fields:</span>
          {FIELD_TOKENS.map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => onInsertToken(token)}
              className="rounded-md bg-[#F0EFF4] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#2D2061] hover:bg-[#E4E1EE]"
            >
              {token}
            </button>
          ))}
          <span className="text-[11px] text-[#8B8B9E]">
            The job comes from where the set is sent.
          </span>
        </div>
      ) : null}
    </div>
  )
}

function IconAction({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md text-[#6B6B80] hover:bg-[#F0EFF4] hover:text-[#2D2061]',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
      )}
    >
      {children}
    </button>
  )
}
