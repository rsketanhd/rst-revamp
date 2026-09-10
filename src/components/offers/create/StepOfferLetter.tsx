import { useId, useRef } from 'react'
import { FileText } from 'lucide-react'
import { OFFER_LETTER_TOKENS, type CreateOfferStepProps } from './types'

const ACCEPT = '.pdf,.docx,.png,application/pdf,image/png'

/**
 * Step 03 — Offer letter template, tokens, and attached files.
 */
export function StepOfferLetter({ value, onChange }: CreateOfferStepProps) {
  const letterId = useId()
  const letterRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function insertToken(token: string) {
    const el = letterRef.current
    const current = value.letterContent
    if (!el) {
      onChange({ letterContent: `${current}${token}` })
      return
    }
    const start = el.selectionStart ?? current.length
    const end = el.selectionEnd ?? current.length
    const next = `${current.slice(0, start)}${token}${current.slice(end)}`
    onChange({ letterContent: next })
    window.requestAnimationFrame(() => {
      el.focus()
      const pos = start + token.length
      el.setSelectionRange(pos, pos)
    })
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    const existing = new Set(value.attachments.map((file) => file.name))
    const added = [...fileList]
      .filter((file) => !existing.has(file.name))
      .map((file) => ({
        id: `doc-${file.name}-${Date.now()}`,
        name: file.name,
      }))
    if (added.length === 0) return
    onChange({ attachments: [...value.attachments, ...added] })
  }

  function removeAttachment(id: string) {
    onChange({
      attachments: value.attachments.filter((file) => file.id !== id),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-[#2D2061]">
        Offer Letter & Documents
      </h2>

      <div className="flex flex-col gap-2">
        <label htmlFor={letterId} className="text-xs font-medium text-[#2D2061]">
          Offer Letter Content (supports dynamic tokens)
          <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          ref={letterRef}
          id={letterId}
          required
          rows={12}
          value={value.letterContent}
          onChange={(event) => onChange({ letterContent: event.target.value })}
          className="min-h-[14rem] w-full resize-y rounded-md border border-[#ddd9e8] bg-white px-3 py-2.5 text-sm leading-relaxed text-[#2D2061] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#8B8B9E]">Tokens:</span>
          {OFFER_LETTER_TOKENS.map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => insertToken(token)}
              className="inline-flex h-7 items-center rounded-md border border-[#E4E1EE] bg-white px-2 text-[11px] font-medium text-[#2D2061] transition-colors hover:border-[#2D2061] hover:bg-[#F7F6FB]"
            >
              + {token}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#2D2061]">
            Attached Documents & Files
          </h3>
          <p className="mt-0.5 text-sm text-[#8B8B9E]">
            Attach policies, benefit summaries, or NDAs to this offer package.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files)
            event.target.value = ''
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex min-h-[3.25rem] w-full items-center justify-center rounded-lg border border-dashed border-[#9B8EC4] bg-white px-4 py-3 text-sm font-semibold text-[#2D2061] transition-colors hover:bg-[#F7F6FB]"
        >
          + Click to Browse and Attach Files (.pdf, .docx, .png)
        </button>

        <ul className="flex flex-col gap-2">
          {value.attachments.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-lg bg-[#EEF2F8] px-3 py-2.5"
            >
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[#EDE9F8] text-[#6B5CE7]">
                <FileText className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#2D2061]">
                {file.name}
              </p>
              <button
                type="button"
                onClick={() => removeAttachment(file.id)}
                className="shrink-0 text-sm font-medium text-[#8B8B9E] transition-colors hover:text-[#C62828]"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
