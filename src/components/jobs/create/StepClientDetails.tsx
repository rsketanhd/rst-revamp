import { Select } from '../../ui'
import type { CreateJobFormState } from './types'
import { FormGrid, SectionTitle, StepHeader } from './StepChrome'

type Props = {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
}

const CLIENTS = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Health']
const CONTACTS = [
  'Alex Morgan',
  'Jordan Lee',
  'Sam Rivera',
  'Taylor Brooks',
]
const INDUSTRIES = ['SaaS', 'Healthcare', 'Finance', 'Retail', 'Manufacturing']

export function StepClientDetails({ value, onChange }: Props) {
  return (
    <div>
      <StepHeader
        title="Client Details"
        description="Provide key information about the Client."
      />

      <SectionTitle>Organization</SectionTitle>
      <FormGrid cols={2}>
        <Select
          label="Client"
          options={CLIENTS}
          value={value.client}
          onChange={(e) => onChange({ client: e.target.value })}
        />
        <Select
          label="Client Contact"
          options={CONTACTS}
          value={value.clientContact}
          onChange={(e) => onChange({ clientContact: e.target.value })}
        />
        <Select
          label="Client Contact (Secondary)"
          options={CONTACTS}
          value={value.clientContactSecondary}
          onChange={(e) =>
            onChange({ clientContactSecondary: e.target.value })
          }
        />
        <Select
          label="Client Industry"
          options={INDUSTRIES}
          value={value.clientIndustry}
          onChange={(e) => onChange({ clientIndustry: e.target.value })}
        />
      </FormGrid>
    </div>
  )
}
