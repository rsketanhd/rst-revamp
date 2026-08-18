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
  CREATE_JOB_STEPS,
  defaultCreateJobForm,
  type CreateJobFormState,
} from '../components/jobs/create/types'
import { StepCreateJob } from '../components/jobs/create/StepCreateJob'
import { StepJobDetails } from '../components/jobs/create/StepJobDetails'
import { StepJobAnalyzer } from '../components/jobs/create/StepJobAnalyzer'
import { StepClientDetails } from '../components/jobs/create/StepClientDetails'
import { StepJobBoards } from '../components/jobs/create/StepJobBoards'
import { StepReview } from '../components/jobs/create/StepReview'

const LAST_STEP = CREATE_JOB_STEPS.length - 1

export function CreateJobPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [form, setForm] = useState<CreateJobFormState>(defaultCreateJobForm)
  const [success, setSuccess] = useState(false)

  function patchForm(patch: Partial<CreateJobFormState>) {
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
      navigate('/jobs')
      return
    }
    setStep((s) => Math.max(0, s - 1))
  }

  function resetWizard() {
    setForm(defaultCreateJobForm)
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
            title="Job Created Successfully!"
            primaryAction={{
              label: 'View All Jobs',
              onClick: () => navigate('/jobs'),
            }}
            secondaryAction={{
              label: 'Add New Job',
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
                onClick={() => navigate('/jobs')}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
              >
                <ArrowLeft className="size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                Go Back
              </button>

              <PageHeader
                className="mt-1"
                title="Create New Job"
                subtitle="AI-powered job creation with intelligent suggestions."
              />
            </header>

            {/*
              Rail has no scroll overflow so the active caret can paint past the
              vertical border into the form padding. Form scrolls without a bar.
            */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
              <aside className="relative z-20 w-full shrink-0 overflow-visible border-b border-[#eceaf3] bg-white pt-3 pb-2 lg:w-[15rem] lg:border-b-0 lg:border-r lg:border-[#E4E3EC] lg:pt-3 xl:w-[15.75rem]">
                <StepsWizard
                  steps={[...CREATE_JOB_STEPS]}
                  currentStep={step}
                  completedThrough={maxReached}
                  onStepClick={(index) => {
                    if (index <= maxReached) goTo(index)
                  }}
                />
              </aside>

              <div className="relative z-0 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white py-3 pl-6 pr-0 scrollbar-none">
                {step === 0 ? (
                  <StepCreateJob value={form} onChange={patchForm} />
                ) : null}
                {step === 1 ? (
                  <StepJobDetails value={form} onChange={patchForm} />
                ) : null}
                {step === 2 ? (
                  <StepJobAnalyzer value={form} onChange={patchForm} />
                ) : null}
                {step === 3 ? (
                  <StepClientDetails value={form} onChange={patchForm} />
                ) : null}
                {step === 4 ? (
                  <StepJobBoards value={form} onChange={patchForm} />
                ) : null}
                {step === 5 ? (
                  <StepReview value={form} onChange={patchForm} />
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
                {step >= LAST_STEP ? 'Create' : 'Continue'}
              </Button>
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}
