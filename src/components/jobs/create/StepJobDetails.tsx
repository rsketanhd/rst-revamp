import { Checkbox, RangeSlider, Select } from '../../ui'
import type { CreateJobFormState } from './types'
import { FieldInput, FormGrid, SectionTitle, StepHeader } from './StepChrome'

type Props = {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
}

const STATES = ['England', 'Scotland', 'Wales', 'Gujarat', 'California', 'Maharashtra']
const COUNTRIES = ['UK', 'India', 'USA', 'UAE']
const RADII = ['25 km', '50 km', '100 km', '100 miles']
const CLIENTS = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Health']
const PROJECTS = ['Project Alpha', 'Project Beta', 'Project Gamma']
const DEPARTMENTS = ['Product Engineering', 'Design', 'Sales', 'Marketing']
const DIVISIONS = ['Enterprise', 'SMB', 'Growth']
const BANDS = ['L4', 'L5', 'L6', 'L7']
const RECRUITERS = [
  'Sarah Johnson',
  'Michael Chen',
  'Priya Shah',
  'David Park',
]
const INDUSTRIES = ['SaaS', 'Healthcare', 'Finance', 'Retail']
const CATEGORIES = ['Engineering', 'Design', 'Product', 'Sales']
const SUB_CATEGORIES = ['Frontend', 'Backend', 'Full Stack', 'UI/UX']

export function StepJobDetails({ value, onChange }: Props) {
  function toggleSameAsPrimary(checked: boolean) {
    if (checked) {
      onChange({
        sameAsPrimary: true,
        secondaryCity: value.primaryCity,
        secondaryState: value.primaryState,
        secondaryCountry: value.primaryCountry,
      })
      return
    }
    onChange({ sameAsPrimary: false })
  }

  return (
    <div>
      <StepHeader
        title="Job Details"
        description="Capture location, organization, and classification details."
      />

      <section className="mb-8">
        <SectionTitle>Location & Eligibility</SectionTitle>
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-1.5 text-xs font-medium text-[#2D2061]">
              Location (Primary){' '}
              <span className="text-[#E53935]" aria-hidden="true">
                *
              </span>
            </p>
            <FormGrid>
              <FieldInput
                placeholder="Enter City"
                value={value.primaryCity}
                onChange={(e) => onChange({ primaryCity: e.target.value })}
              />
              <Select
                placeholder="Select State"
                options={STATES}
                value={value.primaryState}
                onChange={(e) => onChange({ primaryState: e.target.value })}
              />
              <Select
                placeholder="Select Country"
                options={COUNTRIES}
                value={value.primaryCountry}
                onChange={(e) => onChange({ primaryCountry: e.target.value })}
              />
            </FormGrid>
          </div>

          <div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium text-[#2D2061]">
                Location (Secondary){' '}
                <span className="text-[#E53935]" aria-hidden="true">
                  *
                </span>
              </p>
              <Checkbox
                label="Same as Primary"
                checked={value.sameAsPrimary}
                onChange={(e) => toggleSameAsPrimary(e.target.checked)}
              />
            </div>
            <FormGrid>
              <FieldInput
                placeholder="Enter City"
                value={value.secondaryCity}
                disabled={value.sameAsPrimary}
                onChange={(e) => onChange({ secondaryCity: e.target.value })}
              />
              <Select
                placeholder="Select State"
                options={STATES}
                value={value.secondaryState}
                disabled={value.sameAsPrimary}
                onChange={(e) => onChange({ secondaryState: e.target.value })}
              />
              <Select
                placeholder="Select Country"
                options={COUNTRIES}
                value={value.secondaryCountry}
                disabled={value.sameAsPrimary}
                onChange={(e) =>
                  onChange({ secondaryCountry: e.target.value })
                }
              />
            </FormGrid>
          </div>

          <FormGrid cols={2}>
            <Select
              label="Job Radius"
              options={RADII}
              value={value.jobRadius}
              onChange={(e) => onChange({ jobRadius: e.target.value })}
            />
            <RangeSlider
              label="Experience"
              value={[value.experienceMin, value.experienceMax]}
              min={0}
              max={20}
              step={1}
              onChange={([experienceMin, experienceMax]) =>
                onChange({ experienceMin, experienceMax })
              }
            />
          </FormGrid>
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>Organization</SectionTitle>
        <div className="flex flex-col gap-4">
          <FormGrid>
            <Select
              label="Client"
              options={CLIENTS}
              value={value.client}
              onChange={(e) => onChange({ client: e.target.value })}
            />
            <Select
              label="Project"
              options={PROJECTS}
              value={value.project}
              onChange={(e) => onChange({ project: e.target.value })}
            />
            <Select
              label="Department"
              options={DEPARTMENTS}
              value={value.department}
              onChange={(e) => onChange({ department: e.target.value })}
            />
          </FormGrid>
          <FormGrid cols={2}>
            <Select
              label="Division"
              options={DIVISIONS}
              value={value.division}
              onChange={(e) => onChange({ division: e.target.value })}
            />
            <Select
              label="Band"
              options={BANDS}
              value={value.band}
              onChange={(e) => onChange({ band: e.target.value })}
            />
          </FormGrid>
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>Recruitment Details</SectionTitle>
        <div className="flex flex-col gap-4">
          <FormGrid>
            <Select
              label="Support Recruiter"
              options={RECRUITERS}
              value={value.supportRecruiter}
              onChange={(e) => onChange({ supportRecruiter: e.target.value })}
            />
            <FieldInput
              label="Start Date"
              requiredMark
              type="date"
              value={value.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
            <FieldInput
              label="End Date"
              requiredMark
              type="date"
              value={value.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
            />
          </FormGrid>
          <Checkbox
            label="Mask Information"
            checked={value.maskRecruitment}
            onChange={(e) =>
              onChange({ maskRecruitment: e.target.checked })
            }
          />
        </div>
      </section>

      <section>
        <SectionTitle>Classification</SectionTitle>
        <div className="flex flex-col gap-4">
          <FormGrid>
            <Select
              label="Industry"
              options={INDUSTRIES}
              value={value.industry}
              onChange={(e) => onChange({ industry: e.target.value })}
            />
            <Select
              label="Job Category"
              requiredMark
              options={CATEGORIES}
              value={value.jobCategory}
              onChange={(e) => onChange({ jobCategory: e.target.value })}
            />
            <Select
              label="Job Sub Category"
              requiredMark
              options={SUB_CATEGORIES}
              value={value.jobSubCategory}
              onChange={(e) => onChange({ jobSubCategory: e.target.value })}
            />
          </FormGrid>
          <Checkbox
            label="Mask Information"
            checked={value.maskClassification}
            onChange={(e) =>
              onChange({ maskClassification: e.target.checked })
            }
          />
        </div>
      </section>
    </div>
  )
}
