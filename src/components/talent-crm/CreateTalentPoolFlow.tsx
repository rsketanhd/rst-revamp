import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, SidePanel, toast } from '../ui'
import { CreateTalentPoolMatchesStep } from './CreateTalentPoolMatchesStep'
import { CreateTalentPoolPromptStep } from './CreateTalentPoolPromptStep'
import {
  AI_SIMILAR_TALENT_POOLS,
  DEFAULT_TALENT_POOL_CRITERIA,
  DEFAULT_TALENT_POOL_REFINE_CRITERIA,
  detectTalentPoolCriteria,
  refineCriteriaFromPrompt,
  TALENT_POOL_SUGGESTED_PROMPTS,
  type CreateTalentPoolNavState,
  type TalentPoolPromptCriterionId,
  type TalentPoolRefineCriteria,
} from './createTalentPoolData'

export type CreateTalentPoolFlowProps = {
  open: boolean
  onClose: () => void
}

type FlowStep = 'prompt' | 'matches'

const TOAST_TITLE = 'Talent CRM'

const outlineBtnClass =
  '!h-10 !rounded-md !border-[#2D2061]/40 !px-4 !text-[#2D2061] hover:!bg-[#F7F6FA]'
const primaryBtnClass =
  '!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]'

/**
 * Create Talent Pool — single SidePanel; navigates to wizard on Skip actions.
 */
export function CreateTalentPoolFlow({
  open,
  onClose,
}: CreateTalentPoolFlowProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<FlowStep>('prompt')
  const [prompt, setPrompt] = useState('')
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [detectedCriteria, setDetectedCriteria] = useState<
    TalentPoolPromptCriterionId[]
  >(DEFAULT_TALENT_POOL_CRITERIA)
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null)
  const [refineCriteria, setRefineCriteria] = useState<TalentPoolRefineCriteria>(
    DEFAULT_TALENT_POOL_REFINE_CRITERIA,
  )

  useEffect(() => {
    if (!open) return
    setStep('prompt')
    setPrompt('')
    setSelectedPromptId(null)
    setDetectedCriteria(DEFAULT_TALENT_POOL_CRITERIA)
    setSelectedPoolId(null)
    setRefineCriteria(DEFAULT_TALENT_POOL_REFINE_CRITERIA)
  }, [open])

  function goToWizard(state: CreateTalentPoolNavState) {
    onClose()
    navigate('/talent-crm/talent-pool/new', { state })
  }

  function applyPrompt(value: string, suggestedId?: string) {
    setPrompt(value)
    setDetectedCriteria(detectTalentPoolCriteria(value))
    if (suggestedId !== undefined) {
      setSelectedPromptId(suggestedId)
      return
    }
    const match = TALENT_POOL_SUGGESTED_PROMPTS.find((item) => item.text === value)
    setSelectedPromptId(match?.id ?? null)
  }

  function handleContinue() {
    const trimmed = prompt.trim()
    if (!trimmed) {
      toast.error(
        'Enter a talent pool description or select a suggested prompt.',
        { title: TOAST_TITLE },
      )
      return
    }
    setPrompt(trimmed)
    setRefineCriteria(refineCriteriaFromPrompt(trimmed))
    setSelectedPoolId(null)
    setStep('matches')
  }

  function handleSkipToManual() {
    goToWizard({ manualEntry: true })
  }

  function handleSkipAndCreateNew() {
    const selected =
      AI_SIMILAR_TALENT_POOLS.find((pool) => pool.id === selectedPoolId) ?? null
    goToWizard({
      aiContinue: true,
      aiPrompt: prompt.trim(),
      similarPoolId: selected?.id,
      similarPoolName: selected?.name,
      refineCriteria,
    })
  }

  const isMatches = step === 'matches'

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Create Talent Pool"
      width="60%"
      footerClassName={
        isMatches
          ? 'justify-end gap-3 border-t border-[#ECEAF3]'
          : 'justify-between gap-3 border-t border-[#ECEAF3]'
      }
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
              onClick={handleSkipToManual}
              className={outlineBtnClass}
            >
              Skip to Manual
            </Button>
            <div className="flex gap-3">
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
            </div>
          </>
        )
      }
    >
      {isMatches ? (
        <CreateTalentPoolMatchesStep
          selectedId={selectedPoolId}
          criteria={refineCriteria}
          onTogglePool={(id) =>
            setSelectedPoolId((current) => (current === id ? null : id))
          }
          onCriteriaChange={(key, value) =>
            setRefineCriteria((current) => ({ ...current, [key]: value }))
          }
        />
      ) : (
        <CreateTalentPoolPromptStep
          prompt={prompt}
          selectedPromptId={selectedPromptId}
          criteria={detectedCriteria}
          onPromptChange={(value) => applyPrompt(value)}
          onSelectSuggested={(id, text) => applyPrompt(text, id)}
        />
      )}
    </SidePanel>
  )
}
