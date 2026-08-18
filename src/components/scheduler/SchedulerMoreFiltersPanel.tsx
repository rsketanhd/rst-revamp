import { useEffect, useState } from 'react'
import {
  Button,
  Select,
  SidePanel,
} from '../ui'
import {
  emptySchedulerMoreFilters,
  SCHEDULER_STATUS_META,
  SCHEDULER_STATUS_OPTIONS,
  SCHEDULER_TAG_OPTIONS,
  type SchedulerMoreFilters,
} from '../../data/interviewScheduler'

export type SchedulerMoreFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value: SchedulerMoreFilters
  onApply: (value: SchedulerMoreFilters) => void
  reqOptions: string[]
}

/**
 * More filters drawer for Interview Scheduler.
 */
export function SchedulerMoreFiltersPanel({
  open,
  onClose,
  value,
  onApply,
  reqOptions,
}: SchedulerMoreFiltersPanelProps) {
  const [draft, setDraft] = useState<SchedulerMoreFilters>(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  function patch(partial: Partial<SchedulerMoreFilters>) {
    setDraft((current) => ({ ...current, ...partial }))
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="More Filters"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDraft(emptySchedulerMoreFilters)
            }}
            className="!rounded-md border-[#2D2061] text-[#2D2061]"
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
            className="!rounded-md !bg-[#2D2061] text-white hover:!bg-[#241a52]"
          >
            Apply
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Status"
          options={SCHEDULER_STATUS_OPTIONS.map((id) => ({
            value: id,
            label: SCHEDULER_STATUS_META[id].label,
          }))}
          value={draft.status}
          placeholder="Select status"
          onChange={(e) => patch({ status: e.target.value })}
          className="bg-white"
        />
        <Select
          label="Req Reference"
          options={reqOptions}
          value={draft.reqReference}
          placeholder="Select req"
          onChange={(e) => patch({ reqReference: e.target.value })}
          className="bg-white"
        />
        <Select
          label="Tags"
          options={SCHEDULER_TAG_OPTIONS}
          value={draft.tag}
          placeholder="Select tags"
          onChange={(e) => patch({ tag: e.target.value })}
          className="bg-white"
        />
      </div>
    </SidePanel>
  )
}
