import { useMemo, useRef, useState } from 'react'
import { Calendar, CloudUpload, Copy, FileUp, MapPin, Plus, Search, Sparkles } from 'lucide-react'
import { Textarea, toast } from '../../ui'
import { cn } from '../../../lib/cn'
import { JOBS, type JobListing } from '../../../data/jobs'
import { getExtraJobs } from '../../../data/jobStore'
import {
  defaultCreateJobForm,
  type CreateJobFormState,
  type CreateMethod,
} from './types'
import { jobListingToCreateForm } from './jobListingToForm'
import { FieldInput, StepHeader } from './StepChrome'

type Props = {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
}

const METHODS: Array<{
  id: CreateMethod
  title: string
  description: string
  icon: typeof Copy
}> = [
  {
    id: 'copy',
    title: 'Copy from Existing Jobs',
    description: 'Use an existing job as your starting point.',
    icon: Copy,
  },
  {
    id: 'scratch',
    title: 'Create From Scratch',
    description: 'Build a completely custom job from the ground up.',
    icon: Plus,
  },
  {
    id: 'upload',
    title: 'Upload JD',
    description: 'Upload a job description or paste the text.',
    icon: FileUp,
  },
]

type TemplateRow = {
  id: string
  code: string
  title: string
  location: string
  department: string
  createdAt: string
  listing: JobListing | null
}

function formatCreatedLabel(iso: string): string {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function templateCatalog(): JobListing[] {
  const extras = getExtraJobs()
  const extraIds = new Set(extras.map((job) => job.id))
  return [...extras, ...JOBS.filter((job) => !extraIds.has(job.id))]
}

export function StepCreateJob({ value, onChange }: Props) {
  if (value.aiEntry) {
    return (
      <div>
        <StepHeader
          title="Create Job"
          description="Provide key information about the job."
        />
        {value.providedRole ? (
          <ProvidedRoleBanner
            role={value.providedRole}
            onClear={() => onChange({ providedRole: '' })}
          />
        ) : null}
        <ScratchFields value={value} onChange={onChange} split />
      </div>
    )
  }

  return (
    <div>
      <StepHeader
        title="Create Job"
        description="Provide key information about the job."
      />

      <p className="mb-3 text-sm font-semibold text-[#2D2061]">
        Select your Method
      </p>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        {METHODS.map((method) => {
          const active = value.method === method.id
          const Icon = method.icon
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => {
                if (
                  method.id === 'upload' &&
                  value.jobDescription === defaultCreateJobForm.jobDescription
                ) {
                  onChange({ method: 'upload', jobDescription: '' })
                  return
                }
                onChange({ method: method.id })
              }}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                active
                  ? 'border-[#2D2061] bg-[#2D2061] text-white'
                  : 'border-[#e0ddea] bg-white text-[#2D2061] hover:border-[#2D2061]/40',
              )}
            >
              <span
                className={cn(
                  'inline-flex size-10 shrink-0 items-center justify-center rounded-lg',
                  active ? 'bg-white/15' : 'bg-[#f5f4f9]',
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{method.title}</span>
                <span
                  className={cn(
                    'mt-0.5 block text-xs leading-relaxed',
                    active ? 'text-white/80' : 'text-[#8B8B9E]',
                  )}
                >
                  {method.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <MethodBody value={value} onChange={onChange} />
    </div>
  )
}

function MethodBody({ value, onChange }: Props) {
  switch (value.method) {
    case 'copy':
      return <CopyFromExisting value={value} onChange={onChange} />
    case 'scratch':
      return <ScratchFields value={value} onChange={onChange} />
    case 'upload':
      return <UploadJd value={value} onChange={onChange} />
    default: {
      const exhaustive: never = value.method
      return exhaustive
    }
  }
}

function CopyFromExisting({ value, onChange }: Props) {
  const [query, setQuery] = useState('')
  const catalog = useMemo(() => templateCatalog(), [])

  const rows = useMemo(() => {
    const fromCatalog: TemplateRow[] = catalog.map((job) => ({
      id: job.id,
      code: job.code,
      title: job.title,
      location: job.location,
      department: job.department,
      createdAt: job.createdAt,
      listing: job,
    }))

    const pinnedCode =
      value.jobReqId ||
      (value.sourceJobId.startsWith('dup-') ? '' : value.sourceJobId)
    const pinned =
      value.sourceJobId && !fromCatalog.some((row) => row.id === value.sourceJobId)
        ? [
            {
              id: value.sourceJobId,
              code: pinnedCode,
              title: value.jobTitle,
              location: '',
              department: value.department,
              createdAt: '',
              listing: null,
            } satisfies TemplateRow,
          ]
        : []

    return [...pinned, ...fromCatalog]
  }, [catalog, value])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q),
    )
  }, [query, rows])

  function selectRow(row: TemplateRow) {
    if (row.listing) {
      onChange({
        ...jobListingToCreateForm(row.listing),
        method: 'copy',
        sourceJobId: row.listing.id,
      })
      return
    }
    onChange({
      method: 'copy',
      sourceJobId: row.id,
      jobTitle: row.title,
      department: row.department,
    })
  }

  const countLabel = `${filtered.length} ${filtered.length === 1 ? 'job' : 'jobs'}`

  return (
    <div className="rounded-xl border border-[#ECEAF3] bg-[#F7F6FB] p-4 sm:p-5">
      <p className="text-sm font-semibold text-[#2D2061]">
        Search or select an existing job to use as your template
      </p>

      <label className="relative mt-4 block">
        <span className="sr-only">Search by Job Title OR Job ID</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A0A0B2]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by Job Title OR Job ID"
          className="h-11 w-full rounded-md border border-[#E4E1EE] bg-white py-2 pl-10 pr-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
        />
      </label>

      <p className="mt-3 text-xs text-[#8B8B9E]">{countLabel}</p>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#8B8B9E]">
          No jobs match that search.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3" role="listbox" aria-label="Existing jobs">
          {filtered.map((row) => {
            const selected = value.sourceJobId === row.id
            const created = formatCreatedLabel(row.createdAt)
            return (
              <li key={row.id}>
                <div
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    'flex w-full items-center justify-between gap-4 rounded-xl border bg-white px-4 py-3.5 text-left transition-colors',
                    selected
                      ? 'border-[#2D2061] ring-1 ring-[#2D2061]'
                      : 'border-[#E6E4EF]',
                  )}
                >
                  <span className="min-w-0">
                    <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                      <span className="truncate text-sm font-semibold text-[#1a1a2e]">
                        {row.title}
                      </span>
                      {row.code ? (
                        <span className="shrink-0 text-sm font-medium text-[#8B8B9E]">
                          {row.code}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8B8B9E]">
                      {row.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                          {row.location}
                        </span>
                      ) : null}
                      {row.location && row.department ? <span aria-hidden="true">•</span> : null}
                      {row.department ? <span>{row.department}</span> : null}
                      {created ? (
                        <>
                          {row.location || row.department ? (
                            <span aria-hidden="true">•</span>
                          ) : null}
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                            Created {created}
                          </span>
                        </>
                      ) : null}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => selectRow(row)}
                    className={cn(
                      'inline-flex h-9 shrink-0 items-center rounded-md px-4 text-sm font-semibold transition-colors',
                      selected
                        ? 'bg-[#2D2061] text-white'
                        : 'border border-[#2D2061]/40 bg-white text-[#2D2061] hover:bg-[#F7F6FA]',
                    )}
                  >
                    {selected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function ProvidedRoleBanner({
  role,
  onClear,
}: {
  role: string
  onClear: () => void
}) {
  return (
    <div className="mb-6 rounded-xl bg-[#F6F4FB] px-4 py-3 sm:px-5 sm:py-4">
      <p className="text-xs font-medium text-[#8E7BB8]">Your provided job role</p>
      <div className="mt-2 flex items-start gap-3 rounded-lg border border-[#E6E4EF] bg-white px-3 py-2.5">
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-[#3D3A52]">{role}</p>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6B5A9E] transition-colors hover:text-[#2D2061]"
        >
          Clear Search
          <Sparkles className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function ScratchFields({
  value,
  onChange,
  split = false,
}: Props & { split?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <div className={cn(split && 'grid grid-cols-1 gap-4 md:grid-cols-2')}>
        <FieldInput
          label="Job Req ID"
          requiredMark
          placeholder="Enter Job Req ID"
          value={value.jobReqId}
          onChange={(event) => onChange({ jobReqId: event.target.value })}
        />
        <FieldInput
          label="Job Title"
          requiredMark
          placeholder="Enter job title"
          value={value.jobTitle}
          onChange={(event) => onChange({ jobTitle: event.target.value })}
          helperText="Be specific and use standard industry titles."
        />
      </div>
      <Textarea
        label="Job Descriptions"
        requiredMark
        rows={8}
        value={value.jobDescription}
        onChange={(event) => onChange({ jobDescription: event.target.value })}
      />
    </div>
  )
}

const JD_MAX_BYTES = 10 * 1024 * 1024
const JD_FILE_PATTERN = /\.(pdf|doc|docx|txt)$/i

function UploadJd({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!JD_FILE_PATTERN.test(file.name)) {
      toast.error('Upload a PDF, DOC, DOCX, or TXT file.')
      return
    }
    if (file.size > JD_MAX_BYTES) {
      toast.error('File must be 10 MB or smaller.')
      return
    }

    setFileName(file.name)
    const isText = /\.txt$/i.test(file.name) || file.type.startsWith('text/')
    if (!isText) return

    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result.trim() : ''
      if (!text) {
        toast.error('Could not read that file. Paste the job description instead.')
        return
      }
      onChange({ method: 'upload', jobDescription: text })
    }
    reader.onerror = () => {
      toast.error('Could not read that file. Paste the job description instead.')
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) handleFile(file)
        }}
      />

      <div
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          const file = event.dataTransfer.files?.[0]
          if (file) handleFile(file)
        }}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition-colors',
          dragging
            ? 'border-[#9B8EC4] bg-[#F7F5FC]'
            : 'border-[#D9D7E3] bg-[#FAFAFC]',
        )}
      >
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-[#F3F0FA] text-[#B7A9D6]">
          <CloudUpload className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-[#1a1a2e]">
          Drag & drop your JD here
        </p>
        <p className="mt-1 text-xs text-[#A0A0B2]">
          PDF, DOC, DOCX or TXT · up to 10 MB
        </p>
        {fileName ? (
          <p className="mt-2 text-xs font-medium text-[#2D2061]">{fileName}</p>
        ) : null}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 inline-flex h-9 items-center rounded-md border border-[#E4E1EE] bg-white px-4 text-sm font-medium text-[#3D3A52] transition-colors hover:bg-[#F7F6FB]"
        >
          Browse files
        </button>
      </div>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-[#E6E4EF]" />
        <span className="text-xs font-medium tracking-wide text-[#8B8B9E]">
          OR Paste below
        </span>
        <span className="h-px flex-1 bg-[#E6E4EF]" />
      </div>

      <Textarea
        label="Paste JD text"
        rows={6}
        value={value.jobDescription}
        placeholder="Paste the job description here..."
        onChange={(event) => onChange({ jobDescription: event.target.value })}
      />
    </div>
  )
}
