import { useMemo, useState } from 'react'
import { PageContainer, PageHeader } from '../components/layout'
import { JeevesFiltersBar } from '../components/jeeves/JeevesFiltersBar'
import { JeevesMoreFiltersPanel } from '../components/jeeves/JeevesMoreFiltersPanel'
import {
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
  SegmentedControl,
  ThreeDotsMenu,
  toast,
  type TableColumnConfig,
  type ThreeDotsMenuItem,
} from '../components/ui'
import {
  JEEVES_HIDING_OPTIONS,
  JEEVES_TAG_OPTIONS,
  emptyJeevesMoreFilters,
  getJeevesRecords,
  type JeevesMoreFilters,
  type JeevesRecord,
  type JeevesTab,
} from '../data/jeevesAi'

const DEFAULT_COLUMNS: TableColumnConfig[] = [
  { id: 'name', label: 'Candidate Name', visible: true, required: true },
  { id: 'email', label: 'Email', visible: true },
  { id: 'jobReqId', label: 'Job Req ID', visible: true },
  { id: 'canId', label: 'Can ID', visible: true },
  { id: 'jobTitle', label: 'Job Title', visible: true },
  { id: 'experience', label: 'Experience', visible: true },
  { id: 'currentCity', label: 'Current City', visible: true },
  { id: 'currentCountry', label: 'Current Country', visible: true },
  { id: 'relocation', label: 'Relocation', visible: true },
  { id: 'preferredLocation', label: 'Preferred Location', visible: true },
  { id: 'noticePeriod', label: 'Notice Period', visible: true },
  { id: 'compensation', label: 'Compensation', visible: true },
]

type SortKey =
  | 'name'
  | 'email'
  | 'jobReqId'
  | 'canId'
  | 'jobTitle'
  | 'experience'
  | 'currentCity'
  | 'currentCountry'
  | 'relocation'
  | 'preferredLocation'
  | 'noticePeriod'
  | 'compensation'

type SortDir = 'asc' | 'desc'

const ROW_MENU: ThreeDotsMenuItem[] = [
  {
    id: 'view',
    label: 'View profile',
    onSelect: () =>
      toast.success('Opening candidate profile.', { title: 'Jeeves AI' }),
  },
  {
    id: 'message',
    label: 'Send message',
    onSelect: () =>
      toast.success('Message composer opened.', { title: 'Jeeves AI' }),
  },
  {
    id: 'hide',
    label: 'Hide candidate',
    onSelect: () =>
      toast.success('Candidate hidden from this view.', { title: 'Jeeves AI' }),
  },
]

/**
 * Jeeves AI (Chatbot) — applicants / recommendations table per design.
 */
export function JeevesAiPage() {
  const allRecords = useMemo(() => getJeevesRecords(), [])

  const [tab, setTab] = useState<JeevesTab>('applicants')
  const [lastUpdatedOn, setLastUpdatedOn] = useState('')
  const [tag, setTag] = useState('')
  const [candidateHiding, setCandidateHiding] = useState('Show all')
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [moreFilters, setMoreFilters] = useState<JeevesMoreFilters>(
    emptyJeevesMoreFilters,
  )
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const jobTitleOptions = useMemo(
    () => [...new Set(allRecords.map((r) => r.jobTitle))].sort(),
    [allRecords],
  )
  const countryOptions = useMemo(
    () => [...new Set(allRecords.map((r) => r.currentCountry))].sort(),
    [allRecords],
  )
  const cityOptions = useMemo(
    () => [...new Set(allRecords.map((r) => r.currentCity))].sort(),
    [allRecords],
  )

  const tabCounts = useMemo(() => {
    const applicants = allRecords.filter((r) => r.tab === 'applicants').length
    const recommendations = allRecords.filter(
      (r) => r.tab === 'recommendations',
    ).length
    return { applicants, recommendations }
  }, [allRecords])

  const filtered = useMemo(() => {
    return allRecords.filter((record) => {
      if (record.tab !== tab) return false
      if (lastUpdatedOn && record.lastUpdatedOn !== lastUpdatedOn) return false
      if (tag && !record.tags.includes(tag)) return false
      if (candidateHiding === 'Hide shortlisted' && record.tags.includes('Shortlisted')) {
        return false
      }
      if (candidateHiding === 'Hide rejected' && record.tags.includes('Follow-up')) {
        return false
      }
      if (candidateHiding === 'Hide contacted' && record.hidden) return false
      if (moreFilters.jobTitle && record.jobTitle !== moreFilters.jobTitle) {
        return false
      }
      if (moreFilters.country && record.currentCountry !== moreFilters.country) {
        return false
      }
      if (moreFilters.city && record.currentCity !== moreFilters.city) {
        return false
      }
      if (moreFilters.relocation && record.relocation !== moreFilters.relocation) {
        return false
      }
      if (
        moreFilters.preferredLocation &&
        record.preferredLocation !== moreFilters.preferredLocation
      ) {
        return false
      }
      return true
    })
  }, [
    allRecords,
    tab,
    lastUpdatedOn,
    tag,
    candidateHiding,
    moreFilters,
  ])

  const sorted = useMemo(() => {
    const rows = [...filtered]
    rows.sort((a, b) => {
      const av = String(a[sortKey] ?? '')
      const bv = String(b[sortKey] ?? '')
      const cmp = av.localeCompare(bv, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = sorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const visibleColumns = getVisibleTableColumns(columns)
  const colSpan = visibleColumns.length + 2

  const selectedCount = Object.values(selected).filter(Boolean).length
  const allPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selected[r.id])
  const somePageSelected =
    pageRows.some((r) => selected[r.id]) && !allPageSelected

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function toggleAll(checked: boolean) {
    if (!checked) {
      setSelected((current) => {
        const next = { ...current }
        pageRows.forEach((r) => {
          delete next[r.id]
        })
        return next
      })
      return
    }
    setSelected((current) => ({
      ...current,
      ...Object.fromEntries(pageRows.map((r) => [r.id, true])),
    }))
  }

  function toggleOne(id: string) {
    setSelected((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  function renderCell(record: JeevesRecord, columnId: string) {
    switch (columnId) {
      case 'name':
        return (
          <DataTableTd key={columnId} strong>
            {record.name}
          </DataTableTd>
        )
      case 'email':
        return <DataTableTd key={columnId}>{record.email}</DataTableTd>
      case 'jobReqId':
        return <DataTableTd key={columnId}>{record.jobReqId}</DataTableTd>
      case 'canId':
        return <DataTableTd key={columnId}>{record.canId}</DataTableTd>
      case 'jobTitle':
        return <DataTableTd key={columnId}>{record.jobTitle}</DataTableTd>
      case 'experience':
        return <DataTableTd key={columnId}>{record.experience}</DataTableTd>
      case 'currentCity':
        return <DataTableTd key={columnId}>{record.currentCity}</DataTableTd>
      case 'currentCountry':
        return <DataTableTd key={columnId}>{record.currentCountry}</DataTableTd>
      case 'relocation':
        return <DataTableTd key={columnId}>{record.relocation}</DataTableTd>
      case 'preferredLocation':
        return (
          <DataTableTd key={columnId}>{record.preferredLocation}</DataTableTd>
        )
      case 'noticePeriod':
        return <DataTableTd key={columnId}>{record.noticePeriod}</DataTableTd>
      case 'compensation':
        return <DataTableTd key={columnId}>{record.compensation}</DataTableTd>
      default:
        return <DataTableTd key={columnId}>—</DataTableTd>
    }
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Jeeves AI (Chatbot)"
        subtitle="Track application rates, click-through metrics, and candidate quality in real time to continuously improve your listings."
      />

      <JeevesFiltersBar
        lastUpdatedOn={lastUpdatedOn}
        onLastUpdatedOnChange={(next) => {
          setLastUpdatedOn(next)
          setPage(1)
        }}
        tag={tag}
        tagOptions={JEEVES_TAG_OPTIONS}
        onTagChange={(next) => {
          setTag(next)
          setPage(1)
        }}
        candidateHiding={candidateHiding}
        hidingOptions={JEEVES_HIDING_OPTIONS}
        onCandidateHidingChange={(next) => {
          setCandidateHiding(next)
          setPage(1)
        }}
        onMoreFilters={() => setMoreFiltersOpen(true)}
      />

      <JeevesMoreFiltersPanel
        open={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        value={moreFilters}
        jobTitleOptions={jobTitleOptions}
        countryOptions={countryOptions}
        cityOptions={cityOptions}
        onApply={(next) => {
          setMoreFilters(next)
          setPage(1)
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          value={tab}
          aria-label="Applicants or recommendations"
          options={[
            {
              value: 'applicants',
              label: `Applicants (${tabCounts.applicants})`,
            },
            {
              value: 'recommendations',
              label: `Recommendations (${tabCounts.recommendations})`,
            },
          ]}
          onChange={(next) => {
            setTab(next)
            setSelected({})
            setPage(1)
          }}
          className="w-full sm:w-auto"
        />
      </div>

      {selectedCount > 0 ? (
        <BulkActionsBar
          selectedCount={selectedCount}
          entityLabel="Candidate"
          actions={[
            {
              id: 'sendMail',
              label: 'Send Mail',
            },
            {
              id: 'hide',
              label: 'Hide',
            },
          ]}
          onAction={(id) => {
            if (id === 'sendMail') {
              toast.success(`Mail ready for ${selectedCount} candidate(s).`, {
                title: 'Send Mail',
              })
            } else if (id === 'hide') {
              toast.success(`${selectedCount} candidate(s) hidden.`, {
                title: 'Hide',
              })
            }
          }}
          onClear={() => setSelected({})}
          selectAll={{
            checked: allPageSelected,
            indeterminate: somePageSelected,
            onChange: toggleAll,
          }}
          className="border-[#e0dde8] bg-[#F2F1F6] shadow-none"
        />
      ) : null}

      <DataTable
        minWidthClassName="min-w-[96rem]"
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
              aria-label="Select all on this page"
              className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
            />
          </DataTableTh>
          {visibleColumns.map((column) => (
            <DataTableSortHeader
              key={column.id}
              label={column.label}
              direction={sortKey === column.id ? sortDir : null}
              onSort={() => toggleSort(column.id as SortKey)}
            />
          ))}
          <DataTableActionsHeader
            onSettingsClick={() => setColumnsOpen(true)}
          />
        </DataTableHead>
        <DataTableBody>
          {pageRows.map((record) => (
            <DataTableRow key={record.id}>
              <DataTableTd checkbox>
                <input
                  type="checkbox"
                  checked={Boolean(selected[record.id])}
                  onChange={() => toggleOne(record.id)}
                  aria-label={`Select ${record.name}`}
                  className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                />
              </DataTableTd>
              {visibleColumns.map((column) => renderCell(record, column.id))}
              <DataTableTd className="pr-1">
                <ThreeDotsMenu
                  triggerLabel={`Actions for ${record.name}`}
                  side="left"
                  items={ROW_MENU}
                />
              </DataTableTd>
            </DataTableRow>
          ))}
          {pageRows.length === 0 ? (
            <DataTableEmpty colSpan={colSpan}>
              No {tab} match the current filters.
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
