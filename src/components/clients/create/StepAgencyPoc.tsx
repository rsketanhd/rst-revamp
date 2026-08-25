import { Select } from '../../ui'
import {
  AGENCY_POC_OPTIONS,
  LEAD_RECRUITER_OPTIONS,
} from '../../../data/clients'
import type { CreateClientFormState } from './types'
import { FormGrid, StepHeader } from './StepChrome'

type Props = {
  value: CreateClientFormState
  onChange: (patch: Partial<CreateClientFormState>) => void
}

export function StepAgencyPoc({ value, onChange }: Props) {
  return (
    <div>
      <StepHeader title="Agency POC" />

      <FormGrid cols={2}>
        <Select
          label="Agency POC"
          options={AGENCY_POC_OPTIONS}
          value={value.agencyPoc}
          onChange={(e) => onChange({ agencyPoc: e.target.value })}
        />
        <Select
          label="Lead Recruiter"
          options={LEAD_RECRUITER_OPTIONS}
          value={value.leadRecruiter}
          onChange={(e) => onChange({ leadRecruiter: e.target.value })}
        />
      </FormGrid>
    </div>
  )
}
