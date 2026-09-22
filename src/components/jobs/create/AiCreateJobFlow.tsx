import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../ui'
import { JOBS_DRAFT_NAV_STATE } from '../../../data/jobs'
import type { AiCreateJobNavState, SimilarJobMatch } from './aiCreateJobData'
import { AiCreateJobDuplicatePanel } from './AiCreateJobDuplicatePanel'
import { AiCreateJobPromptPanel } from './AiCreateJobPromptPanel'
import { persistDraftFromPrompt } from './jobListingToForm'

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

  function handleSkipFromPrompt(nextPrompt: string) {
    const text = nextPrompt.trim()
    goToWizard({
      manualEntry: true,
      aiPrompt: text || undefined,
    })
  }

  function handleSkipFromDuplicates(selected: SimilarJobMatch | null) {
    const text = prompt.trim()
    goToWizard({
      manualEntry: true,
      aiPrompt: text || undefined,
      similarJobId: selected?.id,
      similarJobTitle: selected?.title,
      similarJobDepartment: selected?.department,
    })
  }

  function handlePromptContinue(nextPrompt: string) {
    setPrompt(nextPrompt.trim())
    setStep('duplicates')
  }

  function handleSkipAndContinue(selected: SimilarJobMatch | null) {
    goToWizard({
      aiContinue: true,
      aiPrompt: prompt,
      similarJobId: selected?.id,
      similarJobTitle: selected?.title,
      similarJobDepartment: selected?.department,
    })
  }

  function handleSaveDraft(nextPrompt?: string) {
    const listing = persistDraftFromPrompt(nextPrompt ?? prompt)
    toast.success(`“${listing.title}” saved as draft.`, {
      title: 'Draft saved',
    })
    resetAndClose()
    navigate('/jobs', { state: JOBS_DRAFT_NAV_STATE })
  }

  return (
    <>
      <AiCreateJobPromptPanel
        open={open && step === 'prompt'}
        onClose={resetAndClose}
        onSkipToManual={handleSkipFromPrompt}
        onContinue={handlePromptContinue}
        onSaveDraft={handleSaveDraft}
      />
      <AiCreateJobDuplicatePanel
        open={open && step === 'duplicates'}
        onClose={resetAndClose}
        onSkipToManual={handleSkipFromDuplicates}
        onSkipAndContinue={handleSkipAndContinue}
        onSaveDraft={handleSaveDraft}
      />
    </>
  )
}
