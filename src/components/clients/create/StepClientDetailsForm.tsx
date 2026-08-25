import { Select } from '../../ui'
import {
  CLIENT_INDUSTRY_OPTIONS,
  CLIENT_STATUS_OPTIONS,
} from '../../../data/clients'
import type { CreateClientFormState } from './types'
import { FieldInput, FormGrid, SectionTitle, StepHeader } from './StepChrome'

type Props = {
  value: CreateClientFormState
  onChange: (patch: Partial<CreateClientFormState>) => void
}

export function StepClientDetailsForm({ value, onChange }: Props) {
  return (
    <div>
      <StepHeader title="Client Details" />

      <SectionTitle>Basic Information</SectionTitle>
      <FormGrid cols={2} className="mb-6">
        <FieldInput
          label="Client Subdomain"
          requiredMark
          placeholder="Client Subdomain"
          value={value.clientSubdomain}
          onChange={(e) => onChange({ clientSubdomain: e.target.value })}
        />
        <FieldInput
          label="Full Name"
          requiredMark
          placeholder="Full Name"
          value={value.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
      </FormGrid>

      <SectionTitle>Domain Information</SectionTitle>
      <FormGrid cols={3} className="mb-6">
        <FieldInput
          label="Domain 1"
          requiredMark
          placeholder="Domain 1"
          value={value.domain1}
          onChange={(e) => onChange({ domain1: e.target.value })}
        />
        <FieldInput
          label="Domain 2"
          placeholder="Domain 2"
          value={value.domain2}
          onChange={(e) => onChange({ domain2: e.target.value })}
        />
        <FieldInput
          label="Domain 3"
          placeholder="Domain 3"
          value={value.domain3}
          onChange={(e) => onChange({ domain3: e.target.value })}
        />
      </FormGrid>

      <SectionTitle>Location Information</SectionTitle>
      <FormGrid cols={3} className="mb-6">
        <FieldInput
          label="Location 1"
          requiredMark
          placeholder="Location 1"
          value={value.location1}
          onChange={(e) => onChange({ location1: e.target.value })}
        />
        <FieldInput
          label="Location 2"
          placeholder="Location 2"
          value={value.location2}
          onChange={(e) => onChange({ location2: e.target.value })}
        />
        <FieldInput
          label="Location 3"
          placeholder="Location 3"
          value={value.location3}
          onChange={(e) => onChange({ location3: e.target.value })}
        />
      </FormGrid>

      <SectionTitle>Additional Information</SectionTitle>
      <FormGrid cols={4}>
        <FieldInput
          label="Website Link 1"
          requiredMark
          placeholder="Website Link 1"
          value={value.websiteLink1}
          onChange={(e) => onChange({ websiteLink1: e.target.value })}
        />
        <FieldInput
          label="Website Link 2"
          placeholder="Website Link 2"
          value={value.websiteLink2}
          onChange={(e) => onChange({ websiteLink2: e.target.value })}
        />
        <Select
          label="Client Industry"
          options={CLIENT_INDUSTRY_OPTIONS}
          value={value.clientIndustry}
          onChange={(e) => onChange({ clientIndustry: e.target.value })}
        />
        <Select
          label="Status"
          options={CLIENT_STATUS_OPTIONS}
          value={value.status}
          onChange={(e) => onChange({ status: e.target.value })}
        />
      </FormGrid>
    </div>
  )
}
