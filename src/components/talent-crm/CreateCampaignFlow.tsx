import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, SidePanel, toast } from '../ui'
import { CreateCampaignMatchesStep } from './CreateCampaignMatchesStep'
import { CreateCampaignPromptStep } from './CreateCampaignPromptStep'
import {
  AI_SIMILAR_CAMPAIGNS,
  CAMPAIGN_SUGGESTED_PROMPTS,
  DEFAULT_CAMPAIGN_CRITERIA,
  DEFAULT_CAMPAIGN_REFINE_CRITERIA,
  detectCampaignCriteria,
  refineCampaignCriteriaFromPrompt,
  type CampaignPromptCriterionId,
  type CampaignRefineCriteria,
  type CreateCampaignNavState,
} from './createCampaignData'

export type CreateCampaignFlowProps = {
  open: boolean
  onClose: () => void
  /** When opened from Talent Pool Details, pre-select this pool in the wizard. */
  initialTalentPoolName?: string
}

type FlowStep = 'prompt' | 'matches'

const TOAST_TITLE = 'Campaigns'
const WIZARD_PATH = '/talent-crm/campaigns/new'

const outlineBtnClass =
  '!h-10 !rounded-md !border-[#2D2061]/40 !px-4 !text-[#2D2061] hover:!bg-[#F7F6FA]'
const primaryBtnClass =
  '!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]'

/**
 * Create Campaign — prompt panel → similar campaigns panel → wizard.
 */
export function CreateCampaignFlow({
  open,
  onClose,
  initialTalentPoolName,
}: CreateCampaignFlowProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<FlowStep>('prompt')
  const [prompt, setPrompt] = useState('')
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [detectedCriteria, setDetectedCriteria] = useState<
    CampaignPromptCriterionId[]
  >(DEFAULT_CAMPAIGN_CRITERIA)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  )
  const [refineCriteria, setRefineCriteria] = useState<CampaignRefineCriteria>(
    DEFAULT_CAMPAIGN_REFINE_CRITERIA,
  )

  useEffect(() => {
    if (!open) return
    setStep('prompt')
    setPrompt('')
    setSelectedPromptId(null)
    setDetectedCriteria(DEFAULT_CAMPAIGN_CRITERIA)
    setSelectedCampaignId(null)
    setRefineCriteria(DEFAULT_CAMPAIGN_REFINE_CRITERIA)
  }, [open])

  function goToWizard(state: CreateCampaignNavState) {
    onClose()
    navigate(WIZARD_PATH, {
      state: {
        ...state,
        talentPoolName: state.talentPoolName ?? initialTalentPoolName,
      },
    })
  }

  function applyPrompt(value: string, suggestedId?: string) {
    setPrompt(value)
    setDetectedCriteria(detectCampaignCriteria(value))
    if (suggestedId !== undefined) {
      setSelectedPromptId(suggestedId)
      return
    }
    const match = CAMPAIGN_SUGGESTED_PROMPTS.find((item) => item.text === value)
    setSelectedPromptId(match?.id ?? null)
  }

  function handleContinue() {
    const trimmed = prompt.trim()
    if (!trimmed) {
      toast.error(
        'Enter a campaign description or select a suggested prompt.',
        { title: TOAST_TITLE },
      )
      return
    }
    setPrompt(trimmed)
    setRefineCriteria(refineCampaignCriteriaFromPrompt(trimmed))
    setSelectedCampaignId(null)
    setStep('matches')
  }

  function handleSkipAndCreateNew() {
    const selected = AI_SIMILAR_CAMPAIGNS.find(
      (item) => item.id === selectedCampaignId,
    )
    goToWizard({
      aiContinue: true,
      aiPrompt: prompt.trim(),
      similarCampaignId: selected?.id,
      similarCampaignName: selected?.name,
      refineCriteria,
    })
  }

  const isMatches = step === 'matches'

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Create Campaign"
      width="60%"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        isMatches ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('prompt')}
              className={outlineBtnClass}
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleSkipAndCreateNew}
              className={primaryBtnClass}
            >
              Skip &amp; Create New
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={outlineBtnClass}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleContinue}
              className={primaryBtnClass}
            >
              Continue
            </Button>
          </>
        )
      }
    >
      {isMatches ? (
        <CreateCampaignMatchesStep
          selectedId={selectedCampaignId}
          criteria={refineCriteria}
          onToggleCampaign={(id) =>
            setSelectedCampaignId((current) => (current === id ? null : id))
          }
          onCriteriaChange={(key, value) =>
            setRefineCriteria((current) => ({ ...current, [key]: value }))
          }
        />
      ) : (
        <CreateCampaignPromptStep
          prompt={prompt}
          selectedPromptId={selectedPromptId}
          criteria={detectedCriteria}
          onPromptChange={(value) => applyPrompt(value)}
          onSelectSuggested={(id, text) => applyPrompt(text, id)}
          onSelectRecent={(text) => applyPrompt(text)}
        />
      )}
    </SidePanel>
  )
}
