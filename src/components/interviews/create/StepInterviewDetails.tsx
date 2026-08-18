import { MultiSelect, Select, Textarea } from '../../ui'
import { StepHeader } from '../../jobs/create/StepChrome'
import {
  INTERVIEW_TYPE_OPTIONS,
  LINK_EXPIRATION_OPTIONS,
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
        <div className="lg:col-span-3">
          <Select
            label="Interview Type"
            requiredMark
            options={INTERVIEW_TYPE_OPTIONS}
            value={value.interviewType}
            onChange={(e) => onChange({ interviewType: e.target.value })}
            placeholder="Select type"
          />
        </div>
        <div className="lg:col-span-3">
          <Select
            label="Link Expiration Duration"
            requiredMark
            options={LINK_EXPIRATION_OPTIONS}
            value={value.linkExpiration}
            onChange={(e) => onChange({ linkExpiration: e.target.value })}
            placeholder="Select duration"
          />
        </div>
        <div className="lg:col-span-6">
          <MultiSelect
            label="Job"
            requiredMark
            options={jobOptions}
            value={value.jobCodes}
            onChange={(jobCodes) => onChange({ jobCodes })}
            placeholder="Search and select jobs"
          />
        </div>
      </div>

      <Textarea
        label="Interview Description"
        placeholder="Enter Interview Descriptions"
        value={value.description}
        onChange={(e) => onChange({ description: e.target.value })}
        rows={6}
        className="resize-y"
      />
    </div>
  )
}
