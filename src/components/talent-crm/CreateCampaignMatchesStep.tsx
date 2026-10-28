import { Info } from 'lucide-react'
import { Select } from '../ui'
import { cn } from '../../lib/cn'
import {
  AI_SIMILAR_CAMPAIGNS,
  CAMPAIGN_EXPERIENCE_OPTIONS,
  CAMPAIGN_FREQUENCY_OPTIONS,
  CAMPAIGN_LOCATION_OPTIONS,
  CAMPAIGN_SOURCE_CHANNEL_OPTIONS,
  type CampaignRefineCriteria,
  type SimilarCampaignMatch,
} from './createCampaignData'

const REFINE_FIELDS: Array<{
  key: keyof CampaignRefineCriteria
  id: string
  label: string
  options: string[]
}> = [
  {
    key: 'experienceLevel',
    id: 'campaign-experience-level',
    label: 'Experience Level',
    options: CAMPAIGN_EXPERIENCE_OPTIONS,
  },
  {
    key: 'talentPoolLocation',
    id: 'campaign-talent-pool-location',
    label: 'Talent Pool Location',
    options: CAMPAIGN_LOCATION_OPTIONS,
  },
  {
    key: 'sourceChannels',
    id: 'campaign-source-channels',
    label: 'Source Channels',
    options: CAMPAIGN_SOURCE_CHANNEL_OPTIONS,
  },
  {
    key: 'outreachFrequency',
    id: 'campaign-outreach-frequency',
    label: 'Outreach Frequency',
    options: CAMPAIGN_FREQUENCY_OPTIONS,
  },
]

function cardClass(active: boolean): string {
  return cn(
    'rounded-xl border p-4 text-left transition-colors',
    active
      ? 'border-[#9B8BC8] bg-[#F5F2FB]'
      : 'border-[#E4E1EE] bg-white hover:border-[#9B8BC8]/50 hover:bg-[#FAF9FC]',
  )
}

export type CreateCampaignMatchesStepProps = {
  similarCampaigns?: SimilarCampaignMatch[]
  selectedId: string | null
  criteria: CampaignRefineCriteria
  onToggleCampaign: (id: string) => void
  onCriteriaChange: (key: keyof CampaignRefineCriteria, value: string) => void
}

/**
 * Matches + refine step body for Create Campaign (no SidePanel chrome).
 */
export function CreateCampaignMatchesStep({
  similarCampaigns = AI_SIMILAR_CAMPAIGNS,
  selectedId,
  criteria,
  onToggleCampaign,
  onCriteriaChange,
}: CreateCampaignMatchesStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F0ECF8] px-3 py-1.5">
        <Info
          className="size-3.5 text-[#6B5A9E]"
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold text-[#6B5A9E]">
          Similar Campaigns Detected
        </span>
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#1a1a2e]">
          We found existing Campaigns that match your description
        </h2>
        <p className="mt-1 text-sm text-[#8B8B9E]">
          Would you like to use one of these as a template or continue creating a
          new one?
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {similarCampaigns.map((campaign) => {
            const active = selectedId === campaign.id
            return (
              <button
                key={campaign.id}
                type="button"
                onClick={() => onToggleCampaign(campaign.id)}
                className={cardClass(active)}
              >
                <span className="block text-sm font-semibold text-[#1a1a2e]">
                  {campaign.name}
                </span>
                <span className="mt-1.5 block text-xs text-[#6B6B80]">
                  Match Score:{' '}
                  <span className="font-semibold text-[#22A45A]">
                    {campaign.matchPercent}%
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-[#1a1a2e]">
          Refine Campaign Criteria
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {REFINE_FIELDS.map((field) => (
            <Select
              key={field.key}
              id={field.id}
              label={field.label}
              options={field.options}
              value={criteria[field.key]}
              onChange={(event) =>
                onCriteriaChange(field.key, event.target.value)
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
