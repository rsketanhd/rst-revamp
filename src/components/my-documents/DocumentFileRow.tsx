import type { ReactNode } from 'react'
import { Download, Eye, FileText } from 'lucide-react'
import {
  documentFileMetaLine,
  type DocumentFileStatus,
  type MyDocumentFile,
} from '../../data/myDocuments'
import { cn } from '../../lib/cn'
import { Button } from '../ui'

export type DocumentFileRowProps = {
  file: MyDocumentFile
  onView: (file: MyDocumentFile) => void
  onDownload: (file: MyDocumentFile) => void
  onSign: (file: MyDocumentFile) => void
  className?: string
}

/**
 * Single document row inside a My Documents category.
 */
export function DocumentFileRow({
  file,
  onView,
  onDownload,
  onSign,
  className,
}: DocumentFileRowProps) {
  const tone = fileRowTone(file.status)

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-[#E8E6F0] bg-white px-3 py-2.5 sm:px-4',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
          tone.iconWrap,
        )}
      >
        <FileText className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#2D2061]">
          {file.name}
        </p>
        <p className={cn('mt-0.5 truncate text-xs', tone.meta)}>
          {documentFileMetaLine(file)}
        </p>
      </div>

      <FileRowActions
        file={file}
        onView={onView}
        onDownload={onDownload}
        onSign={onSign}
      />
    </div>
  )
}

function fileRowTone(status: DocumentFileStatus): {
  iconWrap: string
  meta: string
} {
  switch (status) {
    case 'available':
      return {
        iconWrap: 'bg-[#EEF0F6] text-[#6B6B80]',
        meta: 'text-[#8B8B9E]',
      }
    case 'needs-signature':
      return {
        iconWrap: 'bg-[#FDECEC] text-[#E53935]',
        meta: 'text-[#E53935]',
      }
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

function FileRowActions({
  file,
  onView,
  onDownload,
  onSign,
}: DocumentFileRowProps) {
  switch (file.status) {
    case 'available':
      return (
        <div className="flex shrink-0 items-center gap-1">
          <IconActionButton
            label={`View ${file.name}`}
            onClick={() => onView(file)}
          >
            <Eye className="size-4" strokeWidth={1.75} />
          </IconActionButton>
          <IconActionButton
            label={`Download ${file.name}`}
            onClick={() => onDownload(file)}
          >
            <Download className="size-4" strokeWidth={1.75} />
          </IconActionButton>
        </div>
      )
    case 'needs-signature':
      return (
        <Button
          type="button"
          size="sm"
          onClick={() => onSign(file)}
          className="!h-8 shrink-0 !rounded-md !bg-[#E53935] px-3.5 text-xs font-semibold text-white hover:!bg-[#c62828]"
        >
          Sign Now
        </Button>
      )
    default: {
      const _exhaustive: never = file.status
      return _exhaustive
    }
  }
}

function IconActionButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-8 items-center justify-center rounded-full text-[#8B8B9E] transition-colors hover:bg-white hover:text-[#2D2061]"
    >
      {children}
    </button>
  )
}
