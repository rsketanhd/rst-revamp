import type { ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import { Switch } from '../../ui'
import { StepHeader } from '../../jobs/create/StepChrome'
import {
  formatExperienceRange,
  listOrDash,
  textOrDash,
  type CreateTalentPoolFormState,
  type TalentPoolPrivacy,
} from '../createTalentPoolData'

export type StepPoolReviewProps = {
  value: CreateTalentPoolFormState
  onChange: (patch: Partial<CreateTalentPoolFormState>) => void
  onEditDetails: () => void
}

function privacyLabel(privacy: TalentPoolPrivacy): string {
  switch (privacy) {
    case 'public':
      return 'Public'
    case 'private':
      return 'Private'
    case '':
      return '—'
    default: {
      const exhaustive: never = privacy
      return exhaustive
    }
  }
}

const LOCATION_DISPLAY: Record<string, string> = {
  Ahmedabad: 'Ahmedabad, India',
  Riyadh: 'Riyadh, Saudi Arabia',
  Jeddah: 'Jeddah, Saudi Arabia',
  Dubai: 'Dubai, UAE',
  London: 'London, UK',
  Remote: 'Remote',
}

function formatReviewLocation(location: string): string {
  if (!location) return '—'
  return LOCATION_DISPLAY[location] ?? location
}

function formatJobRadius(jobRadius: string): string {
  if (!jobRadius) return '—'
  return jobRadius.replace(/^within\s+/i, '').replace(/\bkm\b/i, 'Miles')
}

/**
 * Create Talent Pool — Review step with editable Auto Update toggle.
 */
export function StepPoolReview({
  value,
  onChange,
  onEditDetails,
}: StepPoolReviewProps) {
  return (
    <div>
      <StepHeader
        title="Review"
        description="Confirm details and create your pool."
      />

      <div className="flex max-w-3xl flex-col gap-4">
        <ReviewCard
          title="Talent Pool Details"
          action={
            <button
              type="button"
              onClick={onEditDetails}
              aria-label="Edit talent pool details"
              className="inline-flex size-8 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F5F4F8]"
            >
              <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          }
        >
          <ReviewField label="Created By" value={textOrDash(value.createdBy)} />
          <ReviewField label="Name" value={textOrDash(value.name)} />
          <ReviewField label="Owner(s)" value={listOrDash(value.owners)} />
          <ReviewField label="Privacy" value={privacyLabel(value.privacy)} />
          <ReviewField
            label="Description"
            value={textOrDash(value.description)}
            wide
          />
        </ReviewCard>

        <ReviewCard
          title="Auto Update"
          action={
            <Switch
              checked={value.autoUpdate}
              onCheckedChange={(autoUpdate) => onChange({ autoUpdate })}
              aria-label="Auto update"
            />
          }
        >
          <ReviewField label="Job Title" value={listOrDash(value.jobTitles)} />
          <ReviewField
            label="Location"
            value={formatReviewLocation(value.location)}
          />
          <ReviewField
            label="Job Radius"
            value={formatJobRadius(value.jobRadius)}
          />
          <ReviewField
            label="Experience"
            value={formatExperienceRange(
              value.experienceMin,
              value.experienceMax,
            )}
          />
        </ReviewCard>
      </div>
    </div>
  )
}

function ReviewCard({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#E8E6F0] bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
        {action}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

function ReviewField({
  label,
  value,
  wide = false,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={wide ? 'min-w-0 sm:col-span-2' : 'min-w-0'}>
      <p className="text-xs text-[#8B8B9E]">{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap text-sm font-semibold text-[#1a1a2e]">
        {value}
      </p>
    </div>
  )
}
