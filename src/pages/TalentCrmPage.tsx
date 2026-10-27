import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Send, SlidersHorizontal, Sparkles } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  CreateTalentPoolFlow,
  TalentCrmFiltersPanel,
  TalentCrmMetricCards,
  TalentPoolCard,
} from '../components/talent-crm'
import { Button, SegmentedToggle } from '../components/ui'
import {
  countTalentCrmFilters,
  emptyTalentCrmFilters,
  filterTalentPools,
  formatPaddedCount,
  TALENT_CRM_METRICS,
  TALENT_POOLS,
  type TalentCrmFilters,
  type TalentPool,
  type TalentPoolScope,
} from '../data/talentCrm'

const SCOPE_OPTIONS: Array<{ value: TalentPoolScope; label: string }> = [
  { value: 'my', label: 'My Talent Pools' },
  { value: 'all', label: 'All Talent Pools' },
]

/**
 * Talent CRM — Talent Pool landing (metrics, search, scope, pool list).
 */
export function TalentCrmPage() {
  const navigate = useNavigate()
  const [pools, setPools] = useState(TALENT_POOLS)
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<TalentPoolScope>('my')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [filters, setFilters] = useState<TalentCrmFilters>(emptyTalentCrmFilters)

  const filtered = useMemo(
    () => filterTalentPools(pools, query, scope, filters),
    [pools, query, scope, filters],
  )

  const filterCount = countTalentCrmFilters(filters)

  function handleOpenPool(pool: TalentPool) {
    navigate(`/talent-crm/talent-pool/${pool.id}`)
  }

  function handleDeletePool(pool: TalentPool) {
    setPools((current) => current.filter((row) => row.id !== pool.id))
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Talent CRM"
        subtitle="Organize and nurture candidates for current and future roles."
        actions={
          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="!h-10 w-full shrink-0 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52] sm:w-auto"
          >
            <Sparkles className="size-4" strokeWidth={2} aria-hidden="true" />
            Create Talent Pool
          </Button>
        }
      />

      <TalentCrmMetricCards metrics={TALENT_CRM_METRICS} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type here to search"
            aria-label="Search talent pools"
            className="h-11 w-full rounded-[5px] border border-[#E0DDEA] bg-white py-2 pl-11 pr-12 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
          <span
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5B8DEF]"
            aria-hidden="true"
          >
            <Send className="size-4" strokeWidth={1.75} />
          </span>
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#2D2061]/25 bg-white px-4 text-sm font-medium text-[#2D2061] shadow-[0_1px_2px_rgba(45,32,97,0.04)] transition-colors hover:bg-[#faf9fd]"
        >
          <SlidersHorizontal className="size-4 shrink-0" aria-hidden="true" />
          Filter &amp; Sort
          {filterCount > 0 ? (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#2D2061] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
              {filterCount}
            </span>
          ) : null}
        </button>
      </div>

      <TalentCrmFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={setFilters}
      />

      <CreateTalentPoolFlow
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#2D2061]">
          “
          <span className="font-bold tabular-nums">
            {formatPaddedCount(filtered.length)}
          </span>{' '}
          Talent Pools found”
        </p>
        <SegmentedToggle
          aria-label="Talent pool scope"
          value={scope}
          options={SCOPE_OPTIONS}
          onChange={setScope}
          className="!h-auto shadow-[0_1px_2px_rgba(45,32,97,0.04)] [&_button]:h-8 [&_button]:px-3.5 [&_button]:text-xs"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E0DDEA] bg-[#F8FAFC] px-6 py-12 text-center">
            <p className="text-sm font-semibold text-[#2D2061]">
              No talent pools found
            </p>
            <p className="mt-1 text-sm text-[#8B8B9E]">
              Try adjusting search or filters, or create a new talent pool.
            </p>
          </div>
        ) : (
          filtered.map((pool) => (
            <TalentPoolCard
              key={pool.id}
              pool={pool}
              onOpen={handleOpenPool}
              onDelete={handleDeletePool}
            />
          ))
        )}
      </div>
    </PageContainer>
  )
}
