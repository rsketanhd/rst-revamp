import { useEffect, useState } from 'react'
import { Button, Select, SidePanel } from '../ui'
import {
  emptyJeevesMoreFilters,
  type JeevesMoreFilters,
} from '../../data/jeevesAi'

export type JeevesMoreFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value: JeevesMoreFilters
  onApply: (value: JeevesMoreFilters) => void
  jobTitleOptions: string[]
  countryOptions: string[]
  cityOptions: string[]
}

/**
 * Jeeves AI — more filters side panel.
 */
export function JeevesMoreFiltersPanel({
  open,
  onClose,
  value,
  onApply,
  jobTitleOptions,
  countryOptions,
  cityOptions,
}: JeevesMoreFiltersPanelProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="More Filters"
      widthClassName="w-full max-w-[28rem]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDraft(emptyJeevesMoreFilters())}
            className="!h-10 !rounded-md border-[#d5d2e2] px-4 text-sm font-medium text-[#2D2061]"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Apply
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Job Title"
          options={jobTitleOptions}
          value={draft.jobTitle}
          placeholder="Select"
          onChange={(e) => setDraft({ ...draft, jobTitle: e.target.value })}
        />
        <Select
          label="Current Country"
          options={countryOptions}
          value={draft.country}
          placeholder="Select"
          onChange={(e) => setDraft({ ...draft, country: e.target.value })}
        />
        <Select
          label="Current City"
          options={cityOptions}
          value={draft.city}
          placeholder="Select"
          onChange={(e) => setDraft({ ...draft, city: e.target.value })}
        />
        <Select
          label="Relocation"
          options={['Yes', 'No']}
          value={draft.relocation}
          placeholder="Select"
          onChange={(e) => setDraft({ ...draft, relocation: e.target.value })}
        />
        <Select
          label="Preferred Location"
          options={['Anywhere', 'On-site', 'Hybrid', 'Remote']}
          value={draft.preferredLocation}
          placeholder="Select"
          onChange={(e) =>
            setDraft({ ...draft, preferredLocation: e.target.value })
          }
        />
      </div>
    </SidePanel>
  )
}
