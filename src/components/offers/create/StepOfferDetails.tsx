import { Input, Select } from '../../ui'
import { FormGrid, StepHeader } from '../../jobs/create/StepChrome'
import { OFFER_JOB_OPTIONS, type CreateOfferStepProps } from './types'

/**
 * Step 01 — Candidate, role, and key dates.
 */
export function StepOfferDetails({ value, onChange }: CreateOfferStepProps) {
  return (
    <div>
      <StepHeader
        title="Offer Details"
        description="Select the candidate, role, and key dates for this employment offer."
      />
      <FormGrid cols={2}>
        <Input
          label="Candidate Name"
          requiredMark
          placeholder="Enter candidate name"
          value={value.candidateName}
          onChange={(event) => onChange({ candidateName: event.target.value })}
        />
        <Input
          label="Email"
          requiredMark
          type="email"
          placeholder="Enter email"
          value={value.email}
          onChange={(event) => onChange({ email: event.target.value })}
        />
        <Select
          label="Job"
          requiredMark
          options={OFFER_JOB_OPTIONS}
          placeholder="Select job"
          value={value.job}
          onChange={(event) => onChange({ job: event.target.value })}
        />
        <Input
          label="Joining Date"
          requiredMark
          type="date"
          value={value.joiningDate}
          onChange={(event) => onChange({ joiningDate: event.target.value })}
        />
        <Input
          label="Expiry Date"
          requiredMark
          type="date"
          value={value.expiryDate}
          onChange={(event) => onChange({ expiryDate: event.target.value })}
        />
      </FormGrid>
    </div>
  )
}
