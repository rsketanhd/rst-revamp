import { useId, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  MY_DOCUMENT_ACCEPT,
  MY_DOCUMENT_MAX_BYTES,
} from '../../data/myDocuments'

export type MyDocumentsDropzoneProps = {
  onFiles: (files: File[]) => void
  className?: string
}

/**
 * My Documents — drag-and-drop upload well.
 */
export function MyDocumentsDropzone({
  onFiles,
  className,
}: MyDocumentsDropzoneProps) {
  const inputId = useId()
  const [dragging, setDragging] = useState(false)

  function pickFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    onFiles(Array.from(fileList))
  }

  return (
    <div className={cn('relative', className)}>
      <input
        id={inputId}
        type="file"
        accept={MY_DOCUMENT_ACCEPT}
        multiple
        className="sr-only"
        onChange={(event) => {
          pickFiles(event.target.files)
          event.currentTarget.value = ''
        }}
      />
      <label
        htmlFor={inputId}
        onDragEnter={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setDragging(false)
          pickFiles(event.dataTransfer.files)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl px-5 py-10 text-center transition-colors sm:py-12',
          dragging ? 'bg-[#EEEAF8]' : 'bg-[#F5F6F9] hover:bg-[#F0F1F6]',
        )}
      >
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-[#EEEAF8] text-[#6B5CE7]">
          <Upload className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-[#2D2061]">
          Drag & drop files here
        </p>
        <p className="mt-1 text-xs text-[#8B8B9E]">
          or{' '}
          <span className="font-semibold text-[#2D2061] underline underline-offset-2">
            click to browse
          </span>{' '}
          from your device
        </p>
        <p className="mt-2 text-[11px] text-[#A0A0B2]">
          PDF, JPG, PNG • Max {MY_DOCUMENT_MAX_BYTES / (1024 * 1024)} MB per file
        </p>
      </label>
    </div>
  )
}
