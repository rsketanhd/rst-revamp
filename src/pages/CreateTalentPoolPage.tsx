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
import { StepPoolAutoUpdate } from '../components/talent-crm/create/StepPoolAutoUpdate'
import { StepPoolDetails } from '../components/talent-crm/create/StepPoolDetails'
import { StepPoolReview } from '../components/talent-crm/create/StepPoolReview'
import {
  CREATE_TALENT_POOL_STEPS,
  createTalentPoolFormFromNavState,
  type CreateTalentPoolFormState,
  type CreateTalentPoolNavState,
} from '../components/talent-crm/createTalentPoolData'

const LAST_STEP = CREATE_TALENT_POOL_STEPS.length - 1
const LIST_PATH = '/talent-crm/talent-pool'
const wizardOutlineBtnClass =
  'border-[#2D2061]/40 text-[#2D2061] hover:bg-[#f7f6fb]'
const TOAST_TITLE = 'Talent CRM'

/** Toast an error and return false so callers can early-exit validation. */
function fail(message: string): false {
  toast.error(message, { title: TOAST_TITLE })
  return false
}

function canLeaveDetails(form: CreateTalentPoolFormState): boolean {
  if (!form.name.trim()) return fail('Enter a talent pool name.')
  if (form.owners.length === 0) return fail('Select at least one owner.')
  if (!form.description.trim()) return fail('Enter a description.')
  if (!form.privacy) return fail('Select a privacy option.')
  return true
}

function canLeaveAutoUpdate(form: CreateTalentPoolFormState): boolean {
  if (!form.autoUpdate) return true
  if (form.jobTitles.length === 0) return fail('Select at least one job title.')
  if (form.skills.length === 0) return fail('Select at least one skill.')
  if (form.experienceMax < form.experienceMin) {
    return fail('Experience max must be greater than or equal to min.')
  }
  if (!form.location) return fail('Select a location.')
  if (!form.jobRadius) return fail('Select a job radius.')
  return true
}

/**
 * Create New Talent Pool wizard — Details → Auto Update → Review.
 */
export function CreateTalentPoolPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const navState = (location.state as CreateTalentPoolNavState | null) ?? null

  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<CreateTalentPoolFormState>(() =>
    createTalentPoolFormFromNavState(navState),
  )

  function patchForm(patch: Partial<CreateTalentPoolFormState>) {
    setForm((current) => ({ ...current, ...patch }))
  }

  function goTo(next: number) {
    setStep(next)
    setMaxReached((max) => Math.max(max, next))
  }

  function resetWizard() {
    setForm(createTalentPoolFormFromNavState({ manualEntry: true }))
    setStep(0)
    setMaxReached(0)
    setSuccess(false)
  }

  function handleContinue() {
    if (step === 0 && !canLeaveDetails(form)) return
    if (step === 1 && !canLeaveAutoUpdate(form)) return
    if (step >= LAST_STEP) {
      setSuccess(true)
      return
    }
    goTo(step + 1)
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
            title="Talent Pool Created Successfully!"
            primaryAction={{
              label: 'View All Pools',
              onClick: () => navigate(LIST_PATH),
            }}
            secondaryAction={{
              label: 'Add New Pool',
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
                title="Create New Talent Pool"
                subtitle="Set up outreach to your talent pool."
              />
            </header>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
              <aside className="relative z-20 w-full shrink-0 overflow-visible border-b border-[#eceaf3] bg-white pt-3 pb-2 lg:w-[15rem] lg:border-b-0 lg:border-r lg:border-[#E4E3EC] lg:pt-3 xl:w-[15.75rem]">
                <StepsWizard
                  steps={[...CREATE_TALENT_POOL_STEPS]}
                  currentStep={step}
                  completedThrough={maxReached}
                  onStepClick={(index) => {
                    if (index <= maxReached) goTo(index)
                  }}
                />
              </aside>

              <div className="relative z-0 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white py-3 pl-6 pr-0 scrollbar-none">
                {step === 0 ? (
                  <StepPoolDetails value={form} onChange={patchForm} />
                ) : null}
                {step === 1 ? (
                  <StepPoolAutoUpdate value={form} onChange={patchForm} />
                ) : null}
                {step === 2 ? (
                  <StepPoolReview
                    value={form}
                    onChange={patchForm}
                    onEditDetails={() => goTo(0)}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <footer className="z-30 shrink-0 border-t border-[#eceaf3] bg-white px-8 py-4">
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className={`min-w-[6.5rem] ${wizardOutlineBtnClass}`}
              >
                Previous
              </Button>
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
