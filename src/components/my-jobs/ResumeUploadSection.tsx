import { forwardRef, useId, useImperativeHandle, useRef } from 'react'
import { FileText, Upload } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ResumeUploadSectionHandle = {
  openFilePicker: () => void
}

export type ResumeUploadSectionProps = {
  fileName: string | null
  onUpload: (file: File) => void
  onRemove: () => void
  className?: string
}

/**
 * My Jobs — resume upload banner (empty and uploaded states).
 */
export const ResumeUploadSection = forwardRef<
  ResumeUploadSectionHandle,
  ResumeUploadSectionProps
>(function ResumeUploadSection(
  { fileName, onUpload, onRemove, className },
  ref,
) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    openFilePicker: () => inputRef.current?.click(),
  }))

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onUpload(file)
  }

  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-dashed border-[#D5D2E2] bg-[#F5F6FF] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5',
        className,
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(45,32,97,0.08)]">
          {fileName ? (
            <FileText
              className="size-5 text-[#C9A84C]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          ) : (
            <Upload
              className="size-5 text-[#C9A84C]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          )}
        </span>

        <div className="min-w-0">
          {fileName ? (
            <>
              <h2 className="text-base font-bold text-[#2D2061]">Uploaded Resume</h2>
              <p className="mt-0.5 truncate text-sm text-[#8B8B9E]">{fileName}</p>
            </>
          ) : (
            <>
              <h2 className="text-base font-bold text-[#2D2061]">
                No resume uploaded
              </h2>
              <p className="mt-0.5 text-sm leading-snug text-[#8B8B9E]">
                Your job matches are running without your profile — results stay
                generic until you upload.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-stretch sm:items-end">
        {fileName ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2D2061] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#241a52] sm:min-w-[8.75rem]"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2D2061] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#241a52] sm:min-w-[8.75rem]"
          >
            Upload Resume
          </button>
        )}
        {!fileName ? (
          <p className="mt-1.5 text-center text-xs text-[#A0A0B2] sm:text-right">
            PDF · DOCX up to 5 MB
          </p>
        ) : null}
      </div>
    </section>
  )
})
