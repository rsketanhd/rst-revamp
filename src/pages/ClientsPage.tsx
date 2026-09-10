import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Send, SlidersHorizontal } from 'lucide-react'
import { cn } from '../lib/cn'
import { PageContainer, PageHeader } from '../components/layout'
import {
  Button,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  SegmentedControl,
  Select,
  ThreeDotsMenu,
  toast,
} from '../components/ui'
import { ClientsFiltersPanel } from '../components/clients/ClientsFiltersPanel'
import { AddEndClientPanel } from '../components/clients/AddEndClientPanel'
import { AddIndustryPanel } from '../components/clients/AddIndustryPanel'
import {
  CLIENTS,
  END_CLIENTS,
  INDUSTRIES,
  SYNC_STATE_OPTIONS,
  countClientsMoreFilters,
  emptyClientsMoreFilters,
  filterClients,
  filterEndClients,
  filterIndustries,
  formatClientStat,
  getClientMetrics,
  type ClientRecord,
  type ClientTab,
  type ClientsMoreFilters,
  type EndClientRecord,
  type IndustryRecord,
} from '../data/clients'

type SortDir = 'asc' | 'desc' | null

function formatCount(value: number): string {
  return String(value).padStart(2, '0')
}

function cycleSort(current: SortDir): SortDir {
  if (current === null) return 'asc'
  if (current === 'asc') return 'desc'
  return null
}

function compareText(a: string, b: string, dir: 'asc' | 'desc'): number {
  const result = a.localeCompare(b, undefined, { sensitivity: 'base' })
  return dir === 'asc' ? result : -result
}

function compareNumber(a: number, b: number, dir: 'asc' | 'desc'): number {
  return dir === 'asc' ? a - b : b - a
}

/**
 * Client Management listing — Clients / End Clients / Industries & Sectors.
 */
export function ClientsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<ClientTab>('clients')
  const [query, setQuery] = useState('')
  const [syncState, setSyncState] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [moreFilters, setMoreFilters] = useState<ClientsMoreFilters>(
    emptyClientsMoreFilters,
  )
  const filterCount = countClientsMoreFilters(moreFilters)

  const [clients, setClients] = useState(CLIENTS)
  const [endClients, setEndClients] = useState(END_CLIENTS)
  const [industries, setIndustries] = useState(INDUSTRIES)

  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)

  const [endClientOpen, setEndClientOpen] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)

  const metrics = useMemo(
    () => getClientMetrics(clients, endClients, industries),
    [clients, endClients, industries],
  )

  const filteredClients = useMemo(() => {
    let rows = filterClients(clients, query, moreFilters)
    if (sortKey && sortDir) {
      rows = [...rows].sort((a, b) => {
        switch (sortKey) {
          case 'name':
            return compareText(a.name, b.name, sortDir)
          case 'location':
            return compareText(a.location, b.location, sortDir)
          case 'taxonomyFocus':
            return compareText(a.taxonomyFocus, b.taxonomyFocus, sortDir)
          case 'coreContact':
            return compareText(a.coreContact, b.coreContact, sortDir)
          case 'assignedRecruiter':
            return compareText(a.assignedRecruiter, b.assignedRecruiter, sortDir)
          case 'endClientsCount':
            return compareNumber(a.endClientsCount, b.endClientsCount, sortDir)
          case 'industry':
            return compareText(a.industry, b.industry, sortDir)
          default:
            return 0
        }
      })
    }
    return rows
  }, [clients, query, moreFilters, sortKey, sortDir])

  const filteredEndClients = useMemo(() => {
    let rows = filterEndClients(endClients, query, syncState)
    if (sortKey && sortDir) {
      rows = [...rows].sort((a, b) => {
        switch (sortKey) {
          case 'subsidiary':
            return compareText(a.subsidiary, b.subsidiary, sortDir)
          case 'primaryClient':
            return compareText(a.primaryClient, b.primaryClient, sortDir)
          case 'industrySector':
            return compareText(a.industrySector, b.industrySector, sortDir)
          case 'hiringManager':
            return compareText(a.hiringManager, b.hiringManager, sortDir)
          case 'activeFunnels':
            return compareNumber(a.activeFunnels, b.activeFunnels, sortDir)
          case 'createdDate':
            return compareText(a.createdDate, b.createdDate, sortDir)
          default:
            return 0
        }
      })
    }
    return rows
  }, [endClients, query, syncState, sortKey, sortDir])

  const filteredIndustries = useMemo(() => {
    let rows = filterIndustries(industries, query)
    if (sortKey && sortDir) {
      rows = [...rows].sort((a, b) => {
        switch (sortKey) {
          case 'code':
            return compareText(a.code, b.code, sortDir)
          case 'name':
            return compareText(a.name, b.name, sortDir)
          case 'createdDate':
            return compareText(a.createdDate, b.createdDate, sortDir)
          default:
            return 0
        }
      })
    }
    return rows
  }, [industries, query, sortKey, sortDir])

  function handleTabChange(next: ClientTab) {
    setTab(next)
    setQuery('')
    setSyncState('')
    setSortKey(null)
    setSortDir(null)
  }

  function handleSort(key: string) {
    if (sortKey === key) {
      const next = cycleSort(sortDir)
      setSortDir(next)
      if (next === null) setSortKey(null)
      return
    }
    setSortKey(key)
    setSortDir('asc')
  }

  function sortDirection(key: string): SortDir {
    return sortKey === key ? sortDir : null
  }

  function primaryAction() {
    if (tab === 'clients') {
      navigate('/client-management/new')
      return
    }
    if (tab === 'endClients') {
      setEndClientOpen(true)
      return
    }
    setIndustryOpen(true)
  }

  function handleSaveEndClient(payload: { name: string; industry: string }) {
    const row: EndClientRecord = {
      id: `ec-${Date.now()}`,
      subsidiary: payload.name,
      primaryClient: '—',
      industrySector: payload.industry,
      hiringManager: '—',
      activeFunnels: 0,
      createdDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      syncState: 'pending',
    }
    setEndClients((current) => [row, ...current])
  }

  function handleSaveIndustry(payload: { name: string }) {
    const code = payload.name
      .split(/\s+/)
      .map((part) => part[0] ?? '')
      .join('')
      .slice(0, 4)
      .toUpperCase() || 'IND'
    const row: IndustryRecord = {
      id: `ind-${Date.now()}`,
      code,
      name: payload.name,
      createdDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }
    setIndustries((current) => [row, ...current])
  }

  function removeClient(id: string) {
    setClients((current) => current.filter((item) => item.id !== id))
    toast.success('Client removed')
  }

  function removeEndClient(id: string) {
    setEndClients((current) => current.filter((item) => item.id !== id))
    toast.success('End client removed')
  }

  function removeIndustry(id: string) {
    setIndustries((current) => current.filter((item) => item.id !== id))
    toast.success('Industry removed')
  }

  const statCards = [
    { label: 'Active Clients', value: metrics.activeClients },
    { label: 'End Client Entities', value: metrics.endClientEntities },
    { label: 'Classification Industries', value: metrics.classificationIndustries },
    { label: 'Hiring Volume Density', value: metrics.hiringVolumeDensity },
  ]

  const ctaLabel =
    tab === 'clients'
      ? 'Add Client'
      : tab === 'endClients'
        ? 'Add End Client'
        : 'Add Industry'

  return (
    <PageContainer>
      <PageHeader
        className="mb-5 sm:mb-6"
        title="Clients"
        subtitle="Manage client accounts, contacts, and relationships."
      />

      <div className="mb-5 grid grid-cols-1 gap-2.5 sm:mb-6 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F7F9] px-3 py-3 shadow-[0_1px_3px_rgba(45,32,97,0.05)] sm:px-4 sm:py-3.5"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#626889] sm:text-[11px]">
              {stat.label}
            </p>
            <p className="text-[1.25rem] font-bold leading-none tabular-nums text-[#706BB0] sm:text-[1.5rem]">
              {formatClientStat(stat.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          aria-label="Client management views"
          value={tab}
          onChange={handleTabChange}
          options={[
            { value: 'clients', label: 'Clients' },
            { value: 'endClients', label: 'End Clients' },
            { value: 'industries', label: 'Industries & Sectors' },
          ]}
        />
        <Button
          type="button"
          onClick={primaryAction}
          className="!bg-[#2D2061] hover:!bg-[#241a52] sm:min-w-[8.5rem]"
        >
          {ctaLabel}
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-11 w-full rounded-lg border border-[#E0DDE8] bg-white py-2 pl-10 pr-11 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
          <button
            type="button"
            aria-label="Submit search"
            className="absolute right-2.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[#5B8DEF] transition-colors hover:bg-[#F0F5FF]"
          >
            <Send className="size-4" aria-hidden="true" />
          </button>
        </div>

        {tab === 'clients' ? (
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#2D2061]/25 bg-white px-4 text-sm font-medium text-[#2D2061] shadow-[0_1px_2px_rgba(45,32,97,0.04)] transition-colors hover:bg-[#faf9fd]"
          >
            <SlidersHorizontal className="size-4 shrink-0" aria-hidden="true" />
            Filter By
            {filterCount > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#2D2061] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                {filterCount}
              </span>
            ) : null}
          </button>
        ) : null}

        {tab === 'endClients' ? (
          <div className="w-full shrink-0 sm:w-[16rem]">
            <Select
              aria-label="Integration Pipeline Sync State"
              options={SYNC_STATE_OPTIONS}
              value={syncState}
              onChange={(e) => setSyncState(e.target.value)}
              placeholder="Integration Pipeline Sync State"
            />
          </div>
        ) : null}
      </div>

      {tab === 'clients' ? (
        <ClientsTable
          rows={filteredClients}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRemove={removeClient}
        />
      ) : null}

      {tab === 'endClients' ? (
        <EndClientsTable
          rows={filteredEndClients}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRemove={removeEndClient}
        />
      ) : null}

      {tab === 'industries' ? (
        <IndustriesTable
          rows={filteredIndustries}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRemove={removeIndustry}
        />
      ) : null}

      <ClientsFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={moreFilters}
        onApply={setMoreFilters}
      />

      <AddEndClientPanel
        open={endClientOpen}
        onClose={() => setEndClientOpen(false)}
        onSave={handleSaveEndClient}
      />

      <AddIndustryPanel
        open={industryOpen}
        onClose={() => setIndustryOpen(false)}
        onSave={handleSaveIndustry}
      />
    </PageContainer>
  )
}

function ClientsTable({
  rows,
  sortDirection,
  onSort,
  onRemove,
}: {
  rows: ClientRecord[]
  sortDirection: (key: string) => SortDir
  onSort: (key: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <DataTable minWidthClassName="min-w-[64rem]">
      <DataTableHead>
        <DataTableSortHeader
          label="Client Name"
          direction={sortDirection('name')}
          onSort={() => onSort('name')}
        />
        <DataTableSortHeader
          label="Location"
          direction={sortDirection('location')}
          onSort={() => onSort('location')}
        />
        <DataTableSortHeader
          label="Taxonomy Focus"
          direction={sortDirection('taxonomyFocus')}
          onSort={() => onSort('taxonomyFocus')}
        />
        <DataTableSortHeader
          label="Core Contact"
          direction={sortDirection('coreContact')}
          onSort={() => onSort('coreContact')}
        />
        <DataTableSortHeader
          label="Assigned Recruiter"
          direction={sortDirection('assignedRecruiter')}
          onSort={() => onSort('assignedRecruiter')}
        />
        <DataTableSortHeader
          label="End Clients"
          direction={sortDirection('endClientsCount')}
          onSort={() => onSort('endClientsCount')}
        />
        <DataTableSortHeader
          label="Industry"
          direction={sortDirection('industry')}
          onSort={() => onSort('industry')}
        />
        <DataTableSortHeader label="" sortable={false} />
      </DataTableHead>
      <DataTableBody>
        {rows.length === 0 ? (
          <DataTableEmpty colSpan={8}>No clients found</DataTableEmpty>
        ) : (
          rows.map((row, index) => (
            <DataTableRow
              key={row.id}
              className={cn(
                index % 2 === 1 && 'bg-[#F7F7F9] hover:bg-[#F2F1F6]',
              )}
            >
              <DataTableTd strong>{row.name}</DataTableTd>
              <DataTableTd muted>{row.location}</DataTableTd>
              <DataTableTd muted>{row.taxonomyFocus}</DataTableTd>
              <DataTableTd muted>{row.coreContact}</DataTableTd>
              <DataTableTd muted>{row.assignedRecruiter}</DataTableTd>
              <DataTableTd muted>
                {formatCount(row.endClientsCount)}
              </DataTableTd>
              <DataTableTd muted>{row.industry}</DataTableTd>
              <DataTableTd className="pr-1">
                <ThreeDotsMenu
                  triggerLabel={`Actions for ${row.name}`}
                  items={[
                    {
                      id: 'view',
                      label: 'View',
                      onSelect: () => toast.success(`Opening ${row.name}`),
                    },
                    {
                      id: 'remove',
                      label: 'Remove',
                      destructive: true,
                      onSelect: () => onRemove(row.id),
                    },
                  ]}
                />
              </DataTableTd>
            </DataTableRow>
          ))
        )}
      </DataTableBody>
    </DataTable>
  )
}

function EndClientsTable({
  rows,
  sortDirection,
  onSort,
  onRemove,
}: {
  rows: EndClientRecord[]
  sortDirection: (key: string) => SortDir
  onSort: (key: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <DataTable minWidthClassName="min-w-[60rem]">
      <DataTableHead>
        <DataTableSortHeader
          label="Subsidiary / Hiring Entity"
          direction={sortDirection('subsidiary')}
          onSort={() => onSort('subsidiary')}
        />
        <DataTableSortHeader
          label="Primary Client Connection"
          direction={sortDirection('primaryClient')}
          onSort={() => onSort('primaryClient')}
        />
        <DataTableSortHeader
          label="Functional Industry Sector"
          direction={sortDirection('industrySector')}
          onSort={() => onSort('industrySector')}
        />
        <DataTableSortHeader
          label="Hiring Manager"
          direction={sortDirection('hiringManager')}
          onSort={() => onSort('hiringManager')}
        />
        <DataTableSortHeader
          label="Active Funnels"
          direction={sortDirection('activeFunnels')}
          onSort={() => onSort('activeFunnels')}
        />
        <DataTableSortHeader
          label="Created Date"
          direction={sortDirection('createdDate')}
          onSort={() => onSort('createdDate')}
        />
        <DataTableSortHeader label="" sortable={false} />
      </DataTableHead>
      <DataTableBody>
        {rows.length === 0 ? (
          <DataTableEmpty colSpan={7}>No end clients found</DataTableEmpty>
        ) : (
          rows.map((row, index) => (
            <DataTableRow
              key={row.id}
              className={cn(
                index % 2 === 1 && 'bg-[#F7F7F9] hover:bg-[#F2F1F6]',
              )}
            >
              <DataTableTd strong>{row.subsidiary}</DataTableTd>
              <DataTableTd muted>{row.primaryClient}</DataTableTd>
              <DataTableTd muted>{row.industrySector}</DataTableTd>
              <DataTableTd muted>{row.hiringManager}</DataTableTd>
              <DataTableTd muted>{row.activeFunnels}</DataTableTd>
              <DataTableTd muted>{row.createdDate}</DataTableTd>
              <DataTableTd className="pr-1">
                <ThreeDotsMenu
                  triggerLabel={`Actions for ${row.subsidiary}`}
                  items={[
                    {
                      id: 'view',
                      label: 'View',
                      onSelect: () =>
                        toast.success(`Opening ${row.subsidiary}`),
                    },
                    {
                      id: 'remove',
                      label: 'Remove',
                      destructive: true,
                      onSelect: () => onRemove(row.id),
                    },
                  ]}
                />
              </DataTableTd>
            </DataTableRow>
          ))
        )}
      </DataTableBody>
    </DataTable>
  )
}

function IndustriesTable({
  rows,
  sortDirection,
  onSort,
  onRemove,
}: {
  rows: IndustryRecord[]
  sortDirection: (key: string) => SortDir
  onSort: (key: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <DataTable minWidthClassName="min-w-[36rem]">
      <DataTableHead>
        <DataTableSortHeader
          label="ID"
          direction={sortDirection('code')}
          onSort={() => onSort('code')}
        />
        <DataTableSortHeader
          label="Name"
          direction={sortDirection('name')}
          onSort={() => onSort('name')}
        />
        <DataTableSortHeader
          label="Created Date"
          direction={sortDirection('createdDate')}
          onSort={() => onSort('createdDate')}
        />
        <DataTableSortHeader label="" sortable={false} />
      </DataTableHead>
      <DataTableBody>
        {rows.length === 0 ? (
          <DataTableEmpty colSpan={4}>No industries found</DataTableEmpty>
        ) : (
          rows.map((row, index) => (
            <DataTableRow
              key={row.id}
              className={cn(
                index % 2 === 1 && 'bg-[#F7F7F9] hover:bg-[#F2F1F6]',
              )}
            >
              <DataTableTd strong>#{row.code}</DataTableTd>
              <DataTableTd muted>{row.name}</DataTableTd>
              <DataTableTd muted>{row.createdDate}</DataTableTd>
              <DataTableTd className="pr-1">
                <ThreeDotsMenu
                  triggerLabel={`Actions for ${row.name}`}
                  items={[
                    {
                      id: 'view',
                      label: 'View',
                      onSelect: () => toast.success(`Opening ${row.name}`),
                    },
                    {
                      id: 'remove',
                      label: 'Remove',
                      destructive: true,
                      onSelect: () => onRemove(row.id),
                    },
                  ]}
                />
              </DataTableTd>
            </DataTableRow>
          ))
        )}
      </DataTableBody>
    </DataTable>
  )
}
