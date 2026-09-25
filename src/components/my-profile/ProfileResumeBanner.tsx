import { useId, useRef } from 'react'
import { Download, FileText, Sparkles } from 'lucide-react'

export type ProfileResumeBannerProps = {
  fileName: string | null
  /** e.g. "16 Sep 2026" */
  uploadedOn: string | null
  /** False while the new resume's details haven't been applied to the profile */
  appliedToProfile: boolean
  onUpload: (file: File) => void
  onDownload: () => void
  onApplyToProfile: () => void
}

export function ProfileResumeBanner({
  fileName,
  uploadedOn,
  appliedToProfile,
  onUpload,
  onDownload,
  onApplyToProfile,
}: ProfileResumeBannerProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onUpload(file)
    event.target.value = ''
  }

  const fileInput = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept=".doc,.docx,.rtf,.pdf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      className="sr-only"
      onChange={handleFileChange}
    />
  )

  if (!fileName) {
    return (
      <section className="rounded-lg border border-dashed border-[#D5D2E2] bg-white px-4 py-4 sm:px-5">
        {fileInput}
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_2px_8px_rgba(45,32,97,0.08)]">
            <FileText className="size-5 text-[#C9A84C]" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="min-w-0">
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
            <p className="mt-1 text-xs text-[#A0A0B2]">
              Supported Formats: doc, docx, rtf, pdf, upto 2 MB
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      {fileInput}

      {/* Uploaded file */}
      <div className="flex flex-col gap-4 rounded-xl border border-dashed border-[#EAD9C8] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-4">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#2D2061] text-white">
            <FileText className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#2D2061]">
              {fileName}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#8B8B9E]">
              {uploadedOn ? <span>Updated on {uploadedOn}</span> : null}
              {!appliedToProfile ? (
                <>
                  {uploadedOn ? (
                    <span className="text-[#C8C5D6]" aria-hidden="true">
                      •
                    </span>
                  ) : null}
                  <span className="inline-flex rounded-full bg-[#FBF1C9] px-2.5 py-0.5 text-xs font-semibold text-[#6B5A10]">
                    New — not yet applied to profile
                  </span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#241a52]"
          >
            <Download className="size-4" strokeWidth={2} aria-hidden="true" />
            Download CV
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] transition-colors hover:bg-[#F7F6FA]"
          >
            Replace
          </button>
        </div>
      </div>

      {/* Nudge: resume saved, profile not updated yet */}
      {!appliedToProfile ? (
        <div className="flex flex-col gap-3 rounded-xl bg-[#FBF5DC] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="flex min-w-0 items-start gap-3 text-sm text-[#6B5A10]">
            <Sparkles
              className="mt-0.5 size-4 shrink-0 text-[#C9A84C]"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>
              Your new resume is saved as a document.{' '}
              <span className="font-bold">Your profile hasn&apos;t changed</span>{' '}
              — review what it would update before applying.
            </span>
          </p>
          <button
            type="button"
            onClick={onApplyToProfile}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#241a52]"
          >
            Update profile from this resume
          </button>
        </div>
      ) : null}
    </section>
  )
}
