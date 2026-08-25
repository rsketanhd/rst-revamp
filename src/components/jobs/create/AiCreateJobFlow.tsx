import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiCreateJobPromptPanel } from './AiCreateJobPromptPanel'
import { AiCreateJobDuplicatePanel } from './AiCreateJobDuplicatePanel'
import type { AiCreateJobNavState, SimilarJobMatch } from './aiCreateJobData'

export type AiCreateJobFlowProps = {
  open: boolean
  onClose: () => void
}

type FlowStep = 'prompt' | 'duplicates'

/**
 * Orchestrates AI Create Job side panels: prompt → duplicate check → wizard.
 */
export function AiCreateJobFlow({ open, onClose }: AiCreateJobFlowProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<FlowStep>('prompt')
  const [prompt, setPrompt] = useState('')

  function resetAndClose() {
    setStep('prompt')
    setPrompt('')
    onClose()
  }

  function goToWizard(state?: AiCreateJobNavState) {
    resetAndClose()
    navigate('/jobs/new', { state })
  }

  function handleSkipToManual() {
    goToWizard()
  }

  function handlePromptContinue(nextPrompt: string) {
    setPrompt(nextPrompt)
    setStep('duplicates')
  }

  function handleSkipAndContinue(selected: SimilarJobMatch | null) {
    goToWizard({
      aiPrompt: prompt,
      similarJobId: selected?.id,
      similarJobTitle: selected?.title,
    })
  }

  return (
    <>
      <AiCreateJobPromptPanel
        open={open && step === 'prompt'}
        onClose={resetAndClose}
        onSkipToManual={handleSkipToManual}
        onContinue={handlePromptContinue}
      />
      <AiCreateJobDuplicatePanel
        open={open && step === 'duplicates'}
        onClose={resetAndClose}
        onSkipToManual={handleSkipToManual}
        onSkipAndContinue={handleSkipAndContinue}
      />
    </>
  )
}
