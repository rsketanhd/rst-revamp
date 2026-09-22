import { useEffect, useState } from 'react'
import { SidePanel, Select, Button, RangeSlider, SearchSelect } from '../ui'
import {
  CANDIDATE_APPLICATION_STATUS_OPTIONS,
  CANDIDATE_COMPANY_OPTIONS,
  CANDIDATE_CREATED_BY_OPTIONS,
  CANDIDATE_JOB_OPTIONS,
  CANDIDATE_SKILL_OPTIONS,
  CANDIDATE_SOURCE_OPTIONS,
  CANDIDATE_TAG_OPTIONS,
  emptyCandidatesMoreFilters,
  type CandidatesMoreFilters,
} from '../../data/candidates'

export type CandidatesMoreFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value?: CandidatesMoreFilters
  onApply?: (values: CandidatesMoreFilters) => void
}

/**
 * Candidates "Filter By" side panel.
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

  function handleApply() {
    onApply?.(draft)
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Filter By"
      widthClassName="w-full max-w-[28rem]"
      footerClassName="justify-end"
      footer={
        <>
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
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <RangeSlider
          label="Experience"
          min={0}
          max={10}
          step={1}
          unit="yrs"
          value={draft.experience}
          onChange={(next) => updateField('experience', next)}
          accent="brand"
        />
        <Select
          id="cand-filter-source"
          label="Source"
          options={CANDIDATE_SOURCE_OPTIONS}
          value={draft.source}
          placeholder="Select"
          onChange={(event) => updateField('source', event.target.value)}
        />
        <Select
          id="cand-filter-created-by"
          label="Created By"
          options={CANDIDATE_CREATED_BY_OPTIONS}
          value={draft.createdBy}
          placeholder="Select"
          onChange={(event) => updateField('createdBy', event.target.value)}
        />
        <Select
          id="cand-filter-skills"
          label="Skills"
          options={CANDIDATE_SKILL_OPTIONS}
          value={draft.skills}
          placeholder="Select"
          onChange={(event) => updateField('skills', event.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#2D2061]">Companies</span>
            <TenureToggle
              current={draft.companyCurrent}
              past={draft.companyPast}
              currentId="cand-company-current"
              pastId="cand-company-past"
              onCurrentChange={(checked) =>
                updateField('companyCurrent', checked)
              }
              onPastChange={(checked) => updateField('companyPast', checked)}
            />
          </div>
          <Select
            id="cand-filter-companies"
            aria-label="Companies"
            options={CANDIDATE_COMPANY_OPTIONS}
            value={draft.companies}
            placeholder="Select"
            onChange={(event) => updateField('companies', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#2D2061]">Tags</span>
          <SearchSelect
            value={draft.tags}
            onChange={(next) => updateField('tags', next)}
            options={CANDIDATE_TAG_OPTIONS}
            placeholder="Search and select multiple"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#2D2061]">Job</span>
            <TenureToggle
              current={draft.jobCurrent}
              past={draft.jobPast}
              currentId="cand-job-current"
              pastId="cand-job-past"
              onCurrentChange={(checked) => updateField('jobCurrent', checked)}
              onPastChange={(checked) => updateField('jobPast', checked)}
            />
          </div>
          <Select
            id="cand-filter-job"
            aria-label="Job"
            options={CANDIDATE_JOB_OPTIONS}
            value={draft.job}
            placeholder="Select"
            onChange={(event) => updateField('job', event.target.value)}
          />
        </div>
        <Select
          id="cand-filter-application-status"
          label="Application Status"
          options={CANDIDATE_APPLICATION_STATUS_OPTIONS}
          value={draft.applicationStatus}
          placeholder="Select"
          onChange={(event) =>
            updateField('applicationStatus', event.target.value)
          }
        />
      </div>
    </SidePanel>
  )
}

function TenureToggle({
  current,
  past,
  currentId,
  pastId,
  onCurrentChange,
  onPastChange,
}: {
  current: boolean
  past: boolean
  currentId: string
  pastId: string
  onCurrentChange: (checked: boolean) => void
  onPastChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#2D2061]">
      <label htmlFor={currentId} className="inline-flex items-center gap-1.5">
        <input
          id={currentId}
          type="checkbox"
          checked={current}
          onChange={(event) => onCurrentChange(event.target.checked)}
          className="size-4 rounded border-[#C8C5D6] accent-[#2D2061]"
        />
        Current
      </label>
      <label htmlFor={pastId} className="inline-flex items-center gap-1.5">
        <input
          id={pastId}
          type="checkbox"
          checked={past}
          onChange={(event) => onPastChange(event.target.checked)}
          className="size-4 rounded border-[#C8C5D6] accent-[#2D2061]"
        />
        Past
      </label>
    </div>
  )
}
