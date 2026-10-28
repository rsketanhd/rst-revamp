import { useEffect, useState } from 'react'
import { Button, Select, SidePanel } from '../ui'
import {
  CAMPAIGN_OWNER_OPTIONS,
  CAMPAIGN_STATUS_META,
  emptyCampaignFilters,
  type CampaignFilters,
  type CampaignStatus,
} from '../../data/campaigns'

export type CampaignsFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value: CampaignFilters
  onApply: (value: CampaignFilters) => void
}

const SORT_BY_OPTIONS = [
  { value: 'createdOn', label: 'Created Date' },
  { value: 'name', label: 'Name' },
  { value: 'talentPool', label: 'Talent Pool' },
  { value: 'status', label: 'Status' },
]

const SORT_DIR_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
]

const CHANNEL_OPTIONS = [
  { value: 'Email', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
]

const FREQUENCY_OPTIONS = [
  { value: 'Recurring', label: 'Recurring' },
  { value: 'Once', label: 'Once' },
]

const STATUS_OPTIONS = (
  Object.keys(CAMPAIGN_STATUS_META) as CampaignStatus[]
).map((status) => ({
  value: status,
  label: CAMPAIGN_STATUS_META[status].label,
}))

/**
 * Filter & Sort panel for the Campaigns list.
 */
export function CampaignsFiltersPanel({
  open,
  onClose,
  value,
  onApply,
}: CampaignsFiltersPanelProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  function updateField<K extends keyof CampaignFilters>(
    key: K,
    next: CampaignFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleReset() {
    setDraft({
      ...emptyCampaignFilters,
      sortBy: draft.sortBy,
      sortDir: draft.sortDir,
    })
  }

  function handleApply() {
    onApply(draft)
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Filter & Sort"
      widthClassName="w-full max-w-[28rem]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="!h-10 !rounded-md border-[#d5d2e2] px-4 text-sm font-medium text-[#2D2061]"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Apply
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          id="campaigns-sort-by"
          label="Sort By"
          options={SORT_BY_OPTIONS}
          value={draft.sortBy}
          onChange={(event) =>
            updateField('sortBy', event.target.value as CampaignFilters['sortBy'])
          }
        />
        <Select
          id="campaigns-sort-dir"
          label="Sort Direction"
          options={SORT_DIR_OPTIONS}
          value={draft.sortDir}
          onChange={(event) =>
            updateField(
              'sortDir',
              event.target.value as CampaignFilters['sortDir'],
            )
          }
        />
        <Select
          id="campaigns-status"
          label="Status"
          options={STATUS_OPTIONS}
          value={draft.status}
          placeholder="Select"
          onChange={(event) =>
            updateField(
              'status',
              event.target.value as CampaignFilters['status'],
            )
          }
        />
        <Select
          id="campaigns-channel"
          label="Channel"
          options={CHANNEL_OPTIONS}
          value={draft.channel}
          placeholder="Select"
          onChange={(event) =>
            updateField(
              'channel',
              event.target.value as CampaignFilters['channel'],
            )
          }
        />
        <Select
          id="campaigns-frequency"
          label="Frequency"
          options={FREQUENCY_OPTIONS}
          value={draft.frequency}
          placeholder="Select"
          onChange={(event) =>
            updateField(
              'frequency',
              event.target.value as CampaignFilters['frequency'],
            )
          }
        />
        <Select
          id="campaigns-owner"
          label="Owner"
          options={CAMPAIGN_OWNER_OPTIONS}
          value={draft.owner}
          placeholder="Select"
          onChange={(event) => updateField('owner', event.target.value)}
        />
      </div>
    </SidePanel>
  )
}
