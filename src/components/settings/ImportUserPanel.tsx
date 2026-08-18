import { useEffect, useId, useRef, useState } from 'react'
import { Check, FileSpreadsheet, Upload } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button, SidePanel, toast } from '../ui'

export type ImportUserPanelProps = {
  open: boolean
  onClose: () => void
}

type PanelPhase = 'upload' | 'success'

const ACCEPTED_TYPES = ['.csv', 'text/csv', 'application/vnd.ms-excel']

/**
 * Import User side panel — CSV pick/drop zone, then success confirmation.
 */
export function ImportUserPanel({ open, onClose }: ImportUserPanelProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<PanelPhase>('upload')
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!open) return
    setPhase('upload')
    setFileName('')
    setError('')
    setDragging(false)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }, [open])

  function isCsvFile(file: File) {
    const lower = file.name.toLowerCase()
    return (
      lower.endsWith('.csv') ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel'
    )
  }

  function pickFile(file: File | undefined | null) {
    if (!file) return
    if (!isCsvFile(file)) {
      setError('Please upload a valid .csv file.')
      setFileName('')
      return
    }
    setError('')
    setFileName(file.name)
  }

  function handleUpload() {
    if (!fileName) {
      setError('Choose a CSV file to import.')
      return
    }
    setUploading(true)
    // UI-only: simulate short processing delay
    window.setTimeout(() => {
      setUploading(false)
      setPhase('success')
      toast.success('Users imported successfully from CSV.', {
        title: 'Import complete',
        description: fileName,
      })
    }, 900)
  }

  function handleDone() {
    onClose()
  }

  function handleImportAnother() {
    setPhase('upload')
    setFileName('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Import User"
      widthClassName="w-full max-w-[28rem]"
      footerClassName={
        phase === 'success' ? 'hidden' : 'justify-stretch border-t-0 pt-2'
      }
      footer={
        phase === 'upload' ? (
          <Button
            type="button"
            fullWidth
            disabled={uploading}
            onClick={handleUpload}
            className="!h-11 !rounded-md bg-[#2D2061] text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            {uploading ? 'Uploading…' : 'Upload CSV'}
          </Button>
        ) : null
      }
    >
      {phase === 'success' ? (
        <div
          className="flex flex-col items-center justify-center px-2 py-10 text-center"
          role="status"
        >
          <div className="mb-5 inline-flex size-14 items-center justify-center rounded-full bg-[#22A45A] text-white shadow-[0_8px_24px_rgba(34,164,90,0.28)]">
            <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-[#1a1a2e]">
            Users Imported Successfully
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#8B8B9E]">
            {fileName
              ? `“${fileName}” was uploaded and users are ready in the list.`
              : 'Your CSV file was uploaded and users are ready in the list.'}
          </p>
          <div className="mt-8 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              type="button"
              onClick={handleDone}
              className="!h-10 min-w-[8.5rem] !rounded-md bg-[#2D2061] text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Done
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleImportAnother}
              className="!h-10 min-w-[8.5rem] !rounded-md border-[#2D2061]/40 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              Import Another
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-[#2D2061]">Upload CSV</p>
            <p className="mt-1 text-xs leading-relaxed text-[#8B8B9E]">
              Import multiple users at once. Download the template, fill in user
              details, then upload the completed file.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              toast.success('CSV template download started.', {
                title: 'Template',
              })
            }
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
          >
            <FileSpreadsheet
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
            Download CSV Template
          </button>

          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                inputRef.current?.click()
              }
            }}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragging(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragging(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragging(false)
              pickFile(e.dataTransfer.files?.[0])
            }}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-5 py-10 text-center transition-colors',
              dragging
                ? 'border-[#2D2061] bg-[#F4F2FA]'
                : 'border-[#C8C5D6] bg-[#FAFAFC] hover:border-[#2D2061]/50 hover:bg-[#F7F6FA]',
              error && 'border-[#E53935]/60',
            )}
          >
            <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-white text-[#2D2061] shadow-[0_1px_4px_rgba(45,32,97,0.08)]">
              <Upload className="size-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold text-[#2D2061]">
              Drag & drop your CSV here
            </p>
            <p className="mt-1 text-xs text-[#8B8B9E]">
              or click to browse from your device
            </p>
            <span className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-[#2D2061] bg-white px-3.5 text-xs font-semibold text-[#2D2061]">
              Choose File
            </span>
            {fileName ? (
              <p className="mt-3 max-w-full truncate text-xs font-medium text-[#2F9E44]">
                {fileName}
              </p>
            ) : (
              <p className="mt-3 text-xs text-[#A0A0B2]">No file chosen</p>
            )}
          </div>

          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="sr-only"
            onChange={(e) => {
              pickFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />

          {error ? (
            <p className="text-xs font-medium text-[#E53935]" role="alert">
              {error}
            </p>
          ) : null}

          <ul className="list-disc space-y-1 pl-4 text-[11px] leading-relaxed text-[#8B8B9E]">
            <li>Only .csv files are supported</li>
            <li>Maximum file size 5 MB</li>
            <li>
              Required columns: First Name, Last Name, Email Address, Role
            </li>
          </ul>
        </div>
      )}
    </SidePanel>
  )
}
