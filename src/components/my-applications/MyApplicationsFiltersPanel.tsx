import { useEffect, useState } from 'react'
import {
  APPLICATION_PIPELINE_STAGES,
  emptyMyApplicationFilters,
  type ApplicationPipelineStageId,
  type MyApplicationFilterOptions,
  type MyApplicationFilters,
} from '../../data/myApplications'
import { Button, Select, SidePanel } from '../ui'

export type MyApplicationsFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value?: MyApplicationFilters
  options: MyApplicationFilterOptions
  onApply?: (values: MyApplicationFilters) => void
}

/**
 * My Applications — filter side panel for job type, experience, department,
 * location, and application status.
 */
export function MyApplicationsFiltersPanel({
  open,
  onClose,
  value,
  options,
  onApply,
}: MyApplicationsFiltersPanelProps) {
  const [draft, setDraft] = useState<MyApplicationFilters>(
    value ?? emptyMyApplicationFilters,
  )

  useEffect(() => {
    if (!open) return
    setDraft(value ?? emptyMyApplicationFilters)
  }, [open, value])

  function updateField<K extends keyof MyApplicationFilters>(
    key: K,
    next: MyApplicationFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleCancel() {
    setDraft(value ?? emptyMyApplicationFilters)
    onClose()
  }

  function handleClearFilters() {
    setDraft(emptyMyApplicationFilters)
  }

  function handleApply() {
    onApply?.(draft)
    onClose()
  }

  const hasDraftFilters =
    Boolean(draft.jobType) ||
    Boolean(draft.experience) ||
    Boolean(draft.department) ||
    Boolean(draft.location) ||
    Boolean(draft.status)

  const statusOptions = APPLICATION_PIPELINE_STAGES.map((stage) => ({
    value: stage.id,
    label: stage.label,
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
          id="my-app-filter-job-type"
          label="Job Type"
          options={toSelectOptions(options.jobType)}
          value={draft.jobType}
          placeholder="Select"
          onChange={(event) => updateField('jobType', event.target.value)}
        />
        <Select
          id="my-app-filter-experience"
          label="Experience"
          options={toSelectOptions(options.experience)}
          value={draft.experience}
          placeholder="Select"
          onChange={(event) => updateField('experience', event.target.value)}
        />
        <Select
          id="my-app-filter-department"
          label="Department"
          options={toSelectOptions(options.department)}
          value={draft.department}
          placeholder="Select"
          onChange={(event) => updateField('department', event.target.value)}
        />
        <Select
          id="my-app-filter-location"
          label="Location"
          options={toSelectOptions(options.location)}
          value={draft.location}
          placeholder="Select"
          onChange={(event) => updateField('location', event.target.value)}
        />
        <Select
          id="my-app-filter-status"
          label="Status"
          options={statusOptions}
          value={draft.status}
          placeholder="Select"
          onChange={(event) =>
            updateField(
              'status',
              event.target.value as ApplicationPipelineStageId | '',
            )
          }
        />
      </div>
    </SidePanel>
  )
}

function toSelectOptions(values: string[]) {
  return values.map((value) => ({ value, label: value }))
}
