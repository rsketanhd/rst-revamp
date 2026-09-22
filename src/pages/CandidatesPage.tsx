import { useMemo, useState } from 'react'
import { Search, Send, SlidersHorizontal, Upload } from 'lucide-react'
import { cn } from '../lib/cn'
import { PageContainer, PageHeader } from '../components/layout'
import {
  countCandidateFilters,
  emptyCandidatesMoreFilters,
  getCandidates,
  PORTAL_ACCESS_META,
  portalAccessLabel,
  type Candidate,
  type CandidateScope,
  type CandidatesMoreFilters,
} from '../data/candidates'
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
  StatusPillBadge,
  ThreeDotsMenu,
  type TableColumnConfig,
} from '../components/ui'
import { getApplicantRowMenuItems } from '../components/applications/applicantRowActions'
import { CandidatesMoreFiltersPanel } from '../components/candidates/CandidatesMoreFiltersPanel'
import { ImportCandidatesPanel } from '../components/candidates/ImportCandidatesPanel'
import { ProfileCompletionCell } from '../components/candidates/ProfileCompletionCell'
import { getCandidateBulkActions } from '../components/candidates/candidateBulkActions'

type CandidateColumnId =
  | 'candidateId'
  | 'name'
  | 'email'
  | 'phone'
  | 'linkedin'
  | 'country'
  | 'city'
  | 'designation'
  | 'source'
  | 'createdBy'
  | 'skills'
  | 'experience'
  | 'profileCompleted'
  | 'portalAccess'
  | 'associatedJob'

const DEFAULT_CANDIDATE_COLUMNS: Array<
  TableColumnConfig & { id: CandidateColumnId }
> = [
  { id: 'candidateId', label: 'Candidate ID', visible: true },
  { id: 'name', label: 'Name', visible: true },
  { id: 'email', label: 'Email', visible: true },
  { id: 'phone', label: 'Phone', visible: true },
  { id: 'linkedin', label: 'LinkedIn', visible: true },
  { id: 'country', label: 'Country', visible: true },
  { id: 'city', label: 'City', visible: true },
  { id: 'designation', label: 'Designation', visible: true },
  { id: 'source', label: 'Source', visible: false },
  { id: 'createdBy', label: 'Created By', visible: false },
  { id: 'skills', label: 'Skills', visible: false },
  { id: 'experience', label: 'Experience (Total)', visible: false },
  { id: 'profileCompleted', label: 'Profile (%)', visible: true },
  { id: 'portalAccess', label: 'Candidate Portal Access', visible: true },
  { id: 'associatedJob', label: 'Associated to Job', visible: false },
]

/**
 * Candidates list — search, scope, and the design table columns.
 */
export function CandidatesPage() {
  const allCandidates = useMemo(() => getCandidates(), [])

  const [columns, setColumns] = useState<TableColumnConfig[]>(
    DEFAULT_CANDIDATE_COLUMNS,
  )
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [scope, setScope] = useState<CandidateScope>('my')
  const [query, setQuery] = useState('')
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [moreFilters, setMoreFilters] = useState<CandidatesMoreFilters>(
    emptyCandidatesMoreFilters,
  )
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return allCandidates.filter((candidate) => {
      if (scope === 'my' && !candidate.isMine) return false
      if (
        candidate.experienceYears < moreFilters.experience[0] ||
        candidate.experienceYears > moreFilters.experience[1]
      ) {
        return false
      }
      if (moreFilters.source && candidate.source !== moreFilters.source) {
        return false
      }
      if (
        moreFilters.createdBy &&
        candidate.createdBy !== moreFilters.createdBy
      ) {
        return false
      }
      if (moreFilters.skills && candidate.skills !== moreFilters.skills) {
        return false
      }
      if (moreFilters.companies) {
        const matchesCurrent =
          moreFilters.companyCurrent &&
          candidate.currentCompany === moreFilters.companies
        const matchesPast =
          moreFilters.companyPast &&
          candidate.pastCompany === moreFilters.companies
        if (!matchesCurrent && !matchesPast) return false
      }
      if (
        moreFilters.tags.length > 0 &&
        !moreFilters.tags.some((tag) => candidate.tags.includes(tag))
      ) {
        return false
      }
      if (moreFilters.job) {
        const matchesCurrent =
          moreFilters.jobCurrent && candidate.currentJob === moreFilters.job
        const matchesPast =
          moreFilters.jobPast && candidate.pastJob === moreFilters.job
        if (!matchesCurrent && !matchesPast) return false
      }
      if (
        moreFilters.applicationStatus &&
        candidate.applicationStatus !== moreFilters.applicationStatus
      ) {
        return false
      }
      if (!needle) return true
      const haystack = [
        candidate.candidateId,
        candidate.name,
        candidate.email,
        candidate.phone,
        candidate.linkedin,
        candidate.country,
        candidate.city,
        candidate.designation,
        candidate.source,
        candidate.skills,
        portalAccessLabel(candidate.portalAccess),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [allCandidates, scope, query, moreFilters])

  const totalFound = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalFound / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const pageIds = pageRows.map((row) => row.id)
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected[id])
  const somePageSelected =
    pageIds.some((id) => selected[id]) && !allPageSelected
  const selectedIds = Object.keys(selected).filter((id) => selected[id])
  const selectedCount = selectedIds.length
  const showBulkActions = selectedCount > 0
  const filterCount = countCandidateFilters(moreFilters)

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

  const visibleColumns = useMemo(
    () => getVisibleTableColumns(columns),
    [columns],
  )
  const colSpan = 2 + visibleColumns.length

  function renderCell(candidate: Candidate, columnId: CandidateColumnId) {
    switch (columnId) {
      case 'candidateId':
        return <DataTableTd key={columnId}>{candidate.candidateId}</DataTableTd>
      case 'name':
        return <DataTableTd key={columnId}>{candidate.name}</DataTableTd>
      case 'email':
        return <DataTableTd key={columnId}>{candidate.email}</DataTableTd>
      case 'phone':
        return <DataTableTd key={columnId}>{candidate.phone}</DataTableTd>
      case 'linkedin':
        return (
          <DataTableTd key={columnId}>
            <a
              href={candidate.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-medium text-[#1A6FD0] underline-offset-2 hover:underline"
            >
              {candidate.linkedin}
            </a>
          </DataTableTd>
        )
      case 'country':
        return <DataTableTd key={columnId}>{candidate.country}</DataTableTd>
      case 'city':
        return <DataTableTd key={columnId}>{candidate.city}</DataTableTd>
      case 'designation':
        return <DataTableTd key={columnId}>{candidate.designation}</DataTableTd>
      case 'source':
        return <DataTableTd key={columnId}>{candidate.source}</DataTableTd>
      case 'createdBy':
        return <DataTableTd key={columnId}>{candidate.createdBy}</DataTableTd>
      case 'skills':
        return <DataTableTd key={columnId}>{candidate.skills}</DataTableTd>
      case 'experience':
        return (
          <DataTableTd key={columnId}>{candidate.experienceYears} yrs</DataTableTd>
        )
      case 'profileCompleted':
        return (
          <DataTableTd key={columnId}>
            <ProfileCompletionCell
              percent={candidate.profileCompletion}
              incompleteFields={candidate.incompleteFields}
            />
          </DataTableTd>
        )
      case 'associatedJob':
        return <DataTableTd key={columnId}>{candidate.associatedJob}</DataTableTd>
      case 'portalAccess':
        return (
          <DataTableTd key={columnId}>
            <StatusPillBadge
              option={{
                value: candidate.portalAccess,
                label: portalAccessLabel(candidate.portalAccess),
                className: PORTAL_ACCESS_META[candidate.portalAccess].className,
                dotClassName:
                  PORTAL_ACCESS_META[candidate.portalAccess].dotClassName,
              }}
            />
          </DataTableTd>
        )
      default: {
        const exhaustive: never = columnId
        return <DataTableTd key={exhaustive}>—</DataTableTd>
      }
    }
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Candidates"
        subtitle="Monitor and optimize your job postings performance"
        actions={
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setImportOpen(true)}
            className="!h-10 w-full shrink-0 !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb] sm:w-auto"
          >
            <Upload className="size-4" strokeWidth={2} aria-hidden="true" />
            Upload Resume
          </Button>
        }
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
            aria-label="Search candidates"
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
          onClick={() => setMoreFiltersOpen(true)}
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
      </div>

      <CandidatesMoreFiltersPanel
        open={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        value={moreFilters}
        onApply={(next) => {
          setMoreFilters(next)
          setPage(1)
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#2D2061]">
          “<span className="font-bold tabular-nums">{totalFound}</span> Candidates found”
        </p>
        <ScopeToggle
          value={scope}
          onChange={(next) => {
            setScope(next)
            setPage(1)
          }}
        />
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
        minWidthClassName="min-w-[72rem]"
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
            <DataTableSortHeader
              key={column.id}
              label={
                column.id === 'portalAccess' ? 'Portal Access' : column.label
              }
              sortable={
                column.id !== 'linkedin' && column.id !== 'portalAccess'
              }
            />
          ))}
          <DataTableActionsHeader onSettingsClick={() => setColumnsOpen(true)} />
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
                renderCell(candidate, column.id as CandidateColumnId),
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

      <ImportCandidatesPanel
        open={importOpen}
        onClose={() => setImportOpen(false)}
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
