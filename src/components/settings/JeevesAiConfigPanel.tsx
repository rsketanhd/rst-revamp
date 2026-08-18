import { useEffect, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button, Select, SidePanel, Textarea } from '../ui'

export type JeevesAiConfigPanelProps = {
  open: boolean
  onClose: () => void
}

type QuestionType =
  | 'single-choice'
  | 'multi-choice'
  | 'yes-no'
  | 'free-text'
  | 'dropdown'
  | 'location'

type ChatQuestion = {
  id: string
  title: string
  type: QuestionType
  expanded: boolean
  options: string[]
  min?: number
  max?: number
  dropdownMode?: 'single' | 'multi'
  locationMode?: 'map' | 'list'
  country?: string
  state?: string
}

const TYPE_OPTIONS = [
  { value: 'single-choice', label: 'Single Choice' },
  { value: 'multi-choice', label: 'Multi Choice' },
  { value: 'yes-no', label: 'Yes/No' },
  { value: 'free-text', label: 'Free Text' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'location', label: 'Location' },
]

/** Seed data from Question Configurations designs (expand + collapse). */
const INITIAL_QUESTIONS: ChatQuestion[] = [
  {
    id: 'q1',
    title: 'What is your expected salary?',
    type: 'single-choice',
    expanded: false,
    options: ['Under 50k', '50k to 75k', '75k to 100k', '100k Plus'],
  },
  {
    id: 'q2',
    title: 'Which technologies have you worked with?',
    type: 'multi-choice',
    expanded: false,
    options: ['Java', 'Spring Boot', 'Django', 'FastAPI'],
    min: 1,
    max: 2,
  },
  {
    id: 'q3',
    title: 'Are you willing to relocate to Riyadh for this role?',
    type: 'yes-no',
    expanded: false,
    options: [],
  },
  {
    id: 'q4',
    title: 'What projects have you worked on?',
    type: 'free-text',
    expanded: false,
    options: [],
  },
  {
    id: 'q5',
    title: 'Which technologies have you worked with?',
    type: 'dropdown',
    expanded: false,
    options: ['Java', 'Spring Boot', 'Django', 'FastAPI'],
    dropdownMode: 'single',
  },
  {
    id: 'q6',
    title: 'Where are you located currently?',
    type: 'location',
    expanded: false,
    options: [],
    locationMode: 'map',
    country: '',
    state: '',
  },
]

/**
 * Admin Panel → Jeeves AI → Configure side panel.
 * Supports collapsed list rows and expanded question editors per design.
 */
export function JeevesAiConfigPanel({
  open,
  onClose,
}: JeevesAiConfigPanelProps) {
  const [queryMessage, setQueryMessage] = useState(
    'Hi {{Candidate Name}}, we currently handle job-specific opportunities with {{Company Name}}.',
  )
  const [closingMessage, setClosingMessage] = useState(
    'Thank you for sharing your details.',
  )
  const [followUpMessage, setFollowUpMessage] = useState(
    'A recruiter will review your profile and get in touch with you shortly.',
  )
  const [questions, setQuestions] = useState<ChatQuestion[]>(() =>
    cloneQuestions(INITIAL_QUESTIONS),
  )

  useEffect(() => {
    if (!open) return
    setQueryMessage(
      'Hi {{Candidate Name}}, we currently handle job-specific opportunities with {{Company Name}}.',
    )
    setClosingMessage('Thank you for sharing your details.')
    setFollowUpMessage(
      'A recruiter will review your profile and get in touch with you shortly.',
    )
    setQuestions(cloneQuestions(INITIAL_QUESTIONS))
  }, [open])

  function updateQuestion(id: string, patch: Partial<ChatQuestion>) {
    setQuestions((current) =>
      current.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    )
  }

  function toggleExpanded(id: string) {
    setQuestions((current) =>
      current.map((q) =>
        q.id === id ? { ...q, expanded: !q.expanded } : q,
      ),
    )
  }

  function deleteQuestion(id: string) {
    setQuestions((current) => current.filter((q) => q.id !== id))
  }

  function addQuestion() {
    const index = questions.length + 1
    setQuestions((current) => [
      ...current,
      {
        id: `q-new-${Date.now()}`,
        title: `New question ${index}`,
        type: 'free-text',
        expanded: true,
        options: [],
      },
    ])
  }

  function addOption(id: string) {
    setQuestions((current) =>
      current.map((q) =>
        q.id === id
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q,
      ),
    )
  }

  function updateOption(id: string, optionIndex: number, value: string) {
    setQuestions((current) =>
      current.map((q) => {
        if (q.id !== id) return q
        const options = [...q.options]
        options[optionIndex] = value
        return { ...q, options }
      }),
    )
  }

  function removeOption(id: string, optionIndex: number) {
    setQuestions((current) =>
      current.map((q) => {
        if (q.id !== id) return q
        return {
          ...q,
          options: q.options.filter((_, i) => i !== optionIndex),
        }
      }),
    )
  }

  function handleSave() {
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Question Configurations"
      widthClassName="w-full max-w-[40rem]"
      bodyClassName="bg-white"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <section>
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6B6B80]">
            Query Message
          </p>
          <p className="mt-0.5 text-xs text-[#8B8B9E]">
            The message will be shown to candidate once the chat begins.
          </p>
          <Textarea
            value={queryMessage}
            onChange={(e) => setQueryMessage(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </section>

        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6B6B80]">
              Chatbot Questions ({questions.length})
            </p>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-[#2D2061] bg-white px-2.5 text-xs font-semibold text-[#2D2061] transition-colors hover:bg-[#f7f6fb]"
            >
              <Plus className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
              Add question
            </button>
          </div>

          <ul className="flex flex-col gap-2.5">
            {questions.map((question, index) => (
              <li
                key={question.id}
                className="overflow-hidden rounded-lg border border-[#E4E1EE] bg-white"
              >
                <div className="flex items-start gap-2 px-3 py-3">
                  <span
                    className="mt-0.5 inline-flex cursor-grab text-[#A0A0B2]"
                    aria-hidden="true"
                  >
                    <GripVertical className="size-4" strokeWidth={2} />
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(question.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="text-sm font-semibold text-[#2A2740]">
                      {index + 1}. {question.title}
                    </p>
                    {!question.expanded ? (
                      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.03em] text-[#8B8B9E]">
                        {summarizeQuestion(question)}
                      </p>
                    ) : null}
                  </button>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                      className="inline-flex size-8 items-center justify-center rounded-md text-[#8B8B9E] transition-colors hover:bg-[#F7F6FA] hover:text-[#E53935]"
                      aria-label={`Delete question ${index + 1}`}
                    >
                      <Trash2 className="size-3.5" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpanded(question.id)}
                      className="inline-flex size-8 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F7F6FA]"
                      aria-expanded={question.expanded}
                      aria-label={
                        question.expanded
                          ? `Collapse question ${index + 1}`
                          : `Expand question ${index + 1}`
                      }
                    >
                      {question.expanded ? (
                        <ChevronDown className="size-4" strokeWidth={2} />
                      ) : (
                        <ChevronRight className="size-4" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>

                {question.expanded ? (
                  <div className="space-y-3 border-t border-[#F0EEF5] px-3 pb-3.5 pt-3">
                    <input
                      type="text"
                      value={question.title}
                      onChange={(e) =>
                        updateQuestion(question.id, { title: e.target.value })
                      }
                      className="h-10 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm font-medium text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                      aria-label={`Question ${index + 1} title`}
                    />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Select
                        label="Question Type"
                        options={TYPE_OPTIONS}
                        value={question.type}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            type: e.target.value as QuestionType,
                          })
                        }
                      />
                      {question.type === 'multi-choice' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-[#2D2061]">
                              Min
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={question.min ?? 1}
                              onChange={(e) =>
                                updateQuestion(question.id, {
                                  min: Number(e.target.value),
                                })
                              }
                              className="h-11 rounded-md border border-[#ddd9e8] px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                            />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-[#2D2061]">
                              Max
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={question.max ?? 2}
                              onChange={(e) =>
                                updateQuestion(question.id, {
                                  max: Number(e.target.value),
                                })
                              }
                              className="h-11 rounded-md border border-[#ddd9e8] px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                            />
                          </label>
                        </div>
                      ) : null}
                      {question.type === 'dropdown' ? (
                        <Select
                          label="Dropdown Type"
                          options={[
                            { value: 'single', label: 'Single Select' },
                            { value: 'multi', label: 'Multi Select' },
                          ]}
                          value={question.dropdownMode ?? 'single'}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              dropdownMode: e.target.value as
                                | 'single'
                                | 'multi',
                            })
                          }
                        />
                      ) : null}
                      {question.type === 'location' ? (
                        <Select
                          label="Selection Type"
                          options={[
                            { value: 'map', label: 'Map' },
                            { value: 'list', label: 'List' },
                          ]}
                          value={question.locationMode ?? 'map'}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              locationMode: e.target.value as 'map' | 'list',
                            })
                          }
                        />
                      ) : null}
                    </div>

                    {question.type === 'single-choice' ||
                    question.type === 'multi-choice' ||
                    question.type === 'dropdown' ? (
                      <div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={`${question.id}-opt-${optionIndex}`}
                              className="flex items-center gap-2 rounded-md border border-[#E8E6F0] bg-[#FAFAFC] px-2.5 py-2"
                            >
                              <span
                                className={cn(
                                  'size-3.5 shrink-0 border border-[#C8C5D6]',
                                  question.type === 'multi-choice'
                                    ? 'rounded-sm'
                                    : 'rounded-full',
                                )}
                                aria-hidden="true"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  updateOption(
                                    question.id,
                                    optionIndex,
                                    e.target.value,
                                  )
                                }
                                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#2D2061] outline-none"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeOption(question.id, optionIndex)
                                }
                                className="text-[#A0A0B2] hover:text-[#E53935]"
                                aria-label="Remove option"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addOption(question.id)}
                          className="mt-2 text-xs font-semibold text-[#2D2061] hover:underline"
                        >
                          + Add option
                        </button>
                      </div>
                    ) : null}

                    {question.type === 'location' ? (
                      <div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Select
                            label="Select Country"
                            options={[
                              'United Kingdom',
                              'United States',
                              'India',
                              'UAE',
                            ]}
                            value={question.country ?? ''}
                            placeholder="Select Country"
                            onChange={(e) =>
                              updateQuestion(question.id, {
                                country: e.target.value,
                              })
                            }
                          />
                          <Select
                            label="Select State"
                            options={['London', 'California', 'Dubai', 'Delhi']}
                            value={question.state ?? ''}
                            placeholder="Select State"
                            onChange={(e) =>
                              updateQuestion(question.id, {
                                state: e.target.value,
                              })
                            }
                          />
                        </div>
                        <p className="mt-2 text-xs font-medium text-[#C27A3A]">
                          Note: Based on this country and state result for
                          candidate will set into filter.
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6B6B80]">
            Closing Message
          </p>
          <Textarea
            value={closingMessage}
            onChange={(e) => setClosingMessage(e.target.value)}
            rows={2}
            className="mt-2"
          />
        </section>

        <section>
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6B6B80]">
            Follow Up Message
          </p>
          <Textarea
            value={followUpMessage}
            onChange={(e) => setFollowUpMessage(e.target.value)}
            rows={2}
            className="mt-2"
          />
        </section>
      </div>
    </SidePanel>
  )
}

function cloneQuestions(source: ChatQuestion[]): ChatQuestion[] {
  return source.map((q) => ({ ...q, options: [...q.options] }))
}

function summarizeQuestion(question: ChatQuestion): string {
  switch (question.type) {
    case 'single-choice':
      return `Single Choice - ${question.options.length} options configured`
    case 'multi-choice':
      return `Multi Choice - ${question.options.length} options configured`
    case 'yes-no':
      return 'Choice'
    case 'free-text':
      return 'Free Text'
    case 'dropdown':
      return `Hierarchy (${question.dropdownMode === 'multi' ? 'Multi Select' : 'Single Select'}) - ${question.options.length} options configured`
    case 'location':
      return 'Country List'
    default: {
      const _exhaustive: never = question.type
      return _exhaustive
    }
  }
}
