import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye,
  Pencil,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { CampaignsFiltersPanel } from '../components/talent-crm/CampaignsFiltersPanel'
import { CreateCampaignFlow } from '../components/talent-crm/CreateCampaignFlow'
import { TalentCrmMetricCards } from '../components/talent-crm/TalentCrmMetricCards'
import { campaignDetailPath } from '../data/campaignDetail'
import {
  Button,
  ConfirmDeleteModal,
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
  Pagination,
  SegmentedToggle,
  StatusPillBadge,
  ThreeDotsMenu,
  toast,
  type ThreeDotsMenuItem,
} from '../components/ui'
import {
  CAMPAIGN_METRICS,
  CAMPAIGNS,
  campaignStatusPillOption,
  countCampaignFilters,
  emptyCampaignFilters,
  filterCampaigns,
  formatOwners,
  formatPaddedCount,
  type Campaign,
  type CampaignFilters,
  type CampaignScope,
} from '../data/campaigns'

const SCOPE_OPTIONS: Array<{ value: CampaignScope; label: string }> = [
  { value: 'my', label: 'My Campaigns' },
  { value: 'all', label: 'All Campaigns' },
]

const TOAST_TITLE = 'Campaigns'

const COLUMNS = [
  { id: 'name', label: 'Name' },
  { id: 'talentPool', label: 'Talent Pool' },
  { id: 'channel', label: 'Channel' },
  { id: 'owners', label: 'Owner(s)' },
  { id: 'createdOn', label: 'Created Date' },
  { id: 'frequency', label: 'Frequency' },
  { id: 'status', label: 'Status' },
] as const

type CampaignColumnId = (typeof COLUMNS)[number]['id']

/**
 * Talent CRM — Campaigns landing (metrics, search, scope, campaigns table).
 */
export function CampaignsPage() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState(CAMPAIGNS)
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<CampaignScope>('my')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<CampaignFilters>(emptyCampaignFilters)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [pendingDelete, setPendingDelete] = useState<Campaign | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(
    () => filterCampaigns(campaigns, query, scope, filters),
    [campaigns, query, scope, filters],
  )

  const filterCount = countCampaignFilters(filters)
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )
  const allPageSelected =
    pageRows.length > 0 && pageRows.every((row) => selected[row.id])
  const colSpan = 2 + COLUMNS.length

  function toggleAll(checked: boolean) {
    setSelected((prev) => {
      const next = { ...prev }
      for (const row of pageRows) {
        if (checked) next[row.id] = true
        else delete next[row.id]
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

  function rowMenuItems(campaign: Campaign): ThreeDotsMenuItem[] {
    return [
      {
        id: 'view',
        label: 'View',
        icon: <Eye strokeWidth={1.75} aria-hidden="true" />,
        onSelect: () => navigate(campaignDetailPath(campaign.id)),
      },
      {
        id: 'edit',
        label: 'Edit',
        icon: <Pencil strokeWidth={1.75} aria-hidden="true" />,
        onSelect: () =>
          toast.success(`Editing “${campaign.name}”.`, { title: TOAST_TITLE }),
      },
      {
        id: 'delete',
        label: 'Delete',
        destructive: true,
        icon: <Trash2 strokeWidth={1.75} aria-hidden="true" />,
        onSelect: () => setPendingDelete(campaign),
      },
    ]
  }

  function confirmDelete() {
    const target = pendingDelete
    if (!target) return
    setCampaigns((current) => current.filter((row) => row.id !== target.id))
    setSelected((prev) => {
      const next = { ...prev }
      delete next[target.id]
      return next
    })
    setPendingDelete(null)
    toast.success(`“${target.name}” was deleted.`, { title: TOAST_TITLE })
  }

  function renderCell(row: Campaign, columnId: CampaignColumnId) {
    switch (columnId) {
      case 'name':
        return (
          <DataTableTd key={columnId} strong>
            <Link
              to={campaignDetailPath(row.id)}
              className="text-[#2D2061] transition-colors hover:text-[#241a52] hover:underline"
            >
              {row.name}
            </Link>
          </DataTableTd>
        )
      case 'talentPool':
      case 'channel':
      case 'createdOn':
      case 'frequency':
        return <DataTableTd key={columnId}>{row[columnId]}</DataTableTd>
      case 'owners':
        return (
          <DataTableTd key={columnId}>{formatOwners(row.owners)}</DataTableTd>
        )
      case 'status':
        return (
          <DataTableTd key={columnId}>
            <StatusPillBadge option={campaignStatusPillOption(row.status)} />
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
        title="Campaigns"
        subtitle="Send targeted outreach to talent pools"
        actions={
          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="!h-10 w-full shrink-0 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52] sm:w-auto"
          >
            <Sparkles className="size-4" strokeWidth={2} aria-hidden="true" />
            Create Campaign
          </Button>
        }
      />

      <TalentCrmMetricCards metrics={CAMPAIGN_METRICS} />

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
            aria-label="Search campaigns"
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

      <CampaignsFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={(next) => {
          setFilters(next)
          setPage(1)
        }}
      />

      <CreateCampaignFlow
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#2D2061]">
          “
          <span className="font-bold tabular-nums">
            {formatPaddedCount(filtered.length)}
          </span>{' '}
          Campaigns found”
        </p>
        <SegmentedToggle
          aria-label="Campaign scope"
          value={scope}
          options={SCOPE_OPTIONS}
          onChange={(next) => {
            setScope(next)
            setPage(1)
          }}
          className="!h-auto shadow-[0_1px_2px_rgba(45,32,97,0.04)] [&_button]:h-8 [&_button]:px-3.5 [&_button]:text-xs"
        />
      </div>

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
              aria-label="Select all campaigns on this page"
              className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
            />
          </DataTableTh>
          {COLUMNS.map((column) => (
            <DataTableSortHeader key={column.id} label={column.label} />
          ))}
          <DataTableActionsHeader />
        </DataTableHead>
        <DataTableBody>
          {pageRows.map((campaign) => (
            <DataTableRow key={campaign.id}>
              <DataTableTd checkbox>
                <input
                  type="checkbox"
                  checked={Boolean(selected[campaign.id])}
                  onChange={() => toggleOne(campaign.id)}
                  aria-label={`Select ${campaign.name}`}
                  className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                />
              </DataTableTd>
              {COLUMNS.map((column) => renderCell(campaign, column.id))}
              <DataTableTd className="pr-1">
                <ThreeDotsMenu
                  triggerLabel={`Actions for ${campaign.name}`}
                  side="left"
                  items={rowMenuItems(campaign)}
                />
              </DataTableTd>
            </DataTableRow>
          ))}

          {pageRows.length === 0 ? (
            <DataTableEmpty colSpan={colSpan}>
              No campaigns match the current filters.
            </DataTableEmpty>
          ) : null}
        </DataTableBody>
      </DataTable>

      <ConfirmDeleteModal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Campaign"
        itemName={pendingDelete?.name}
      />
    </PageContainer>
  )
}
