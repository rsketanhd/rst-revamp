import { useId, useRef } from 'react'
import { FileText } from 'lucide-react'

export type ProfileResumeBannerProps = {
  fileName: string | null
  onUpload: (file: File) => void
}

export function ProfileResumeBanner({ fileName, onUpload }: ProfileResumeBannerProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onUpload(file)
  }

  return (
    <section className="rounded-lg border border-dashed border-[#D5D2E2] bg-white px-4 py-4 sm:px-5">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".doc,.docx,.rtf,.pdf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_2px_8px_rgba(45,32,97,0.08)]">
            <FileText className="size-5 text-[#C9A84C]" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            {fileName ? (
              <>
                <p className="text-sm font-semibold text-[#2D2061]">Resume uploaded</p>
                <p className="mt-0.5 truncate text-sm text-[#8B8B9E]">{fileName}</p>
              </>
            ) : (
              <p className="text-sm text-[#5C5878]">
                Already have a resume?{' '}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="font-semibold text-[#E85D4C] underline underline-offset-2 transition-colors hover:text-[#D14A3A]"
                >
                  Upload Resume
                </button>
              </p>
            )}
            <p className="mt-1 text-xs text-[#A0A0B2]">
              Supported Formats: doc, docx, rtf, pdf, upto 2 MB
            </p>
          </div>
        </div>

        {fileName ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#241a52]"
          >
            Replace
          </button>
        ) : null}
      </div>
    </section>
  )
}
