import { useEffect, useRef, useState } from 'react'
import {
  Filter,
  Mic,
  MoreVertical,
  SendHorizontal,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import type { ChatMessage } from '../../data/discovery'

export type DiscoveryChatPanelProps = {
  title: string
  messages: ChatMessage[]
  onSend: (text: string) => void
  onOpenFilters: () => void
}

const MAX_CHARS = 200

/**
 * Left chat / refinement panel for Candidate Discovery results.
 */
export function DiscoveryChatPanel({
  title,
  messages,
  onSend,
  onOpenFilters,
}: DiscoveryChatPanelProps) {
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-[#ECEAF3] bg-white lg:max-w-[22rem] lg:shrink-0 xl:max-w-[24rem]">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-[#ECEAF3] px-4 py-3">
        <p className="min-w-0 truncate text-sm font-semibold text-[#2D2061]">
          {title}
        </p>
        <button
          type="button"
          aria-label="Chat options"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#6B6B80] hover:bg-[#F7F6FA]"
        >
          <MoreVertical className="size-4" strokeWidth={2} />
        </button>
      </header>

      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
              message.role === 'user'
                ? 'bg-[#F0EEF5] text-[#2A2740]'
                : 'border border-[#EDEAF5] bg-white text-[#4A4760]',
            )}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-[#ECEAF3] p-3">
        <div className="rounded-xl border border-[#E4E1EE] bg-white">
          <textarea
            value={draft}
            maxLength={MAX_CHARS}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            rows={3}
            placeholder="Type or speak"
            className="w-full resize-none border-0 bg-transparent px-3 pt-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2]"
          />
          <div className="flex items-center justify-between px-2.5 pb-2.5">
            <div className="flex items-center gap-2 text-[#8B8B9E]">
              <button
                type="button"
                aria-label="Voice input"
                className="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#F7F6FA] hover:text-[#2D2061]"
              >
                <Mic className="size-4" strokeWidth={1.75} />
              </button>
              <span className="text-[11px] tabular-nums">
                {draft.length}/{MAX_CHARS}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim()}
              aria-label="Send message"
              className="inline-flex size-8 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F7F6FA] disabled:opacity-40"
            >
              <SendHorizontal className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenFilters}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-[#2D2061] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#241a52]"
        >
          <Filter className="size-4" strokeWidth={2} aria-hidden="true" />
          Filters
        </button>
      </div>
    </aside>
  )
}
