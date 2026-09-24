import { Select, Textarea } from '../../ui'
import { StepHeader } from '../../jobs/create/StepChrome'
import {
  LINK_VALID_DAYS_OPTIONS,
  type CreateOneWayInterviewForm,
} from './types'

type Props = {
  value: CreateOneWayInterviewForm
  onChange: (patch: Partial<CreateOneWayInterviewForm>) => void
  jobOptions: Array<{ value: string; label: string }>
}

/**
 * Step 01 — Interview Details (Create One-Way Interview).
 */
export function StepInterviewDetails({ value, onChange, jobOptions }: Props) {
  return (
    <div>
      <StepHeader
        title="Interview Details"
        description="Set up the basics for your interview template"
      />

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Select
            id="job-title"
            label="Job Title"
            requiredMark
            options={jobOptions}
            value={value.jobCode}
            onChange={(e) => onChange({ jobCode: e.target.value })}
            placeholder="Select job"
          />
        </div>
        <div className="lg:col-span-4">
          <Select
            id="link-valid-days"
            label="Link Valid For (Days)"
            requiredMark
            labelTooltip="Number of days the interview link stays active after it is sent to the candidate."
            options={LINK_VALID_DAYS_OPTIONS}
            value={value.linkExpiration}
            onChange={(e) => onChange({ linkExpiration: e.target.value })}
            placeholder="Select days"
          />
          <p className="mt-1.5 text-xs text-[#8B8B9E]">
            1 to 60 days, applies to every round.
          </p>
        </div>
      </div>

      <Textarea
        label="Job Descriptions"
        placeholder="Enter Job Descriptions"
        value={value.description}
        onChange={(e) => onChange({ description: e.target.value })}
        rows={6}
        className="resize-y"
      />
    </div>
  )
}
