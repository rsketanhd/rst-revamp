import { Input, Select, Textarea } from '../../ui'
import { FormGrid, StepHeader } from '../../jobs/create/StepChrome'
import { PAY_FREQUENCY_OPTIONS, type CreateOfferStepProps } from './types'

/**
 * Step 02 — Package amount, frequency, and notes.
 */
export function StepCompensation({ value, onChange }: CreateOfferStepProps) {
  return (
    <div>
      <StepHeader
        title="Compensation"
        description="Set the offered package and any notes the candidate should see."
      />
      <FormGrid cols={2}>
        <Input
          label="Compensation (AED)"
          requiredMark
          inputMode="numeric"
          placeholder="Enter amount"
          value={value.compensationAed}
          onChange={(event) => onChange({ compensationAed: event.target.value })}
        />
        <Select
          label="Pay Frequency"
          requiredMark
          options={PAY_FREQUENCY_OPTIONS}
          value={value.payFrequency}
          onChange={(event) => onChange({ payFrequency: event.target.value })}
        />
      </FormGrid>
      <div className="mt-4">
        <Textarea
          label="Notes"
          placeholder="Add compensation notes"
          value={value.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
          rows={5}
          className="resize-y"
        />
      </div>
    </div>
  )
}
