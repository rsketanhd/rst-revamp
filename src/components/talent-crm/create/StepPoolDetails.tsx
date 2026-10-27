import { Input, MultiSelect, RadioGroup, Switch, Textarea } from '../../ui'
import { TALENT_POOL_OWNER_OPTIONS } from '../../../data/talentCrm'
import type {
  CreateTalentPoolFormState,
  TalentPoolPrivacy,
} from '../createTalentPoolData'
import { StepHeader } from '../../jobs/create/StepChrome'

export type StepPoolDetailsProps = {
  value: CreateTalentPoolFormState
  onChange: (patch: Partial<CreateTalentPoolFormState>) => void
}

const PRIVACY_OPTIONS: Array<{ value: TalentPoolPrivacy; label: string }> = [
  {
    value: 'private',
    label: 'Private (Only owners can view and edit)',
  },
  {
    value: 'public',
    label: 'Public (Everyone can view; only owners edit)',
  },
]

function RequiredFieldLabel({ children }: { children: string }) {
  return (
    <p className="text-sm font-medium text-[#2D2061]">
      {children}
      <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
        *
      </span>
    </p>
  )
}

/**
 * Create Talent Pool — Details step (name, owners, description, privacy, auto-update).
 */
export function StepPoolDetails({ value, onChange }: StepPoolDetailsProps) {
  return (
    <div>
      <StepHeader
        title="Pool Details"
        description="Define the basic details of your Pool."
      />

      <div className="flex max-w-3xl flex-col gap-5">
        <Input
          id="talent-pool-name"
          label="Name"
          requiredMark
          value={value.name}
          placeholder="Enter talent pool name"
          onChange={(event) => onChange({ name: event.target.value })}
        />

        <MultiSelect
          label="Owner(s)"
          requiredMark
          value={value.owners}
          options={TALENT_POOL_OWNER_OPTIONS}
          placeholder="Select owners"
          onChange={(owners) => onChange({ owners })}
        />

        <Textarea
          id="talent-pool-description"
          label="Description"
          requiredMark
          rows={4}
          value={value.description}
          placeholder="Describe this talent pool"
          onChange={(event) => onChange({ description: event.target.value })}
        />

        <div className="flex flex-col gap-2">
          <RequiredFieldLabel>Privacy</RequiredFieldLabel>
          <RadioGroup
            name="talent-pool-privacy"
            value={value.privacy}
            onChange={(privacy) =>
              onChange({ privacy: privacy as TalentPoolPrivacy })
            }
            options={PRIVACY_OPTIONS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <RequiredFieldLabel>Auto update</RequiredFieldLabel>
          <div className="flex items-center justify-between gap-4 rounded-lg bg-[#F5F4F8] px-4 py-3">
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-[#6B6B80]">
              Keep adding candidates who match your criteria — from the database,
              resume uploads, Discovery and the career site.
            </p>
            <Switch
              checked={value.autoUpdate}
              onCheckedChange={(autoUpdate) => onChange({ autoUpdate })}
              aria-label="Auto update"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
