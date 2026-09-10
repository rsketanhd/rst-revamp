import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Smile,
  Sparkles,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { toast } from '../ui'

const INSERT_TOKENS = [
  { id: 'firstName', label: 'First Name', token: '{{First Name}}' },
  { id: 'lastName', label: 'Last Name', token: '{{Last Name}}' },
  { id: 'companyName', label: 'Company Name', token: '{{Company Name}}' },
  { id: 'jobTitle', label: 'Job Title', token: '{{Job Title}}' },
  { id: 'recruiterName', label: 'Recruiter Name', token: '{{Recruiter Name}}' },
]

const EMOJIS = ['😊', '👋', '✅', '🎉', '💼', '📧', '⭐', '👍']
const DEFAULT_MAX_LENGTH = 200

export type MessageBodyEditorProps = {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  maxLength?: number
  error?: string
  className?: string
}

export function MessageBodyEditor({
  id = 'message-body',
  label = 'Email Body',
  value,
  onChange,
  maxLength = DEFAULT_MAX_LENGTH,
  error,
  className,
}: MessageBodyEditorProps) {
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const tokenMenuRef = useRef<HTMLDivElement>(null)
  const emojiMenuRef = useRef<HTMLDivElement>(null)
  const [tokenMenuOpen, setTokenMenuOpen] = useState(false)
  const [emojiMenuOpen, setEmojiMenuOpen] = useState(false)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (!tokenMenuRef.current?.contains(target)) setTokenMenuOpen(false)
      if (!emojiMenuRef.current?.contains(target)) setEmojiMenuOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function setBody(next: string) {
    onChange(truncate(next, maxLength))
  }

  function insertAtCursor(text: string) {
    const el = bodyRef.current
    if (!el) {
      setBody(`${value}${text}`)
      return
    }
    const start = el.selectionStart ?? value.length
    const end = el.selectionEnd ?? value.length
    const next = truncate(`${value.slice(0, start)}${text}${value.slice(end)}`, maxLength)
    setBody(next)
    window.requestAnimationFrame(() => {
      el.focus()
      const pos = Math.min(start + text.length, next.length)
      el.setSelectionRange(pos, pos)
    })
  }

  function wrapSelection(before: string, after = before) {
    const el = bodyRef.current
    if (!el) return
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const selected = value.slice(start, end) || 'text'
    const injection = `${before}${selected}${after}`
    const next = truncate(
      `${value.slice(0, start)}${injection}${value.slice(end)}`,
      maxLength,
    )
    setBody(next)
    window.requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start, Math.min(start + injection.length, next.length))
    })
  }

  function handleGenerateWithAi() {
    const generated =
      'Hi {{First Name}}, thank you for your interest in {{Company Name}} 😊 We reviewed your profile and would love to share next steps.'
    setBody(generated)
    toast.success('Draft generated with AI.', { title: 'Generated' })
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-[#2D2061]">
          {label}
        </label>
        <button
          type="button"
          onClick={handleGenerateWithAi}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
        >
          <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Generate with AI
        </button>
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-md border bg-white focus-within:border-[#2D2061] focus-within:ring-2 focus-within:ring-[#2D2061]/10',
          error ? 'border-[#E53935]' : 'border-[#ddd9e8]',
        )}
      >
        <div className="flex flex-wrap items-center gap-0.5 border-b border-[#E8E6F0] bg-[#F7F6FA] px-2 py-1.5">
          <ToolbarButton label="Bold" onClick={() => wrapSelection('**', '**')}>
            <Bold className="size-3.5" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton label="Italic" onClick={() => wrapSelection('_', '_')}>
            <Italic className="size-3.5" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton label="Underline" onClick={() => wrapSelection('<u>', '</u>')}>
            <Underline className="size-3.5" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton label="Strikethrough" onClick={() => wrapSelection('~~', '~~')}>
            <Strikethrough className="size-3.5" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton label="Insert link" onClick={() => wrapSelection('[', '](https://)')}>
            <LinkIcon className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton label="Bullet list" onClick={() => insertAtCursor('\n• ')}>
            <List className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton label="Numbered list" onClick={() => insertAtCursor('\n1. ')}>
            <ListOrdered className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton label="Align left" onClick={() => undefined}>
            <AlignLeft className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton label="Align center" onClick={() => undefined}>
            <AlignCenter className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton label="Align right" onClick={() => undefined}>
            <AlignRight className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton label="Code" onClick={() => wrapSelection('`', '`')}>
            <Code2 className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton label="Emoji" onClick={() => setEmojiMenuOpen((open) => !open)}>
            <Smile className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
        </div>

        <textarea
          id={id}
          ref={bodyRef}
          value={value}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          onChange={(event) => setBody(event.target.value)}
          rows={7}
          className="block w-full resize-y border-0 bg-white px-3.5 py-3 text-sm leading-relaxed text-[#2D2061] outline-none placeholder:text-[#A0A0B2]"
          placeholder="Write your message…"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E8E6F0] bg-white px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <div ref={tokenMenuRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setTokenMenuOpen((open) => !open)
                  setEmojiMenuOpen(false)
                }}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-[#E0DDEA] bg-white px-2.5 text-xs font-semibold text-[#2D2061] transition-colors hover:bg-[#F7F6FA]"
              >
                + Insert Token
              </button>
              {tokenMenuOpen ? (
                <ul
                  role="menu"
                  className="absolute bottom-full left-0 z-20 mb-1 min-w-[11rem] overflow-hidden rounded-lg border border-[#E4E1EE] bg-white py-1 shadow-[0_8px_24px_rgba(26,26,46,0.12)]"
                >
                  {INSERT_TOKENS.map((token) => (
                    <li key={token.id} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full px-3 py-2 text-left text-xs font-medium text-[#2A2740] hover:bg-[#F7F6FA]"
                        onClick={() => {
                          insertAtCursor(token.token)
                          setTokenMenuOpen(false)
                        }}
                      >
                        {token.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div ref={emojiMenuRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setEmojiMenuOpen((open) => !open)
                  setTokenMenuOpen(false)
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E0DDEA] bg-white px-2.5 text-xs font-semibold text-[#2D2061] transition-colors hover:bg-[#F7F6FA]"
              >
                <Smile className="size-3.5" strokeWidth={2} aria-hidden="true" />
                Emoji
              </button>
              {emojiMenuOpen ? (
                <div className="absolute bottom-full left-0 z-20 mb-1 grid grid-cols-4 gap-1 rounded-lg border border-[#E4E1EE] bg-white p-2 shadow-[0_8px_24px_rgba(26,26,46,0.12)]">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="size-8 rounded-md text-base hover:bg-[#F7F6FA]"
                      onClick={() => {
                        insertAtCursor(emoji)
                        setEmojiMenuOpen(false)
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <p className="text-xs font-medium tabular-nums text-[#8B8B9E]">
            {value.length} / {maxLength}
          </p>
        </div>
      </div>
      {error ? (
        <p className="text-xs text-[#E53935]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function ToolbarButton({
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
      title={label}
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-7 items-center justify-center rounded text-[#4A4760] transition-colors hover:bg-white hover:text-[#2D2061]"
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <span className="mx-0.5 h-4 w-px shrink-0 bg-[#D5D2E2]" aria-hidden="true" />
}

function truncate(value: string, max: number) {
  return value.length > max ? value.slice(0, max) : value
}
