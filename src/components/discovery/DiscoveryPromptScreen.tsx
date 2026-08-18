import { Check, ChevronDown, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  DISCOVERY_SOURCE_OPTIONS,
  PROMPT_FILTERS,
  type DiscoverySource,
  type PromptFilterId,
  type SavedSearch,
  type AiSuggestion,
} from '../../data/discovery'
import { useEffect, useRef, useState } from 'react'

const SAVED_SEARCHES_PREVIEW = 3

export type DiscoveryPromptScreenProps = {
  prompt: string
  onPromptChange: (value: string) => void
  /** Green chips — typically derived from detectPromptCriteria(prompt) */
  promptFilters: Record<PromptFilterId, boolean>
  onToggleFilter: (id: PromptFilterId) => void
  sourcing: DiscoverySource
  onSourcingChange: (value: DiscoverySource) => void
  onSearch: () => void
  onUsePrompt: (prompt: string) => void
  savedSearches: SavedSearch[]
  suggestions: AiSuggestion[]
}

/**
 * Initial Candidate Discovery prompt screen (search box, chips, saved + AI cards).
 */
export function DiscoveryPromptScreen({
  prompt,
  onPromptChange,
  promptFilters,
  onToggleFilter,
  sourcing,
  onSourcingChange,
  onSearch,
  onUsePrompt,
  savedSearches,
  suggestions,
}: DiscoveryPromptScreenProps) {
  const [showAllSaved, setShowAllSaved] = useState(false)
  const visibleSaved = showAllSaved
    ? savedSearches
    : savedSearches.slice(0, SAVED_SEARCHES_PREVIEW)
  const hasMoreSaved = savedSearches.length > SAVED_SEARCHES_PREVIEW

  return (
    <div className="flex w-full max-w-none flex-col gap-10 px-2 pb-8 pt-4 sm:px-3 sm:pt-8">
      <header className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#2D2061] sm:text-3xl">
          Who do you want to hire?
        </h1>
        <p className="mt-2 text-sm text-[#8B8B9E] sm:text-base">
          Define your hiring needs to find the right candidates faster.
        </p>
      </header>

      <DiscoveryPromptBox
        prompt={prompt}
        onPromptChange={onPromptChange}
        promptFilters={promptFilters}
        onToggleFilter={onToggleFilter}
        sourcing={sourcing}
        onSourcingChange={onSourcingChange}
        onSearch={onSearch}
      />

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#2D2061]">Saved Searches</h2>
          {hasMoreSaved ? (
            <button
              type="button"
              onClick={() => setShowAllSaved((open) => !open)}
              className="text-sm font-semibold text-[#E85A6C] transition-colors hover:text-[#D13F52]"
            >
              {showAllSaved ? 'Show Less' : 'Show All'}
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleSaved.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onUsePrompt(item.prompt)}
              className="rounded-xl border border-[#E8E6F0] bg-white p-4 text-left shadow-[0_1px_2px_rgba(45,32,97,0.03)] transition-colors hover:border-[#D5D0E8] hover:bg-[#FAFAFC]"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-[#2D2061]">{item.title}</p>
                <span className="shrink-0 text-xs text-[#A0A0B2]">{item.date}</span>
              </div>
              <p className="line-clamp-3 text-xs leading-relaxed text-[#8B8B9E]">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold text-[#2D2061]">AI Suggestions</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {suggestions.slice(0, 3).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onUsePrompt(item.prompt)}
              className="rounded-xl border border-[#E4DEF5] bg-[#F6F3FC] p-4 text-left transition-colors hover:border-[#D0C8EB] hover:bg-[#F0ECFA]"
            >
              <p className="mb-2 text-sm font-bold text-[#2D2061]">{item.title}</p>
              <p className="line-clamp-3 text-xs leading-relaxed text-[#6B6B80]">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function DiscoveryPromptBox({
  prompt,
  onPromptChange,
  promptFilters,
  onToggleFilter,
  sourcing,
  onSourcingChange,
  onSearch,
}: {
  prompt: string
  onPromptChange: (value: string) => void
  promptFilters: Record<PromptFilterId, boolean>
  onToggleFilter: (id: PromptFilterId) => void
  sourcing: DiscoverySource
  onSourcingChange: (value: DiscoverySource) => void
  onSearch: () => void
}) {
  const [sourceOpen, setSourceOpen] = useState(false)
  const sourceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!sourceRef.current?.contains(event.target as Node)) {
        setSourceOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E4E1EE] bg-white shadow-[0_4px_24px_rgba(45,32,97,0.06)]">
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        rows={5}
        placeholder="Describe the candidates you want to find…"
        className="w-full resize-none border-0 bg-transparent px-5 pt-5 text-sm leading-relaxed text-[#2A2740] outline-none placeholder:text-[#A0A0B2]"
      />

      <div className="flex flex-col gap-3 border-t border-[#F0EEF5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {PROMPT_FILTERS.map((filter) => {
            const active = promptFilters[filter.id]
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onToggleFilter(filter.id)}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors',
                  active
                    ? 'border-[#9DD4C8] bg-[#E8F7F3] text-[#1F7A68]'
                    : 'border-[#E0DDEA] bg-white text-[#6B6B80] hover:bg-[#FAFAFC]',
                )}
              >
                {active ? (
                  <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  <span
                    className="size-3.5 rounded-full border border-[#C8C5D6]"
                    aria-hidden="true"
                  />
                )}
                {filter.label}
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <div ref={sourceRef} className="relative">
            <button
              type="button"
              onClick={() => setSourceOpen((open) => !open)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#E0DDEA] bg-white px-3 text-xs font-medium text-[#2D2061] transition-colors hover:bg-[#FAFAFC]"
              aria-expanded={sourceOpen}
            >
              <span className="text-[#8B8B9E]">Sourcing :</span>
              <span className="max-w-[9rem] truncate font-semibold">{sourcing}</span>
              <ChevronDown className="size-3.5 text-[#8B8B9E]" aria-hidden="true" />
            </button>
            {sourceOpen ? (
              <ul
                className="absolute bottom-full right-0 z-20 mb-1 min-w-[12rem] overflow-hidden rounded-lg border border-[#E4E1EE] bg-white py-1 shadow-lg"
                role="listbox"
              >
                {DISCOVERY_SOURCE_OPTIONS.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option === sourcing}
                      onClick={() => {
                        onSourcingChange(option)
                        setSourceOpen(false)
                      }}
                      className={cn(
                        'flex w-full px-3 py-2 text-left text-sm transition-colors',
                        option === sourcing
                          ? 'bg-[#F5F3FF] font-semibold text-[#2D2061]'
                          : 'text-[#4A4760] hover:bg-[#F7F6FA]',
                      )}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onSearch}
            disabled={!prompt.trim()}
            aria-label="Search candidates"
            className="inline-flex size-10 items-center justify-center rounded-lg bg-[#2D2061] text-white transition-colors hover:bg-[#241a52] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
