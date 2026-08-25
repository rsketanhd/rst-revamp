import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  AppTopBar,
  Button,
  StepsWizard,
  SuccessMessage,
} from '../components/ui'
import { PageHeader } from '../components/layout'
import {
  CREATE_CLIENT_STEPS,
  defaultCreateClientForm,
  type CreateClientFormState,
} from '../components/clients/create/types'
import { StepClientDetailsForm } from '../components/clients/create/StepClientDetailsForm'
import { StepClientUserDetails } from '../components/clients/create/StepClientUserDetails'
import { StepAgencyPoc } from '../components/clients/create/StepAgencyPoc'
import { StepAttachments } from '../components/clients/create/StepAttachments'

const LAST_STEP = CREATE_CLIENT_STEPS.length - 1

export function CreateClientPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [form, setForm] = useState<CreateClientFormState>(
    defaultCreateClientForm,
  )
  const [success, setSuccess] = useState(false)

  function patchForm(patch: Partial<CreateClientFormState>) {
    setForm((current) => ({ ...current, ...patch }))
  }

  function goTo(next: number) {
    setStep(next)
    setMaxReached((max) => Math.max(max, next))
  }

  function handleContinue() {
    if (step >= LAST_STEP) {
      setSuccess(true)
      return
    }
    goTo(step + 1)
  }

  function handlePrevious() {
    if (step === 0) {
      navigate('/client-management')
      return
    }
    setStep((s) => Math.max(0, s - 1))
  }

  function resetWizard() {
    setForm(defaultCreateClientForm)
    setStep(0)
    setMaxReached(0)
    setSuccess(false)
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col bg-white">
      <AppTopBar />

      {success ? (
        <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-8">
          <SuccessMessage
            title="Client Added Successfully!"
            primaryAction={{
              label: 'View All Clients',
              onClick: () => navigate('/client-management'),
            }}
            secondaryAction={{
              label: 'Add New Client',
              onClick: resetWizard,
            }}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="flex min-h-0 flex-1 flex-col px-8 pt-8">
            <header className="shrink-0 border-b border-[#eceaf3] bg-white pb-3">
              <button
                type="button"
                onClick={() => navigate('/client-management')}
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
                title="Create New Client"
                subtitle="Create New Client"
              />
            </header>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
              <aside className="relative z-20 w-full shrink-0 overflow-visible border-b border-[#eceaf3] bg-white pt-3 pb-2 lg:w-[15rem] lg:border-b-0 lg:border-r lg:border-[#E4E3EC] lg:pt-3 xl:w-[15.75rem]">
                <StepsWizard
                  steps={[...CREATE_CLIENT_STEPS]}
                  currentStep={step}
                  completedThrough={maxReached}
                  onStepClick={(index) => {
                    if (index <= maxReached) goTo(index)
                  }}
                />
              </aside>

              <div className="relative z-0 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white py-3 pl-6 pr-0 scrollbar-none">
                {step === 0 ? (
                  <StepClientDetailsForm value={form} onChange={patchForm} />
                ) : null}
                {step === 1 ? (
                  <StepClientUserDetails value={form} onChange={patchForm} />
                ) : null}
                {step === 2 ? (
                  <StepAgencyPoc value={form} onChange={patchForm} />
                ) : null}
                {step === 3 ? (
                  <StepAttachments value={form} onChange={patchForm} />
                ) : null}
              </div>
            </div>
          </div>

          <footer className="z-30 shrink-0 border-t border-[#eceaf3] bg-white px-8 py-4">
            <div className="flex items-center justify-end gap-3">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="min-w-[6.5rem] border-[#2D2061]/40 text-[#2D2061] hover:bg-[#f7f6fb]"
                >
                  Previous
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={handleContinue}
                className="min-w-[6.5rem] !bg-[#2D2061] hover:!bg-[#241a52]"
              >
                Continue
              </Button>
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}
