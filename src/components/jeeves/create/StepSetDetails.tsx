import { Checkbox, Input } from '../../ui'
import { StepHeader } from '../../jobs/create/StepChrome'
import {
  CURRENT_DEFAULT_SET_NAME,
  SET_TYPE_OPTIONS,
  defaultsForKind,
  type CreatePreInterviewSetForm,
} from './types'

type Props = {
  value: CreatePreInterviewSetForm
  onChange: (patch: Partial<CreatePreInterviewSetForm>) => void
  nameError?: string
}

export function StepSetDetails({ value, onChange, nameError }: Props) {
  return (
    <div>
      <StepHeader
        title="Details"
        description="Name the set and choose its type. Sets aren't tied to a job: recruiters pick one when they send from any job, or a trigger picks it."
      />

      <div className="flex flex-col gap-6">
        <div>
          <Input
            id="pre-interview-set-name"
            label="Set Name"
            requiredMark
            value={value.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="For example, Default prescreen"
            error={nameError}
          />
          <p className="mt-1.5 text-xs text-[#8B8B9E]">
            • recruiters see this name; candidates don&apos;t
          </p>
        </div>

        <fieldset className="flex flex-col">
          <legend className="text-sm font-medium text-[#2D2061]">Set Type</legend>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-8">
            {SET_TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="inline-flex min-w-0 flex-1 cursor-pointer items-start gap-2.5"
              >
                <input
                  type="radio"
                  name="pre-interview-set-type"
                  value={option.value}
                  checked={value.kind === option.value}
                  onChange={() => {
                    if (option.value === value.kind) return
                    onChange(defaultsForKind(option.value))
                  }}
                  className="mt-0.5 size-4 shrink-0 accent-[#2D2061]"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[#2D2061]">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#8B8B9E]">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <Checkbox
            id="pre-interview-set-default"
            name="isDefault"
            checked={value.isDefault}
            onChange={(e) => onChange({ isDefault: e.target.checked })}
            label="Make this the Default set"
          />
          <p className="mt-1.5 pl-6 text-xs leading-relaxed text-[#8B8B9E]">
            {`The Default set is used for every chat unless a recruiter or a trigger picks another one. Currently '${CURRENT_DEFAULT_SET_NAME}'.`}
          </p>
        </div>
      </div>
    </div>
  )
}
