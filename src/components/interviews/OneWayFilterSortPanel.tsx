import { useEffect, useState } from 'react'
import { Button, Select, SidePanel } from '../ui'
import {
  emptyOneWayFilters,
  type OneWayFilterValues,
} from '../../data/oneWayInterviews'

export type OneWayFilterSortPanelProps = {
  open: boolean
  onClose: () => void
  value: OneWayFilterValues
  onApply: (value: OneWayFilterValues) => void
  jobReqIdOptions: string[]
  recruiterOptions: string[]
}

/**
 * Filter & Sort panel for One-Way Interviews list.
 */
export function OneWayFilterSortPanel({
  open,
  onClose,
  value,
  onApply,
  jobReqIdOptions,
  recruiterOptions,
}: OneWayFilterSortPanelProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Filter & Sort By"
      widthClassName="w-full max-w-[28rem]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setDraft({
                ...emptyOneWayFilters(),
                sortBy: draft.sortBy,
              })
            }
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
          label="Sort By"
          options={[
            { value: 'updatedOn', label: 'Updated On' },
            { value: 'createdOn', label: 'Created On' },
            { value: 'title', label: 'Interview Title' },
          ]}
          value={draft.sortBy}
          onChange={(e) =>
            setDraft({
              ...draft,
              sortBy: e.target.value as OneWayFilterValues['sortBy'],
            })
          }
        />
        <Select
          label="Interview Type"
          options={[
            { value: 'skill', label: 'Skill Based' },
            { value: 'competency', label: 'Competency Based' },
          ]}
          value={draft.type}
          placeholder="Select"
          onChange={(e) => setDraft({ ...draft, type: e.target.value })}
        />
        <Select
          label="Job Req ID"
          options={jobReqIdOptions}
          value={draft.jobReqId}
          placeholder="Select"
          onChange={(e) => setDraft({ ...draft, jobReqId: e.target.value })}
        />
        <Select
          label="Recruiter"
          options={recruiterOptions}
          value={draft.recruiter}
          placeholder="Select"
          onChange={(e) => setDraft({ ...draft, recruiter: e.target.value })}
        />
      </div>
    </SidePanel>
  )
}
