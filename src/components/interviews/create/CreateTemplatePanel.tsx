import {
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type RefObject,
} from 'react'
import {
  CloudUpload,
  GripVertical,
  Minus,
  Plus,
  Sparkles,
  Upload,
} from 'lucide-react'
import {
  Button,
  Input,
  Select,
  SidePanel,
  Switch,
  toast,
} from '../../ui'
import { cn } from '../../../lib/cn'

export type ScreeningQuestionType =
  | 'Yes/No'
  | 'Range'
  | 'Single Choice'
  | 'Multi-Select'

export type TemplateQuestion = {
  id: string
  text: string
  /** One-way video timing (mm:ss or minutes) */
  prep: string
  answer: string
  /** Telephonic screening fields */
  questionType?: ScreeningQuestionType
  /** Yes/No value or choice options text */
  acceptValue?: string
  acceptRangeFrom?: string
  acceptRangeTo?: string
}

export type CreateTemplatePanelProps = {
  open: boolean
  onClose: () => void
  /**
   * Interview type from Details step — "Telephonic Interview" uses
   * Screening & Logistics layout; other types use video Q&A layout.
   */
  interviewType?: string
  onCreated?: (template: {
    id: string
    name: string
    type: string
    language: string
    questions: TemplateQuestion[]
    screeningEnabled?: boolean
  }) => void
}

const TYPE_OPTIONS = ['Default', 'Resend'] as const
const LANGUAGE_OPTIONS = ['English', 'Spanish', 'French', 'German', 'Hindi']
const SCREENING_TYPES: ScreeningQuestionType[] = [
  'Yes/No',
  'Range',
  'Single Choice',
  'Multi-Select',
]

const SAMPLE_VIDEO_QUESTIONS: Array<Omit<TemplateQuestion, 'id'>> = [
  {
    text: 'Describe a time when you had to collaborate with a difficult team member',
    prep: '01:00',
    answer: '01:00',
  },
  {
    text: 'What is a project you are particularly proud of and why?',
    prep: '02:00',
    answer: '02:00',
  },
  {
    text: 'Explain a situation where you had to manage competing deadlines',
    prep: '03:00',
    answer: '03:00',
  },
  {
    text: 'How do you handle constructive criticism?',
    prep: '01:30',
    answer: '01:30',
  },
  {
    text: 'Can you describe a challenge you faced and how you overcame it?',
    prep: '04:00',
    answer: '04:00',
  },
]

const SAMPLE_TELEPHONIC_QUESTIONS: Array<Omit<TemplateQuestion, 'id'>> = [
  {
    text: 'Willing to relocate to London?',
    prep: '',
    answer: '',
    questionType: 'Yes/No',
    acceptValue: 'Yes',
  },
  {
    text: 'What is your expected annual base salary?',
    prep: '',
    answer: '',
    questionType: 'Range',
    acceptRangeFrom: '$80,000',
    acceptRangeTo: '$90,000',
  },
  {
    text: "What's your notice period?",
    prep: '',
    answer: '',
    questionType: 'Single Choice',
    acceptValue: 'Immediate, 15 Days, 30 Days',
  },
  {
    text: 'Which of these do you have hands-on experience with?',
    prep: '',
    answer: '',
    questionType: 'Multi-Select',
    acceptValue: 'React, Node.js, AWS, Docker',
  },
  {
    text: 'Do you require visa sponsorship?',
    prep: '',
    answer: '',
    questionType: 'Yes/No',
    acceptValue: 'No',
  },
  {
    text: 'Preferred work arrangement',
    prep: '',
    answer: '',
    questionType: 'Single Choice',
    acceptValue: 'Remote, Hybrid, On-site',
  },
  {
    text: 'Years of relevant experience',
    prep: '',
    answer: '',
    questionType: 'Range',
    acceptRangeFrom: '3',
    acceptRangeTo: '8',
  },
]

function nextId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function withIds(
  rows: Array<Omit<TemplateQuestion, 'id'>>,
): TemplateQuestion[] {
  return rows.map((row) => ({ ...row, id: nextId() }))
}

function isTelephonicInterview(interviewType?: string) {
  return (interviewType ?? '').toLowerCase().includes('telephonic')
}

function emptyVideoQuestion(): TemplateQuestion {
  return { id: nextId(), text: '', prep: '01:00', answer: '01:00' }
}

function emptyTelephonicQuestion(): TemplateQuestion {
  return {
    id: nextId(),
    text: '',
    prep: '',
    answer: '',
    questionType: 'Yes/No',
    acceptValue: 'Yes',
  }
}

function parseQuestionsFromCsv(
  text: string,
  telephonic: boolean,
): TemplateQuestion[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line, index) => {
      if (index === 0 && /^question/i.test(line.replace(/["']/g, ''))) {
        return false
      }
      return true
    })

  if (lines.length === 0) {
    return withIds(
      telephonic ? SAMPLE_TELEPHONIC_QUESTIONS : SAMPLE_VIDEO_QUESTIONS,
    )
  }

  return lines.map((line) => {
    const parts = line.split(',').map((p) => p.replace(/^"|"$/g, '').trim())
    const questionText = parts[0] || line
    if (telephonic) {
      const qt = (parts[1] as ScreeningQuestionType) || 'Yes/No'
      return {
        id: nextId(),
        text: questionText,
        prep: '',
        answer: '',
        questionType: SCREENING_TYPES.includes(qt) ? qt : 'Yes/No',
        acceptValue: parts[2] || 'Yes',
        acceptRangeFrom: parts[2] || '',
        acceptRangeTo: parts[3] || '',
      }
    }
    return {
      id: nextId(),
      text: questionText,
      prep: parts[1] && /^\d/.test(parts[1]) ? parts[1] : '01:00',
      answer: parts[2] && /^\d/.test(parts[2]) ? parts[2] : '01:00',
    }
  })
}

/**
 * Create Template side panel (60vw).
 * Telephonic interviews → Screening & Logistics design; others → video Q&A design.
 */
export function CreateTemplatePanel({
  open,
  onClose,
  interviewType,
  onCreated,
}: CreateTemplatePanelProps) {
  const telephonic = isTelephonicInterview(interviewType)
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState('Default')
  const [language, setLanguage] = useState('English')
  const [questions, setQuestions] = useState<TemplateQuestion[]>([])
  const [nameError, setNameError] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)
  const [screeningEnabled, setScreeningEnabled] = useState(true)

  useEffect(() => {
    if (!open) return
    setName('')
    setType('Default')
    setLanguage('English')
    setNameError('')
    setQuestions([])
    setDragId(null)
    setScreeningEnabled(true)
  }, [open, interviewType])

  const hasQuestions = questions.length > 0
  const sampleSource = telephonic
    ? SAMPLE_TELEPHONIC_QUESTIONS
    : SAMPLE_VIDEO_QUESTIONS

  function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError('Template name is required.')
      return
    }
    setNameError('')
    const id = `tpl-${Date.now()}`
    onCreated?.({
      id,
      name: trimmed,
      type,
      language,
      questions: questions.map((q) => ({ ...q })),
      screeningEnabled: telephonic ? screeningEnabled : undefined,
    })
    toast.success(`“${trimmed}” was created.`, {
      title: 'Template created',
    })
    onClose()
  }

  function handleAddQuestions() {
    setQuestions((current) => {
      if (current.length === 0) return withIds(sampleSource)
      return [
        ...current,
        telephonic ? emptyTelephonicQuestion() : emptyVideoQuestion(),
      ]
    })
  }

  function handleAutoGenerate() {
    setQuestions(withIds(sampleSource))
    toast.success(
      hasQuestions
        ? 'Template questions re-generated.'
        : 'Template questions generated.',
      {
        title: hasQuestions ? 'Re-Generate Template' : 'Auto Generate Template',
      },
    )
  }

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(file: File | null) {
    if (!file) return
    const lower = file.name.toLowerCase()
    try {
      if (lower.endsWith('.csv') || lower.endsWith('.txt')) {
        const text = await file.text()
        const parsed = parseQuestionsFromCsv(text, telephonic)
        setQuestions(parsed)
        toast.success(
          `Imported ${parsed.length} question${parsed.length === 1 ? '' : 's'} from “${file.name}”.`,
          { title: 'Upload File' },
        )
        return
      }
      setQuestions(withIds(sampleSource))
      toast.success(
        `“${file.name}” processed. Sample questions loaded for review.`,
        { title: 'Upload File' },
      )
    } catch {
      toast.error(
        'Could not read that file. Try a CSV with one question per line.',
        { title: 'Upload File' },
      )
    }
  }

  function updateQuestion(
    id: string,
    patch: Partial<Omit<TemplateQuestion, 'id'>>,
  ) {
    setQuestions((current) =>
      current.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    )
  }

  function removeQuestion(id: string) {
    setQuestions((current) => current.filter((q) => q.id !== id))
  }

  function handleDragStart(id: string) {
    setDragId(id)
  }

  function handleDragOver(event: DragEvent, overId: string) {
    event.preventDefault()
    if (!dragId || dragId === overId) return
    setQuestions((current) => {
      const from = current.findIndex((q) => q.id === dragId)
      const to = current.findIndex((q) => q.id === overId)
      if (from < 0 || to < 0 || from === to) return current
      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  function handleDragEnd() {
    setDragId(null)
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Create Template"
      width="60vw"
      widthClassName="w-[60vw] max-w-none min-w-[20rem]"
      headerClassName="bg-[#2D2061]"
      bodyClassName="!p-5 sm:!p-6"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-[5.5rem] !rounded-md border-[#2D2061] text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            className="min-w-[5.5rem] !rounded-md !bg-[#2D2061] text-white hover:!bg-[#241a52]"
          >
            Create
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Input
              label="Template Name"
              requiredMark
              placeholder="ex. Senior Software Engineer Interview"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError('')
              }}
              error={nameError || undefined}
              className="!rounded-md border-[#ddd9e8] !text-[#2D2061] placeholder:!text-[#A0A0B2]"
            />
          </div>
          <div className="lg:col-span-3">
            <Select
              label="Type"
              options={[...TYPE_OPTIONS]}
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="lg:col-span-3">
            <Select
              label="Language"
              options={LANGUAGE_OPTIONS}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        {telephonic ? (
          <TelephonicTemplateBody
            questions={questions}
            screeningEnabled={screeningEnabled}
            hasQuestions={hasQuestions}
            dragId={dragId}
            onScreeningChange={setScreeningEnabled}
            onAddQuestions={handleAddQuestions}
            onAutoGenerate={handleAutoGenerate}
            onUpdateQuestion={updateQuestion}
            onRemoveQuestion={removeQuestion}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          />
        ) : (
          <VideoTemplateBody
            questions={questions}
            hasQuestions={hasQuestions}
            dragId={dragId}
            fileInputId={fileInputId}
            fileInputRef={fileInputRef}
            onAddQuestions={handleAddQuestions}
            onAutoGenerate={handleAutoGenerate}
            onUploadClick={handleUploadClick}
            onFileChange={(file) => {
              void handleFileChange(file)
            }}
            onUpdateQuestion={updateQuestion}
            onRemoveQuestion={removeQuestion}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          />
        )}
      </div>
    </SidePanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Video (non-telephonic) layout                                              */
/* -------------------------------------------------------------------------- */

function VideoTemplateBody({
  questions,
  hasQuestions,
  dragId,
  fileInputId,
  fileInputRef,
  onAddQuestions,
  onAutoGenerate,
  onUploadClick,
  onFileChange,
  onUpdateQuestion,
  onRemoveQuestion,
  onDragStart,
  onDragOver,
  onDragEnd,
}: {
  questions: TemplateQuestion[]
  hasQuestions: boolean
  dragId: string | null
  fileInputId: string
  fileInputRef: RefObject<HTMLInputElement | null>
  onAddQuestions: () => void
  onAutoGenerate: () => void
  onUploadClick: () => void
  onFileChange: (file: File | null) => void
  onUpdateQuestion: (
    id: string,
    patch: Partial<Omit<TemplateQuestion, 'id'>>,
  ) => void
  onRemoveQuestion: (id: string) => void
  onDragStart: (id: string) => void
  onDragOver: (event: DragEvent, overId: string) => void
  onDragEnd: () => void
}) {
  return (
    <div className="flex min-h-[22rem] flex-col overflow-hidden rounded-xl border border-[#E4E1EE] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#F0EEF5] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#2D2061]">
            {questions.length} Questions Selected
          </p>
          <p className="mt-0.5 text-xs text-[#8B8B9E]">
            Questions you&apos;ve added will appear here
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onAddQuestions}
            className="!h-9 !rounded-md border-[#2D2061] bg-white px-3 text-xs font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            <Plus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            Add Questions
          </Button>
          <Button
            type="button"
            onClick={onAutoGenerate}
            className="!h-9 !rounded-md !bg-[#7C3AED] px-3 text-xs font-semibold text-white hover:!bg-[#6D28D9]"
          >
            <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
            {hasQuestions ? 'Re-Generate Template' : 'Auto Generate Template'}
          </Button>
        </div>
      </div>

      <div className="mx-4 mt-4 flex flex-col gap-3 rounded-lg border border-[#D8E0F0] bg-[#EEF2FA] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#2D2061] shadow-sm">
            <CloudUpload className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#2D2061]">Upload Bulk Questions</p>
            <p className="mt-0.5 text-xs text-[#6B6B80]">
              We support bulk ZIP files for large imports.
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={onUploadClick}
          className="!h-9 shrink-0 !rounded-md !bg-[#2D2061] px-3 text-xs font-semibold text-white hover:!bg-[#241a52]"
        >
          <Upload className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Upload File
        </Button>
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          accept=".zip,.csv,.txt,.xlsx,.json"
          className="sr-only"
          onChange={(e) => {
            onFileChange(e.target.files?.[0] ?? null)
            e.target.value = ''
          }}
        />
      </div>

      {hasQuestions ? (
        <ul className="flex flex-col gap-2.5 px-4 py-4">
          {questions.map((question, index) => (
            <li
              key={question.id}
              draggable
              onDragStart={() => onDragStart(question.id)}
              onDragOver={(e) => onDragOver(e, question.id)}
              onDragEnd={onDragEnd}
              className={cn(
                'rounded-lg border border-[#E4E1EE] bg-white px-2.5 py-2.5 sm:px-3',
                dragId === question.id && 'opacity-70 ring-2 ring-[#2D2061]/20',
              )}
            >
              <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="inline-flex size-8 shrink-0 cursor-grab items-center justify-center text-[#A0A0B2] active:cursor-grabbing">
                    <GripVertical className="size-4" strokeWidth={2} />
                  </span>
                  <span className="inline-flex h-8 w-9 shrink-0 items-center justify-center rounded-md bg-[#2D2061] text-[11px] font-bold text-white">
                    Q{index + 1}
                  </span>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) =>
                      onUpdateQuestion(question.id, { text: e.target.value })
                    }
                    placeholder="Enter question text"
                    className="h-10 min-w-0 flex-1 rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                  />
                </div>
                <div className="flex flex-wrap items-end gap-2 pl-10 lg:pl-0">
                  <TimeField
                    label="Preparation"
                    requiredMark
                    value={question.prep}
                    onChange={(prep) => onUpdateQuestion(question.id, { prep })}
                  />
                  <TimeField
                    label="Answer"
                    requiredMark
                    value={question.answer}
                    onChange={(answer) =>
                      onUpdateQuestion(question.id, { answer })
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Remove question ${index + 1}`}
                    onClick={() => onRemoveQuestion(question.id)}
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[#E45C6A] text-white transition-colors hover:bg-[#D14A58]"
                  >
                    <Minus className="size-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="min-h-[12rem] flex-1" aria-hidden="true" />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Telephonic / Screening & Logistics layout                                  */
/* -------------------------------------------------------------------------- */

function TelephonicTemplateBody({
  questions,
  screeningEnabled,
  hasQuestions,
  dragId,
  onScreeningChange,
  onAddQuestions,
  onAutoGenerate,
  onUpdateQuestion,
  onRemoveQuestion,
  onDragStart,
  onDragOver,
  onDragEnd,
}: {
  questions: TemplateQuestion[]
  screeningEnabled: boolean
  hasQuestions: boolean
  dragId: string | null
  onScreeningChange: (on: boolean) => void
  onAddQuestions: () => void
  onAutoGenerate: () => void
  onUpdateQuestion: (
    id: string,
    patch: Partial<Omit<TemplateQuestion, 'id'>>,
  ) => void
  onRemoveQuestion: (id: string) => void
  onDragStart: (id: string) => void
  onDragOver: (event: DragEvent, overId: string) => void
  onDragEnd: () => void
}) {
  return (
    <div className="flex min-h-[22rem] flex-col overflow-hidden rounded-xl border border-[#E4E1EE] bg-white">
      <div className="border-b border-[#F0EEF5] px-4 py-3.5">
        <p className="text-sm font-bold text-[#2D2061]">
          {questions.length} Questions Selected
        </p>
        <p className="mt-0.5 text-xs text-[#8B8B9E]">
          Questions you&apos;ve added will appear here
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4 py-4">
        {/* Screening & Logistics header — title + FIT SCORE + toggle; desc + actions */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[#2D2061]">
                Screening &amp; Logistics
              </h3>
              <span className="inline-flex rounded-full bg-[#F5C56B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-[#5C3D0A]">
                Fit Score
              </span>
            </div>
            <Switch
              checked={screeningEnabled}
              onCheckedChange={onScreeningChange}
              aria-label="Enable screening and logistics"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p className="min-w-0 max-w-xl text-xs leading-relaxed text-[#8B8B9E]">
              Drawn from the shared screening library. Answers write back to the
              candidate record.
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onAddQuestions}
                disabled={!screeningEnabled}
                className="!h-9 !rounded-md border-[#2D2061] bg-white px-3 text-xs font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
              >
                <Plus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                Add Questions
              </Button>
              <Button
                type="button"
                onClick={onAutoGenerate}
                disabled={!screeningEnabled}
                className="!h-9 !rounded-md !bg-[#7C3AED] px-3 text-xs font-semibold text-white hover:!bg-[#6D28D9]"
              >
                <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
                {hasQuestions ? 'Re-Generate Template' : 'Auto Generate Template'}
              </Button>
            </div>
          </div>
        </div>

        {!screeningEnabled ? (
          <p className="rounded-lg border border-dashed border-[#E4E1EE] bg-[#FAFAFC] px-4 py-8 text-center text-sm text-[#8B8B9E]">
            Enable Screening &amp; Logistics to add fit-score questions.
          </p>
        ) : hasQuestions ? (
          <ul className="flex flex-col gap-2.5">
            {questions.map((question, index) => (
              <li
                key={question.id}
                draggable
                onDragStart={() => onDragStart(question.id)}
                onDragOver={(e) => onDragOver(e, question.id)}
                onDragEnd={onDragEnd}
                className={cn(
                  'rounded-xl border border-[#E4E1EE] bg-white p-3 sm:p-3.5',
                  dragId === question.id && 'opacity-70 ring-2 ring-[#2D2061]/20',
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-1 inline-flex size-7 shrink-0 cursor-grab items-center justify-center text-[#A0A0B2] active:cursor-grabbing">
                    <GripVertical className="size-4" strokeWidth={2} />
                  </span>
                  <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#2D2061] text-[10px] font-bold text-white">
                    Q{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) =>
                        onUpdateQuestion(question.id, { text: e.target.value })
                      }
                      placeholder="Enter screening question"
                      className="mb-3 h-10 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Select
                        label="Question Type"
                        options={SCREENING_TYPES}
                        value={question.questionType ?? 'Yes/No'}
                        onChange={(e) => {
                          const nextType = e.target
                            .value as ScreeningQuestionType
                          onUpdateQuestion(question.id, {
                            questionType: nextType,
                            acceptValue:
                              nextType === 'Yes/No'
                                ? 'Yes'
                                : question.acceptValue || '',
                          })
                        }}
                        className="bg-white"
                      />
                      <AcceptsWhenField
                        question={question}
                        onChange={(patch) =>
                          onUpdateQuestion(question.id, patch)
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove question ${index + 1}`}
                    onClick={() => onRemoveQuestion(question.id)}
                    className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[#E45C6A] text-white transition-colors hover:bg-[#D14A58]"
                  >
                    <Minus className="size-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-[#E4E1EE] bg-[#FAFAFC] px-4 py-8 text-center text-sm text-[#8B8B9E]">
            Add or auto-generate screening questions for this template.
          </p>
        )}
      </div>
    </div>
  )
}

function AcceptsWhenField({
  question,
  onChange,
}: {
  question: TemplateQuestion
  onChange: (patch: Partial<Omit<TemplateQuestion, 'id'>>) => void
}) {
  const type = question.questionType ?? 'Yes/No'

  if (type === 'Yes/No') {
    return (
      <Select
        label="Accepts When"
        options={['Yes', 'No']}
        value={question.acceptValue === 'No' ? 'No' : 'Yes'}
        onChange={(e) => onChange({ acceptValue: e.target.value })}
        className="bg-white"
      />
    )
  }

  if (type === 'Range') {
    return (
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-xs font-medium text-[#2D2061]">Accepts When</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={question.acceptRangeFrom ?? ''}
            onChange={(e) => onChange({ acceptRangeFrom: e.target.value })}
            placeholder="From"
            className="h-11 min-w-0 flex-1 rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
          <span className="shrink-0 text-xs font-medium text-[#8B8B9E]">To</span>
          <input
            type="text"
            value={question.acceptRangeTo ?? ''}
            onChange={(e) => onChange({ acceptRangeTo: e.target.value })}
            placeholder="To"
            className="h-11 min-w-0 flex-1 rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-[#2D2061]">Accepts When</span>
      <input
        type="text"
        value={question.acceptValue ?? ''}
        onChange={(e) => onChange({ acceptValue: e.target.value })}
        placeholder={
          type === 'Multi-Select'
            ? 'Option A, Option B, Option C'
            : 'Immediate, 15 Days, 30 Days'
        }
        className="h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
      />
    </div>
  )
}

function TimeField({
  label,
  requiredMark,
  value,
  onChange,
}: {
  label: string
  requiredMark?: boolean
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="flex w-[6.5rem] shrink-0 flex-col gap-1">
      <span className="text-[11px] font-medium text-[#2D2061]">
        {label}
        {requiredMark ? (
          <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      <span className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-md border border-[#ddd9e8] bg-white py-1.5 pl-2 pr-10 text-sm tabular-nums text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          aria-label={label}
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#8B8B9E]">
          Mins
        </span>
      </span>
    </label>
  )
}
