import { useState, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Pencil,
  Play,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import {
  Button,
  ConfirmDeleteModal,
  Input,
  Select,
  SidePanel,
  Switch,
  Textarea,
  toast,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'

type LibraryKind = 'prescreen' | 'assessment'

type QuestionType =
  | 'single-choice'
  | 'yes-no'
  | 'country'
  | 'city'
  | 'text'
  | 'number'

type ChatQuestion = {
  id: string
  text: string
  type: QuestionType
  mapping: string
  enabled: boolean
}

type QuestionSet = {
  id: string
  kind: LibraryKind
  name: string
  isDefault: boolean
  version: number
  sentCount: number
  savedAt: string
  savedBy?: string
  intro: string
  questions: ChatQuestion[]
  closings: string[]
}

type QuestionForm = {
  text: string
  type: QuestionType
  mapping: string
  enabled: boolean
}

type StandardQuestion = Omit<ChatQuestion, 'id'>

const TOAST_TITLE = 'Question Sets'
const FIELD_TOKENS = ['[NAME]', '[COMPANY_NAME]', '[JOB_TITLE]', '[LOCATION]'] as const
const QUESTION_LIMIT = 30
const DEFAULT_MAPPING = 'Default - Custom'

const QUESTION_TYPE_OPTIONS: Array<{ value: QuestionType; label: string }> = [
  { value: 'single-choice', label: 'Single choice (buttons)' },
  { value: 'yes-no', label: 'Yes / No' },
  { value: 'country', label: 'Country (searchable)' },
  { value: 'city', label: 'City (searchable)' },
  { value: 'text', label: 'Free text' },
  { value: 'number', label: 'Number' },
]

const QUESTION_TYPE_LABEL = Object.fromEntries(
  QUESTION_TYPE_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<QuestionType, string>

const STANDARD_QUESTIONS: StandardQuestion[] = [
  {
    text: 'What is your highest education level?',
    type: 'single-choice',
    mapping: 'Default - Education',
    enabled: true,
  },
  {
    text: 'Are you authorized to work in this country?',
    type: 'yes-no',
    mapping: 'Default - Work Authorization',
    enabled: true,
  },
  {
    text: 'What is your expected annual compensation?',
    type: 'single-choice',
    mapping: 'Default - Expected Compensation',
    enabled: true,
  },
]

const DEFAULT_INTRO =
  "Hi [NAME], we are here to help you explore opportunities with [COMPANY_NAME]. Kindly help me know a few details about yourself. Your answers are stored with your application and used only to assess it, as described in [COMPANY_NAME]'s privacy notice."

const EMPTY_QUESTION_FORM: QuestionForm = {
  text: '',
  type: 'single-choice',
  mapping: DEFAULT_MAPPING,
  enabled: true,
}

function q(
  id: string,
  text: string,
  type: QuestionType,
  mapping: string,
  enabled = true,
): ChatQuestion {
  return { id, text, type, mapping, enabled }
}

const INITIAL_SETS: QuestionSet[] = [
  {
    id: 'default-prescreen',
    kind: 'prescreen',
    name: 'Default prescreen',
    isDefault: true,
    version: 1,
    sentCount: 3,
    savedAt: '10 Oct 2026, 11:30',
    intro: DEFAULT_INTRO,
    questions: [
      q('exp', 'What is your total years of experience?', 'single-choice', 'Default - Experience'),
      q('country', 'Which country are you currently located in?', 'country', 'Default - Current Country'),
      q('city', 'Which city are you currently located in?', 'city', 'Default - Current City'),
      q('relocate', 'Are you flexible to relocate?', 'yes-no', 'Default - Relocation'),
      q('notice', 'What is your notice period?', 'single-choice', 'Default - Notice Period'),
      q(
        'comp',
        'What is your current annual compensation? (optional)',
        'single-choice',
        'Default - Current Compensation',
      ),
      q(
        'expected',
        'What is your expected annual compensation?',
        'single-choice',
        'Default - Expected Compensation',
        false,
      ),
      q('visa', 'Do you require visa sponsorship?', 'yes-no', 'Default - Visa Sponsorship', false),
    ],
    closings: [
      'Thank you for your time. Our Talent Adviser will get in touch with you shortly.',
      'Have a great day!',
    ],
  },
  {
    id: 'data-science-tech',
    kind: 'prescreen',
    name: 'data science Tech',
    isDefault: false,
    version: 1,
    sentCount: 1,
    savedAt: '10 Oct 2026, 11:40',
    savedBy: 'Chiranjeev Pankajya',
    intro: DEFAULT_INTRO,
    questions: [
      q(
        'ds-1',
        'How many years of data science experience do you have?',
        'single-choice',
        'Default - Experience',
      ),
      q('ds-2', 'Which ML frameworks do you use regularly?', 'single-choice', 'Default - Skills'),
      q('ds-3', 'Are you open to hybrid work?', 'yes-no', 'Default - Work Preference'),
    ],
    closings: [
      'Thank you for your time. Our Talent Adviser will get in touch with you shortly.',
    ],
  },
  {
    id: 'default-assessment',
    kind: 'assessment',
    name: 'Default assessment',
    isDefault: true,
    version: 1,
    sentCount: 0,
    savedAt: '10 Oct 2026, 12:00',
    intro:
      'Hi [NAME], thanks for applying to [JOB_TITLE] at [COMPANY_NAME]. Please answer a few scored questions so we can assess your fit.',
    questions: [
      q(
        'as-1',
        'Which sorting algorithm has average O(n log n) complexity?',
        'single-choice',
        'Assessment - Algorithms',
      ),
      q(
        'as-2',
        "Describe a time you improved a model's precision.",
        'text',
        'Assessment - Situational',
      ),
      q('as-3', 'Have you led a production ML rollout?', 'yes-no', 'Assessment - Experience'),
    ],
    closings: ['Thanks — we will review your answers shortly.'],
  },
]

function cloneSet(set: QuestionSet): QuestionSet {
  return {
    ...set,
    questions: set.questions.map((item) => ({ ...item })),
    closings: [...set.closings],
  }
}

function cloneSets(sets: QuestionSet[]): QuestionSet[] {
  return sets.map(cloneSet)
}

function metaLine(set: QuestionSet): string {
  const base = `${set.questions.length} questions · version ${set.version} · ${set.sentCount} sent. Saved ${set.savedAt}`
  return set.savedBy ? `${base} by ${set.savedBy}` : `${base}.`
}

function countByKind(sets: QuestionSet[], kind: LibraryKind): number {
  return sets.filter((set) => set.kind === kind).length
}

function fieldsFromForm(form: QuestionForm) {
  return {
    text: form.text.trim(),
    type: form.type,
    mapping: form.mapping.trim() || DEFAULT_MAPPING,
    enabled: form.enabled,
  }
}

function notifySuccess(message: string) {
  toast.success(message, { title: TOAST_TITLE })
}

function notifyLimitReached() {
  toast.error(`Limit of ${QUESTION_LIMIT} questions reached.`, { title: TOAST_TITLE })
}

/**
 * Settings → Module Configuration → Jeeves AI → Question Sets.
 */
export function JeevesAiQuestionSetsPanel() {
  const [sets, setSets] = useState(() => cloneSets(INITIAL_SETS))
  const [libraryKind, setLibraryKind] = useState<LibraryKind>('prescreen')
  const [selectedId, setSelectedId] = useState('default-prescreen')
  const [questionFormOpen, setQuestionFormOpen] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [questionForm, setQuestionForm] = useState<QuestionForm>(EMPTY_QUESTION_FORM)
  const [questionError, setQuestionError] = useState('')
  const [pendingDeleteQuestionId, setPendingDeleteQuestionId] = useState<string | null>(
    null,
  )
  const [standardMenuOpen, setStandardMenuOpen] = useState(false)

  const librarySets = sets.filter((set) => set.kind === libraryKind)
  const selected = sets.find((set) => set.id === selectedId) ?? librarySets[0]
  const enabledCount = selected?.questions.filter((item) => item.enabled).length ?? 0
  const atLimit = (selected?.questions.length ?? 0) >= QUESTION_LIMIT
  const pendingDeleteQuestion = selected?.questions.find(
    (item) => item.id === pendingDeleteQuestionId,
  )

  function patchSelected(patch: Partial<QuestionSet>) {
    if (!selected) return
    setSets((current) =>
      current.map((set) => (set.id === selected.id ? { ...set, ...patch } : set)),
    )
  }

  function patchQuestions(updater: (questions: ChatQuestion[]) => ChatQuestion[]) {
    if (!selected) return
    setSets((current) =>
      current.map((set) =>
        set.id === selected.id ? { ...set, questions: updater(set.questions) } : set,
      ),
    )
  }

  function switchLibrary(kind: LibraryKind) {
    setLibraryKind(kind)
    setStandardMenuOpen(false)
    const first = sets.find((set) => set.kind === kind)
    if (first) setSelectedId(first.id)
  }

  function handleNewSet() {
    const isPrescreen = libraryKind === 'prescreen'
    const id = `set-${Date.now()}`
    const next: QuestionSet = {
      id,
      kind: libraryKind,
      name: isPrescreen ? 'New chat prescreen' : 'New assessment',
      isDefault: false,
      version: 1,
      sentCount: 0,
      savedAt: 'Just now',
      intro: isPrescreen
        ? DEFAULT_INTRO
        : 'Hi [NAME], please complete this short assessment for [JOB_TITLE] at [COMPANY_NAME].',
      questions: [],
      closings: ['Thank you for your time.'],
    }
    setSets((current) => [...current, next])
    setSelectedId(id)
    notifySuccess(
      isPrescreen ? 'New chat prescreen created.' : 'New assessment created.',
    )
  }

  function insertToken(token: string) {
    if (!selected) return
    patchSelected({
      intro: `${selected.intro}${selected.intro ? ' ' : ''}${token}`,
    })
  }

  function moveQuestion(id: string, direction: -1 | 1) {
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

  function openAddQuestion() {
    if (atLimit) {
      notifyLimitReached()
      return
    }
    setEditingQuestionId(null)
    setQuestionForm(EMPTY_QUESTION_FORM)
    setQuestionError('')
    setQuestionFormOpen(true)
  }

  function openEditQuestion(question: ChatQuestion) {
    setEditingQuestionId(question.id)
    setQuestionForm({
      text: question.text,
      type: question.type,
      mapping: question.mapping,
      enabled: question.enabled,
    })
    setQuestionError('')
    setQuestionFormOpen(true)
  }

  function saveQuestionForm() {
    if (!questionForm.text.trim()) {
      setQuestionError('Question text is required')
      return
    }

    const fields = fieldsFromForm(questionForm)

    if (editingQuestionId) {
      patchQuestions((questions) =>
        questions.map((item) =>
          item.id === editingQuestionId ? { ...item, ...fields } : item,
        ),
      )
      notifySuccess('Question updated.')
    } else {
      if (atLimit) {
        notifyLimitReached()
        return
      }
      patchQuestions((questions) => [
        ...questions,
        { id: `q-${Date.now()}`, ...fields },
      ])
      notifySuccess('Question added.')
    }

    setQuestionFormOpen(false)
  }

  function addStandardQuestion(standard: StandardQuestion) {
    if (atLimit) {
      notifyLimitReached()
      return
    }
    patchQuestions((questions) => [...questions, { ...standard, id: `q-${Date.now()}` }])
    setStandardMenuOpen(false)
    notifySuccess('Standard question added.')
  }

  function confirmDeleteQuestion() {
    if (!pendingDeleteQuestionId) return
    patchQuestions((questions) =>
      questions.filter((item) => item.id !== pendingDeleteQuestionId),
    )
    setPendingDeleteQuestionId(null)
    notifySuccess('Question removed.')
  }

  function updateClosing(index: number, value: string) {
    if (!selected) return
    const closings = [...selected.closings]
    closings[index] = value
    patchSelected({ closings })
  }

  function removeClosing(index: number) {
    if (!selected) return
    patchSelected({ closings: selected.closings.filter((_, i) => i !== index) })
  }

  function addClosing() {
    if (!selected) return
    patchSelected({ closings: [...selected.closings, ''] })
  }

  function handleSave() {
    if (!selected) return
    const savedAt = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    setSets((current) =>
      current.map((set) =>
        set.id === selected.id
          ? { ...set, version: set.version + 1, savedAt, savedBy: 'You' }
          : set,
      ),
    )
    notifySuccess(`“${selected.name}” saved.`)
  }

  function patchQuestionEnabled(questionId: string, enabled: boolean) {
    patchQuestions((questions) =>
      questions.map((item) => (item.id === questionId ? { ...item, enabled } : item)),
    )
  }

  return (
    <SettingsPanel
      eyebrow="Jeeves AI"
      title="Question Sets"
      description="The questions Jeeves asks candidates, in order, with the intro and closing messages."
    >
      <SettingsBlock title="Question library">
        <div
          role="tablist"
          aria-label="Question library type"
          className="mb-4 grid grid-cols-1 gap-2 border-b border-[#E8E6F0] sm:grid-cols-2"
        >
          <LibraryTab
            active={libraryKind === 'prescreen'}
            title={`Chat prescreens (${countByKind(sets, 'prescreen')})`}
            description="Conversational screening — collects details, no scores."
            onClick={() => switchLibrary('prescreen')}
          />
          <LibraryTab
            active={libraryKind === 'assessment'}
            title={`Assessments (${countByKind(sets, 'assessment')})`}
            description="Scored skill check — knowledge and situational questions with a pass mark."
            onClick={() => switchLibrary('assessment')}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {librarySets.map((set) => (
            <button
              key={set.id}
              type="button"
              onClick={() => setSelectedId(set.id)}
              className={cn(
                'min-w-[14rem] max-w-sm flex-1 rounded-[8px] border bg-white px-4 py-3 text-left transition-colors',
                selected?.id === set.id
                  ? 'border-[#2D2061] ring-2 ring-[#2D2061]/15'
                  : 'border-[#E4E1EE] hover:border-[#C9C6D6]',
              )}
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#1A1A2E]">{set.name}</span>
                {set.isDefault ? (
                  <span className="rounded-full bg-[#E8F1FE] px-2 py-0.5 text-[10px] font-semibold text-[#2F6FD6]">
                    Default
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] leading-relaxed text-[#8B8B9E]">{metaLine(set)}</p>
            </button>
          ))}
          <button
            type="button"
            onClick={handleNewSet}
            className="flex min-w-[12rem] max-w-sm flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-[#C9C6D6] bg-[#FCFCFE] px-4 py-3 text-sm font-semibold text-[#2D2061] hover:border-[#2D2061] hover:bg-white"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            {libraryKind === 'prescreen' ? 'New chat prescreen' : 'New assessment'}
          </button>
        </div>
      </SettingsBlock>

      {selected ? (
        <SettingsBlock
          title={selected.name}
          trailing={
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                toast.success('Opening chat preview for this set.', {
                  title: 'Preview chat',
                })
              }
              className="!h-9 !rounded-[8px] !border-[#D5D2E2] !px-3.5 !text-[#2D2061]"
            >
              <Play className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
              Preview chat
            </Button>
          }
        >
          <div className="mb-4 max-w-md">
            <Input
              id="jeeves-set-name"
              label="Set name"
              value={selected.name}
              onChange={(event) => patchSelected({ name: event.target.value })}
            />
          </div>

          <div
            role="note"
            className="mb-5 rounded-[8px] border border-[#D6E4F7] bg-[#EEF5FC] px-3.5 py-3 text-xs leading-relaxed text-[#2F5AA8]"
          >
            {selected.kind === 'prescreen'
              ? "Chat prescreen · Scored questions aren't available here — create an assessment for skill checks."
              : 'Assessment · Answers can be scored against a pass mark.'}
          </div>

          <div className="mb-5">
            <p className="mb-1.5 text-xs font-medium text-[#2D2061]">
              Intro / greeting message
            </p>
            <Textarea
              id="jeeves-intro"
              label=""
              value={selected.intro}
              onChange={(event) => patchSelected({ intro: event.target.value })}
              rows={4}
            />
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-[#8B8B9E]">Fields:</span>
              {FIELD_TOKENS.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => insertToken(token)}
                  className="rounded-md bg-[#F0EFF4] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#2D2061] hover:bg-[#E4E1EE]"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-[#1A1A2E]">Chatbot questions</h4>
              <div className="relative flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    toast.success(
                      'Job-based suggestions will appear here once a job is chosen.',
                      { title: 'Suggest from a job' },
                    )
                  }
                  className="!h-9 !rounded-[8px] !border-[#D5D2E2] !px-3 !text-xs !font-semibold !text-[#2D2061]"
                >
                  <Plus className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
                  Suggest from a job
                </Button>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStandardMenuOpen((open) => !open)}
                    className="!h-9 !rounded-[8px] !border-[#D5D2E2] !px-3 !text-xs !font-semibold !text-[#2D2061]"
                  >
                    <Plus className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
                    Add standard question…
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
                <Button
                  type="button"
                  onClick={openAddQuestion}
                  disabled={atLimit}
                  className="!h-9 !rounded-[8px] !bg-[#2D2061] !px-3 !text-xs !font-semibold text-white hover:!bg-[#241a52] disabled:!opacity-50"
                >
                  <Plus className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
                  Add Question
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
              {selected.questions.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[#8B8B9E]">
                  No questions yet. Add a question to get started.
                </p>
              ) : (
                <ul className="divide-y divide-[#EEEDF3]">
                  {selected.questions.map((question, index) => (
                    <QuestionRow
                      key={question.id}
                      question={question}
                      index={index}
                      isLast={index === selected.questions.length - 1}
                      onToggleEnabled={(enabled) =>
                        patchQuestionEnabled(question.id, enabled)
                      }
                      onMoveUp={() => moveQuestion(question.id, -1)}
                      onMoveDown={() => moveQuestion(question.id, 1)}
                      onDelete={() => setPendingDeleteQuestionId(question.id)}
                      onEdit={() => openEditQuestion(question)}
                    />
                  ))}
                </ul>
              )}
              <div className="border-t border-[#EEEDF3] bg-[#F7F8FB] px-4 py-2.5 text-[11px] text-[#8B8B9E]">
                Showing {selected.questions.length} questions total · {enabledCount}{' '}
                switched on · limit {QUESTION_LIMIT}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-sm font-bold text-[#1A1A2E]">
              Closing / thank-you messages
            </p>
            <div className="flex flex-col gap-3">
              {selected.closings.map((closing, index) => (
                <div key={`closing-${index}`} className="relative">
                  <Textarea
                    id={`jeeves-closing-${index}`}
                    label=""
                    value={closing}
                    onChange={(event) => updateClosing(index, event.target.value)}
                    rows={2}
                  />
                  <button
                    type="button"
                    aria-label={`Remove closing message ${index + 1}`}
                    onClick={() => removeClosing(index)}
                    className="absolute right-2 top-2 rounded-md p-1 text-[#8B8B9E] hover:bg-[#F0EFF4] hover:text-[#2D2061]"
                  >
                    <X className="size-3.5" strokeWidth={2.25} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addClosing}
                className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#2D2061] hover:underline"
              >
                <Plus className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
                Add closing message
              </button>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              type="button"
              onClick={handleSave}
              className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              Save
            </Button>
          </div>
        </SettingsBlock>
      ) : null}

      <SidePanel
        open={questionFormOpen}
        onClose={() => setQuestionFormOpen(false)}
        title={editingQuestionId ? 'Edit Question' : 'Add Question'}
        widthClassName="w-full max-w-[28rem]"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setQuestionFormOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={saveQuestionForm}>
              {editingQuestionId ? 'Save' : 'Add Question'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Textarea
            id="jeeves-question-text"
            label="Question"
            value={questionForm.text}
            onChange={(event) => {
              setQuestionForm((current) => ({
                ...current,
                text: event.target.value,
              }))
              setQuestionError('')
            }}
            rows={3}
            error={questionError}
          />
          <Select
            id="jeeves-question-type"
            label="Type"
            options={QUESTION_TYPE_OPTIONS}
            value={questionForm.type}
            onChange={(event) =>
              setQuestionForm((current) => ({
                ...current,
                type: event.target.value as QuestionType,
              }))
            }
          />
          <Input
            id="jeeves-question-mapping"
            label="Field mapping"
            value={questionForm.mapping}
            onChange={(event) =>
              setQuestionForm((current) => ({
                ...current,
                mapping: event.target.value,
              }))
            }
            placeholder={DEFAULT_MAPPING}
          />
          <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#F8F9FB] px-3 py-2.5">
            <span className="text-sm font-medium text-[#2D2061]">Switched on</span>
            <Switch
              checked={questionForm.enabled}
              onCheckedChange={(enabled) =>
                setQuestionForm((current) => ({ ...current, enabled }))
              }
              aria-label="Question switched on"
              className="!gap-0"
            />
          </div>
        </div>
      </SidePanel>

      <ConfirmDeleteModal
        open={Boolean(pendingDeleteQuestionId)}
        onClose={() => setPendingDeleteQuestionId(null)}
        onConfirm={confirmDeleteQuestion}
        itemName={pendingDeleteQuestion?.text ?? 'question'}
      />
    </SettingsPanel>
  )
}

function QuestionRow({
  question,
  index,
  isLast,
  onToggleEnabled,
  onMoveUp,
  onMoveDown,
  onDelete,
  onEdit,
}: {
  question: ChatQuestion
  index: number
  isLast: boolean
  onToggleEnabled: (enabled: boolean) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onEdit: () => void
}) {
  return (
    <li
      className={cn(
        'flex flex-wrap items-start gap-3 px-3 py-3 sm:px-4',
        !question.enabled && 'opacity-60',
      )}
    >
      <span className="mt-0.5 w-5 shrink-0 text-xs font-bold text-[#8B8B9E]">
        {index + 1}.
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#2D2061]">{question.text}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#F0EFF4] px-2 py-0.5 text-[10px] font-semibold text-[#6B6B80]">
            {QUESTION_TYPE_LABEL[question.type]}
          </span>
          <span className="rounded-full bg-[#E8F1FE] px-2 py-0.5 text-[10px] font-semibold text-[#2F6FD6]">
            {question.mapping}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Switch
          checked={question.enabled}
          onCheckedChange={onToggleEnabled}
          aria-label={`Enable ${question.text}`}
          className="!gap-0"
        />
        <IconAction
          label={`Move ${question.text} up`}
          disabled={index === 0}
          onClick={onMoveUp}
        >
          <ArrowUp className="size-3.5" strokeWidth={2} />
        </IconAction>
        <IconAction
          label={`Move ${question.text} down`}
          disabled={isLast}
          onClick={onMoveDown}
        >
          <ArrowDown className="size-3.5" strokeWidth={2} />
        </IconAction>
        <IconAction label={`Delete ${question.text}`} onClick={onDelete}>
          <Trash2 className="size-3.5" strokeWidth={2} />
        </IconAction>
        <IconAction label={`Edit ${question.text}`} onClick={onEdit}>
          <Pencil className="size-3.5" strokeWidth={2} />
        </IconAction>
      </div>
    </li>
  )
}

function LibraryTab({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'border-b-2 px-1 pb-3 text-left transition-colors',
        active ? 'border-[#2D2061]' : 'border-transparent hover:border-[#D5D2E2]',
      )}
    >
      <span
        className={cn(
          'block text-sm',
          active ? 'font-semibold text-[#2D2061]' : 'font-medium text-[#8B8B9E]',
        )}
      >
        {title}
      </span>
      <span className="mt-0.5 block text-xs leading-relaxed text-[#8B8B9E]">
        {description}
      </span>
    </button>
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
