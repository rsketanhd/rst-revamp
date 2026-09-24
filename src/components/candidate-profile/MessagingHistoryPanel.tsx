import { useState } from 'react'
import {
  PROFILE_CONVERSATIONS,
  type ConversationStatus,
  type ProfileConversation,
} from '../../data/candidateProfileTabs'
import { cn } from '../../lib/cn'

const STATUS_CLASS: Record<ConversationStatus, string> = {
  OPEN: 'bg-[#E7F8EE] text-[#178A45]',
  CLOSED: 'bg-[#F1F1F4] text-[#8B8B9E]',
}

export function MessagingHistoryPanel() {
  const [conversations, setConversations] = useState<ProfileConversation[]>(PROFILE_CONVERSATIONS)
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState('')

  function addConversation() {
    const title = draft.trim()
    if (!title) return
    setConversations((current) => [
      { id: `msg-${Date.now()}`, title, status: 'OPEN' },
      ...current,
    ])
    setDraft('')
    setComposing(false)
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setComposing((open) => !open)}
          className="inline-flex h-9 items-center rounded-md bg-[#2D2061] px-3 text-[13px] font-semibold text-white hover:bg-[#241a4e]"
        >
          New Conversations
        </button>
      </div>
      {composing ? (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            addConversation()
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Conversation title"
            aria-label="Conversation title"
            className="h-9 min-w-0 flex-1 rounded-md border border-[#E4E1EC] px-3 text-[13px] outline-none focus:border-[#2D2061]"
          />
          <button
            type="submit"
            className="h-9 rounded-md bg-[#2D2061] px-3 text-[12px] font-semibold text-white"
          >
            Create
          </button>
        </form>
      ) : null}
      <ul className="mt-3 divide-y divide-[#EEEAF5] rounded-xl border border-[#E8E6F0] bg-white">
        {conversations.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
            <p className="text-[14px] font-medium text-[#1A1A2E]">{item.title}</p>
            <span
              className={cn(
                'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
                STATUS_CLASS[item.status],
              )}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
