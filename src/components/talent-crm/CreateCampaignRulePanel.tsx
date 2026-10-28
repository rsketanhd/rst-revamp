import { useEffect, useState } from 'react'
import { Button, Select, SidePanel } from '../ui'
import {
  CAMPAIGN_MESSAGE_RULE_CONDITION_OPTIONS,
  DEFAULT_CAMPAIGN_MESSAGE_RULE,
  type CampaignMessageRule,
  type CampaignMessageRuleCondition,
} from './createCampaignData'

export type CreateCampaignRulePanelProps = {
  open: boolean
  onClose: () => void
  value?: CampaignMessageRule | null
  onSet: (rule: CampaignMessageRule) => void
}

/**
 * Create Campaign → Messages → + → Create Rule side panel.
 */
export function CreateCampaignRulePanel({
  open,
  onClose,
  value = null,
  onSet,
}: CreateCampaignRulePanelProps) {
  const [condition, setCondition] = useState<CampaignMessageRuleCondition>(
    DEFAULT_CAMPAIGN_MESSAGE_RULE.condition,
  )
  const [waitDays, setWaitDays] = useState(
    DEFAULT_CAMPAIGN_MESSAGE_RULE.waitDays,
  )

  useEffect(() => {
    if (!open) return
    setCondition(value?.condition ?? DEFAULT_CAMPAIGN_MESSAGE_RULE.condition)
    setWaitDays(value?.waitDays ?? DEFAULT_CAMPAIGN_MESSAGE_RULE.waitDays)
  }, [open, value])

  function handleSet() {
    onSet({
      condition,
      waitDays: Math.max(1, Math.min(365, waitDays || 1)),
    })
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Create Rule"
      widthClassName="w-full max-w-[28rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-sm !font-semibold !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSet}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 !text-sm !font-semibold text-white hover:!bg-[#241a52]"
          >
            Set
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[#4A4A5C]">
            Send this Message If
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="min-w-[10rem] flex-1">
              <Select
                id="campaign-rule-condition"
                aria-label="Send this message if"
                options={CAMPAIGN_MESSAGE_RULE_CONDITION_OPTIONS}
                value={condition}
                onChange={(event) =>
                  setCondition(
                    event.target.value as CampaignMessageRuleCondition,
                  )
                }
                className="!h-11"
              />
            </div>
            <span className="shrink-0 text-sm text-[#4A4A5C]">
              to previous message
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-sm font-medium text-[#4A4A5C]">Wait</span>
          <input
            id="campaign-rule-wait-days"
            type="number"
            min={1}
            max={365}
            value={waitDays}
            onChange={(event) =>
              setWaitDays(Number.parseInt(event.target.value, 10) || 0)
            }
            aria-label="Wait days"
            className="h-11 w-20 rounded-md border border-[#D5D2E2] bg-white px-3 text-center text-sm text-[#1A1A2E] outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/15"
          />
          <span className="text-sm text-[#4A4A5C]">days</span>
        </div>
      </div>
    </SidePanel>
  )
}
