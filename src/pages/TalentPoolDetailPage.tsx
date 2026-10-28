import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  GraduationCap,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserPlus,
  UserRound,
} from 'lucide-react'
import { AddFetchCandidatePanel } from '../components/applications/AddFetchCandidatePanel'
import { PipelineFunnel } from '../components/applications/PipelineFunnel'
import { getApplicantRowMenuItems } from '../components/applications/applicantRowActions'
import { PageContainer, PageHeader } from '../components/layout'
import { CreateCampaignFlow } from '../components/talent-crm/CreateCampaignFlow'
import { TalentPoolCandidatesFiltersPanel } from '../components/talent-crm/TalentPoolCandidatesFiltersPanel'
import { candidateProfilePath } from '../data/candidateProfile'
import {
  formatOwners,
  formatTalentMetric,
  getTalentPoolById,
} from '../data/talentCrm'
import {
  countTalentPoolCandidateFilters,
  emptyTalentPoolCandidateFilters,
  filterTalentPoolCandidates,
  TALENT_POOL_CANDIDATES,
  TALENT_POOL_PIPELINE,
  TALENT_POOL_STAGE_LABEL,
  type TalentPoolCandidate,
  type TalentPoolCandidateBadge,
  type TalentPoolCandidateFilters,
  type TalentPoolCandidateStage,
} from '../data/talentPoolDetail'
import {
  Button,
  ConfigureColumnsPanel,
  DataTable,
  DataTableActionsHeader,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTablePaginationBar,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  getVisibleTableColumns,
  Pagination,
  ThreeDotsMenu,
  type TableColumnConfig,
} from '../components/ui'

type CandidateColumnId =
  | 'name'
  | 'email'
  | 'stage'
  | 'experience'
  | 'location'
  | 'nationality'
  | 'updated'
  | 'badges'
  | 'source'

const DEFAULT_COLUMNS: Array<TableColumnConfig & { id: CandidateColumnId }> = [
  { id: 'name', label: 'Name', visible: true },
  { id: 'email', label: 'Email', visible: true },
  { id: 'stage', label: 'Stage', visible: true },
  { id: 'experience', label: 'Experience', visible: true },
  { id: 'location', label: 'Location', visible: true },
  { id: 'nationality', label: 'Nationality', visible: true },
  { id: 'updated', label: 'Updated', visible: true },
  { id: 'badges', label: 'Badges', visible: true },
  { id: 'source', label: 'Source', visible: true },
]

const LIST_PATH = '/talent-crm/talent-pool'

/**
 * Talent Pool details — pipeline, search/filter, and candidates table.
 */
export function TalentPoolDetailPage() {
  const { poolId = '' } = useParams()
  const pool = getTalentPoolById(poolId)

  const [activeStage, setActiveStage] =
    useState<TalentPoolCandidateStage>('lead')
  const [query, setQuery] = useState('')
  const [addCandidateOpen, setAddCandidateOpen] = useState(false)
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [filters, setFilters] = useState<TalentPoolCandidateFilters>(
    emptyTalentPoolCandidateFilters,
  )
  const [columns, setColumns] = useState<TableColumnConfig[]>(DEFAULT_COLUMNS)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const sourceOptions = useMemo(
    () =>
      [...new Set(TALENT_POOL_CANDIDATES.map((row) => row.source))].sort(),
    [],
  )
  const nationalityOptions = useMemo(
    () =>
      [...new Set(TALENT_POOL_CANDIDATES.map((row) => row.nationality))].sort(),
    [],
  )

  const filtered = useMemo(
    () =>
      filterTalentPoolCandidates(
        TALENT_POOL_CANDIDATES,
        activeStage,
        query,
        filters,
      ),
    [activeStage, query, filters],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const visibleColumns = useMemo(
    () => getVisibleTableColumns(columns),
    [columns],
  )
  const colSpan = 2 + visibleColumns.length
  const filterCount = countTalentPoolCandidateFilters(filters)

  const pageIds = pageRows.map((row) => row.id)
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected[id])

  if (!pool) {
    return <Navigate to={LIST_PATH} replace />
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

  function renderCell(row: TalentPoolCandidate, columnId: CandidateColumnId) {
    switch (columnId) {
      case 'name':
        return (
          <DataTableTd key={columnId}>
            <Link
              to={candidateProfilePath(row.id, poolId)}
              className="font-semibold text-[#2D2061] hover:underline"
            >
              {row.name}
            </Link>
          </DataTableTd>
        )
      case 'email':
        return <DataTableTd key={columnId}>{row.email}</DataTableTd>
      case 'stage':
        return (
          <DataTableTd key={columnId}>
            {TALENT_POOL_STAGE_LABEL[row.stage]}
          </DataTableTd>
        )
      case 'experience':
        return <DataTableTd key={columnId}>{row.experience}</DataTableTd>
      case 'location':
        return <DataTableTd key={columnId}>{row.location}</DataTableTd>
      case 'nationality':
        return <DataTableTd key={columnId}>{row.nationality}</DataTableTd>
      case 'updated':
        return <DataTableTd key={columnId}>{row.updatedOn}</DataTableTd>
      case 'badges':
        return (
          <DataTableTd key={columnId}>
            <div className="flex items-center gap-1">
              {row.badges.map((badge) => (
                <BadgeIcon key={badge} badge={badge} />
              ))}
            </div>
          </DataTableTd>
        )
      case 'source':
        return <DataTableTd key={columnId}>{row.source}</DataTableTd>
      default: {
        const exhaustive: never = columnId
        return <DataTableTd key={exhaustive}>—</DataTableTd>
      }
    }
  }

  return (
    <PageContainer contentClassName="gap-5">
      <div className="flex flex-col gap-3">
        <Link
          to={LIST_PATH}
          className="inline-flex w-fit items-center gap-1 text-[13px] font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
        >
          <ArrowLeft
            className="size-3.5 shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          Back to Pool List
        </Link>

        <PageHeader
          title={pool.name}
          subtitle={<span className="sr-only">Talent pool details</span>}
          actions={
            <>
              <Button
                type="button"
                onClick={() => setCreateCampaignOpen(true)}
                className="!h-10 w-full shrink-0 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52] sm:w-auto"
              >
                <Sparkles className="size-4" strokeWidth={2} aria-hidden="true" />
                Create Campaign
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddCandidateOpen(true)}
                className="!h-10 w-full shrink-0 !rounded-md border-[#2D2061]/30 bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb] sm:w-auto"
              >
                <UserPlus className="size-4" strokeWidth={2} aria-hidden="true" />
                Add candidate
              </Button>
            </>
          }
        />

        <div className="flex flex-wrap gap-2.5">
          <MetaChip
            label="Owner(s)"
            value={formatOwners(pool.owners)}
          />
          <MetaChip
            label="No. of Candidates"
            value={formatTalentMetric(pool.candidateCount)}
          />
          <MetaChip label="Created On" value={pool.createdOn} />
        </div>
      </div>

      <PipelineFunnel
        aria-label="Talent pool pipeline"
        stages={TALENT_POOL_PIPELINE}
        activeId={activeStage}
        onChange={(id) => {
          setActiveStage(id as TalentPoolCandidateStage)
          setPage(1)
        }}
      />

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
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Type here to search"
            aria-label="Search talent pool candidates"
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
          Filter
          {filterCount > 0 ? (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#2D2061] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
              {filterCount}
            </span>
          ) : null}
        </button>
      </div>

      <TalentPoolCandidatesFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        sourceOptions={sourceOptions}
        nationalityOptions={nationalityOptions}
        onApply={(next) => {
          setFilters(next)
          setPage(1)
        }}
      />

      <DataTable
        footer={
          <DataTablePaginationBar
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(next) => {
              setRowsPerPage(next)
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
              onChange={(event) => toggleAll(event.target.checked)}
              aria-label="Select all candidates on this page"
              className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
            />
          </DataTableTh>
          {visibleColumns.map((column) => (
            <DataTableTh key={column.id}>{column.label}</DataTableTh>
          ))}
          <DataTableActionsHeader
            onSettingsClick={() => setColumnsOpen(true)}
          />
        </DataTableHead>
        <DataTableBody>
          {pageRows.map((row) => (
            <DataTableRow key={row.id}>
              <DataTableTd checkbox>
                <input
                  type="checkbox"
                  checked={Boolean(selected[row.id])}
                  onChange={() => toggleOne(row.id)}
                  aria-label={`Select ${row.name}`}
                  className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                />
              </DataTableTd>
              {visibleColumns.map((column) =>
                renderCell(row, column.id as CandidateColumnId),
              )}
              <DataTableTd className="pr-1">
                <ThreeDotsMenu
                  triggerLabel={`Actions for ${row.name}`}
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

      <AddFetchCandidatePanel
        open={addCandidateOpen}
        onClose={() => setAddCandidateOpen(false)}
        job={{
          id: pool.id,
          code: pool.id.toUpperCase(),
          title: pool.name,
        }}
      />

      <CreateCampaignFlow
        open={createCampaignOpen}
        onClose={() => setCreateCampaignOpen(false)}
        initialTalentPoolName={pool.name}
      />
    </PageContainer>
  )
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex min-w-0 items-center gap-2 rounded-lg bg-[#F5F4F8] px-3 py-2">
      <span className="text-[11px] font-medium text-[#8B8B9E]">{label}:</span>
      <span className="truncate text-[13px] font-semibold text-[#2D2061]">
        {value}
      </span>
    </div>
  )
}

function BadgeIcon({ badge }: { badge: TalentPoolCandidateBadge }) {
  switch (badge) {
    case 'verified':
      return (
        <span
          title="Verified"
          className="inline-flex size-6 items-center justify-center rounded-full bg-[#E7F8ED] text-[#15803D]"
        >
          <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
        </span>
      )
    case 'star':
      return (
        <span
          title="Featured"
          className="inline-flex size-6 items-center justify-center rounded-full bg-[#EDE8F8] text-[#5B4B9E]"
        >
          <Star className="size-3.5" strokeWidth={2} aria-hidden="true" />
        </span>
      )
    case 'graduate':
      return (
        <span
          title="Education"
          className="inline-flex size-6 items-center justify-center rounded-full bg-[#E3F0FF] text-[#1A6FD0]"
        >
          <GraduationCap
            className="size-3.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
      )
    case 'profile':
      return (
        <span
          title="Profile"
          className="inline-flex size-6 items-center justify-center rounded-full bg-[#F0ECF8] text-[#7B6BA8]"
        >
          <UserRound className="size-3.5" strokeWidth={2} aria-hidden="true" />
        </span>
      )
    default: {
      const exhaustive: never = badge
      return exhaustive
    }
  }
}
