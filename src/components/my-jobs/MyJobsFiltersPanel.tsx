import { useEffect, useState } from 'react'
import {
  emptyMyJobsFilters,
  MY_JOBS_FILTER_OPTIONS,
  type MyJobsFilters,
} from '../../data/myJobs'
import { Button, Select, SidePanel } from '../ui'

export type MyJobsFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value?: MyJobsFilters
  onApply?: (values: MyJobsFilters) => void
}

/**
 * My Jobs — extended filters side panel.
 */
export function MyJobsFiltersPanel({
  open,
  onClose,
  value,
  onApply,
}: MyJobsFiltersPanelProps) {
  const [draft, setDraft] = useState<MyJobsFilters>(value ?? emptyMyJobsFilters)

  useEffect(() => {
    if (!open) return
    setDraft(value ?? emptyMyJobsFilters)
  }, [open, value])

  function updateField<K extends keyof MyJobsFilters>(
    key: K,
    next: MyJobsFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleCancel() {
    setDraft(value ?? emptyMyJobsFilters)
    onClose()
  }

  function handleClearFilters() {
    setDraft(emptyMyJobsFilters)
  }

  function handleApply() {
    onApply?.(draft)
    onClose()
  }

  const hasDraftFilters =
    Boolean(draft.jobType) ||
    Boolean(draft.companySize) ||
    Boolean(draft.salaryRange) ||
    Boolean(draft.workMode) ||
    Boolean(draft.experience)

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="All Filters"
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
        <Select
          id="my-jobs-filter-job-type"
          label="Job Type"
          options={MY_JOBS_FILTER_OPTIONS.jobType}
          value={draft.jobType}
          placeholder="Select"
          onChange={(event) => updateField('jobType', event.target.value)}
        />
        <Select
          id="my-jobs-filter-company-size"
          label="Company Size"
          options={MY_JOBS_FILTER_OPTIONS.companySize}
          value={draft.companySize}
          placeholder="Select"
          onChange={(event) => updateField('companySize', event.target.value)}
        />
        <Select
          id="my-jobs-filter-salary"
          label="Salary Range"
          options={MY_JOBS_FILTER_OPTIONS.salaryRange}
          value={draft.salaryRange}
          placeholder="Select"
          onChange={(event) => updateField('salaryRange', event.target.value)}
        />
        <Select
          id="my-jobs-filter-work-mode"
          label="Work Mode"
          options={MY_JOBS_FILTER_OPTIONS.workMode}
          value={draft.workMode}
          placeholder="Select"
          onChange={(event) => updateField('workMode', event.target.value)}
        />
        <Select
          id="my-jobs-filter-experience"
          label="Experience"
          options={MY_JOBS_FILTER_OPTIONS.experience}
          value={draft.experience}
          placeholder="Select"
          onChange={(event) => updateField('experience', event.target.value)}
        />
      </div>
    </SidePanel>
  )
}
