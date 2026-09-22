import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button, SidePanel, Textarea, toast } from '../../ui'
import { cn } from '../../../lib/cn'
import {
  AI_JOB_PROMPT_PLACEHOLDER,
  AI_SUGGESTED_PROMPTS,
} from './aiCreateJobData'

const outlineBtnClass =
  '!h-10 !rounded-md !border-[#2D2061]/40 !px-4 !text-[#2D2061] hover:!bg-[#F7F6FA]'
const primaryBtnClass =
  '!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]'

export type AiCreateJobPromptPanelProps = {
  open: boolean
  onClose: () => void
  /** Skip AI flow and open the manual wizard with the current prompt */
  onSkipToManual: (prompt: string) => void
  /** Continue with the current prompt into duplicate detection */
  onContinue: (prompt: string) => void
  onSaveDraft: (prompt: string) => void
}

/**
 * First AI Create Job panel — describe role via prompt or suggested cards.
 */
export function AiCreateJobPromptPanel({
  open,
  onClose,
  onSkipToManual,
  onContinue,
  onSaveDraft,
}: AiCreateJobPromptPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setPrompt('')
    setSelectedPromptId(null)
  }, [open])

  function handleSelectSuggested(id: string, text: string) {
    setSelectedPromptId(id)
    setPrompt(text)
  }

  function handlePromptChange(value: string) {
    setPrompt(value)
    const match = AI_SUGGESTED_PROMPTS.find((item) => item.text === value)
    setSelectedPromptId(match?.id ?? null)
  }

  function handleContinue() {
    const trimmed = prompt.trim()
    if (!trimmed) {
      toast.error('Enter a job prompt or select a suggested prompt.')
      return
    }
    onContinue(trimmed)
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Create Job"
      width="60%"
      footerClassName="justify-between gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onSkipToManual(prompt.trim())}
            className={outlineBtnClass}
          >
            Skip to Manual
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSaveDraft(prompt)}
              className={outlineBtnClass}
            >
              Save as Draft
            </Button>
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
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-bold text-[#1a1a2e]">
            Describe the Job Role
          </h2>
          <p className="mt-1 text-sm text-[#8B8B9E]">
            SniperAI will extract requirements, responsibilities, and key
            criteria from your prompt.
          </p>
        </div>

        <Textarea
          id="ai-create-job-prompt"
          rows={6}
          value={prompt}
          placeholder={AI_JOB_PROMPT_PLACEHOLDER}
          onChange={(e) => handlePromptChange(e.target.value)}
          className="min-h-[9rem] resize-y"
        />

        <div>
          <p className="mb-3 text-sm font-semibold text-[#7B6BA8]">
            AI Suggested Prompts
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {AI_SUGGESTED_PROMPTS.map((item) => {
              const selected = selectedPromptId === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSuggested(item.id, item.text)}
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
    </SidePanel>
  )
}
