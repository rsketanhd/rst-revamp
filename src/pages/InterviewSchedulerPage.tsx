import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { SchedulerFiltersBar } from '../components/scheduler/SchedulerFiltersBar'
import { SchedulerMoreFiltersPanel } from '../components/scheduler/SchedulerMoreFiltersPanel'
import { TeamPanelConfigurations } from '../components/scheduler/TeamPanelConfigurations'
import { UpdateInterviewTeamPanel } from '../components/scheduler/UpdateInterviewTeamPanel'
import {
  emptySchedulerMoreFilters,
  getSchedulerCandidates,
  SCHEDULER_HIDING_OPTIONS,
  SCHEDULER_STATUS_META,
  SCHEDULER_TAG_OPTIONS,
  SCHEDULER_UPDATED_OPTIONS,
  type InterviewStageSlot,
  type SchedulerCandidate,
  type SchedulerListScope,
  type SchedulerMoreFilters,
  type SchedulerStatus,
  type SchedulerTab,
} from '../data/interviewScheduler'
import {
  ConfigureColumnsPanel,
  DataTable,
  DataTableActionsHeader,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTablePaginationBar,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  DataTableTh,
  getVisibleTableColumns,
  Pagination,
  SegmentedControl,
  toast,
  type TableColumnConfig,
} from '../components/ui'
import { cn } from '../lib/cn'

const DEFAULT_COLUMNS: TableColumnConfig[] = [
  { id: 'name', label: 'Candidate Name', visible: true, required: true },
  { id: 'reqReference', label: 'Req Reference', visible: true },
  { id: 'mobile', label: 'Mobile', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'technicalRound', label: 'Technical Round', visible: true },
  { id: 'hrScreening', label: 'HR Screening', visible: true },
  { id: 'firstInterview', label: '1st Interview', visible: true },
  { id: 'secondInterview', label: '2nd Interview', visible: true },
]

type SortKey =
  | 'name'
  | 'reqReference'
  | 'mobile'
  | 'status'
  | 'technicalRound'
  | null

/**
 * Interview Scheduler & Analytics — candidates board + team panel config tabs.
 */
export function InterviewSchedulerPage() {
  const all = useMemo(() => getSchedulerCandidates(), [])

  const [mainTab, setMainTab] = useState<SchedulerTab>('bookCandidates')
  const [listScope, setListScope] =
    useState<SchedulerListScope>('applicants')
  const [lastUpdatedOn, setLastUpdatedOn] = useState('')
  const [tag, setTag] = useState('')
  const [candidateHiding, setCandidateHiding] = useState('')
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [moreFilters, setMoreFilters] = useState<SchedulerMoreFilters>(
    emptySchedulerMoreFilters,
  )
  const [columns, setColumns] = useState<TableColumnConfig[]>(DEFAULT_COLUMNS)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  /** Local overrides when user confirms assign panel */
  const [slotOverrides, setSlotOverrides] = useState<
    Record<string, Partial<Record<StageKey, string>>>
  >({})
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignTarget, setAssignTarget] = useState<{
    candidate: SchedulerCandidate
    stage: StageKey
  } | null>(null)

  const applicantsCount = useMemo(
    () => all.filter((c) => c.list === 'applicants').length,
    [all],
  )
  const recommendationsCount = useMemo(
    () => all.filter((c) => c.list === 'recommendations').length,
    [all],
  )

  const reqOptions = useMemo(
    () => [...new Set(all.map((c) => c.reqReference))].sort(),
    [all],
  )

  const filtered = useMemo(() => {
    let rows = all.filter((c) => c.list === listScope)

    if (lastUpdatedOn) {
      rows = rows.filter((c) => c.lastUpdatedOn === lastUpdatedOn)
    }
    const activeTag = tag || moreFilters.tag
    if (activeTag) {
      rows = rows.filter((c) => c.tags.includes(activeTag))
    }
    if (candidateHiding === 'Hidden only') {
      rows = rows.filter((c) => c.hidden)
    } else if (candidateHiding === 'Visible only') {
      rows = rows.filter((c) => !c.hidden)
    }
    if (moreFilters.status) {
      rows = rows.filter((c) => c.status === moreFilters.status)
    }
    if (moreFilters.reqReference) {
      rows = rows.filter((c) => c.reqReference === moreFilters.reqReference)
    }

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = sortValue(a, sortKey, slotOverrides)
        const bv = sortValue(b, sortKey, slotOverrides)
        const cmp = av.localeCompare(bv, undefined, { sensitivity: 'base' })
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return rows
  }, [
    all,
    listScope,
    lastUpdatedOn,
    tag,
    candidateHiding,
    moreFilters,
    sortKey,
    sortDir,
    slotOverrides,
  ])

  const totalFound = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalFound / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const pageIds = pageRows.map((r) => r.id)
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected[id])
  const visibleColumns = useMemo(
    () => getVisibleTableColumns(columns),
    [columns],
  )
  const colSpan = 2 + visibleColumns.length

  function toggleAll(checked: boolean) {
    setSelected((prev) => {
      const next = { ...prev }
      for (const id of pageIds) {
        if (checked) next[id] = true
        else delete next[id]
      }
      return next
    })
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }

  function handleSort(key: SortKey) {
    if (!key) return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function resolveSlot(
    candidate: SchedulerCandidate,
    stage: StageKey,
  ): InterviewStageSlot {
    const override = slotOverrides[candidate.id]?.[stage]
    if (override) return { scheduledAt: override }
    return candidate[stage]
  }

  function handleAssign(candidate: SchedulerCandidate, stage: StageKey) {
    setAssignTarget({ candidate, stage })
    setAssignOpen(true)
  }

  function handleConfirmAssign(payload: { slot: string; timezone: string }) {
    if (!assignTarget) return
    const { candidate, stage } = assignTarget
    const stamp = formatDateTimeLocal(payload.slot)
    setSlotOverrides((prev) => ({
      ...prev,
      [candidate.id]: { ...prev[candidate.id], [stage]: stamp },
    }))
  }

  function handleDownloadCsv(candidate: SchedulerCandidate) {
    toast.success(`Preparing CSV for ${candidate.name}.`, {
      title: 'Download CSV',
    })
  }

  function sortDirectionFor(key: SortKey) {
    if (sortKey !== key) return null
    return sortDir
  }

  function renderHeader(column: TableColumnConfig) {
    const sortable =
      column.id === 'name' ||
      column.id === 'reqReference' ||
      column.id === 'mobile' ||
      column.id === 'status' ||
      column.id === 'technicalRound'
    return (
      <DataTableSortHeader
        key={column.id}
        label={column.label}
        sortable={sortable}
        direction={
          sortable ? sortDirectionFor(column.id as SortKey) : null
        }
        onSort={
          sortable
            ? () => handleSort(column.id as SortKey)
            : undefined
        }
      />
    )
  }

  function renderCell(candidate: SchedulerCandidate, columnId: string) {
    switch (columnId) {
      case 'name':
        return (
          <DataTableTd key={columnId} strong>
            {candidate.name}
          </DataTableTd>
        )
      case 'reqReference':
        return (
          <DataTableTd key={columnId}>{candidate.reqReference}</DataTableTd>
        )
      case 'mobile':
        return <DataTableTd key={columnId}>{candidate.mobile}</DataTableTd>
      case 'status':
        return (
          <DataTableTd key={columnId}>
            <StatusBadge status={candidate.status} />
          </DataTableTd>
        )
      case 'technicalRound':
        return (
          <DataTableTd key={columnId}>
            <StageCell
              slot={resolveSlot(candidate, 'technicalRound')}
              onAssign={() => handleAssign(candidate, 'technicalRound')}
            />
          </DataTableTd>
        )
      case 'hrScreening':
        return (
          <DataTableTd key={columnId}>
            <StageCell
              slot={resolveSlot(candidate, 'hrScreening')}
              onAssign={() => handleAssign(candidate, 'hrScreening')}
            />
          </DataTableTd>
        )
      case 'firstInterview':
        return (
          <DataTableTd key={columnId}>
            <StageCell
              slot={resolveSlot(candidate, 'firstInterview')}
              onAssign={() => handleAssign(candidate, 'firstInterview')}
            />
          </DataTableTd>
        )
      case 'secondInterview':
        return (
          <DataTableTd key={columnId}>
            <StageCell
              slot={resolveSlot(candidate, 'secondInterview')}
              onAssign={() => handleAssign(candidate, 'secondInterview')}
            />
          </DataTableTd>
        )
      default:
        return <DataTableTd key={columnId}>—</DataTableTd>
    }
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Interview Scheduler & Analytics"
        subtitle="Automate candidate interviews via interactive calendars, dispatch email loops, and configure panel hours."
      />

      {/* Top tabs — Book Candidates / Team Panel */}
      <div className="border-b border-[#E8E6F0]">
        <nav
          className="flex flex-wrap gap-6"
          aria-label="Scheduler sections"
        >
          <MainTab
            active={mainTab === 'bookCandidates'}
            onClick={() => setMainTab('bookCandidates')}
            label="Book Candidates"
          />
          <MainTab
            active={mainTab === 'teamPanel'}
            onClick={() => setMainTab('teamPanel')}
            label="Team Panel Configurations"
          />
        </nav>
      </div>

      {mainTab === 'teamPanel' ? (
        <TeamPanelConfigurations />
      ) : (
        <>
          <SchedulerFiltersBar
            lastUpdatedOn={lastUpdatedOn}
            lastUpdatedOptions={SCHEDULER_UPDATED_OPTIONS}
            onLastUpdatedChange={(next) => {
              setLastUpdatedOn(next)
              setPage(1)
            }}
            tag={tag}
            tagOptions={SCHEDULER_TAG_OPTIONS}
            onTagChange={(next) => {
              setTag(next)
              setPage(1)
            }}
            candidateHiding={candidateHiding}
            hidingOptions={SCHEDULER_HIDING_OPTIONS}
            onCandidateHidingChange={(next) => {
              setCandidateHiding(next)
              setPage(1)
            }}
            onMoreFilters={() => setMoreFiltersOpen(true)}
          />

          <SchedulerMoreFiltersPanel
            open={moreFiltersOpen}
            onClose={() => setMoreFiltersOpen(false)}
            value={moreFilters}
            reqOptions={reqOptions}
            onApply={(next) => {
              setMoreFilters(next)
              if (next.tag) setTag(next.tag)
              setPage(1)
            }}
          />

          <SegmentedControl
            value={listScope}
            aria-label="Candidate list scope"
            options={[
              {
                value: 'applicants',
                label: `Applicants (${applicantsCount})`,
              },
              {
                value: 'recommendations',
                label: `Recommendations (${recommendationsCount})`,
              },
            ]}
            onChange={(next) => {
              setListScope(next)
              setSelected({})
              setPage(1)
            }}
            className="w-fit shrink-0"
          />

          <DataTable
            minWidthClassName="min-w-[72rem] lg:min-w-[80rem]"
            footer={
              <DataTablePaginationBar
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(n) => {
                  setRowsPerPage(n)
                  setPage(1)
                }}
                pagination={
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                }
              />
            }
          >
            <DataTableHead>
              <DataTableTh checkbox>
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  aria-label="Select all candidates on this page"
                  className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                />
              </DataTableTh>
              {visibleColumns.map(renderHeader)}
              <DataTableActionsHeader
                onSettingsClick={() => setColumnsOpen(true)}
              />
            </DataTableHead>
            <DataTableBody>
              {pageRows.length === 0 ? (
                <DataTableEmpty colSpan={colSpan}>
                  No candidates match the current filters.
                </DataTableEmpty>
              ) : (
                pageRows.map((candidate) => (
                  <DataTableRow key={candidate.id}>
                    <DataTableTd checkbox>
                      <input
                        type="checkbox"
                        checked={Boolean(selected[candidate.id])}
                        onChange={() => toggleOne(candidate.id)}
                        aria-label={`Select ${candidate.name}`}
                        className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                      />
                    </DataTableTd>
                    {visibleColumns.map((col) =>
                      renderCell(candidate, col.id),
                    )}
                    <DataTableTd>
                      <button
                        type="button"
                        onClick={() => handleDownloadCsv(candidate)}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1A6FD0] transition-colors hover:text-[#1559A8] hover:underline"
                      >
                        Download CSV
                        <Download
                          className="size-3.5 shrink-0"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </button>
                    </DataTableTd>
                  </DataTableRow>
                ))
              )}
            </DataTableBody>
          </DataTable>

          <ConfigureColumnsPanel
            open={columnsOpen}
            onClose={() => setColumnsOpen(false)}
            columns={columns}
            onApply={setColumns}
          />

          <UpdateInterviewTeamPanel
            open={assignOpen}
            onClose={() => {
              setAssignOpen(false)
              setAssignTarget(null)
            }}
            context={
              assignTarget
                ? {
                    candidateName: assignTarget.candidate.name,
                    jobReference: assignTarget.candidate.reqReference,
                    roundCategory: stageLabel(assignTarget.stage).toUpperCase(),
                  }
                : null
            }
            onConfirm={handleConfirmAssign}
          />
        </>
      )}
    </PageContainer>
  )
}

type StageKey =
  | 'technicalRound'
  | 'hrScreening'
  | 'firstInterview'
  | 'secondInterview'

function stageLabel(stage: StageKey): string {
  switch (stage) {
    case 'technicalRound':
      return 'Technical Round'
    case 'hrScreening':
      return 'HR Screening'
    case 'firstInterview':
      return '1st Interview'
    case 'secondInterview':
      return '2nd Interview'
    default: {
      const _exhaustive: never = stage
      return _exhaustive
    }
  }
}

function formatDateTimeLocal(value: string): string {
  if (!value) return formatAssignStamp()
  // datetime-local: "2026-06-15T14:00"
  const [datePart, timePart] = value.split('T')
  if (!datePart || !timePart) return formatAssignStamp()
  const [y, m, d] = datePart.split('-')
  const [hh, mm] = timePart.split(':')
  if (!y || !m || !d || !hh || !mm) return formatAssignStamp()
  const hour = Number(hh)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${y}-${m}-${d} @ ${String(hour12).padStart(2, '0')}:${mm} ${ampm}`
}

function formatAssignStamp(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} @ ${hh}:${min}`
}

function sortValue(
  candidate: SchedulerCandidate,
  key: Exclude<SortKey, null>,
  overrides: Record<string, Partial<Record<StageKey, string>>>,
): string {
  switch (key) {
    case 'name':
      return candidate.name
    case 'reqReference':
      return candidate.reqReference
    case 'mobile':
      return candidate.mobile
    case 'status':
      return SCHEDULER_STATUS_META[candidate.status].label
    case 'technicalRound':
      return (
        overrides[candidate.id]?.technicalRound ??
        candidate.technicalRound.scheduledAt ??
        ''
      )
    default: {
      const _exhaustive: never = key
      return _exhaustive
    }
  }
}

function StatusBadge({ status }: { status: SchedulerStatus }) {
  const meta = SCHEDULER_STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center truncate rounded-md px-2.5 py-1 text-[11px] font-semibold leading-none',
        meta.className,
      )}
    >
      {meta.label}
    </span>
  )
}

function StageCell({
  slot,
  onAssign,
}: {
  slot: InterviewStageSlot
  onAssign: () => void
}) {
  if (slot.scheduledAt) {
    return (
      <span className="tabular-nums text-[13px] font-medium text-[#2A2740]">
        {slot.scheduledAt}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onAssign}
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-md border border-dashed border-[#C8C5D6] bg-[#FAFAFC] px-3',
        'text-xs font-semibold text-[#8B8B9E] transition-colors',
        'hover:border-[#2D2061]/40 hover:bg-white hover:text-[#2D2061]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/20',
      )}
    >
      + Assign
    </button>
  )
}

function MainTab({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative pb-3 text-sm font-semibold transition-colors',
        active ? 'text-[#2D2061]' : 'text-[#8B8B9E] hover:text-[#2D2061]',
      )}
    >
      {label}
      {active ? (
        <span
          className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#C0278A]"
          aria-hidden="true"
        />
      ) : null}
    </button>
  )
}
