import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import { Button, MultiSelect, Select } from '../../ui'
import { cn } from '../../../lib/cn'
import { StepHeader } from '../../jobs/create/StepChrome'
import {
  estimateMatchingCandidates,
  TALENT_POOL_JOB_TITLE_CRITERIA_OPTIONS,
  TALENT_POOL_LOCATION_CITY_OPTIONS,
  TALENT_POOL_RADIUS_OPTIONS,
  TALENT_POOL_SKILL_OPTIONS,
  type CreateTalentPoolFormState,
} from '../createTalentPoolData'

export type StepPoolAutoUpdateProps = {
  value: CreateTalentPoolFormState
  onChange: (patch: Partial<CreateTalentPoolFormState>) => void
}

/**
 * Create Talent Pool — Auto Update Criteria step.
 */
export function StepPoolAutoUpdate({
  value,
  onChange,
}: StepPoolAutoUpdateProps) {
  const matchCount = estimateMatchingCandidates(value)
  const showJeddahSuggestion =
    value.location === 'Riyadh' && !value.jobRadius.includes('900')

  return (
    <div>
      <StepHeader
        title="Auto Update Criteria"
        description="Candidates who match all criteria join the pool at stage Lead. Auto update only removes candidates it added itself, and only while they're still at Lead."
      />

      <div className="flex max-w-3xl flex-col gap-5">
        <MultiSelect
          label="Job Title"
          requiredMark
          value={value.jobTitles}
          options={TALENT_POOL_JOB_TITLE_CRITERIA_OPTIONS}
          placeholder="Select job titles"
          onChange={(jobTitles) => onChange({ jobTitles })}
        />

        <MultiSelect
          label="Skills"
          requiredMark
          value={value.skills}
          options={TALENT_POOL_SKILL_OPTIONS}
          placeholder="Select skills"
          onChange={(skills) => onChange({ skills })}
        />

        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Experience</FieldLabel>
          <div className="flex flex-wrap items-center gap-2">
            <ExperienceInput
              aria-label="Minimum years of experience"
              value={value.experienceMin}
              onChange={(experienceMin) => onChange({ experienceMin })}
            />
            <span className="text-sm font-medium text-[#8B8B9E]">To</span>
            <ExperienceInput
              aria-label="Maximum years of experience"
              value={value.experienceMax}
              onChange={(experienceMax) => onChange({ experienceMax })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel required>Location</FieldLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_12rem]">
            <Select
              id="talent-pool-criteria-location"
              aria-label="Location"
              options={TALENT_POOL_LOCATION_CITY_OPTIONS}
              value={value.location}
              placeholder="Select"
              onChange={(event) => onChange({ location: event.target.value })}
            />
            <Select
              id="talent-pool-criteria-radius"
              aria-label="Job radius"
              options={TALENT_POOL_RADIUS_OPTIONS}
              value={value.jobRadius}
              placeholder="Select"
              onChange={(event) => onChange({ jobRadius: event.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <InfoBanner>
            {matchCount} candidates match these criteria right now.
          </InfoBanner>

          {showJeddahSuggestion ? (
            <InfoBanner
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onChange({
                      location: 'Jeddah',
                      jobRadius: 'within 900 km',
                    })
                  }
                  className="!h-8 shrink-0 !rounded-md !border-[#2D2061]/30 !px-3 !text-xs !font-semibold !text-[#2D2061] hover:!bg-white"
                >
                  Apply
                </Button>
              }
            >
              Include Jeddah (widen to 900 km) to reach more candidates.
            </InfoBanner>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function FieldLabel({
  children,
  required = false,
}: {
  children: string
  required?: boolean
}) {
  return (
    <span className="text-xs font-medium text-[#2D2061]">
      {children}
      {required ? (
        <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
          *
        </span>
      ) : null}
    </span>
  )
}

function ExperienceInput({
  value,
  onChange,
  'aria-label': ariaLabel,
}: {
  value: number
  onChange: (value: number) => void
  'aria-label': string
}) {
  return (
    <input
      type="number"
      min={0}
      max={40}
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => {
        const next = Number(event.target.value)
        onChange(Number.isFinite(next) ? Math.max(0, next) : 0)
      }}
      className={cn(
        'h-11 w-20 rounded-md border border-[#ddd9e8] bg-white px-3 text-sm tabular-nums text-[#2D2061]',
        'outline-none transition-colors placeholder:text-[#A0A0B2]',
        'focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
      )}
    />
  )
}

function InfoBanner({
  children,
  action,
}: {
  children: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#F0ECF8] px-4 py-3">
      <Sparkles
        className="size-4 shrink-0 text-[#7B6BA8]"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <p className="min-w-0 flex-1 text-sm font-medium text-[#5B4A9A]">
        {children}
      </p>
      {action}
    </div>
  )
}
