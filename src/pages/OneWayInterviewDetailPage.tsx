import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ClipboardList,
  Copy,
  Link2,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { PageContainer } from '../components/layout'
import { GetPublicLinkPanel } from '../components/interviews/GetPublicLinkPanel'
import {
  getOneWayInterviewById,
  getOneWayInviteStatusCounts,
  getOneWayInvites,
  ONE_WAY_INVITE_STATUS_META,
  type OneWayInvite,
  type OneWayInviteStatus,
} from '../data/oneWayInterviews'
import {
  Button,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTablePaginationBar,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  DataTableTh,
  Pagination,
  Select,
  SidePanel,
  StarRating,
  ThreeDotsMenu,
  toast,
  type ThreeDotsMenuItem,
} from '../components/ui'
import { cn } from '../lib/cn'

type StatusTab = 'all' | OneWayInviteStatus

type SortKey =
  | 'name'
  | 'email'
  | 'templateName'
  | 'templateType'
  | 'invitedOn'
  | 'status'
  | 'expiringOn'
  | 'completedOn'
  | 'rating'

type DetailFilters = {
  templateType: string
  status: string
}

const EMPTY_FILTERS: DetailFilters = {
  templateType: '',
  status: '',
}

const STATUS_TABS: Array<{ id: StatusTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'invited', label: 'Invited' },
  { id: 'completed', label: 'Completed' },
  { id: 'incomplete', label: 'Incomplete' },
  { id: 'expired', label: 'Expired' },
  { id: 'cancelled', label: 'Cancelled' },
]

const ICON_CLASS = { strokeWidth: 1.75 as const }

function getInviteMenuItems(status: OneWayInviteStatus): ThreeDotsMenuItem[] {
  switch (status) {
    case 'completed':
      return [
        {
          id: 'viewAssessment',
          label: 'View Assessment',
          icon: <ClipboardList {...ICON_CLASS} aria-hidden="true" />,
        },
      ]
    case 'invited':
      return [
        {
          id: 'sendReminder',
          label: 'Send Reminder',
          icon: <Bell {...ICON_CLASS} aria-hidden="true" />,
        },
        {
          id: 'copyInterviewLink',
          label: 'Copy Interview Link',
          icon: <Copy {...ICON_CLASS} aria-hidden="true" />,
        },
      ]
    case 'incomplete':
    case 'expired':
    case 'cancelled':
      return [
        {
          id: 'sendInterviewLink',
          label: 'Send Interview Link',
          icon: <Link2 {...ICON_CLASS} aria-hidden="true" />,
        },
      ]
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

/**
 * One-Way Interview detail — invitations table + Get Public Link.
 */
export function OneWayInterviewDetailPage() {
  const navigate = useNavigate()
  const { interviewId = '' } = useParams()
  const interview = useMemo(
    () => getOneWayInterviewById(interviewId),
    [interviewId],
  )

  const allInvites = useMemo(
    () => (interview ? getOneWayInvites(interview.id) : []),
    [interview],
  )

  const [statusTab, setStatusTab] = useState<StatusTab>('all')
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<DetailFilters>(EMPTY_FILTERS)
  const [publicLinkOpen, setPublicLinkOpen] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const counts = useMemo(
    () => getOneWayInviteStatusCounts(allInvites),
    [allInvites],
  )

  const filtered = useMemo(() => {
    let rows = allInvites
    if (statusTab !== 'all') {
      rows = rows.filter((r) => r.status === statusTab)
    }
    if (filters.templateType) {
      rows = rows.filter((r) => r.templateType === filters.templateType)
    }
    if (filters.status) {
      rows = rows.filter((r) => r.status === filters.status)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.templateName.toLowerCase().includes(q) ||
          r.templateType.toLowerCase().includes(q),
      )
    }
    rows = [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey)
      const bv = sortValue(b, sortKey)
      const cmp = av.localeCompare(bv, undefined, { sensitivity: 'base' })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [allInvites, statusTab, filters, search, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const pageIds = pageRows.map((r) => r.id)
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected[id])

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
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function sortDirectionFor(key: SortKey) {
    if (sortKey !== key) return null
    return sortDir
  }

  function handleRowAction(actionId: string, invite: OneWayInvite) {
    switch (actionId) {
      case 'viewAssessment':
        toast.success(`Opening assessment for ${invite.name}.`, {
          title: 'View Assessment',
        })
        return
      case 'sendReminder':
        toast.success(`Reminder sent to ${invite.email}.`, {
          title: 'Send Reminder',
        })
        return
      case 'copyInterviewLink': {
        const link =
          typeof window !== 'undefined'
            ? `${window.location.origin}/share/one-way/${interviewId}/invite/${invite.id}`
            : `https://share.example.com/${invite.id}`
        void navigator.clipboard?.writeText(link).catch(() => undefined)
        toast.success('Interview link copied to clipboard.', {
          title: 'Copy Interview Link',
        })
        return
      }
      case 'sendInterviewLink':
        toast.success(`Interview link sent to ${invite.email}.`, {
          title: 'Send Interview Link',
        })
        return
      default:
        return
    }
  }

  if (!interview) {
    return (
      <PageContainer contentClassName="gap-4">
        <button
          type="button"
          onClick={() => navigate('/e2e-interviews/one-way')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D2061] hover:underline"
        >
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
          Back to Interviews
        </button>
        <div className="rounded-xl border border-dashed border-[#E0DDEA] bg-white px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#2D2061]">
            Interview not found
          </p>
          <p className="mt-1 text-sm text-[#8B8B9E]">
            This one-way interview may have been removed.
          </p>
        </div>
      </PageContainer>
    )
  }

  const publicUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/share/one-way/${interview.id}`
      : `https://share.example.com/ht`

  const isCompletedTab = statusTab === 'completed'

  const defaultColumns = [
    ['name', 'Name'],
    ['email', 'Email'],
    ['templateName', 'Template Name'],
    ['templateType', 'Template Type'],
    ['invitedOn', 'Invited On'],
    ['status', 'Status'],
    ['expiringOn', 'Expiring On'],
  ] as const

  const completedColumns = [
    ['name', 'Name'],
    ['email', 'Email'],
    ['templateName', 'Template Name'],
    ['templateType', 'Template Type'],
    ['invitedOn', 'Invited On'],
    ['status', 'Status'],
    ['completedOn', 'Completed On'],
    ['rating', 'Rating'],
  ] as const

  const tableColumns = isCompletedTab ? completedColumns : defaultColumns
  const colSpan = 2 + tableColumns.length + (isCompletedTab ? 1 : 1)

  return (
    <PageContainer contentClassName="gap-5">
      <button
        type="button"
        onClick={() => navigate('/e2e-interviews/one-way')}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
        Back to Interviews
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h1 className="text-[1.375rem] font-bold leading-tight tracking-tight text-[#2D2061] sm:text-[1.5rem]">
          Interview for {interview.title}
        </h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPublicLinkOpen(true)}
            className="!h-10 !rounded-md border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            Get Public Link
          </Button>
          <Button
            type="button"
            onClick={() =>
              toast.success('Invite flow will open here.', {
                title: 'Invite Candidates',
              })
            }
            className="!h-10 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Invite Candidates
          </Button>
        </div>
      </div>

      {/* Status tabs — full-width equal segments */}
      <div
        className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2.5"
        role="tablist"
        aria-label="Invitation status"
      >
        {STATUS_TABS.map((tab) => {
          const active = statusTab === tab.id
          const count = String(counts[tab.id]).padStart(2, '0')
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setStatusTab(tab.id)
                setPage(1)
                setSelected({})
              }}
              className={cn(
                'inline-flex h-10 w-full items-center justify-center rounded-md border px-2 text-sm font-semibold transition-colors sm:px-3',
                active
                  ? 'border-[#2D2061] bg-[#2D2061] text-white'
                  : 'border-[#E0DDEA] bg-white text-[#2D2061] hover:bg-[#f7f6fb]',
              )}
            >
              {tab.label}({count})
            </button>
          )
        })}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
            strokeWidth={2}
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by Template Name, Type"
            className={cn(
              'h-11 w-full rounded-md border border-[#ddd9e8] bg-white py-2 pl-10 pr-11 text-sm text-[#2D2061]',
              'placeholder:text-[#A0A0B2] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
            )}
          />
          <button
            type="button"
            aria-label="Search"
            className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#2D2061] hover:bg-[#F5F4FA]"
          >
            <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setFiltersOpen(true)}
          className="!h-11 shrink-0 !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
        >
          <SlidersHorizontal className="size-4" strokeWidth={2} aria-hidden="true" />
          Filter
        </Button>
      </div>

      <DataTable
        minWidthClassName={
          isCompletedTab ? 'min-w-[72rem] lg:min-w-[80rem]' : 'min-w-[64rem]'
        }
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
          {tableColumns.map(([key, label]) => (
            <DataTableSortHeader
              key={key}
              label={label}
              direction={sortDirectionFor(key)}
              onSort={() => handleSort(key)}
            />
          ))}
          {isCompletedTab ? (
            <DataTableSortHeader
              label="Assessment"
              sortable={false}
            />
          ) : (
            <DataTableTh className="w-12 text-center">
              <span className="sr-only">Actions</span>
            </DataTableTh>
          )}
        </DataTableHead>
        <DataTableBody>
          {pageRows.length === 0 ? (
            <DataTableEmpty colSpan={colSpan}>
              No invitations match the current filters.
            </DataTableEmpty>
          ) : (
            pageRows.map((invite, index) => (
              <DataTableRow
                key={invite.id}
                className={index % 2 === 1 ? 'bg-[#FAFAFC]' : undefined}
              >
                <DataTableTd checkbox>
                  <input
                    type="checkbox"
                    checked={Boolean(selected[invite.id])}
                    onChange={() => toggleOne(invite.id)}
                    aria-label={`Select ${invite.name}`}
                    className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                  />
                </DataTableTd>
                <DataTableTd strong>{invite.name}</DataTableTd>
                <DataTableTd muted>{invite.email}</DataTableTd>
                <DataTableTd>{invite.templateName}</DataTableTd>
                <DataTableTd>{invite.templateType}</DataTableTd>
                <DataTableTd>{invite.invitedOn}</DataTableTd>
                <DataTableTd>
                  <span
                    className={cn(
                      'text-[13px] font-medium',
                      ONE_WAY_INVITE_STATUS_META[invite.status].className,
                    )}
                  >
                    {ONE_WAY_INVITE_STATUS_META[invite.status].label}
                  </span>
                </DataTableTd>
                {isCompletedTab ? (
                  <>
                    <DataTableTd>
                      {invite.completedOn ?? '—'}
                    </DataTableTd>
                    <DataTableTd>
                      <StarRating
                        value={invite.rating ?? 0}
                        size="md"
                        aria-label={`Rating ${invite.rating ?? 0} of 5`}
                      />
                    </DataTableTd>
                    <DataTableTd>
                      <button
                        type="button"
                        onClick={() =>
                          handleRowAction('viewAssessment', invite)
                        }
                        className="text-[13px] font-semibold text-[#5B4B9E] transition-colors hover:text-[#2D2061] hover:underline"
                      >
                        View Assessment
                      </button>
                    </DataTableTd>
                  </>
                ) : (
                  <>
                    <DataTableTd>{invite.expiringOn}</DataTableTd>
                    <DataTableTd className="text-center">
                      <ThreeDotsMenu
                        triggerLabel={`Actions for ${invite.name}`}
                        side="left"
                        items={getInviteMenuItems(invite.status)}
                        onItemSelect={(id) => handleRowAction(id, invite)}
                      />
                    </DataTableTd>
                  </>
                )}
              </DataTableRow>
            ))
          )}
        </DataTableBody>
      </DataTable>

      <InviteFilterPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={(next) => {
          setFilters(next)
          setPage(1)
        }}
      />

      <GetPublicLinkPanel
        open={publicLinkOpen}
        onClose={() => setPublicLinkOpen(false)}
        interviewTitle={interview.title}
        publicUrl={publicUrl}
      />
    </PageContainer>
  )
}

function sortValue(invite: OneWayInvite, key: SortKey): string {
  switch (key) {
    case 'name':
      return invite.name
    case 'email':
      return invite.email
    case 'templateName':
      return invite.templateName
    case 'templateType':
      return invite.templateType
    case 'invitedOn':
      return invite.invitedOn
    case 'status':
      return ONE_WAY_INVITE_STATUS_META[invite.status].label
    case 'expiringOn':
      return invite.expiringOn
    case 'completedOn':
      return invite.completedOn ?? ''
    case 'rating':
      return String(invite.rating ?? 0)
    default: {
      const _exhaustive: never = key
      return _exhaustive
    }
  }
}

function InviteFilterPanel({
  open,
  onClose,
  value,
  onApply,
}: {
  open: boolean
  onClose: () => void
  value: DetailFilters
  onApply: (value: DetailFilters) => void
}) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Filter"
      widthClassName="w-full max-w-[28rem]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDraft(EMPTY_FILTERS)}
            className="!h-10 !rounded-md border-[#d5d2e2] text-[#2D2061]"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
            className="!h-10 !rounded-md !bg-[#2D2061] text-white hover:!bg-[#241a52]"
          >
            Apply
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Template Type"
          options={['Default', 'Resend']}
          value={draft.templateType}
          placeholder="Select type"
          onChange={(e) =>
            setDraft((c) => ({ ...c, templateType: e.target.value }))
          }
          className="bg-white"
        />
        <Select
          label="Status"
          options={[
            { value: 'invited', label: 'Invited' },
            { value: 'completed', label: 'Completed' },
            { value: 'incomplete', label: 'Incomplete' },
            { value: 'expired', label: 'Expired' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          value={draft.status}
          placeholder="Select status"
          onChange={(e) => setDraft((c) => ({ ...c, status: e.target.value }))}
          className="bg-white"
        />
      </div>
    </SidePanel>
  )
}
