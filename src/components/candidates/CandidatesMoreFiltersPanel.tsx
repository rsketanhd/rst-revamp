import { useEffect, useState } from 'react'
import { SidePanel, Select, Button } from '../ui'
import {
  CANDIDATE_STATUS_META,
  CANDIDATE_STATUS_OPTIONS,
  CANDIDATE_SOURCE_OPTIONS,
  CANDIDATE_TAG_OPTIONS,
  emptyCandidatesMoreFilters,
  type CandidatesMoreFilters,
} from '../../data/candidates'

const CV_UPDATED_DATE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '15', label: 'Last 15 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
]

const CV_SCORE_OPTIONS = [
  { value: '1', label: '1 Star & above' },
  { value: '2', label: '2 Stars & above' },
  { value: '3', label: '3 Stars & above' },
  { value: '4', label: '4 Stars & above' },
  { value: '5', label: '5 Stars' },
]

const STATUS_OPTIONS = CANDIDATE_STATUS_OPTIONS.map((id) => ({
  value: id,
  label: CANDIDATE_STATUS_META[id].label,
}))

export type CandidatesMoreFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value?: CandidatesMoreFilters
  onApply?: (values: CandidatesMoreFilters) => void
}

/**
 * Candidates "More Filters" side panel — same pattern as Jobs / Applications.
 */
export function CandidatesMoreFiltersPanel({
  open,
  onClose,
  value,
  onApply,
}: CandidatesMoreFiltersPanelProps) {
  const [draft, setDraft] = useState<CandidatesMoreFilters>(
    value ?? emptyCandidatesMoreFilters,
  )

  useEffect(() => {
    if (!open) return
    setDraft(value ?? emptyCandidatesMoreFilters)
  }, [open, value])

  function updateField<K extends keyof CandidatesMoreFilters>(
    key: K,
    next: CandidatesMoreFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleCancel() {
    setDraft(value ?? emptyCandidatesMoreFilters)
    onClose()
  }

  function handleClearFilters() {
    setDraft(emptyCandidatesMoreFilters)
  }

  function handleApply() {
    onApply?.(draft)
    onClose()
  }

  const hasDraftFilters = Object.values(draft).some(Boolean)

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
          <Select
            id="cand-filter-cv-updated"
            label="CV Updated Date"
            options={CV_UPDATED_DATE_OPTIONS}
            value={draft.cvUpdatedDate}
            placeholder="Select"
            onChange={(e) => updateField('cvUpdatedDate', e.target.value)}
          />
          <Select
            id="cand-filter-cv-score"
            label="CV Score"
            options={CV_SCORE_OPTIONS}
            value={draft.cvScore}
            placeholder="Select"
            onChange={(e) => updateField('cvScore', e.target.value)}
          />
          <Select
            id="cand-filter-source"
            label="Source"
            options={CANDIDATE_SOURCE_OPTIONS}
            value={draft.source}
            placeholder="Select"
            onChange={(e) => updateField('source', e.target.value)}
          />
          <Select
            id="cand-filter-status"
            label="Status"
            options={STATUS_OPTIONS}
            value={draft.status}
            placeholder="Select"
            onChange={(e) => updateField('status', e.target.value)}
          />
          <Select
            id="cand-filter-tag"
            label="Tags"
            options={CANDIDATE_TAG_OPTIONS}
            value={draft.tag}
            placeholder="Select"
            onChange={(e) => updateField('tag', e.target.value)}
          />
        </div>
      </div>
    </SidePanel>
  )
}
