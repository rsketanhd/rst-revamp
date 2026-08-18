import { useMemo, useState } from 'react'
import { BookmarkPlus, X } from 'lucide-react'
import { PageContainer } from '../components/layout'
import {
  DiscoveryCandidateCard,
  DiscoveryChatPanel,
  DiscoveryFiltersPanel,
  DiscoveryPromptScreen,
} from '../components/discovery'
import { BulkActionsBar, Button, toast } from '../components/ui'
import {
  AI_SUGGESTIONS,
  DEFAULT_PROMPT,
  SAVED_SEARCHES,
  buildAssistantSummary,
  detectPromptCriteria,
  emptyDiscoveryListFilters,
  filterDiscoveryCandidates,
  getDiscoveryCandidates,
  type ChatMessage,
  type DiscoveryListFilters,
  type DiscoverySource,
  type PromptFilterId,
} from '../data/discovery'

type ViewMode = 'prompt' | 'results'

/**
 * Candidate Discovery — prompt search first, then chat + results refined by filters.
 */
export function CandidateDiscoveryPage() {
  const allCandidates = useMemo(() => getDiscoveryCandidates(), [])

  const [view, setView] = useState<ViewMode>('prompt')
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
  const [activePrompt, setActivePrompt] = useState(DEFAULT_PROMPT)
  const [promptFilters, setPromptFilters] = useState(() =>
    detectPromptCriteria(DEFAULT_PROMPT),
  )
  const [manualFilters, setManualFilters] = useState<
    Partial<Record<PromptFilterId, boolean>>
  >({})
  const [sourcing, setSourcing] = useState<DiscoverySource>('Internal Candidates')
  const [listFilters, setListFilters] = useState<DiscoveryListFilters>(
    emptyDiscoveryListFilters,
  )
  const [draftFilters, setDraftFilters] = useState<DiscoveryListFilters>(
    emptyDiscoveryListFilters,
  )
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const results = useMemo(
    () =>
      filterDiscoveryCandidates(
        allCandidates,
        activePrompt,
        listFilters,
        promptFilters,
        sourcing,
      ),
    [allCandidates, activePrompt, listFilters, promptFilters, sourcing],
  )

  const displayed = results.slice(0, 20)
  const selectedIds = Object.keys(selected).filter((id) => selected[id])
  const selectedCount = selectedIds.length

  function mergePromptFilters(
    text: string,
    manual: Partial<Record<PromptFilterId, boolean>> = manualFilters,
  ) {
    const detected = detectPromptCriteria(text)
    const merged = { ...detected }
    ;(Object.keys(manual) as PromptFilterId[]).forEach((id) => {
      if (manual[id] !== undefined) {
        merged[id] = Boolean(manual[id])
      }
    })
    return merged
  }

  function handlePromptChange(value: string) {
    setPrompt(value)
    setPromptFilters(mergePromptFilters(value))
  }

  function togglePromptFilter(id: PromptFilterId) {
    setManualFilters((current) => {
      const nextValue = !promptFilters[id]
      const nextManual = { ...current, [id]: nextValue }
      setPromptFilters(mergePromptFilters(prompt, nextManual))
      return nextManual
    })
  }

  function runSearch(nextPrompt?: string) {
    const text = (nextPrompt ?? prompt).trim()
    if (!text) {
      toast.error('Enter a hiring prompt to search.', {
        title: 'Candidate Discovery',
      })
      return
    }

    const filters = mergePromptFilters(text)
    setPrompt(text)
    setActivePrompt(text)
    setPromptFilters(filters)
    setListFilters(emptyDiscoveryListFilters())
    setDraftFilters(emptyDiscoveryListFilters())
    setSelected({})

    const filtered = filterDiscoveryCandidates(
      allCandidates,
      text,
      emptyDiscoveryListFilters(),
      filters,
      sourcing,
    )

    setMessages([
      {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text,
      },
      {
        id: `a-intro-${Date.now()}`,
        role: 'assistant',
        content:
          'I have reviewed your criteria and searched across the selected sourcing channels. Here is what I found:',
      },
      {
        id: `a-sum-${Date.now()}`,
        role: 'assistant',
        content: buildAssistantSummary(filtered.length, filtered),
      },
    ])
    setView('results')
  }

  function handleChatSend(text: string) {
    const combined = `${activePrompt} ${text}`.trim()
    const filters = mergePromptFilters(combined)
    setActivePrompt(combined)
    setPrompt(combined)
    setPromptFilters(filters)

    const filtered = filterDiscoveryCandidates(
      allCandidates,
      combined,
      listFilters,
      filters,
      sourcing,
    )

    setMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, role: 'user', content: text },
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: buildAssistantSummary(filtered.length, filtered),
      },
    ])
    setSelected({})
  }

  function handleApplyFilters() {
    setListFilters({ ...draftFilters })
    setSelected({})
    setMessages((current) => [
      ...current,
      {
        id: `a-filter-${Date.now()}`,
        role: 'assistant',
        content:
          'Filters applied. The candidate list has been updated to match your criteria.',
      },
    ])
  }

  function handleResetFilters() {
    const empty = emptyDiscoveryListFilters()
    setDraftFilters(empty)
    setListFilters(empty)
    setSelected({})
  }

  function handleCloseResults() {
    setView('prompt')
    setSelected({})
  }

  function handleSaveSearch() {
    toast.success('Search saved to your library.', {
      title: 'Save Search',
    })
  }

  function truncateTitle(text: string, max = 42) {
    if (text.length <= max) return text
    return `${text.slice(0, max).trim()}...`
  }

  if (view === 'prompt') {
    return (
      <PageContainer contentClassName="gap-0 !px-6 sm:!px-10 lg:!px-14 xl:!px-16">
        <DiscoveryPromptScreen
          prompt={prompt}
          onPromptChange={handlePromptChange}
          promptFilters={promptFilters}
          onToggleFilter={togglePromptFilter}
          sourcing={sourcing}
          onSourcingChange={setSourcing}
          onSearch={() => runSearch()}
          onUsePrompt={(text) => {
            // Only fill the prompt box — user submits to open results
            setManualFilters({})
            setPrompt(text)
            setPromptFilters(detectPromptCriteria(text))
          }}
          savedSearches={SAVED_SEARCHES}
          suggestions={AI_SUGGESTIONS}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      contentClassName="!p-0 gap-0 min-h-0 flex-1 overflow-hidden"
      className="overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-1 flex-col lg:flex-row">
        <DiscoveryChatPanel
          title={truncateTitle(activePrompt)}
          messages={messages}
          onSend={handleChatSend}
          onOpenFilters={() => {
            setDraftFilters({ ...listFilters })
            setFiltersOpen(true)
          }}
        />

        <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#FAFAFC]">
          <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#ECEAF3] bg-white px-4 py-3 sm:px-5">
            <p className="text-sm font-semibold text-[#2D2061]">
              {displayed.length} Candidates matching your search criteria
              {results.length > displayed.length
                ? ` · ${results.length} total`
                : null}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveSearch}
                className="!h-9 !rounded-md border-[#E0DDEA] bg-white px-3 text-xs font-semibold text-[#2D2061] hover:bg-[#F7F6FA]"
              >
                <BookmarkPlus className="size-3.5" strokeWidth={2} />
                Save Search
              </Button>
              <button
                type="button"
                onClick={handleCloseResults}
                aria-label="Close results"
                className="inline-flex size-9 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F7F6FA] hover:text-[#2D2061]"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>
          </header>

          {selectedCount > 0 ? (
            <div className="shrink-0 border-b border-[#ECEAF3] bg-white px-4 py-2.5 sm:px-5">
              <BulkActionsBar
                selectedCount={selectedCount}
                entityLabel="Candidate"
                actions={[{ id: 'sendMail', label: 'Send Mail' }]}
                onAction={(id) => {
                  if (id === 'sendMail') {
                    toast.success(
                      `Mail composer prepared for ${selectedCount} candidate(s).`,
                      { title: 'Send Mail' },
                    )
                  }
                }}
                onClear={() => setSelected({})}
                selectAll={{
                  checked:
                    displayed.length > 0 &&
                    displayed.every((c) => selected[c.id]),
                  indeterminate:
                    selectedCount > 0 && selectedCount < displayed.length,
                  onChange: (checked) => {
                    if (!checked) {
                      setSelected({})
                      return
                    }
                    setSelected(
                      Object.fromEntries(displayed.map((c) => [c.id, true])),
                    )
                  },
                }}
              />
            </div>
          ) : null}

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
            {displayed.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#E0DDEA] bg-white px-6 py-12 text-center">
                <p className="text-sm font-semibold text-[#2D2061]">
                  No candidates match these filters
                </p>
                <p className="mt-1 text-sm text-[#8B8B9E]">
                  Adjust your prompt, chat refinement, or Filters to expand
                  results.
                </p>
              </div>
            ) : (
              displayed.map((candidate) => (
                <DiscoveryCandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  selected={Boolean(selected[candidate.id])}
                  onSelectChange={(checked) =>
                    setSelected((current) => ({
                      ...current,
                      [candidate.id]: checked,
                    }))
                  }
                  onViewProfile={() =>
                    toast.success(`Opening profile for ${candidate.name}.`, {
                      title: 'Profile',
                    })
                  }
                  onMessage={() =>
                    toast.success(`Compose message to ${candidate.name}.`, {
                      title: 'Message',
                    })
                  }
                  onAdd={() =>
                    toast.success(`${candidate.name} added to shortlist.`, {
                      title: 'Add candidate',
                    })
                  }
                />
              ))
            )}
          </div>
        </section>
      </div>

      <DiscoveryFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </PageContainer>
  )
}
