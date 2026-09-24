import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import {
  NOTE_JOBS,
  PROFILE_NOTES,
  type NoteScope,
  type ProfileNote,
} from '../../data/candidateProfileTabs'
import { Button, ConfirmDeleteModal, Input, Select, SidePanel, Textarea } from '../ui'
import { cn } from '../../lib/cn'

type NoteFilter = 'all' | NoteScope

type NoteDraft = {
  noteType: NoteScope
  jobId: string
  title: string
  description: string
}

const EMPTY_NOTE: NoteDraft = {
  noteType: 'job',
  jobId: '',
  title: '',
  description: '',
}

export function CandidateNotesPanel() {
  const [notes, setNotes] = useState<ProfileNote[]>(PROFILE_NOTES)
  const [filter, setFilter] = useState<NoteFilter>('all')
  const [selectedJob, setSelectedJob] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [adding, setAdding] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<ProfileNote | null>(null)

  const generalCount = notes.filter((note) => note.scope === 'general').length
  const jobCount = notes.filter((note) => note.scope === 'job').length
  const visible = notes.filter((note) => {
    if (filter === 'all') return true
    if (filter === 'general') return note.scope === 'general'
    if (note.scope !== 'job') return false
    if (!selectedJob) return true
    return note.jobId === selectedJob
  })

  function addNote(next: NoteDraft) {
    const job = NOTE_JOBS.find((item) => item.id === next.jobId)
    setNotes((current) => [
      {
        id: `n-${Date.now()}`,
        author: 'You',
        role: 'Recruiter',
        at: 'Just now',
        title: next.title.trim(),
        body: next.description.trim(),
        scope: next.noteType,
        jobId: next.noteType === 'job' && job ? job.id : undefined,
        jobLabel: next.noteType === 'job' && job ? `Job : ${job.label}` : undefined,
        canEdit: true,
        canDelete: true,
      },
      ...current,
    ])
    setAdding(false)
    setFilter(next.noteType)
    setSelectedJob(next.noteType === 'job' ? next.jobId : '')
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setNotes((current) => current.filter((item) => item.id !== pendingDelete.id))
    if (editingId === pendingDelete.id) setEditingId(null)
    setPendingDelete(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Note filters">
          <FilterChip
            label="All"
            count={notes.length}
            selected={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          <FilterChip
            label="General"
            count={generalCount}
            selected={filter === 'general'}
            onClick={() => setFilter('general')}
          />
          <FilterChip
            label="Job-specific"
            count={jobCount}
            selected={filter === 'job'}
            onClick={() => {
              setFilter('job')
              setSelectedJob('')
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="h-9 rounded-md bg-[#2D2061] px-3 text-[13px] font-semibold text-white hover:bg-[#241a4e]"
        >
          Add Note
        </button>
      </div>

      <AddNotePanel open={adding} onClose={() => setAdding(false)} onAdd={addNote} />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Note"
        itemName={pendingDelete?.title?.trim() || pendingDelete?.author}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      {filter === 'job' ? (
        <div className="mt-4 max-w-sm">
          <Select
            id="notes-job-filter"
            label="Job"
            placeholder="Select Job"
            options={NOTE_JOBS.map((job) => ({ value: job.id, label: job.label }))}
            value={selectedJob}
            onChange={(event) => setSelectedJob(event.target.value)}
          />
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="mt-4 text-[13px] text-[#8B8B9E]">
          {filter === 'job' ? 'No notes for this job.' : 'No notes in this view.'}
        </p>
      ) : (
      <ol className="relative mt-4 ml-3 border-l border-[#E4E0F2]">
        {visible.map((note) => (
          <li key={note.id} className="relative pb-4 pl-6 last:pb-0">
            <span
              className="absolute top-4 -left-[5px] size-2.5 rounded-full border-2 border-[#D5D2E2] bg-white"
              aria-hidden="true"
            />
            <article className="rounded-xl border border-[#E8E6F0] bg-white px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] text-[#1A1A2E]">
                  <span className="font-semibold">{note.author}</span>
                  <span className="text-[#8B8B9E]"> {note.role}</span>
                  <span className="text-[#C5C2D2]"> · </span>
                  <span className="text-[#8B8B9E]">{note.at}</span>
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  {note.canEdit ? (
                    <button
                      type="button"
                      aria-label={`Edit note by ${note.author}`}
                      onClick={() => {
                        setEditingId(note.id)
                        setDraft(note.body)
                      }}
                      className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] hover:bg-[#F4F2F8]"
                    >
                      <Pencil className="size-3.5" strokeWidth={2} aria-hidden="true" />
                    </button>
                  ) : null}
                  {note.canDelete ? (
                    <button
                      type="button"
                      aria-label={`Delete note by ${note.author}`}
                      onClick={() => setPendingDelete(note)}
                      className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] hover:bg-[#FDECEC] hover:text-[#D14343]"
                    >
                      <Trash2 className="size-3.5" strokeWidth={2} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </div>
              {editingId === note.id ? (
                <form
                  className="mt-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const body = draft.trim()
                    if (!body) return
                    setNotes((current) =>
                      current.map((item) => (item.id === note.id ? { ...item, body } : item)),
                    )
                    setEditingId(null)
                  }}
                >
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    aria-label="Edit note"
                    rows={3}
                    className="w-full resize-none rounded-md border border-[#E4E1EC] px-3 py-2 text-[13px] outline-none focus:border-[#2D2061]"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="h-8 px-3 text-[12px] font-semibold text-[#5C5870]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-8 rounded-md bg-[#2D2061] px-3 text-[12px] font-semibold text-white"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-2">
                  {note.title ? (
                    <p className="text-[13px] font-semibold text-[#1A1A2E]">{note.title}</p>
                  ) : null}
                  <p className={cn('text-[13px] leading-relaxed text-[#3D3A52]', note.title && 'mt-1')}>
                    {note.body}
                  </p>
                </div>
              )}
              {note.jobLabel ? (
                <span className="mt-2 inline-flex rounded-full bg-[#2D2061] px-2.5 py-1 text-[11px] font-semibold text-white">
                  {note.jobLabel}
                </span>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
      )}
    </div>
  )
}

function AddNotePanel({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (draft: NoteDraft) => void
}) {
  const [draft, setDraft] = useState<NoteDraft>(EMPTY_NOTE)
  const [errors, setErrors] = useState<Partial<Record<keyof NoteDraft, string>>>({})

  function update(patch: Partial<NoteDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function submit() {
    const nextErrors: Partial<Record<keyof NoteDraft, string>> = {}
    if (!draft.title.trim()) nextErrors.title = 'Enter a title'
    if (!draft.description.trim()) nextErrors.description = 'Enter a description'
    if (draft.noteType === 'job' && !draft.jobId) nextErrors.jobId = 'Select a job'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onAdd(draft)
    setDraft(EMPTY_NOTE)
    setErrors({})
  }

  function close() {
    setDraft(EMPTY_NOTE)
    setErrors({})
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={close}
      title="Add Note"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={close}
            className="!h-10 !min-w-[5.5rem] !rounded-md border-[#D5D2E2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={submit}
            className="!h-10 !min-w-[5.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Add
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          id="note-type"
          label="Note Type"
          placeholder="Select note type"
          options={[
            { value: 'job', label: 'Job Specific' },
            { value: 'general', label: 'General' },
          ]}
          value={draft.noteType}
          onChange={(event) => {
            const noteType = event.target.value === 'general' ? 'general' : 'job'
            update({ noteType, jobId: noteType === 'general' ? '' : draft.jobId })
          }}
        />
        {draft.noteType === 'job' ? (
          <Select
            id="note-job"
            label="Job"
            placeholder="Select Job"
            options={NOTE_JOBS.map((job) => ({ value: job.id, label: job.label }))}
            value={draft.jobId}
            error={errors.jobId}
            onChange={(event) => update({ jobId: event.target.value })}
          />
        ) : null}
        <Input
          id="note-title"
          label="Title"
          placeholder="Note Title"
          value={draft.title}
          error={errors.title}
          onChange={(event) => update({ title: event.target.value })}
        />
        <Textarea
          id="note-description"
          label="Descriptions"
          placeholder="Enter Descriptions"
          rows={5}
          value={draft.description}
          error={errors.description}
          onChange={(event) => update({ description: event.target.value })}
        />
      </div>
    </SidePanel>
  )
}

function FilterChip({
  label,
  count,
  selected,
  onClick,
}: {
  label: string
  count: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold',
        selected ? 'bg-[#2D2061] text-white' : 'bg-[#F4F2F8] text-[#5C5870]',
      )}
    >
      {label}
      <span
        className={cn(
          'inline-flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-semibold',
          selected ? 'bg-white text-[#2D2061]' : 'bg-[#E6E3EF] text-[#6B6B80]',
        )}
      >
        {count}
      </span>
    </button>
  )
}
