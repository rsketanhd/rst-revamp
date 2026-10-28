import { Check, Circle, Info, Sparkles } from 'lucide-react'
import {
  Input,
  MultiSelect,
  RadioGroup,
  Select,
} from '../../ui'
import { cn } from '../../../lib/cn'
import {
  CAMPAIGN_CREATE_OWNER_OPTIONS,
  CAMPAIGN_DATE_ADDED_OPTIONS,
  CAMPAIGN_FROM_ADDRESS_OPTIONS,
  CAMPAIGN_PROMPT_CRITERIA,
  CAMPAIGN_REPLY_TO_OPTIONS,
  CAMPAIGN_STAGE_FILTER_OPTIONS,
  CAMPAIGN_TALENT_POOL_OPTIONS,
  DEFAULT_AUDIENCE_SUMMARY,
  detectCampaignCriteria,
  type CampaignChannel,
  type CampaignPromptCriterionId,
  type CampaignSuppressedAction,
  type CreateCampaignFormState,
} from '../createCampaignData'

export type StepCampaignDetailsProps = {
  value: CreateCampaignFormState
  onChange: (patch: Partial<CreateCampaignFormState>) => void
}

const SECTION_SHELL =
  'rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5'

const CHANNEL_OPTIONS: Array<{ value: CampaignChannel; label: string }> = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'telephonic', label: 'Telephonic' },
]

const SUPPRESS_OPTIONS: Array<{
  value: CampaignSuppressedAction
  label: string
}> = [
  { value: 'reschedule', label: 'Reschedule (Send when eligible)' },
  { value: 'suppress', label: 'Suppress (Skip this campaign cycle)' },
  { value: 'ignore', label: 'Ignore and send anyway (Override)' },
]

const COOLDOWN_UNIT_OPTIONS = ['day(s)', 'week(s)']

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
 * Create Campaign — Details step matching the design:
 * bordered Prompt, Campaign Details, and Audience Details (with summary).
 */
export function StepCampaignDetails({
  value,
  onChange,
}: StepCampaignDetailsProps) {
  const summary = DEFAULT_AUDIENCE_SUMMARY
  const criteria =
    value.detectedCriteria.length > 0
      ? value.detectedCriteria
      : detectCampaignCriteria(value.naturalLanguage)

  function patchNaturalLanguage(next: string) {
    onChange({
      naturalLanguage: next,
      detectedCriteria: detectCampaignCriteria(next),
    })
  }

  return (
    <div className="flex w-full flex-col gap-4 pb-8">
      <header className="border-b border-[#ECEAF3] pb-3">
        <h2 className="text-lg font-bold text-[#2D2061]">Campaign Details</h2>
        <p className="mt-0.5 text-sm text-[#8B8B9E]">
          Define the basic details of your campaign.
        </p>
      </header>

      {/* 1. Natural language prompt */}
      <section className="w-full rounded-xl bg-[#F6F4FB] px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-sm font-medium text-[#6B5A9E]">
          Describe your ideal Campaign in natural language.
        </p>
        <div className="relative mt-2 rounded-lg border border-[#E6E4EF] bg-white">
          <textarea
            id="campaign-natural-language"
            rows={3}
            value={value.naturalLanguage}
            placeholder="Describe the campaign goal, audience, and channel…"
            onChange={(event) => patchNaturalLanguage(event.target.value)}
            className="min-h-[4.5rem] w-full resize-y rounded-lg bg-transparent py-2.5 pl-3 pr-[7.5rem] text-sm leading-relaxed text-[#3D3A52] outline-none placeholder:text-[#A0A0B2]"
          />
          <button
            type="button"
            onClick={() => patchNaturalLanguage('')}
            className="absolute right-3 top-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#6B5A9E] transition-colors hover:text-[#2D2061]"
          >
            Clear Search
            <Sparkles
              className="size-3.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        </div>
        <DetectedCriteriaRow criteria={criteria} />
      </section>

      {/* 2. Campaign details form */}
      <section className={cn(SECTION_SHELL, 'w-full')}>
        <div className="flex flex-col gap-5">
          <Input
            id="campaign-name"
            label="Name"
            requiredMark
            value={value.name}
            placeholder="Enter campaign name"
            onChange={(event) => onChange({ name: event.target.value })}
          />

          <MultiSelect
            label="Owner(s)"
            requiredMark
            value={value.owners}
            options={CAMPAIGN_CREATE_OWNER_OPTIONS}
            placeholder="Select owners"
            onChange={(owners) => onChange({ owners })}
          />

          <div className="flex flex-col gap-2">
            <RequiredFieldLabel>Channel</RequiredFieldLabel>
            <RadioGroup
              name="campaign-channel"
              value={value.channel}
              options={CHANNEL_OPTIONS}
              onChange={(channel) =>
                onChange({ channel: channel as CampaignChannel })
              }
            />
          </div>

          <div className="rounded-lg border border-[#E8E4F2] bg-[#F8F7FB] p-4">
            <RequiredFieldLabel>Sender Details</RequiredFieldLabel>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                id="campaign-from-address"
                label="From Address | Name"
                requiredMark
                options={CAMPAIGN_FROM_ADDRESS_OPTIONS}
                value={value.fromAddress}
                placeholder="Select"
                onChange={(event) =>
                  onChange({ fromAddress: event.target.value })
                }
              />
              <Select
                id="campaign-reply-to"
                label="Reply-to Address"
                requiredMark
                options={CAMPAIGN_REPLY_TO_OPTIONS}
                value={value.replyToAddress}
                placeholder="Select"
                onChange={(event) =>
                  onChange({ replyToAddress: event.target.value })
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Audience Details — summary sits inside this section */}
      <section className={cn(SECTION_SHELL, 'w-full')}>
        <h3 className="text-base font-bold text-[#2D2061]">Audience Details</h3>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-5">
            <Select
              id="campaign-talent-pool"
              label="Select Talent Pool"
              requiredMark
              options={
                value.talentPool &&
                !CAMPAIGN_TALENT_POOL_OPTIONS.includes(value.talentPool)
                  ? [value.talentPool, ...CAMPAIGN_TALENT_POOL_OPTIONS]
                  : CAMPAIGN_TALENT_POOL_OPTIONS
              }
              value={value.talentPool}
              placeholder="Select"
              onChange={(event) => onChange({ talentPool: event.target.value })}
            />

            <div>
              <p className="mb-2 text-sm font-medium text-[#2D2061]">
                Talent Pool Filters
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  id="campaign-stage-filter"
                  label="Stages"
                  options={CAMPAIGN_STAGE_FILTER_OPTIONS}
                  value={value.stageFilter}
                  placeholder="Select"
                  onChange={(event) =>
                    onChange({ stageFilter: event.target.value })
                  }
                />
                <Select
                  id="campaign-date-added-filter"
                  label="Date Added to Pool"
                  options={CAMPAIGN_DATE_ADDED_OPTIONS}
                  value={value.dateAddedFilter}
                  placeholder="Select"
                  onChange={(event) =>
                    onChange({ dateAddedFilter: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="inline-flex w-full items-start gap-2 rounded-lg border border-[#E8E4F2] bg-[#F7F5FB] px-3 py-2.5 text-[13px] text-[#5B6178]">
              <Info
                className="mt-0.5 size-4 shrink-0 text-[#6B5A9E]"
                strokeWidth={2}
                aria-hidden="true"
              />
              <p>
                <span className="font-semibold text-[#2D2061]">
                  Dynamic Audience:
                </span>{' '}
                Audience will be recalculated at send time to ensure the most
                accurate recipient list.
              </p>
            </div>

            <div className="border-t border-[#ECEAF3] pt-5">
              <h4 className="text-sm font-bold text-[#2D2061]">
                Governance Rules
              </h4>
              <div className="mt-4 flex flex-col gap-5">
                <div>
                  <p className="text-sm font-medium text-[#2D2061]">
                    Communication Cooldown
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#8B8B9E]">
                    Minimum gap between two communications (Email or SMS)
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <input
                      id="campaign-cooldown-days"
                      type="number"
                      min={0}
                      aria-label="Cooldownoldown amount"
                      value={value.cooldownDays}
                      onChange={(event) =>
                        onChange({
                          cooldownDays: Math.max(
                            0,
                            Number(event.target.value) || 0,
                          ),
                        })
                      }
                      className="h-10 w-20 rounded-md border border-[#D5D2E2] bg-white px-3 text-sm font-medium tabular-nums text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                    />
                    <select
                      aria-label="Cooldownoldown unit"
                      defaultValue="day(s)"
                      className="h-10 rounded-md border border-[#D5D2E2] bg-white px-3 text-sm font-medium text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                    >
                      {COOLDOWN_UNIT_OPTIONS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <RequiredFieldLabel>
                    Suppressed Candidate Action
                  </RequiredFieldLabel>
                  <RadioGroup
                    name="campaign-suppressed-action"
                    value={value.suppressedAction}
                    options={SUPPRESS_OPTIONS}
                    onChange={(suppressedAction) =>
                      onChange({
                        suppressedAction:
                          suppressedAction as CampaignSuppressedAction,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-[15.5rem]">
            <AudienceSummaryCard summary={summary} />
          </aside>
        </div>
      </section>
    </div>
  )
}

function DetectedCriteriaRow({
  criteria,
}: {
  criteria: CampaignPromptCriterionId[]
}) {
  return (
    <div
      role="group"
      aria-label="Detected criteria"
      className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"
    >
      {CAMPAIGN_PROMPT_CRITERIA.map((item) => {
        const enabled = criteria.includes(item.id)
        return (
          <span
            key={item.id}
            className={cn(
              'inline-flex items-center gap-1.5 text-[13px] font-medium',
              enabled ? 'text-[#2F9E6B]' : 'text-[#A0A0B2]',
            )}
          >
            <CriterionMark selected={enabled} />
            {item.label}
          </span>
        )
      })}
    </div>
  )
}

function AudienceSummaryCard({
  summary,
}: {
  summary: typeof DEFAULT_AUDIENCE_SUMMARY
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E4E1EE] bg-white shadow-[0_1px_2px_rgba(45,32,97,0.04)]">
      <div className="bg-[#2D2061] px-4 py-2.5">
        <h3 className="text-sm font-semibold text-white">Audience Summary</h3>
      </div>
      <div className="space-y-2.5 px-4 py-3 text-[13px]">
        <SummaryRow label="Total in Pool" value={summary.totalInPool} />
        <SummaryRow
          label="Unsubscribed"
          value={-summary.unsubscribed}
          tone="negative"
        />
        <SummaryRow
          label="Blocked"
          value={-summary.blocked}
          tone="negative"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#5B6178]">Recently Contacted</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold tabular-nums text-[#D14343]">
              {summary.recentlyContacted}
            </span>
            <button
              type="button"
              className="text-[12px] font-semibold text-[#2F6FD6] hover:underline"
            >
              See All
            </button>
          </div>
        </div>
      </div>
      <div className="m-3 rounded-lg bg-[#E8F7EE] px-3 py-3 text-center">
        <p className="text-[1.75rem] font-bold leading-none tabular-nums text-[#1F7A4D]">
          {summary.reachable.toLocaleString('en-US')}
        </p>
        <p className="mt-1 text-[12px] font-semibold text-[#1F7A4D]">
          Reachable Audience
        </p>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: number
  tone?: 'neutral' | 'negative'
}) {
  const display = value > 0 ? value.toLocaleString('en-US') : String(value)
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[#5B6178]">{label}</span>
      <span
        className={cn(
          'font-semibold tabular-nums',
          tone === 'negative' ? 'text-[#D14343]' : 'text-[#2D2061]',
        )}
      >
        {display}
      </span>
    </div>
  )
}

function CriterionMark({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <span
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#2F9E6B] text-white"
        aria-hidden="true"
      >
        <Check className="size-2.5" strokeWidth={3} />
      </span>
    )
  }
  return (
    <Circle
      className="size-4 shrink-0 text-[#C8C5D6]"
      strokeWidth={1.75}
      aria-hidden="true"
    />
  )
}
