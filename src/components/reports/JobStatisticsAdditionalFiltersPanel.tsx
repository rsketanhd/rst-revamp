import { useEffect, useState } from 'react'
import { Button, Select, SidePanel } from '../ui'
import { JOB_STATISTICS_ADDITIONAL_FILTER_OPTIONS } from '../../data/jobStatisticsOverview'

export type JobStatisticsAdditionalFilters = {
  department: string
  location: string
  employmentType: string
  source: string
}

export type JobStatisticsAdditionalFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value: JobStatisticsAdditionalFilters
  onApply: (value: JobStatisticsAdditionalFilters) => void
}

const EMPTY: JobStatisticsAdditionalFilters = {
  department: '',
  location: '',
  employmentType: '',
  source: '',
}

/**
 * Additional filters drawer for Job Statistics Overview.
 */
export function JobStatisticsAdditionalFiltersPanel({
  open,
  onClose,
  value,
  onApply,
}: JobStatisticsAdditionalFiltersPanelProps) {
  const [draft, setDraft] = useState<JobStatisticsAdditionalFilters>(value)

  useEffect(() => {
    if (!open) return
    setDraft(value)
  }, [open, value])

  function patch<K extends keyof JobStatisticsAdditionalFilters>(
    key: K,
    next: JobStatisticsAdditionalFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleClear() {
    setDraft(EMPTY)
  }

  function handleApply() {
    onApply(draft)
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Additional filters"
      widthClassName="w-full max-w-[28rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061]"
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-white hover:!bg-[#241a52]"
          >
            Apply filters
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Select
          id="job-stats-department"
          label="Department"
          options={JOB_STATISTICS_ADDITIONAL_FILTER_OPTIONS.departments}
          value={draft.department}
          placeholder="Select"
          onChange={(e) => patch('department', e.target.value)}
        />
        <Select
          id="job-stats-location"
          label="Location"
          options={JOB_STATISTICS_ADDITIONAL_FILTER_OPTIONS.locations}
          value={draft.location}
          placeholder="Select"
          onChange={(e) => patch('location', e.target.value)}
        />
        <Select
          id="job-stats-employment-type"
          label="Employment type"
          options={JOB_STATISTICS_ADDITIONAL_FILTER_OPTIONS.employmentTypes}
          value={draft.employmentType}
          placeholder="Select"
          onChange={(e) => patch('employmentType', e.target.value)}
        />
        <Select
          id="job-stats-source"
          label="Source"
          options={JOB_STATISTICS_ADDITIONAL_FILTER_OPTIONS.sources}
          value={draft.source}
          placeholder="Select"
          onChange={(e) => patch('source', e.target.value)}
        />
      </div>
    </SidePanel>
  )
}

export function countActiveAdditionalFilters(
  value: JobStatisticsAdditionalFilters,
): number {
  return Object.values(value).filter(Boolean).length
}
