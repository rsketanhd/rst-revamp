import { useEffect, useState } from 'react'
import { Button, Select, SidePanel } from '../ui'
import {
  emptyTalentCrmFilters,
  TALENT_POOL_OWNER_OPTIONS,
  type TalentCrmFilters,
} from '../../data/talentCrm'

export type TalentCrmFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value: TalentCrmFilters
  onApply: (value: TalentCrmFilters) => void
}

/**
 * Filter & Sort panel for the Talent CRM talent pool list.
 */
export function TalentCrmFiltersPanel({
  open,
  onClose,
  value,
  onApply,
}: TalentCrmFiltersPanelProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  function updateField<K extends keyof TalentCrmFilters>(
    key: K,
    next: TalentCrmFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleReset() {
    setDraft({
      ...emptyTalentCrmFilters,
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
          id="talent-crm-sort-by"
          label="Sort By"
          options={[
            { value: 'createdOn', label: 'Created On' },
            { value: 'name', label: 'Name' },
            { value: 'candidates', label: 'Candidate Count' },
            { value: 'campaigns', label: 'Active Campaigns' },
          ]}
          value={draft.sortBy}
          onChange={(event) =>
            updateField(
              'sortBy',
              event.target.value as TalentCrmFilters['sortBy'],
            )
          }
        />
        <Select
          id="talent-crm-sort-dir"
          label="Sort Direction"
          options={[
            { value: 'desc', label: 'Descending' },
            { value: 'asc', label: 'Ascending' },
          ]}
          value={draft.sortDir}
          onChange={(event) =>
            updateField(
              'sortDir',
              event.target.value as TalentCrmFilters['sortDir'],
            )
          }
        />
        <Select
          id="talent-crm-visibility"
          label="Visibility"
          options={[
            { value: 'public', label: 'Public' },
            { value: 'shared', label: 'Shared' },
            { value: 'private', label: 'Private' },
          ]}
          value={draft.visibility}
          placeholder="Select"
          onChange={(event) =>
            updateField(
              'visibility',
              event.target.value as TalentCrmFilters['visibility'],
            )
          }
        />
        <Select
          id="talent-crm-owner"
          label="Owner"
          options={TALENT_POOL_OWNER_OPTIONS}
          value={draft.owner}
          placeholder="Select"
          onChange={(event) => updateField('owner', event.target.value)}
        />
      </div>
    </SidePanel>
  )
}
