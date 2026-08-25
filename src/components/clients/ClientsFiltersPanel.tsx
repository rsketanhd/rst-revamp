import { useEffect, useState, type ReactNode } from 'react'
import { CalendarDays } from 'lucide-react'
import { SidePanel, SearchSelect, Button } from '../ui'
import { cn } from '../../lib/cn'
import {
  CLIENTS,
  emptyClientsMoreFilters,
  type ClientsMoreFilters,
} from '../../data/clients'

export type ClientsFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value?: ClientsMoreFilters
  onApply?: (values: ClientsMoreFilters) => void
}

/**
 * Clients "Filter By" side panel — Client ID, Client Name, Created On.
 */
export function ClientsFiltersPanel({
  open,
  onClose,
  value,
  onApply,
}: ClientsFiltersPanelProps) {
  const [draft, setDraft] = useState<ClientsMoreFilters>(
    value ?? emptyClientsMoreFilters,
  )

  useEffect(() => {
    if (!open) return
    setDraft(value ?? emptyClientsMoreFilters)
  }, [open, value])

  function updateField<K extends keyof ClientsMoreFilters>(
    key: K,
    next: ClientsMoreFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleCancel() {
    setDraft(value ?? emptyClientsMoreFilters)
    onClose()
  }

  function handleClearFilters() {
    setDraft(emptyClientsMoreFilters)
  }

  function handleApply() {
    onApply?.(draft)
    onClose()
  }

  const hasDraftFilters =
    draft.clientIds.length > 0 ||
    draft.clientNames.length > 0 ||
    Boolean(draft.createdOn)

  const clientIdOptions = CLIENTS.map((client) => ({
    value: client.clientId,
    label: client.clientId,
  }))
  const clientNameOptions = CLIENTS.map((client) => client.name)

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
              size="md"
              onClick={handleCancel}
              className="!h-10 !min-w-[5.5rem] !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
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

        <div className="flex flex-col gap-4">
          <FieldLabel label="Client ID">
            <SearchSelect
              value={draft.clientIds}
              onChange={(next) => updateField('clientIds', next)}
              options={clientIdOptions}
              placeholder="Search and select multiple"
            />
          </FieldLabel>

          <FieldLabel label="Client Name">
            <SearchSelect
              value={draft.clientNames}
              onChange={(next) => updateField('clientNames', next)}
              options={clientNameOptions}
              placeholder="Search and select multiple"
            />
          </FieldLabel>

          <FieldLabel label="Created On">
            <div className="relative">
              <input
                type={draft.createdOn ? 'date' : 'text'}
                value={draft.createdOn}
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
                  updateField('createdOn', event.target.value)
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
