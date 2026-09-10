import { useEffect, useState, type ReactNode } from 'react'
import { CalendarDays } from 'lucide-react'
import { Button, SearchSelect, SidePanel } from '../ui'
import { cn } from '../../lib/cn'
import {
  OFFER_STATUS_META,
  OFFER_STATUS_OPTIONS,
  countOffersFilters,
  emptyOffersFilters,
  type OfferStatus,
  type OffersFilters,
} from '../../data/offers'

export type OffersFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value: OffersFilters
  jobOptions: string[]
  onApply: (values: OffersFilters) => void
}

/**
 * Offers "Filter By" side panel — Status, Job, Joining Date.
 */
export function OffersFiltersPanel({
  open,
  onClose,
  value,
  jobOptions,
  onApply,
}: OffersFiltersPanelProps) {
  const [draft, setDraft] = useState<OffersFilters>(value)

  useEffect(() => {
    if (!open) return
    setDraft(value)
  }, [open, value])

  function updateField<K extends keyof OffersFilters>(
    key: K,
    next: OffersFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleCancel() {
    setDraft(value)
    onClose()
  }

  function handleClearFilters() {
    setDraft(emptyOffersFilters)
  }

  function handleApply() {
    onApply(draft)
    onClose()
  }

  const hasDraftFilters = countOffersFilters(draft) > 0
  const statusOptions = OFFER_STATUS_OPTIONS.map((status) => ({
    value: status,
    label: OFFER_STATUS_META[status].label,
  }))

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Filter By"
      widthClassName="w-full max-w-[28rem]"
      footerClassName="justify-between"
      footer={
        <>
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={!hasDraftFilters}
            className="inline-flex h-10 min-w-[5.5rem] items-center justify-center rounded-md px-3 text-sm font-medium text-[#2D2061] transition-colors hover:bg-[#f7f6fb] disabled:cursor-not-allowed disabled:text-[#A0A0B2] disabled:hover:bg-transparent"
          >
            Clear filters
          </button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="!h-10 !min-w-[5.5rem] !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Apply Now
            </Button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <h3 className="text-sm font-bold text-[#2D2061]">Filter By</h3>

        <FieldLabel label="Status">
          <SearchSelect
            value={draft.statuses}
            onChange={(next) => updateField('statuses', next as OfferStatus[])}
            options={statusOptions}
            placeholder="Search and select statuses"
          />
        </FieldLabel>

        <FieldLabel label="Job">
          <SearchSelect
            value={draft.jobs}
            onChange={(next) => updateField('jobs', next)}
            options={jobOptions}
            placeholder="Search and select jobs"
          />
        </FieldLabel>

        <FieldLabel label="Joining Date">
          <div className="relative">
            <input
              type={draft.joiningDate ? 'date' : 'text'}
              value={draft.joiningDate}
              placeholder="Select Date"
              onFocus={(event) => {
                event.currentTarget.type = 'date'
              }}
              onBlur={(event) => {
                if (!event.currentTarget.value) {
                  event.currentTarget.type = 'text'
                }
              }}
              onChange={(event) =>
                updateField('joiningDate', event.target.value)
              }
              className={cn(panelInputClass, 'pr-10')}
            />
            <CalendarDays
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
              aria-hidden="true"
            />
          </div>
        </FieldLabel>
      </div>
    </SidePanel>
  )
}

function FieldLabel({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[#2D2061]">{label}</span>
      {children}
    </div>
  )
}

const panelInputClass =
  'h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'
