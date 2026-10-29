import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import {
  countUnassigned,
  type HubConversation,
  type HubListFilter,
} from '../../data/communicationHub'
import { cn } from '../../lib/cn'
import { ConversationListItem } from './ConversationListItem'

export type ConversationListProps = {
  conversations: HubConversation[]
  allConversations: HubConversation[]
  selectedId: string | null
  query: string
  listFilter: HubListFilter
  unassignedOnly: boolean
  tagFilter: string | null
  tagOptions: string[]
  onQueryChange: (value: string) => void
  onListFilterChange: (value: HubListFilter) => void
  onUnassignedOnlyChange: (value: boolean) => void
  onTagFilterChange: (value: string | null) => void
  onSelect: (id: string) => void
  className?: string
}

const LIST_FILTERS: Array<{
  value: HubListFilter
  label: string
  shortLabel: string
}> = [
  { value: 'all', label: 'All', shortLabel: 'All' },
  { value: 'assigned', label: 'Assigned to me', shortLabel: 'Assigned' },
  { value: 'open', label: 'Open', shortLabel: 'Open' },
  { value: 'unread', label: 'Unread', shortLabel: 'Unread' },
]

export function ConversationList({
  conversations,
  allConversations,
  selectedId,
  query,
  listFilter,
  unassignedOnly,
  tagFilter,
  tagOptions,
  onQueryChange,
  onListFilterChange,
  onUnassignedOnlyChange,
  onTagFilterChange,
  onSelect,
  className,
}: ConversationListProps) {
  const unassignedCount = countUnassigned(allConversations)
  const tagsMenuId = useId()
  const [tagsOpen, setTagsOpen] = useState(false)
  const tagsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tagsOpen) return

    function onPointerDown(event: MouseEvent) {
      if (!tagsRef.current?.contains(event.target as Node)) {
        setTagsOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [tagsOpen])

  function selectTag(value: string | null) {
    onTagFilterChange(value)
    setTagsOpen(false)
  }

  const tagMenuOptions: Array<{ value: string | null; label: string }> = [
    { value: null, label: 'All Tags' },
    ...tagOptions.map((tag) => ({ value: tag, label: tag })),
  ]

  return (
    <aside
      className={cn(
        'flex min-h-0 min-w-0 flex-col overflow-hidden rounded-none border-0 bg-white lg:rounded-xl lg:border lg:border-[#E8E6F0]',
        className,
      )}
    >
      <div className="shrink-0 space-y-3 border-b border-[#EEEAF5] p-3 sm:p-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search candidates or topics…"
            aria-label="Search candidates or topics"
            className="h-10 w-full rounded-lg border border-[#E0DDEA] bg-white py-2 pl-10 pr-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </div>

        <div
          role="group"
          aria-label="Conversation filters"
          className="flex flex-wrap gap-1.5"
        >
          {LIST_FILTERS.map((option) => {
            const active = option.value === listFilter
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onListFilterChange(option.value)}
                className={cn(
                  'inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-semibold transition-colors',
                  active
                    ? 'bg-[#2D2061] text-white'
                    : 'bg-[#F4F2F8] text-[#6B6B80] hover:bg-[#EBE8F3] hover:text-[#2D2061]',
                )}
              >
                <span className="sm:hidden">{option.shortLabel}</span>
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={unassignedOnly}
            onClick={() => onUnassignedOnlyChange(!unassignedOnly)}
            className={cn(
              'inline-flex h-8 items-center rounded-full px-3 text-[12px] font-semibold transition-colors',
              unassignedOnly
                ? 'bg-[#FFF1E6] text-[#C2410C] ring-1 ring-[#FDBA74]'
                : 'bg-[#FFF7ED] text-[#C2410C] hover:bg-[#FFEDD5]',
            )}
          >
            Unassigned ({unassignedCount})
          </button>

          <div ref={tagsRef} className="relative">
            <button
              type="button"
              aria-expanded={tagsOpen}
              aria-controls={tagsMenuId}
              onClick={() => setTagsOpen((open) => !open)}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-[#E0DDEA] bg-white px-3 text-[12px] font-semibold text-[#5C5870] hover:border-[#2D2061]/30 hover:text-[#2D2061]"
            >
              {tagFilter ?? 'All Tags'}
              <ChevronDown className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </button>
            {tagsOpen ? (
              <ul
                id={tagsMenuId}
                role="listbox"
                aria-label="Filter by tag"
                className="absolute left-0 z-20 mt-1 min-w-[11rem] overflow-hidden rounded-lg border border-[#E8E6F0] bg-white py-1 shadow-[0_8px_24px_rgba(45,32,97,0.12)]"
              >
                {tagMenuOptions.map((option) => {
                  const selected = tagFilter === option.value
                  return (
                    <li key={option.label}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={cn(
                          'flex w-full px-3 py-2 text-left text-[12px] font-medium hover:bg-[#F5F3FB]',
                          selected || option.value === null
                            ? 'text-[#2D2061]'
                            : 'text-[#5C5870]',
                        )}
                        onClick={() => selectTag(option.value)}
                      >
                        {option.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[#8B8B9E]">
            No conversations match your filters.
          </p>
        ) : (
          <div className="divide-y divide-[#E8E6F0]">
            {conversations.map((item) => (
              <ConversationListItem
                key={item.id}
                conversation={item}
                selected={item.id === selectedId}
                onSelect={() => onSelect(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
