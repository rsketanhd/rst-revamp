import { Check, Circle, Search, Sparkles } from 'lucide-react'
import { Textarea } from '../ui'
import { cn } from '../../lib/cn'
import {
  CAMPAIGN_PROMPT_CRITERIA,
  CAMPAIGN_PROMPT_PLACEHOLDER,
  CAMPAIGN_RECENT_SEARCHES,
  CAMPAIGN_SUGGESTED_PROMPTS,
  type CampaignPromptCriterionId,
} from './createCampaignData'

export type CreateCampaignPromptStepProps = {
  prompt: string
  selectedPromptId: string | null
  criteria: CampaignPromptCriterionId[]
  onPromptChange: (value: string) => void
  onSelectSuggested: (id: string, text: string) => void
  onSelectRecent: (text: string) => void
}

/**
 * Prompt step body for Create Campaign (no SidePanel chrome).
 */
export function CreateCampaignPromptStep({
  prompt,
  selectedPromptId,
  criteria,
  onPromptChange,
  onSelectSuggested,
  onSelectRecent,
}: CreateCampaignPromptStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-[#1a1a2e]">
          How would you describe your Campaign?
        </h2>
        <p className="mt-1 text-sm text-[#8B8B9E]">
          SniperAI will automatically fill all steps — campaign details,
          candidate criteria, and outreach flow — from your description
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Textarea
          id="create-campaign-prompt"
          rows={6}
          value={prompt}
          placeholder={CAMPAIGN_PROMPT_PLACEHOLDER}
          onChange={(event) => onPromptChange(event.target.value)}
          className="min-h-[9rem] resize-y"
        />

        <div
          role="group"
          aria-label="Criteria to extract"
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          {CAMPAIGN_PROMPT_CRITERIA.map((item) => {
            const enabled = criteria.includes(item.id)
            return (
              <span
                key={item.id}
                aria-current={enabled ? 'true' : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors',
                  enabled ? 'text-[#2D2061]' : 'text-[#A0A0B2]',
                )}
              >
                <CriterionMark selected={enabled} />
                {item.label}
              </span>
            )
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#8B8B9E]">Recent Search</p>
        <div className="flex flex-wrap gap-2">
          {CAMPAIGN_RECENT_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSelectRecent(item)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E1EE] bg-white px-3 py-1.5 text-[12px] font-medium text-[#2D2061] transition-colors hover:border-[#9B8BC8]/50 hover:bg-[#FAF9FC]"
            >
              <Search
                className="size-3.5 shrink-0 text-[#8B8B9E]"
                strokeWidth={1.75}
              />
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#7B6BA8]">
          Suggested tailored just for you
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CAMPAIGN_SUGGESTED_PROMPTS.map((item) => {
            const selected = selectedPromptId === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSuggested(item.id, item.text)}
                className={cn(
                  'flex h-full flex-col gap-2 rounded-xl border p-3 text-left transition-colors',
                  selected
                    ? 'border-[#9B8BC8] bg-[#F5F2FB]'
                    : 'border-[#E4E1EE] bg-white hover:border-[#9B8BC8]/50 hover:bg-[#FAF9FC]',
                )}
              >
                <Sparkles
                  className="size-4 shrink-0 text-[#7B6BA8]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="text-[12px] leading-snug text-[#3D3A52]">
                  {item.text}
                </span>
              </button>
            )
          })}
        </div>
      </div>
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
