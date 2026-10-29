import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getCandidates } from '../../data/candidates'
import { HUB_CONVERSATION_CATEGORIES } from '../../data/communicationHub'
import { JOBS } from '../../data/jobs'
import { cn } from '../../lib/cn'
import { Button, Input, Select, SidePanel, Textarea, toast } from '../ui'

export type NewConversationInput = {
  candidateId: string
  candidateName: string
  jobTitle: string
  associatedJob: string | null
  topic: string
  category: string | null
  tag: string | null
  firstMessage: string
}

export type NewConversationPanelProps = {
  open: boolean
  onClose: () => void
  tagOptions: string[]
  onCreate: (input: NewConversationInput) => void
}

export function NewConversationPanel({
  open,
  onClose,
  tagOptions,
  onCreate,
}: NewConversationPanelProps) {
  const candidates = useMemo(() => getCandidates().slice(0, 40), [])
  const jobOptions = useMemo(
    () =>
      JOBS.slice(0, 20).map((job) => ({
        value: job.code,
        label: `${job.title} (${job.code})`,
      })),
    [],
  )

  const [candidateId, setCandidateId] = useState('')
  const [associatedJob, setAssociatedJob] = useState('')
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [firstMessage, setFirstMessage] = useState('')

  function reset() {
    setCandidateId('')
    setAssociatedJob('')
    setTopic('')
    setCategory('')
    setTag('')
    setFirstMessage('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleCreate() {
    const candidate = candidates.find((item) => item.id === candidateId)
    if (!candidate) {
      toast.error('Select a candidate')
      return
    }

    const topicTitle = topic.trim()
    if (!topicTitle) {
      toast.error('Enter a topic title')
      return
    }

    const job = jobOptions.find((item) => item.value === associatedJob)

    onCreate({
      candidateId: candidate.id,
      candidateName: candidate.name,
      jobTitle: job?.label.split(' (')[0] ?? candidate.designation,
      associatedJob: associatedJob || null,
      topic: topicTitle,
      category: category || null,
      tag: tag || null,
      firstMessage: firstMessage.trim(),
    })
    reset()
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={handleClose}
      title="Create New Conversation"
      widthClassName="w-full max-w-[28rem]"
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="!h-10 !rounded-md border-[#2D2061] px-5 text-[13px] font-semibold text-[#2D2061]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-[13px] font-semibold text-white hover:bg-[#241a4e]"
          >
            Create
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <CandidateSearchField
          candidates={candidates.map((item) => ({
            id: item.id,
            label: `${item.name} · ${item.email}`,
            name: item.name,
            email: item.email,
          }))}
          value={candidateId}
          onChange={setCandidateId}
        />

        <Select
          label="Associated Job"
          value={associatedJob}
          onChange={(event) => setAssociatedJob(event.target.value)}
          placeholder="Select"
          options={jobOptions}
        />

        <Input
          label="Topic Title"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Topic Title"
        />

        <Select
          label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Select"
          options={[...HUB_CONVERSATION_CATEGORIES]}
        />

        <Select
          label="Initial Tag"
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          placeholder="Select"
          options={tagOptions.map((item) => ({ value: item, label: item }))}
        />

        <Textarea
          label="First Message"
          value={firstMessage}
          onChange={(event) => setFirstMessage(event.target.value)}
          rows={5}
          placeholder="Write your first message…"
        />
      </div>
    </SidePanel>
  )
}

type CandidateOption = {
  id: string
  label: string
  name: string
  email: string
}

function CandidateSearchField({
  candidates,
  value,
  onChange,
}: {
  candidates: CandidateOption[]
  value: string
  onChange: (id: string) => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const selected = candidates.find((item) => item.id === value) ?? null

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return candidates.slice(0, 12)
    return candidates
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q),
      )
      .slice(0, 12)
  }, [candidates, query])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      <label className="text-sm font-medium text-ink">Candidate Email/Name</label>
      {selected ? (
        <div className="flex h-11 items-center gap-2 rounded-control border border-line bg-surface px-3">
          <Search
            className="size-4 shrink-0 text-[#8B8B9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate text-sm text-ink">
            {selected.name}
            <span className="text-subtle"> · {selected.email}</span>
          </span>
          <button
            type="button"
            aria-label="Clear candidate"
            onClick={() => {
              onChange('')
              setQuery('')
              setOpen(true)
            }}
            className="inline-flex size-7 items-center justify-center rounded-md text-[#8B8B9E] hover:bg-[#F4F2F8] hover:text-[#2D2061]"
          >
            <X className="size-3.5" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            'flex h-11 items-center gap-2 rounded-control border border-line bg-surface px-3',
            'focus-within:border-brand-800 focus-within:ring-2 focus-within:ring-brand-800/10',
          )}
        >
          <Search
            className="size-4 shrink-0 text-[#8B8B9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search & Select"
            aria-label="Candidate Email/Name"
            aria-autocomplete="list"
            aria-expanded={open}
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
          />
        </div>
      )}

      {open && !selected ? (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-56 overflow-y-auto rounded-lg border border-[#E8E6F0] bg-white py-1 shadow-[0_8px_24px_rgba(45,32,97,0.12)]"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-[#8B8B9E]">No candidates found</li>
          ) : (
            filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  className="flex w-full flex-col px-3 py-2 text-left hover:bg-[#F5F3FB]"
                  onClick={() => {
                    onChange(item.id)
                    setQuery('')
                    setOpen(false)
                  }}
                >
                  <span className="text-sm font-medium text-[#1A1A2E]">
                    {item.name}
                  </span>
                  <span className="text-[12px] text-[#8B8B9E]">{item.email}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}
