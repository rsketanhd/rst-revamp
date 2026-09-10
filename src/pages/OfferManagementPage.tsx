import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  Button,
  ConfirmDeleteModal,
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
  Pagination,
  ThreeDotsMenu,
  toast,
  getVisibleTableColumns,
  type SortDirection,
  type TableColumnConfig,
} from '../components/ui'
import { OfferStatusBadge } from '../components/offers/OfferStatusBadge'
import { OffersFiltersPanel } from '../components/offers/OffersFiltersPanel'
import {
  OfferConfirmActionPanel,
  type OfferConfirmAction,
  type OfferConfirmPayload,
} from '../components/offers/OfferConfirmActionPanel'
import { OfferViewPanel } from '../components/offers/OfferViewPanel'
import { CreateOfferPanel } from '../components/offers/CreateOfferPanel'
import { UpdateJoiningDateModal } from '../components/offers/UpdateJoiningDateModal'
import { formatListingDate } from '../components/offers/create/offerForm'
import {
  getOfferRowMenuItems,
  type OfferRowActionId,
} from '../components/offers/offerRowActions'
import {
  INITIAL_OFFERS,
  countOffersFilters,
  emptyOffersFilters,
  filterOffers,
  formatCompensationAed,
  formatOfferStat,
  getOfferMetrics,
  type OfferMetrics,
  type OfferRecord,
  type OffersFilters,
} from '../data/offers'

type ConfirmingOffer = {
  action: OfferConfirmAction
  offer: OfferRecord
}

type SortKey =
  | 'candidateName'
  | 'email'
  | 'job'
  | 'compensationAed'
  | 'joiningDate'
  | 'expiryDate'
  | 'status'
  | 'sentOn'

const DEFAULT_OFFER_COLUMNS: Array<TableColumnConfig & { id: SortKey }> = [
  { id: 'candidateName', label: 'Candidate Name', visible: true, required: true },
  { id: 'email', label: 'Email', visible: true },
  { id: 'job', label: 'Job', visible: true },
  { id: 'compensationAed', label: 'Compensation', visible: true },
  { id: 'joiningDate', label: 'Joining Date', visible: true },
  { id: 'expiryDate', label: 'Expiry Date', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'sentOn', label: 'Sent On', visible: true },
]

const OFFER_STAT_CARDS: { label: string; key: keyof OfferMetrics }[] = [
  { label: 'Total Offers', key: 'totalOffers' },
  { label: 'Drafts', key: 'drafts' },
  { label: 'Sent / Viewed', key: 'sentViewed' },
  { label: 'Accepted / Signed', key: 'acceptedSigned' },
  { label: 'Declined / Other', key: 'declinedOther' },
]

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

/**
 * Offer Management listing — summary cards, search, filters, and offers table.
 */
export function OfferManagementPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [offers, setOffers] = useState(INITIAL_OFFERS)
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<OffersFilters>(emptyOffersFilters)
  const [sortKey, setSortKey] = useState<SortKey>('candidateName')
  const [sortDir, setSortDir] = useState<SortDirection>(null)
  const [pendingDelete, setPendingDelete] = useState<OfferRecord | null>(null)
  const [viewing, setViewing] = useState<OfferRecord | null>(null)
  const [confirming, setConfirming] = useState<ConfirmingOffer | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<OfferRecord | null>(null)
  const [updatingJoiningDate, setUpdatingJoiningDate] = useState<OfferRecord | null>(null)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [columns, setColumns] = useState<TableColumnConfig[]>(DEFAULT_OFFER_COLUMNS)
  const [columnsOpen, setColumnsOpen] = useState(false)

  useEffect(() => {
    const state = location.state as { createOffer?: boolean } | null
    if (!state?.createOffer) return
    openCreate()
    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate])

  const metrics = useMemo(() => getOfferMetrics(offers), [offers])
  const filterCount = countOffersFilters(filters)
  const jobOptions = useMemo(
    () => [...new Set(offers.map((offer) => offer.job))].sort(),
    [offers],
  )

  const rows = useMemo(() => {
    const filtered = filterOffers(offers, query, filters)
    if (!sortDir) return filtered
    const factor = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const left = sortValue(a, sortKey)
      const right = sortValue(b, sortKey)
      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * factor
      }
      return compareText(String(left), String(right)) * factor
    })
  }, [offers, query, filters, sortDir, sortKey])

  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )
  const visibleColumns = getVisibleTableColumns(columns)
  const colSpan = visibleColumns.length + 1

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir('asc')
      return
    }
    setSortDir((current) => {
      if (current === 'asc') return 'desc'
      if (current === 'desc') return null
      return 'asc'
    })
  }

  function directionFor(key: SortKey): SortDirection {
    return sortKey === key ? sortDir : null
  }

  function handleRowAction(id: OfferRowActionId, offer: OfferRecord) {
    switch (id) {
      case 'view':
        setViewing(offer)
        return
      case 'revise':
      case 'renew':
        openEdit(offer)
        return
      case 'submitApproval':
        toast.success(`“${offer.candidateName}” submitted for approval.`, {
          title: 'Offer Management',
        })
        return
      case 'duplicate':
        setOffers((current) => [
          {
            ...offer,
            id: `offer-${Date.now()}`,
            candidateName: `${offer.candidateName} (Copy)`,
            status: 'draft',
            sentOn: '',
          },
          ...current,
        ])
        toast.success(`Duplicated “${offer.candidateName}”.`, {
          title: 'Offer Management',
        })
        return
      case 'delete':
        setPendingDelete(offer)
        return
      case 'sendReminder':
        toast.success(`Reminder sent to ${offer.email}.`, {
          title: 'Offer Management',
        })
        return
      case 'withdraw':
        setConfirming({ action: 'withdraw', offer })
        return
      case 'moveToOnboarding':
        toast.success(`“${offer.candidateName}” moved to onboarding.`, {
          title: 'Offer Management',
        })
        return
      case 'updateJoiningDate':
        setUpdatingJoiningDate(offer)
        return
      case 'rescind':
        setConfirming({ action: 'rescind', offer })
        return
      default: {
        const _exhaustive: never = id
        return _exhaustive
      }
    }
  }

  function saveJoiningDate(offer: OfferRecord, joiningDateIso: string) {
    setOffers((current) =>
      current.map((item) =>
        item.id === offer.id
          ? {
              ...item,
              joiningDateIso,
              joiningDate: formatListingDate(joiningDateIso),
            }
          : item,
      ),
    )
    toast.success(
      `Updated joining date for “${offer.candidateName}”. HR has been notified.`,
      { title: 'Offer Management' },
    )
    setUpdatingJoiningDate(null)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setOffers((current) =>
      current.filter((offer) => offer.id !== pendingDelete.id),
    )
    toast.success(`Deleted “${pendingDelete.candidateName}”.`, {
      title: 'Offer Management',
    })
    setPendingDelete(null)
  }

  function confirmOfferAction(offer: OfferRecord, payload: OfferConfirmPayload) {
    if (!confirming) return
    const message = confirmOfferMessage(confirming.action, offer.candidateName)
    setOffers((current) =>
      current.map((item) =>
        item.id === offer.id ? { ...item, status: 'withdrawn' } : item,
      ),
    )
    toast.success(
      payload.notifyCandidate
        ? `${message} A notification was sent to ${offer.email}.`
        : message,
      { title: 'Offer Management' },
    )
    setConfirming(null)
  }

  function openCreate() {
    setEditingOffer(null)
    setCreateOpen(true)
  }

  function openEdit(offer: OfferRecord) {
    setViewing(null)
    setEditingOffer(offer)
    setCreateOpen(true)
  }

  function closeCreate() {
    setCreateOpen(false)
    setEditingOffer(null)
  }

  function saveOffer(offer: OfferRecord) {
    setOffers((current) => {
      const exists = current.some((item) => item.id === offer.id)
      if (exists) {
        return current.map((item) => (item.id === offer.id ? offer : item))
      }
      return [offer, ...current]
    })
    toast.success(
      editingOffer
        ? `Updated offer for “${offer.candidateName}”.`
        : `Created offer for “${offer.candidateName}”.`,
      { title: 'Offer Management' },
    )
  }

  return (
    <PageContainer>
      <PageHeader
        className="mb-5 sm:mb-6"
        title="Offer Management"
        subtitle="Create, approve, track, and send competitive employment offers with automated approvals and e-signatures."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                toast.success(
                  'Open a saved letter layout to customize branding and clauses.',
                  { title: 'Offer Letter Builder' },
                )
              }
              className="!h-10 !rounded-md border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              Offer Letter Builder
            </Button>
            <Button
              type="button"
              onClick={openCreate}
              className="!h-10 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Create Offer
            </Button>
          </>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-2.5 sm:mb-6 sm:grid-cols-2 sm:gap-3 xl:grid-cols-5">
        {OFFER_STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F7F9] px-3 py-3 shadow-[0_1px_3px_rgba(45,32,97,0.05)] sm:px-4 sm:py-3.5"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#626889] sm:text-[11px]">
              {stat.label}
            </p>
            <p className="text-[1.25rem] font-bold leading-none tabular-nums text-[#706BB0] sm:text-[1.5rem]">
              {formatOfferStat(metrics[stat.key])}
            </p>
          </div>
        ))}
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
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search"
            className="h-11 w-full rounded-lg border border-[#E0DDE8] bg-white py-2 pl-10 pr-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </div>
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
      </div>

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
          {visibleColumns.map((column) => (
            <DataTableSortHeader
              key={column.id}
              label={column.label}
              direction={directionFor(column.id as SortKey)}
              onSort={() => toggleSort(column.id as SortKey)}
            />
          ))}
          <DataTableActionsHeader
            onSettingsClick={() => setColumnsOpen(true)}
          />
        </DataTableHead>
        <DataTableBody>
          {pageRows.length === 0 ? (
            <DataTableEmpty colSpan={colSpan}>No offers found.</DataTableEmpty>
          ) : (
            pageRows.map((offer) => (
              <DataTableRow key={offer.id}>
                {visibleColumns.map((column) =>
                  renderOfferCell(offer, column.id as SortKey),
                )}
                <DataTableTd className="pr-1">
                  <ThreeDotsMenu
                    triggerLabel={`Actions for ${offer.candidateName}`}
                    side="left"
                    items={getOfferRowMenuItems(offer.status).map((item) => ({
                      ...item,
                      onSelect: () => handleRowAction(item.id, offer),
                    }))}
                  />
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
      <OffersFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        jobOptions={jobOptions}
        onApply={(next) => {
          setFilters(next)
          setPage(1)
        }}
      />

      <OfferViewPanel
        open={Boolean(viewing)}
        offer={viewing}
        onClose={() => setViewing(null)}
        onSend={(offer) =>
          toast.success(`Offer sent to ${offer.email}.`, {
            title: 'Offer Management',
          })
        }
        onEdit={openEdit}
      />
      <OfferConfirmActionPanel
        open={Boolean(confirming)}
        offer={confirming?.offer ?? null}
        action={confirming?.action ?? 'withdraw'}
        onClose={() => setConfirming(null)}
        onConfirm={confirmOfferAction}
      />
      <CreateOfferPanel
        open={createOpen}
        offer={editingOffer}
        onClose={closeCreate}
        onSave={saveOffer}
      />
      <UpdateJoiningDateModal
        open={Boolean(updatingJoiningDate)}
        offer={updatingJoiningDate}
        onClose={() => setUpdatingJoiningDate(null)}
        onSave={saveJoiningDate}
      />
      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Offer"
        itemName={pendingDelete?.candidateName}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  )
}

function renderOfferCell(offer: OfferRecord, columnId: SortKey) {
  switch (columnId) {
    case 'candidateName':
      return (
        <DataTableTd key={columnId} strong>
          {offer.candidateName}
        </DataTableTd>
      )
    case 'email':
      return (
        <DataTableTd key={columnId} muted>
          {offer.email}
        </DataTableTd>
      )
    case 'job':
      return (
        <DataTableTd key={columnId} muted>
          {offer.job}
        </DataTableTd>
      )
    case 'compensationAed':
      return (
        <DataTableTd key={columnId} muted>
          {formatCompensationAed(offer.compensationAed)}
        </DataTableTd>
      )
    case 'joiningDate':
      return (
        <DataTableTd key={columnId} muted>
          {offer.joiningDate}
        </DataTableTd>
      )
    case 'expiryDate':
      return (
        <DataTableTd key={columnId} muted>
          {offer.expiryDate}
        </DataTableTd>
      )
    case 'status':
      return (
        <DataTableTd key={columnId}>
          <OfferStatusBadge status={offer.status} />
        </DataTableTd>
      )
    case 'sentOn':
      return (
        <DataTableTd key={columnId} muted>
          {offer.sentOn || '—'}
        </DataTableTd>
      )
    default: {
      const _exhaustive: never = columnId
      return _exhaustive
    }
  }
}

function confirmOfferMessage(
  action: OfferConfirmAction,
  candidateName: string,
): string {
  switch (action) {
    case 'withdraw':
      return `Withdrew offer for “${candidateName}”.`
    case 'rescind':
      return `Rescinded offer for “${candidateName}”.`
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}

function sortValue(offer: OfferRecord, key: SortKey): string | number {
  switch (key) {
    case 'candidateName':
      return offer.candidateName
    case 'email':
      return offer.email
    case 'job':
      return offer.job
    case 'compensationAed':
      return offer.compensationAed
    case 'joiningDate':
      return offer.joiningDateIso
    case 'expiryDate':
      return offer.expiryDate
    case 'status':
      return offer.status
    case 'sentOn':
      return offer.sentOn
    default: {
      const _exhaustive: never = key
      throw new Error(`Unhandled offer sort key: ${_exhaustive}`)
    }
  }
}
