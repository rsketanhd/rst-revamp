import { useMemo, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '../lib/cn'
import { PageContainer, PageHeader } from '../components/layout'
import {
  CANDIDATE_SOURCE_OPTIONS,
  CANDIDATE_STATUS_META,
  CANDIDATE_STATUS_OPTIONS,
  CANDIDATE_TAG_OPTIONS,
  emptyCandidatesMoreFilters,
  getCandidates,
  getCandidatesPipelineStages,
  type Candidate,
  type CandidateScope,
  type CandidatesMoreFilters,
} from '../data/candidates'
import type { ApplicantStatus, PipelineStageId } from '../data/applications'
import {
  BulkActionsBar,
  Button,
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
  StarRating,
  StatusPillSelect,
  ThreeDotsMenu,
  type TableColumnConfig,
} from '../components/ui'
import { PipelineFunnel } from '../components/applications/PipelineFunnel'
import {
  getApplicantRowMenuItems,
} from '../components/applications/applicantRowActions'
import { CandidatesFiltersBar } from '../components/candidates/CandidatesFiltersBar'
import { CandidatesMoreFiltersPanel } from '../components/candidates/CandidatesMoreFiltersPanel'
import { getCandidateBulkActions } from '../components/candidates/candidateBulkActions'

const DEFAULT_CANDIDATE_COLUMNS: TableColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true, required: true },
  { id: 'reqId', label: 'Req ID', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'updated', label: 'Updated', visible: true },
  { id: 'source', label: 'Source', visible: true },
  { id: 'suitability', label: 'Suitability', visible: true },
  { id: 'cvRelevancy', label: 'CV Relevancy', visible: true },
  { id: 'profileLinks', label: 'Profile Links', visible: true },
]

/**
 * Candidates list — same patterns as Applications with design-specific columns / filters.
 */
export function CandidatesPage() {
  const allCandidates = useMemo(() => getCandidates(), [])
  const pipeline = useMemo(() => getCandidatesPipelineStages(), [])

  const [columns, setColumns] = useState<TableColumnConfig[]>(
    DEFAULT_CANDIDATE_COLUMNS,
  )
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [activeStage, setActiveStage] =
    useState<PipelineStageId>('clientEndorsement')
  const [scope, setScope] = useState<CandidateScope>('my')
  const [source, setSource] = useState('')
  const [tag, setTag] = useState('')
  const [cvRelevancy, setCvRelevancy] = useState(0)
  const [suitability, setSuitability] = useState<[number, number]>([0, 95])
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [moreFilters, setMoreFilters] = useState<CandidatesMoreFilters>(
    emptyCandidatesMoreFilters,
  )
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [statuses, setStatuses] = useState<Record<string, ApplicantStatus>>({})
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filtered = useMemo(() => {
    const barSource = source || moreFilters.source
    const barTag = tag || moreFilters.tag

    return allCandidates.filter((candidate) => {
      if (scope === 'my' && !candidate.isMine) return false
      if (barSource && candidate.source !== barSource) return false
      if (barTag && !candidate.tags.includes(barTag)) return false
      if (cvRelevancy > 0 && candidate.cvRelevancy < cvRelevancy) return false
      if (
        candidate.suitability < suitability[0] ||
        candidate.suitability > suitability[1]
      ) {
        return false
      }
      if (moreFilters.cvScore) {
        const min = Number(moreFilters.cvScore)
        if (Number.isFinite(min) && candidate.cvRelevancy < min) return false
      }
      const resolvedStatus = statuses[candidate.id] ?? candidate.status
      if (moreFilters.status && resolvedStatus !== moreFilters.status) {
        return false
      }
      return true
    })
  }, [
    allCandidates,
    scope,
    source,
    tag,
    cvRelevancy,
    suitability,
    moreFilters,
    statuses,
  ])

  const stageScoped = useMemo(() => {
    const matched = filtered.filter((c) => c.stage === activeStage)
    return matched.length > 0 ? matched : filtered
  }, [filtered, activeStage])

  const totalFound = stageScoped.length
  const totalPages = Math.max(1, Math.ceil(totalFound / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = stageScoped.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const pageIds = pageRows.map((r) => r.id)
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected[id])
  const somePageSelected =
    pageIds.some((id) => selected[id]) && !allPageSelected
  const selectedIds = Object.keys(selected).filter((id) => selected[id])
  const selectedCount = selectedIds.length
  /** Bulk bar once any candidates are selected on this page */
  const showBulkActions = selectedCount > 0

  function getStatus(candidate: Candidate): ApplicantStatus {
    return statuses[candidate.id] ?? candidate.status
  }

  function setStatus(id: string, status: ApplicantStatus) {
    setStatuses((prev) => ({ ...prev, [id]: status }))
  }

  function clearSelection() {
    setSelected({})
  }

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

  function handleBulkAction(actionId: string) {
    console.info('candidate bulk action', actionId, selectedIds)
  }

  const tableSources = useMemo(() => {
    const set = new Set(allCandidates.map((c) => c.source))
    return Array.from(set)
  }, [allCandidates])

  const visibleColumns = useMemo(
    () => getVisibleTableColumns(columns),
    [columns],
  )
  const colSpan = 2 + visibleColumns.length

  function renderHeader(column: TableColumnConfig) {
    return (
      <DataTableSortHeader
        key={column.id}
        label={column.label}
        sortable={column.id !== 'profileLinks'}
      />
    )
  }

  function renderCell(candidate: Candidate, columnId: string) {
    const status = getStatus(candidate)
    switch (columnId) {
      case 'name':
        return (
          <DataTableTd key={columnId} strong>
            {candidate.name}
          </DataTableTd>
        )
      case 'reqId':
        return <DataTableTd key={columnId}>{candidate.reqId}</DataTableTd>
      case 'status':
        return (
          <DataTableTd key={columnId}>
            <StatusPillSelect
              value={status}
              aria-label={`Status for ${candidate.name}`}
              options={CANDIDATE_STATUS_OPTIONS.map((opt) => ({
                value: opt,
                label: CANDIDATE_STATUS_META[opt].label,
                className: CANDIDATE_STATUS_META[opt].className,
                dotClassName: CANDIDATE_STATUS_META[opt].dotClassName,
              }))}
              onChange={(next) =>
                setStatus(candidate.id, next as ApplicantStatus)
              }
            />
          </DataTableTd>
        )
      case 'updated':
        return <DataTableTd key={columnId}>{candidate.updatedOn}</DataTableTd>
      case 'source':
        return <DataTableTd key={columnId}>{candidate.source}</DataTableTd>
      case 'suitability':
        return (
          <DataTableTd key={columnId} className="font-semibold text-[#12B76A]">
            {candidate.suitability}%
          </DataTableTd>
        )
      case 'cvRelevancy':
        return (
          <DataTableTd key={columnId}>
            <StarRating value={candidate.cvRelevancy} size="md" />
          </DataTableTd>
        )
      case 'profileLinks':
        return (
          <DataTableTd key={columnId}>
            <a
              href={candidate.profileLink}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-medium text-[#1A6FD0] underline-offset-2 hover:underline"
            >
              {candidate.profileLink}
            </a>
          </DataTableTd>
        )
      default:
        return <DataTableTd key={columnId}>—</DataTableTd>
    }
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Candidates"
        subtitle="Monitor and optimize your job postings performance."
        actions={
          <Button
            type="button"
            variant="outline"
            size="md"
            className="!h-10 w-full shrink-0 !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb] sm:w-auto"
          >
            <Upload className="size-4" strokeWidth={2} aria-hidden="true" />
            Upload Resume
          </Button>
        }
      />

      <PipelineFunnel
        stages={pipeline}
        activeId={activeStage}
        onChange={(id) => {
          setActiveStage(id)
          setPage(1)
        }}
      />

      <CandidatesFiltersBar
        source={source}
        sourceOptions={tableSources.length > 0 ? tableSources : CANDIDATE_SOURCE_OPTIONS}
        onSourceChange={(next) => {
          setSource(next)
          setPage(1)
        }}
        tag={tag}
        tagOptions={CANDIDATE_TAG_OPTIONS}
        onTagChange={(next) => {
          setTag(next)
          setPage(1)
        }}
        cvRelevancy={cvRelevancy}
        onCvRelevancyChange={(next) => {
          setCvRelevancy(next)
          setPage(1)
        }}
        suitability={suitability}
        onSuitabilityChange={(next) => {
          setSuitability(next)
          setPage(1)
        }}
        onMoreFilters={() => setMoreFiltersOpen(true)}
      />

      <CandidatesMoreFiltersPanel
        open={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        value={moreFilters}
        onApply={(next) => {
          setMoreFilters(next)
          if (next.source) setSource(next.source)
          if (next.tag) setTag(next.tag)
          setPage(1)
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#2D2061]">
          <span className="font-bold tabular-nums">{totalFound}</span>{' '}
          Candidates found
        </p>
        <ScopeToggle value={scope} onChange={(next) => {
          setScope(next)
          setPage(1)
        }} />
      </div>

      {showBulkActions ? (
        <BulkActionsBar
          selectedCount={selectedCount}
          entityLabel="Candidates"
          actions={getCandidateBulkActions()}
          onAction={handleBulkAction}
          onClear={clearSelection}
          selectAll={{
            checked: allPageSelected,
            indeterminate: somePageSelected,
            label: 'Select All',
            onChange: toggleAll,
          }}
          className="border-[#e0dde8] bg-[#F2F1F6] shadow-none"
        />
      ) : null}

      <DataTable
        minWidthClassName="min-w-[64rem]"
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
          {pageRows.map((candidate) => (
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
              {visibleColumns.map((column) =>
                renderCell(candidate, column.id),
              )}
              <DataTableTd className="pr-1">
                <ThreeDotsMenu
                  triggerLabel={`Actions for ${candidate.name}`}
                  side="left"
                  items={getApplicantRowMenuItems()}
                />
              </DataTableTd>
            </DataTableRow>
          ))}

          {pageRows.length === 0 ? (
            <DataTableEmpty colSpan={colSpan}>
              No candidates match the current filters.
            </DataTableEmpty>
          ) : null}
        </DataTableBody>
      </DataTable>

      <ConfigureColumnsPanel
        open={columnsOpen}
        onClose={() => setColumnsOpen(false)}
        columns={columns}
        onApply={setColumns}
      />
    </PageContainer>
  )
}

function ScopeToggle({
  value,
  onChange,
}: {
  value: CandidateScope
  onChange: (value: CandidateScope) => void
}) {
  const options: Array<{ value: CandidateScope; label: string }> = [
    { value: 'my', label: 'My Candidates' },
    { value: 'all', label: 'All Candidates' },
  ]

  return (
    <div
      role="group"
      aria-label="Candidate scope"
      className="inline-flex rounded-full border border-[#e0ddea] bg-white p-0.5 shadow-[0_1px_2px_rgba(45,32,97,0.04)]"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
              active
                ? 'bg-[#2D2061] text-white'
                : 'text-[#2D2061]/70 hover:text-[#2D2061]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
