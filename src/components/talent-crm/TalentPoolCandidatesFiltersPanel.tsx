import { useEffect, useState } from 'react'
import { Button, Select, SidePanel } from '../ui'
import {
  emptyTalentPoolCandidateFilters,
  type TalentPoolCandidateFilters,
} from '../../data/talentPoolDetail'

export type TalentPoolCandidatesFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value: TalentPoolCandidateFilters
  sourceOptions: string[]
  nationalityOptions: string[]
  onApply: (value: TalentPoolCandidateFilters) => void
}

/**
 * Filter panel for talent pool candidates list.
 */
export function TalentPoolCandidatesFiltersPanel({
  open,
  onClose,
  value,
  sourceOptions,
  nationalityOptions,
  onApply,
}: TalentPoolCandidatesFiltersPanelProps) {
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
            onClick={() => setDraft(emptyTalentPoolCandidateFilters)}
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
          id="tp-candidate-source"
          label="Source"
          options={sourceOptions}
          value={draft.source}
          placeholder="Select"
          onChange={(event) =>
            setDraft((current) => ({ ...current, source: event.target.value }))
          }
        />
        <Select
          id="tp-candidate-nationality"
          label="Nationality"
          options={nationalityOptions}
          value={draft.nationality}
          placeholder="Select"
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              nationality: event.target.value,
            }))
          }
        />
      </div>
    </SidePanel>
  )
}
