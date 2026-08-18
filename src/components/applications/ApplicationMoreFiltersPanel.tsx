import { useEffect, useState } from 'react'
import { SidePanel, Select, Button } from '../ui'
import {
  APPLICANT_STATUS_META,
  APPLICANT_STATUS_OPTIONS,
  SOURCE_OPTIONS,
  type ApplicantStatus,
} from '../../data/applications'

export type ApplicationMoreFilters = {
  cvUpdatedDate: string
  cvScore: string
  source: string
  status: string
}

export const emptyApplicationMoreFilters: ApplicationMoreFilters = {
  cvUpdatedDate: '',
  cvScore: '',
  source: '',
  status: '',
}

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

const STATUS_OPTIONS = APPLICANT_STATUS_OPTIONS.map((id: ApplicantStatus) => ({
  value: id,
  label: APPLICANT_STATUS_META[id].label,
}))

export type ApplicationMoreFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value?: ApplicationMoreFilters
  onApply?: (values: ApplicationMoreFilters) => void
}

/**
 * Applications "More Filters" side panel — CV Updated Date, CV Score, Source, Status.
 */
export function ApplicationMoreFiltersPanel({
  open,
  onClose,
  value,
  onApply,
}: ApplicationMoreFiltersPanelProps) {
  const [draft, setDraft] = useState<ApplicationMoreFilters>(
    value ?? emptyApplicationMoreFilters,
  )

  useEffect(() => {
    if (!open) return
    setDraft(value ?? emptyApplicationMoreFilters)
  }, [open, value])

  function updateField<K extends keyof ApplicationMoreFilters>(
    key: K,
    next: ApplicationMoreFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleCancel() {
    setDraft(value ?? emptyApplicationMoreFilters)
    onClose()
  }

  function handleClearFilters() {
    setDraft(emptyApplicationMoreFilters)
  }

  function handleApply() {
    onApply?.(draft)
    onClose()
  }

  const hasDraftFilters =
    Boolean(draft.cvUpdatedDate) ||
    Boolean(draft.cvScore) ||
    Boolean(draft.source) ||
    Boolean(draft.status)

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
            id="app-filter-cv-updated"
            label="CV Updated Date"
            options={CV_UPDATED_DATE_OPTIONS}
            value={draft.cvUpdatedDate}
            placeholder="Select"
            onChange={(e) => updateField('cvUpdatedDate', e.target.value)}
          />
          <Select
            id="app-filter-cv-score"
            label="CV Score"
            options={CV_SCORE_OPTIONS}
            value={draft.cvScore}
            placeholder="Select"
            onChange={(e) => updateField('cvScore', e.target.value)}
          />
          <Select
            id="app-filter-source"
            label="Source"
            options={SOURCE_OPTIONS}
            value={draft.source}
            placeholder="Select"
            onChange={(e) => updateField('source', e.target.value)}
          />
          <Select
            id="app-filter-status"
            label="Status"
            options={STATUS_OPTIONS}
            value={draft.status}
            placeholder="Select"
            onChange={(e) => updateField('status', e.target.value)}
          />
        </div>
      </div>
    </SidePanel>
  )
}

/** Returns true when applicant matches more-filter panel criteria. */
export function matchesApplicationMoreFilters(
  applicant: {
    updatedOn: string
    cvRelevancy: number
    source: string
    status: ApplicantStatus
  },
  filters: ApplicationMoreFilters,
  resolvedStatus?: ApplicantStatus,
): boolean {
  if (filters.cvUpdatedDate) {
    const days = Number(filters.cvUpdatedDate)
    const updated = parseUpdatedOn(applicant.updatedOn)
    if (updated && Number.isFinite(days)) {
      const cutoff = new Date()
      cutoff.setHours(0, 0, 0, 0)
      cutoff.setDate(cutoff.getDate() - days)
      if (updated < cutoff) return false
    }
  }

  if (filters.cvScore) {
    const minScore = Number(filters.cvScore)
    if (
      Number.isFinite(minScore) &&
      applicant.cvRelevancy < minScore
    ) {
      return false
    }
  }

  if (filters.source && applicant.source !== filters.source) {
    return false
  }

  const status = resolvedStatus ?? applicant.status
  if (filters.status && status !== filters.status) {
    return false
  }

  return true
}

function parseUpdatedOn(value: string): Date | null {
  const parts = value.split('/')
  if (parts.length !== 3) return null
  const day = Number(parts[0])
  const month = Number(parts[1])
  const year = Number(parts[2])
  if (!day || !month || !year) return null
  return new Date(year, month - 1, day)
}
