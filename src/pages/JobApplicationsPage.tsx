import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Circle,
  Share2,
  SquarePen,
  UserPlus,
  X,
} from 'lucide-react'
import { PageContainer } from '../components/layout'
import {
  APPLICANT_STATUS_META,
  APPLICANT_STATUS_OPTIONS,
  SOURCE_OPTIONS,
  getApplicantsForJob,
  getJobActivityItems,
  getJobByCode,
  getPipelineStages,
  type Applicant,
  type ApplicantStatus,
  type PipelineStageId,
} from '../data/applications'
import {
  Button,
  BulkActionsBar,
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
  ShareJobPopover,
  ThreeDotsMenu,
  type TableColumnConfig,
} from '../components/ui'

import { PipelineFunnel } from '../components/applications/PipelineFunnel'
import { ApplicationFiltersBar } from '../components/applications/ApplicationFiltersBar'
import {
  ApplicationMoreFiltersPanel,
  emptyApplicationMoreFilters,
  matchesApplicationMoreFilters,
  type ApplicationMoreFilters,
} from '../components/applications/ApplicationMoreFiltersPanel'
import {
  getApplicantBulkActions,
  getApplicantRowMenuItems,
} from '../components/applications/applicantRowActions'

const DEFAULT_APPLICATION_COLUMNS: TableColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true, required: true },
  { id: 'email', label: 'Email', visible: true },
  { id: 'experience', label: 'Experience', visible: true },
  { id: 'location', label: 'Location', visible: true },
  { id: 'cvRelevancy', label: 'CV Relevancy', visible: true },
  { id: 'nationality', label: 'Nationality', visible: true },
  { id: 'suitability', label: 'Suitability', visible: true },
  { id: 'updatedOn', label: 'Updated On', visible: true },
  { id: 'age', label: 'Age', visible: true },
  { id: 'status', label: 'Status', visible: true },
]

export function JobApplicationsPage() {
  const navigate = useNavigate()
  const { jobCode = '' } = useParams()
  const job = getJobByCode(jobCode)

  const pipeline = useMemo(
    () => (job ? getPipelineStages(job) : []),
    [job],
  )
  const allApplicants = useMemo(
    () => (job ? getApplicantsForJob(job.code) : []),
    [job],
  )
  const activityItems = useMemo(() => getJobActivityItems(), [])

  const [activeStage, setActiveStage] = useState<PipelineStageId>(
    'clientEndorsement',
  )
  const [source, setSource] = useState('')
  const [cvRelevancy, setCvRelevancy] = useState(0)
  const [suitability, setSuitability] = useState<[number, number]>([0, 95])
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [moreFilters, setMoreFilters] = useState<ApplicationMoreFilters>(
    emptyApplicationMoreFilters,
  )
  const [shareOpen, setShareOpen] = useState(false)
  const shareAnchorRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState<TableColumnConfig[]>(
    DEFAULT_APPLICATION_COLUMNS,
  )
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [statuses, setStatuses] = useState<Record<string, ApplicantStatus>>({})
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filtered = useMemo(() => {
    const barSource = source || moreFilters.source
    return allApplicants.filter((applicant) => {
      if (barSource && applicant.source !== barSource) return false
      if (cvRelevancy > 0 && applicant.cvRelevancy < cvRelevancy) return false
      if (
        applicant.suitability < suitability[0] ||
        applicant.suitability > suitability[1]
      ) {
        return false
      }
      const resolvedStatus = statuses[applicant.id] ?? applicant.status
      return matchesApplicationMoreFilters(
        applicant,
        {
          ...moreFilters,
          // Source handled with bar above so skip double-filter inside helper
          source: '',
        },
        resolvedStatus,
      )
    })
  }, [
    allApplicants,
    source,
    cvRelevancy,
    suitability,
    moreFilters,
    statuses,
  ])

  const stageScoped = useMemo(() => {
    const matched = filtered.filter((a) => a.stage === activeStage)
    return matched.length > 0 ? matched : filtered
  }, [filtered, activeStage])

  const totalPages = Math.max(1, Math.ceil(stageScoped.length / rowsPerPage))
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
  /** Bulk bar when every row on the current page is selected */
  const showBulkActions = allPageSelected && pageIds.length > 0

  function getStatus(applicant: Applicant): ApplicantStatus {
    return statuses[applicant.id] ?? applicant.status
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

  function handleBulkAction(actionId: string) {
    console.info('applicant bulk action', actionId, selectedIds)
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }

  const visibleColumns = useMemo(
    () => getVisibleTableColumns(columns),
    [columns],
  )
  const colSpan = 2 + visibleColumns.length

  function renderHeader(column: TableColumnConfig) {
    return (
      <DataTableSortHeader key={column.id} label={column.label} />
    )
  }

  function renderCell(applicant: Applicant, columnId: string) {
    const status = getStatus(applicant)
    switch (columnId) {
      case 'name':
        return (
          <DataTableTd key={columnId} strong>
            {applicant.name}
          </DataTableTd>
        )
      case 'email':
        return <DataTableTd key={columnId}>{applicant.email}</DataTableTd>
      case 'experience':
        return (
          <DataTableTd key={columnId}>{applicant.experience}</DataTableTd>
        )
      case 'location':
        return <DataTableTd key={columnId}>{applicant.location}</DataTableTd>
      case 'cvRelevancy':
        return (
          <DataTableTd key={columnId}>
            <StarRating value={applicant.cvRelevancy} size="md" />
          </DataTableTd>
        )
      case 'nationality':
        return (
          <DataTableTd key={columnId}>{applicant.nationality}</DataTableTd>
        )
      case 'suitability':
        return (
          <DataTableTd key={columnId} className="font-semibold text-[#12B76A]">
            {applicant.suitability}%
          </DataTableTd>
        )
      case 'updatedOn':
        return <DataTableTd key={columnId}>{applicant.updatedOn}</DataTableTd>
      case 'age':
        return <DataTableTd key={columnId}>{applicant.age}</DataTableTd>
      case 'status':
        return (
          <DataTableTd key={columnId}>
            <StatusPillSelect
              value={status}
              aria-label={`Status for ${applicant.name}`}
              options={APPLICANT_STATUS_OPTIONS.map((opt) => ({
                value: opt,
                label: APPLICANT_STATUS_META[opt].label,
                className: APPLICANT_STATUS_META[opt].className,
                dotClassName: APPLICANT_STATUS_META[opt].dotClassName,
              }))}
              onChange={(next) =>
                setStatus(applicant.id, next as ApplicantStatus)
              }
            />
          </DataTableTd>
        )
      default:
        return <DataTableTd key={columnId}>—</DataTableTd>
    }
  }

  if (!job) {
    return (
      <PageContainer contentClassName="items-center justify-center">
        <p className="text-sm font-medium text-[#2D2061]">Job not found.</p>
        <Button
          type="button"
          variant="outline"
          className="mt-3"
          onClick={() => navigate('/jobs')}
        >
          Back to Jobs
        </Button>
      </PageContainer>
    )
  }

  return (
    <PageContainer contentClassName="gap-4 sm:gap-5">
      {/* Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
          >
            <ArrowLeft
              className="size-3.5 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            Back to Jobs
          </button>
          <h1 className="mt-1 text-[1.25rem] font-bold leading-tight tracking-tight text-[#2D2061] sm:text-[1.375rem] lg:text-[1.5rem]">
            {job.title} Applications
          </h1>
          <dl className="mt-2 flex flex-col gap-1 text-sm text-[#6B6B80] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-1 sm:gap-y-1">
            <div className="min-w-0">
              <dt className="inline">Job ID : </dt>
              <dd className="inline font-medium text-[#2D2061]">{job.code}</dd>
            </div>
            <span className="hidden text-[#C8C5D6] sm:inline" aria-hidden="true">
              •
            </span>
            <div className="min-w-0">
              <dt className="inline">Location : </dt>
              <dd className="inline font-medium text-[#2D2061]">{job.location}</dd>
            </div>
            <span className="hidden text-[#C8C5D6] sm:inline" aria-hidden="true">
              •
            </span>
            <div className="min-w-0">
              <dt className="inline">Skills : </dt>
              <dd className="inline font-medium text-[#2D2061]">
                Programming, Problem Solving
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:items-end">
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <div ref={shareAnchorRef} className="relative inline-flex w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-haspopup="menu"
                aria-expanded={shareOpen}
                onClick={() => setShareOpen((open) => !open)}
                className="w-full !rounded-md border-[#d5d2e2] bg-white text-[#2D2061] sm:w-auto"
              >
                <Share2 className="size-3.5" aria-hidden="true" />
                Share Job
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full !rounded-md border-[#d5d2e2] bg-white text-[#2D2061] sm:w-auto"
            >
              <UserPlus className="size-3.5" aria-hidden="true" />
              Add Candidate
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full !rounded-md border-[#d5d2e2] bg-white text-[#2D2061] sm:w-auto"
            >
              <SquarePen className="size-3.5" aria-hidden="true" />
              Edit Job
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {activityItems.map((item) => (
              <ActivityChip key={item.id} item={item} />
            ))}
          </div>
        </div>
      </header>

      <PipelineFunnel
        stages={pipeline}
        activeId={activeStage}
        onChange={(id) => {
          setActiveStage(id)
          setPage(1)
        }}
      />

      <ApplicationFiltersBar
        source={source}
        sourceOptions={SOURCE_OPTIONS}
        onSourceChange={(next) => {
          setSource(next)
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

      <ApplicationMoreFiltersPanel
        open={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        value={moreFilters}
        onApply={(next) => {
          setMoreFilters(next)
          // Keep bar Source in sync when set from the panel
          if (next.source) setSource(next.source)
          setPage(1)
        }}
      />

      {showBulkActions ? (
        <BulkActionsBar
          selectedCount={selectedCount}
          entityLabel="Candidates"
          actions={getApplicantBulkActions()}
          onAction={handleBulkAction}
          onClear={clearSelection}
          selectAll={{
            checked: allPageSelected,
            indeterminate: somePageSelected,
            label: 'Select All',
            onChange: toggleAll,
          }}
        />
      ) : null}

      {/* Shared DataTable — matches product table design for reuse */}
      <DataTable
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
              aria-label="Select all applicants on this page"
              className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
            />
          </DataTableTh>
          {visibleColumns.map(renderHeader)}
          <DataTableActionsHeader
            onSettingsClick={() => setColumnsOpen(true)}
          />
        </DataTableHead>
        <DataTableBody>
          {pageRows.map((applicant) => (
            <DataTableRow key={applicant.id}>
              <DataTableTd checkbox>
                <input
                  type="checkbox"
                  checked={Boolean(selected[applicant.id])}
                  onChange={() => toggleOne(applicant.id)}
                  aria-label={`Select ${applicant.name}`}
                  className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                />
              </DataTableTd>
              {visibleColumns.map((column) =>
                renderCell(applicant, column.id),
              )}
              <DataTableTd className="pr-1">
                <ThreeDotsMenu
                  triggerLabel={`Actions for ${applicant.name}`}
                  side="left"
                  items={getApplicantRowMenuItems()}
                />
              </DataTableTd>
            </DataTableRow>
          ))}

          {pageRows.length === 0 ? (
            <DataTableEmpty colSpan={colSpan}>
              No applicants match the current filters.
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

      <ShareJobPopover
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        anchorRef={shareAnchorRef}
        jobCode={job.code}
        jobTitle={job.title}
      />
    </PageContainer>
  )
}

function ActivityChip({
  item,
}: {
  item: ReturnType<typeof getJobActivityItems>[number]
}) {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#e4e1ee] bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(45,32,97,0.04)]">
      <StatusIcon status={item.status} />
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold leading-tight text-[#2D2061]">
          {item.label}
        </p>
        <p className="truncate text-[10px] leading-tight text-[#8B8B9E]">
          {item.timestamp}
        </p>
      </div>
    </div>
  )
}

function StatusIcon({
  status,
}: {
  status: 'done' | 'failed' | 'pending'
}) {
  if (status === 'done') {
    return (
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E9F8EF] text-[#1B9E4B]">
        <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FDECEC] text-[#E53935]">
        <X className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      </span>
    )
  }
  return (
    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F0F0F4] text-[#A0A0B2]">
      <Circle className="size-3.5" strokeWidth={2} aria-hidden="true" />
    </span>
  )
}
