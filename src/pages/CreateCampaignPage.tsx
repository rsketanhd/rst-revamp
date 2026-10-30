import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  AppTopBar,
  Button,
  StepsWizard,
  SuccessMessage,
  toast,
} from '../components/ui'
import { PageHeader } from '../components/layout'
import { StepCampaignDetails } from '../components/talent-crm/create/StepCampaignDetails'
import { StepCampaignMessages } from '../components/talent-crm/create/StepCampaignMessages'
import { StepCampaignReview } from '../components/talent-crm/create/StepCampaignReview'
import { StepCampaignSettings } from '../components/talent-crm/create/StepCampaignSettings'
import {
  CREATE_CAMPAIGN_STEPS,
  createCampaignFormFromNavState,
  type CreateCampaignFormState,
  type CreateCampaignNavState,
} from '../components/talent-crm/createCampaignData'

const LAST_STEP = CREATE_CAMPAIGN_STEPS.length - 1
const LIST_PATH = '/talent-crm/campaigns'
const wizardOutlineBtnClass =
  'border-[#2D2061]/40 text-[#2D2061] hover:bg-[#f7f6fb]'
const TOAST_TITLE = 'Campaigns'

function fail(message: string): false {
  toast.error(message, { title: TOAST_TITLE })
  return false
}

function canLeaveDetails(form: CreateCampaignFormState): boolean {
  if (!form.name.trim()) return fail('Enter a campaign name.')
  if (form.owners.length === 0) return fail('Select at least one owner.')
  if (!form.channel) return fail('Select a channel.')
  if (!form.fromAddress) return fail('Select a from address.')
  if (!form.replyToAddress) return fail('Select a reply-to address.')
  if (!form.talentPool) return fail('Select a talent pool.')
  if (!form.suppressedAction) {
    return fail('Select a suppressed candidate action.')
  }
  return true
}

function canLeaveMessages(form: CreateCampaignFormState): boolean {
  if (form.messages.length === 0) {
    return fail('Add at least one message to the sequence.')
  }
  if (form.messages.some((item) => !item.template)) {
    return fail('Select a template for every message in the sequence.')
  }
  return true
}

function canLeaveSettings(form: CreateCampaignFormState): boolean {
  if (form.sendMode === 'now') return true
  if (form.sendMode === 'schedule') {
    if (!form.scheduleDate) return fail('Pick a schedule date.')
    if (!form.scheduleTime) return fail('Pick a schedule time.')
    if (!form.scheduleTimezone) return fail('Pick a timezone.')
    return true
  }
  if (!form.recurringInterval || form.recurringInterval < 1) {
    return fail('Enter a repeat interval of at least 1.')
  }
  if (form.recurringUnit === 'week' && form.recurringWeekdays.length === 0) {
    return fail('Select at least one day of the week.')
  }
  if (!form.recurringStartDate) return fail('Pick a start date.')
  if (!form.recurringTime) return fail('Pick a send time.')
  if (!form.recurringTimezone) return fail('Pick a timezone.')
  if (form.recurringEnd.type === 'after' && form.recurringEnd.occurrences < 1) {
    return fail('Enter at least 1 occurrence.')
  }
  if (form.recurringEnd.type === 'on-date' && !form.recurringEnd.date) {
    return fail('Pick an end date.')
  }
  return true
}

function WizardStepBody({
  step,
  form,
  onChange,
  onGoToStep,
}: {
  step: number
  form: CreateCampaignFormState
  onChange: (patch: Partial<CreateCampaignFormState>) => void
  onGoToStep: (step: number) => void
}) {
  if (step === 0) {
    return <StepCampaignDetails value={form} onChange={onChange} />
  }
  if (step === 1) {
    return (
      <StepCampaignMessages
        channel={form.channel}
        messages={form.messages}
        onChange={(messages) => onChange({ messages })}
      />
    )
  }
  if (step === 2) {
    return (
      <StepCampaignSettings
        channel={form.channel}
        value={form}
        onChange={onChange}
      />
    )
  }
  if (step === 3) {
    return (
      <StepCampaignReview
        value={form}
        onEditDetails={() => onGoToStep(0)}
        onEditMessages={() => onGoToStep(1)}
        onEditSettings={() => onGoToStep(2)}
      />
    )
  }
  return null
}

/**
 * Create New Campaign wizard — Details → Messages → Settings → Review.
 */
export function CreateCampaignPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const navState = (location.state as CreateCampaignNavState | null) ?? null

  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<CreateCampaignFormState>(() =>
    createCampaignFormFromNavState(navState),
  )

  function patchForm(patch: Partial<CreateCampaignFormState>) {
    setForm((current) => ({ ...current, ...patch }))
  }

  function goTo(next: number) {
    setStep(next)
    setMaxReached((max) => Math.max(max, next))
  }

  function resetWizard() {
    setForm(createCampaignFormFromNavState({ manualEntry: true }))
    setStep(0)
    setMaxReached(0)
    setSuccess(false)
  }

  function handleContinue() {
    if (step === 0 && !canLeaveDetails(form)) return
    if (step === 1 && !canLeaveMessages(form)) return
    if (step === 2 && !canLeaveSettings(form)) return
    if (step >= LAST_STEP) {
      setSuccess(true)
      return
    }
    goTo(step + 1)
  }

  function handleSaveDraft() {
    toast.success('Campaign saved as draft.', { title: TOAST_TITLE })
    navigate(LIST_PATH)
  }

  function handlePrevious() {
    if (step === 0) {
      navigate(LIST_PATH)
      return
    }
    setStep((current) => Math.max(0, current - 1))
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col bg-white">
      <AppTopBar />

      {success ? (
        <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-8">
          <SuccessMessage
            title="Campaign Created Successfully!"
            primaryAction={{
              label: 'View All Campaigns',
              onClick: () => navigate(LIST_PATH),
            }}
            secondaryAction={{
              label: 'Create Another',
              onClick: resetWizard,
            }}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
            <header className="shrink-0 border-b border-[#eceaf3] bg-white pb-3">
              <button
                type="button"
                onClick={() => navigate(LIST_PATH)}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
              >
                <ArrowLeft
                  className="size-3.5 shrink-0"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Go Back
              </button>

              <PageHeader
                className="mt-1"
                title="Create New Campaign"
                subtitle="Set up outreach to your talent pool."
              />
            </header>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
              <aside className="relative z-20 w-full shrink-0 overflow-visible border-b border-[#eceaf3] bg-white pt-3 pb-2 lg:w-[15rem] lg:border-b-0 lg:border-r lg:border-[#E4E3EC] lg:pt-3 xl:w-[15.75rem]">
                <StepsWizard
                  steps={[...CREATE_CAMPAIGN_STEPS]}
                  currentStep={step}
                  completedThrough={maxReached}
                  onStepClick={(index) => {
                    if (index <= maxReached) goTo(index)
                  }}
                />
              </aside>

              <div className="relative z-0 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white px-4 py-3 sm:px-6 scrollbar-none">
                <WizardStepBody
                  step={step}
                  form={form}
                  onChange={patchForm}
                  onGoToStep={goTo}
                />
              </div>
            </div>
          </div>

          <footer className="z-30 shrink-0 border-t border-[#eceaf3] bg-white px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
            <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className={`w-full min-w-0 sm:w-auto sm:min-w-[6.5rem] ${wizardOutlineBtnClass}`}
              >
                Previous
              </Button>
              {step >= LAST_STEP ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  className={`w-full min-w-0 sm:w-auto sm:min-w-[7.5rem] ${wizardOutlineBtnClass}`}
                >
                  Save as Draft
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={handleContinue}
                className="w-full min-w-0 sm:w-auto sm:min-w-[6.5rem] !bg-[#2D2061] hover:!bg-[#241a52]"
              >
                {step >= LAST_STEP ? 'Create' : 'Continue'}
              </Button>
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}
