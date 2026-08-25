import { useEffect, useId, useRef, useState, type DragEvent, type RefObject } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CloudUpload,
  Download,
  Folder,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  Printer,
  Search,
  Upload,
  X,
} from 'lucide-react'
import {
  getBulkImportResults,
  getSingleImportResult,
  type ImportFileItem,
  type ImportIntent,
  type ImportParsedDetails,
  type ImportResultStatus,
} from '../../data/importCandidates'
import { Button, Input, SidePanel, Switch, toast } from '../ui'
import { cn } from '../../lib/cn'

export type ImportCandidatesPanelProps = {
  open: boolean
  onClose: () => void
}

type PanelStep = 'upload' | 'uploading' | 'review'

const INTENT_TABS: Array<{ id: ImportIntent; label: string }> = [
  { id: 'candidate', label: 'Add Candidate' },
  { id: 'application', label: 'Add Application' },
  { id: 'recommendation', label: 'Add Recommendation' },
]

const ACCEPT = '.pdf,.doc,.docx,.html,.txt,.zip'

/**
 * Candidates → Upload Resume — Import Candidates side panel.
 */
export function ImportCandidatesPanel({
  open,
  onClose,
}: ImportCandidatesPanelProps) {
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<PanelStep>('upload')
  const [intent, setIntent] = useState<ImportIntent>('candidate')
  const [autoProcess, setAutoProcess] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedLabel, setUploadedLabel] = useState('Candidate.zip')
  const [isBulk, setIsBulk] = useState(true)
  const [items, setItems] = useState<ImportFileItem[]>([])
  const [statusTab, setStatusTab] =
    useState<ImportResultStatus>('needsReview')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setStep('upload')
    setIntent('candidate')
    setAutoProcess(true)
    setDragOver(false)
    setProgress(0)
    setUploadedLabel('Candidate.zip')
    setIsBulk(true)
    setItems([])
    setStatusTab('needsReview')
    setSelectedId(null)
  }, [open])

  useEffect(() => {
    if (step !== 'uploading') return
    setProgress(0)
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100
        return Math.min(100, current + 8)
      })
    }, 120)
    return () => window.clearInterval(timer)
  }, [step])

  useEffect(() => {
    if (step !== 'uploading' || progress < 100) return
    const done = window.setTimeout(() => setStep('review'), 350)
    return () => window.clearTimeout(done)
  }, [step, progress])

  const filteredItems = items.filter((item) => item.status === statusTab)
  const selected =
    filteredItems.find((item) => item.id === selectedId) ??
    filteredItems[0] ??
    null

  const counts = {
    needsReview: items.filter((i) => i.status === 'needsReview').length,
    success: items.filter((i) => i.status === 'success').length,
    failed: items.filter((i) => i.status === 'failed').length,
  }

  function startUpload(files: FileList | File[] | null) {
    const list = files ? Array.from(files) : []
    const first = list[0]
    const bulk =
      list.length !== 1 ||
      Boolean(first?.name.toLowerCase().endsWith('.zip'))
    setIsBulk(bulk)
    setUploadedLabel(
      bulk
        ? first?.name.toLowerCase().endsWith('.zip')
          ? first.name
          : 'Candidate.zip'
        : first?.name ?? 'JohnHuber.pdf',
    )
    setItems(bulk ? getBulkImportResults() : [getSingleImportResult(first?.name ?? 'JohnHuber.pdf')])
    setStatusTab(bulk ? 'success' : 'needsReview')
    setSelectedId(null)
    setStep('uploading')
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    startUpload(files)
  }

  function selectTab(next: ImportResultStatus) {
    setStatusTab(next)
    const first = items.find((item) => item.status === next)
    setSelectedId(first?.id ?? null)
  }

  function updateSelected(patch: Partial<ImportParsedDetails>) {
    if (!selected) return
    setItems((current) =>
      current.map((item) =>
        item.id === selected.id
          ? { ...item, details: { ...item.details, ...patch } }
          : item,
      ),
    )
  }

  function moveSelectedToSuccess(message: string) {
    if (!selected) return
    setItems((current) =>
      current.map((item) =>
        item.id === selected.id
          ? { ...item, status: 'success', message }
          : item,
      ),
    )
  }

  function handleContinue() {
    toast.success(
      isBulk
        ? `${counts.success} candidate(s) imported successfully.`
        : 'Candidate imported successfully.',
      { title: 'Import Candidates' },
    )
    onClose()
  }

  const wide = step === 'review'
  const showFooter = step === 'review'

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Import Candidates"
      widthClassName={
        wide
          ? 'w-full max-w-[min(100%,90vw)]'
          : 'w-full max-w-[min(100%,52rem)]'
      }
      bodyClassName={
        wide
          ? '!flex min-h-0 flex-col overflow-hidden !p-0'
          : undefined
      }
      footerClassName={showFooter ? 'justify-end' : undefined}
      footer={
        showFooter ? (
          <Button
            type="button"
            onClick={handleContinue}
            className="!h-10 !rounded-md !bg-[#2D2061] px-6 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Continue
          </Button>
        ) : undefined
      }
    >
      {step === 'upload' ? (
        <UploadStep
          intent={intent}
          autoProcess={autoProcess}
          dragOver={dragOver}
          fileInputId={fileInputId}
          fileInputRef={fileInputRef}
          onIntentChange={setIntent}
          onAutoProcessChange={setAutoProcess}
          onDragOverChange={setDragOver}
          onFiles={handleFiles}
        />
      ) : null}

      {step === 'uploading' ? (
        <UploadingStep
          progress={progress}
          onCancel={() => setStep('upload')}
        />
      ) : null}

      {step === 'review' ? (
        <ReviewStep
          uploadedLabel={uploadedLabel}
          isBulk={isBulk}
          statusTab={statusTab}
          counts={counts}
          items={filteredItems}
          selected={selected}
          onSelectTab={selectTab}
          onSelectItem={(id) => setSelectedId(id)}
          onChangeDetails={updateSelected}
          onClearAll={() => {
            setItems([])
            setStep('upload')
          }}
          onUploadMore={() => setStep('upload')}
          onSaveSuccess={() => {
            if (!selected) return
            if (!selected.details.email.trim()) {
              toast.success('Email is required.', { title: 'Validation' })
              return
            }
            moveSelectedToSuccess('Success : File uploaded successfully')
            toast.success('Candidate details saved.', { title: 'Saved' })
          }}
          onMerge={() => {
            moveSelectedToSuccess('Success : Merged with existing profile')
            toast.success('Profile merged.', { title: 'Merge' })
          }}
          onNew={() => {
            if (!selected?.details.email.trim()) {
              toast.success('Email is required.', { title: 'Validation' })
              return
            }
            moveSelectedToSuccess('Success : New candidate created')
            toast.success('New candidate created.', { title: 'New' })
          }}
          onSkip={() => {
            if (!selected) return
            const rest = filteredItems.filter((i) => i.id !== selected.id)
            setSelectedId(rest[0]?.id ?? null)
            toast.success('Item skipped.', { title: 'Skip' })
          }}
        />
      ) : null}
    </SidePanel>
  )
}

function UploadStep({
  intent,
  autoProcess,
  dragOver,
  fileInputId,
  fileInputRef,
  onIntentChange,
  onAutoProcessChange,
  onDragOverChange,
  onFiles,
}: {
  intent: ImportIntent
  autoProcess: boolean
  dragOver: boolean
  fileInputId: string
  fileInputRef: RefObject<HTMLInputElement | null>
  onIntentChange: (value: ImportIntent) => void
  onAutoProcessChange: (value: boolean) => void
  onDragOverChange: (value: boolean) => void
  onFiles: (files: FileList | null) => void
}) {
  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    onDragOverChange(false)
    onFiles(event.dataTransfer.files)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {INTENT_TABS.map((tab) => {
          const active = tab.id === intent
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onIntentChange(tab.id)}
              className={cn(
                'inline-flex h-9 items-center rounded-full border px-4 text-sm font-semibold transition-colors',
                active
                  ? 'border-[#2D2061] bg-[#2D2061] text-white'
                  : 'border-[#E0DDEA] bg-white text-[#8B8B9E] hover:text-[#2D2061]',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div>
        <h3 className="text-base font-bold text-[#2D2061]">
          Upload Candidate Resumes
        </h3>
        <p className="mt-1 text-sm text-[#8B8B9E]">
          Drag and drop your files here or click to browse. RecruitmentSMART
          supports bulk uploads for efficient candidate processing.
        </p>
      </div>

      <input
        id={fileInputId}
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="sr-only"
        onChange={(e) => {
          onFiles(e.target.files)
          e.currentTarget.value = ''
        }}
      />

      <label
        htmlFor={fileInputId}
        onDragOver={(e) => {
          e.preventDefault()
          onDragOverChange(true)
        }}
        onDragLeave={() => onDragOverChange(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragOver
            ? 'border-[#2D2061] bg-[#F7F6FB]'
            : 'border-[#D5D2E2] bg-[#FAFAFC]',
        )}
      >
        <CloudUpload
          className="size-10 text-[#2D2061]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <p className="mt-3 text-sm font-bold text-[#2D2061]">
          Drop files here or click to upload
        </p>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-[#8B8B9E]">
          You can upload single resumes or multiple resumes at once. We support
          bulk ZIP files for large imports.
        </p>
        <p className="mt-3 text-xs text-[#6B6B80]">
          Supported: PDF, DOC, DOCX, HTML, TXT (up to 5 MB each)
        </p>
        <p className="text-xs text-[#6B6B80]">
          Bulk upload: ZIP file with up to 100 resumes (max 100 MB)
        </p>
      </label>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="!h-10 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          <Upload className="size-4" strokeWidth={2} aria-hidden="true" />
          Upload Files
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast.success('Sample CSV download started.', {
              title: 'Download Sample CSV',
            })
          }
          className="!h-10 !rounded-md border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
        >
          <Download className="size-4" strokeWidth={2} aria-hidden="true" />
          Download Sample CSV
        </Button>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#F0EEF5] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Switch
          checked={autoProcess}
          onCheckedChange={onAutoProcessChange}
          label="Auto Process Resumes"
        />
        <p className="text-xs text-[#8B8B9E] sm:text-right">
          Automatically extract candidate details and skills.
        </p>
      </div>
    </div>
  )
}

function UploadingStep({
  progress,
  onCancel,
}: {
  progress: number
  onCancel: () => void
}) {
  const uploadedMb = Math.round((200 + progress * 2.5) * 10) / 10
  const totalMb = 450
  const shown = Math.min(uploadedMb, totalMb)

  return (
    <div className="rounded-xl bg-[#EEF2FA] px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#2D2061]">
            File uploading in progress
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#6B6B80]">
            {shown} MB of {totalMb} MB •
            <Loader2
              className="size-3.5 animate-spin text-[#2D2061]"
              aria-hidden="true"
            />
            Uploading...
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel upload"
          className="inline-flex size-7 items-center justify-center rounded-full border border-[#D5D2E2] bg-white text-[#6B6B80] hover:text-[#2D2061]"
        >
          <X className="size-3.5" strokeWidth={2.5} />
        </button>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#D9DEEA]">
        <div
          className="h-full rounded-full bg-[#2D2061] transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function ReviewStep({
  uploadedLabel,
  isBulk,
  statusTab,
  counts,
  items,
  selected,
  onSelectTab,
  onSelectItem,
  onChangeDetails,
  onClearAll,
  onUploadMore,
  onSaveSuccess,
  onMerge,
  onNew,
  onSkip,
}: {
  uploadedLabel: string
  isBulk: boolean
  statusTab: ImportResultStatus
  counts: Record<ImportResultStatus, number>
  items: ImportFileItem[]
  selected: ImportFileItem | null
  onSelectTab: (tab: ImportResultStatus) => void
  onSelectItem: (id: string) => void
  onChangeDetails: (patch: Partial<ImportParsedDetails>) => void
  onClearAll: () => void
  onUploadMore: () => void
  onSaveSuccess: () => void
  onMerge: () => void
  onNew: () => void
  onSkip: () => void
}) {
  const showForm = statusTab !== 'failed'
  const emailError = Boolean(selected && !selected.details.email.trim())

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#F0EEF5] px-5 py-3 sm:px-6">
        <p className="text-sm text-[#2D2061]">
          Uploaded File :{' '}
          <span className="font-bold">{uploadedLabel}</span>
        </p>
        <div className="flex items-center gap-3">
          {!isBulk ? (
            <Button
              type="button"
              variant="outline"
              onClick={onUploadMore}
              className="!h-8 !rounded-md border-[#2D2061] px-3 text-xs font-semibold text-[#2D2061]"
            >
              <Plus className="size-3.5" strokeWidth={2.5} />
              Upload More
            </Button>
          ) : null}
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-semibold text-[#1A6FD0] hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {isBulk ? (
        <div className="flex shrink-0 justify-center gap-3 px-5 py-4 sm:px-6">
          <StatusTabButton
            label="Needs Review"
            count={counts.needsReview}
            tone="review"
            active={statusTab === 'needsReview'}
            onClick={() => onSelectTab('needsReview')}
          />
          <StatusTabButton
            label="Success"
            count={counts.success}
            tone="success"
            active={statusTab === 'success'}
            onClick={() => onSelectTab('success')}
          />
          <StatusTabButton
            label="Failed"
            count={counts.failed}
            tone="failed"
            active={statusTab === 'failed'}
            onClick={() => onSelectTab('failed')}
          />
        </div>
      ) : null}

      <div
        className={cn(
          'grid min-h-0 flex-1 overflow-hidden border-t border-[#F0EEF5]',
          isBulk
            ? showForm
              ? 'grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_18rem]'
              : 'grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)]'
            : 'grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem]',
        )}
      >
        {isBulk ? (
          <FileListColumn
            items={items}
            selectedId={selected?.id ?? null}
            statusTab={statusTab}
            onSelect={onSelectItem}
          />
        ) : null}

        <PreviewColumn
          available={Boolean(selected?.previewAvailable)}
          fileName={selected?.fileName ?? ''}
        />

        {showForm && selected ? (
          <DetailsForm
            details={selected.details}
            emailError={emailError}
            statusTab={isBulk ? statusTab : 'success'}
            onChange={onChangeDetails}
            onSave={onSaveSuccess}
            onMerge={onMerge}
            onNew={onNew}
            onSkip={onSkip}
          />
        ) : null}
      </div>
    </div>
  )
}

function StatusTabButton({
  label,
  count,
  tone,
  active,
  onClick,
}: {
  label: string
  count: number
  tone: 'review' | 'success' | 'failed'
  active: boolean
  onClick: () => void
}) {
  const palette = {
    review: {
      active: 'bg-[#F5A524] text-white border-[#F5A524]',
      idle: 'border-[#F5A524] bg-white text-[#F5A524]',
      caret: 'border-t-[#F5A524]',
    },
    success: {
      active: 'bg-[#22A45A] text-white border-[#22A45A]',
      idle: 'border-[#22A45A] bg-white text-[#22A45A]',
      caret: 'border-t-[#22A45A]',
    },
    failed: {
      active: 'bg-[#E53935] text-white border-[#E53935]',
      idle: 'border-[#E53935] bg-white text-[#E53935]',
      caret: 'border-t-[#E53935]',
    },
  }[tone]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative min-w-[9rem] rounded-lg border px-4 py-2.5 text-sm font-semibold',
        active ? palette.active : palette.idle,
      )}
    >
      {label} ({count})
      {active ? (
        <span
          className={cn(
            'absolute left-1/2 top-full size-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent',
            palette.caret,
          )}
          aria-hidden="true"
        />
      ) : null}
    </button>
  )
}

function FileListColumn({
  items,
  selectedId,
  statusTab,
  onSelect,
}: {
  items: ImportFileItem[]
  selectedId: string | null
  statusTab: ImportResultStatus
  onSelect: (id: string) => void
}) {
  return (
    <div className="min-h-0 overflow-y-auto border-b border-[#F0EEF5] lg:border-b-0 lg:border-r">
      {items.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-[#8B8B9E]">
          No files in this status.
        </p>
      ) : (
        items.map((item) => {
          const active = item.id === selectedId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                'relative flex w-full items-start gap-2.5 px-3 py-3 text-left',
                active ? 'bg-[#F4F4F7]' : 'hover:bg-[#FAFAFC]',
              )}
            >
              <StatusIcon status={statusTab} />
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold text-[#2D2061]">
                  {item.fileName}
                </span>
                <span
                  className={cn(
                    'mt-0.5 block text-[11px] leading-snug',
                    statusTab === 'success' ? 'text-[#22A45A]' : 'text-[#E53935]',
                  )}
                >
                  {item.message}
                </span>
              </span>
              {active ? (
                <span
                  className="absolute right-0 top-1/2 hidden size-0 -translate-y-1/2 translate-x-full border-y-8 border-l-8 border-y-transparent border-l-[#F4F4F7] lg:block"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          )
        })
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: ImportResultStatus }) {
  switch (status) {
    case 'success':
      return (
        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#22A45A] text-white">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )
    case 'needsReview':
    case 'failed':
      return (
        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E53935] text-white">
          <CircleAlert className="size-3" strokeWidth={2.5} />
        </span>
      )
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

function PreviewColumn({
  available,
  fileName,
}: {
  available: boolean
  fileName: string
}) {
  return (
    <div className="flex min-h-[22rem] min-w-0 flex-col border-b border-[#F0EEF5] bg-[#F7F7FA] lg:border-b-0 lg:border-r">
      {available ? (
        <>
          <div className="flex shrink-0 items-center gap-2 border-b border-[#E8E6F0] bg-[#EFEFF3] px-2 py-1.5 text-[#5C5878]">
            <Search className="size-3.5" />
            <span className="text-[11px] tabular-nums">1 of 2</span>
            <Minus className="size-3.5" />
            <Plus className="size-3.5" />
            <span className="ml-auto inline-flex items-center gap-2">
              <Maximize2 className="size-3.5" />
              <Download className="size-3.5" />
              <Printer className="size-3.5" />
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <ResumePreview nameFromFile={fileName} />
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-[#8B8B9E]">
          <Folder className="size-14" strokeWidth={1.25} />
          <p className="text-sm font-medium">No Preview Available</p>
        </div>
      )}
    </div>
  )
}

function ResumePreview({ nameFromFile }: { nameFromFile: string }) {
  const display = nameFromFile.split(/[-_.]/)[0] || 'John Huber'
  return (
    <article className="mx-auto max-w-[28rem] bg-white p-6 shadow-[0_1px_8px_rgba(45,32,97,0.08)]">
      <h3 className="text-lg font-bold text-[#1A1A2E]">John Huber</h3>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5B4B9E]">
        UX Designer
      </p>
      <p className="mt-2 text-[11px] text-[#6B6B80]">
        New York, NY · 8905550401 · Parsed from {display}
      </p>
      <p className="mt-4 text-[11px] font-bold uppercase text-[#8B8B9E]">
        Summary
      </p>
      <p className="mt-1 text-xs leading-relaxed text-[#3D3A52]">
        Product-minded UX designer with experience across research, interaction
        design, and design systems. Currently at Real Vision Group, New York.
      </p>
      <p className="mt-4 text-[11px] font-bold uppercase text-[#8B8B9E]">
        Experience
      </p>
      <p className="mt-1 text-xs font-semibold text-[#2D2061]">
        Real Vision Group — UX Designer
      </p>
      <p className="text-[11px] text-[#8B8B9E]">New York · 2022 — Present</p>
    </article>
  )
}

function DetailsForm({
  details,
  emailError,
  statusTab,
  onChange,
  onSave,
  onMerge,
  onNew,
  onSkip,
}: {
  details: ImportParsedDetails
  emailError: boolean
  statusTab: ImportResultStatus
  onChange: (patch: Partial<ImportParsedDetails>) => void
  onSave: () => void
  onMerge: () => void
  onNew: () => void
  onSkip: () => void
}) {
  const [personalOpen, setPersonalOpen] = useState(true)
  const [employmentOpen, setEmploymentOpen] = useState(false)

  return (
    <div className="flex min-h-0 flex-col overflow-y-auto p-4">
      <AccordionHeader
        title="Personal Details"
        open={personalOpen}
        onToggle={() => setPersonalOpen((v) => !v)}
      />
      {personalOpen ? (
        <div className="flex flex-col gap-3 py-3">
          <Input
            label="Full Name"
            requiredMark
            value={details.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className="!rounded-md"
          />
          <Input
            label="Email"
            requiredMark
            placeholder="Email"
            value={details.email}
            error={emailError ? 'Email is required' : undefined}
            onChange={(e) => onChange({ email: e.target.value })}
            className="!rounded-md"
          />
          <Input
            label="Mobile"
            value={details.mobile}
            onChange={(e) => onChange({ mobile: e.target.value })}
            className="!rounded-md"
          />
          <Input
            label="City"
            value={details.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="!rounded-md"
          />
          <Input
            label="State"
            value={details.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className="!rounded-md"
          />
          <Input
            label="Country"
            value={details.country}
            onChange={(e) => onChange({ country: e.target.value })}
            className="!rounded-md"
          />
        </div>
      ) : null}

      <AccordionHeader
        title="Employment Details"
        open={employmentOpen}
        onToggle={() => setEmploymentOpen((v) => !v)}
      />
      {employmentOpen ? (
        <p className="py-3 text-xs text-[#8B8B9E]">
          No employment records extracted.
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap justify-end gap-2 pt-4">
        {statusTab === 'needsReview' ? (
          <>
            <Button
              type="button"
              onClick={onMerge}
              className="!h-9 !rounded-md !bg-[#7C5CDB] px-4 text-sm font-semibold text-white hover:!bg-[#6B4EC8]"
            >
              Merge
            </Button>
            <Button
              type="button"
              onClick={onNew}
              className="!h-9 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              New
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              className="!h-9 !rounded-md border-[#d5d2e2] px-4 text-sm font-semibold text-[#2D2061]"
            >
              Skip
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              className="!h-9 !rounded-md border-[#2D2061] px-4 text-sm font-semibold text-[#2D2061]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSave}
              className="!h-9 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function AccordionHeader({
  title,
  open,
  onToggle,
}: {
  title: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-md bg-[#F2F1F6] px-3 py-2 text-left text-sm font-bold text-[#2D2061]"
    >
      {title}
      {open ? (
        <ChevronUp className="size-4" strokeWidth={2} />
      ) : (
        <ChevronDown className="size-4" strokeWidth={2} />
      )}
    </button>
  )
}
