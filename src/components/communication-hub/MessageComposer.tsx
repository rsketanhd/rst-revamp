import { Bold, Lock, Paperclip, Send } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { Button, toast } from '../ui'

export type ComposerMode = 'reply' | 'internal'

export type MessageComposerProps = {
  candidateFirstName: string
  activeTopic: string
  disabled?: boolean
  onSend: (mode: ComposerMode, body: string) => void
}

export function MessageComposer({
  candidateFirstName,
  activeTopic,
  disabled = false,
  onSend,
}: MessageComposerProps) {
  const [mode, setMode] = useState<ComposerMode>('reply')
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isInternal = mode === 'internal'

  function submit() {
    const body = draft.trim()
    if (!body || disabled) return
    onSend(mode, body)
    setDraft('')
  }

  function wrapBold() {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = draft.slice(start, end) || 'bold text'
    const next = `${draft.slice(0, start)}**${selected}**${draft.slice(end)}`
    setDraft(next)
    requestAnimationFrame(() => {
      el.focus()
      const caret = start + selected.length + 4
      el.setSelectionRange(caret, caret)
    })
  }

  return (
    <div className="shrink-0 border-t border-[#EEEAF5] bg-white px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label="Compose mode"
          className="inline-flex max-w-full rounded-full border border-[#E0DFE8] bg-[#F8F7FC] p-0.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isInternal}
            onClick={() => setMode('reply')}
            className={cn(
              'inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-semibold transition-colors sm:px-3',
              !isInternal
                ? 'bg-white text-[#2D2061] shadow-sm'
                : 'text-[#8B8FA3] hover:text-[#2D2061]',
            )}
          >
            <span className="sm:hidden">Reply</span>
            <span className="hidden sm:inline">Reply to {candidateFirstName}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isInternal}
            onClick={() => setMode('internal')}
            className={cn(
              'inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition-colors sm:px-3',
              isInternal
                ? 'bg-white text-[#8A6A12] shadow-sm'
                : 'text-[#8B8FA3] hover:text-[#2D2061]',
            )}
          >
            <Lock className="size-3" strokeWidth={2} aria-hidden="true" />
            <span className="sm:hidden">Note</span>
            <span className="hidden sm:inline">Internal note</span>
          </button>
        </div>
        <p className="hidden max-w-[14rem] truncate text-[11px] text-[#8B8B9E] sm:block">
          Posting in &ldquo;{activeTopic}&rdquo;
        </p>
      </div>

      <div
        className={cn(
          'rounded-xl border bg-white focus-within:ring-2',
          isInternal
            ? 'border-[#F5E6B8] focus-within:border-[#E8C547] focus-within:ring-[#E8C547]/20'
            : 'border-[#E0DDEA] focus-within:border-[#2D2061] focus-within:ring-[#2D2061]/10',
        )}
      >
        <textarea
          ref={textareaRef}
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              submit()
            }
          }}
          rows={2}
          placeholder={
            isInternal
              ? 'Add an internal note…'
              : `Message ${candidateFirstName}…`
          }
          aria-label={
            isInternal ? 'Internal note' : `Message ${candidateFirstName}`
          }
          className="block w-full resize-none rounded-t-xl bg-transparent px-3.5 py-3 text-sm text-[#1A1A2E] outline-none placeholder:text-[#A0A0B2] disabled:opacity-60"
        />
        <div className="flex items-center justify-between gap-2 border-t border-[#EEEAF5] px-2 py-1.5">
          <div className="flex items-center gap-0.5">
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  toast.success('Attachment ready', {
                    description: `${file.name} will send with your next message.`,
                  })
                }
                event.target.value = ''
              }}
            />
            <button
              type="button"
              disabled={disabled}
              aria-label="Attach file"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex size-8 items-center justify-center rounded-md text-[#5C5870] hover:bg-[#F4F2F8] hover:text-[#2D2061] disabled:opacity-50"
            >
              <Paperclip className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={disabled}
              aria-label="Bold"
              onClick={wrapBold}
              className="inline-flex size-8 items-center justify-center rounded-md text-[#5C5870] hover:bg-[#F4F2F8] hover:text-[#2D2061] disabled:opacity-50"
            >
              <Bold className="size-4" strokeWidth={2.25} aria-hidden="true" />
            </button>
          </div>
          <Button
            type="button"
            size="sm"
            disabled={disabled || !draft.trim()}
            onClick={submit}
            className="!h-8 !rounded-md bg-[#2D2061] px-3 text-[12px] font-semibold text-white hover:bg-[#241a4e]"
          >
            <Send className="size-3.5" strokeWidth={2} aria-hidden="true" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
