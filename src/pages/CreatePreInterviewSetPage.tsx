import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  AppTopBar,
  Button,
  StepsWizard,
  SuccessMessage,
} from '../components/ui'
import { PageHeader } from '../components/layout'
import {
  CREATE_PRE_INTERVIEW_STEPS,
  defaultCreatePreInterviewSetForm,
  type CreatePreInterviewSetForm,
} from '../components/jeeves/create/types'
import { preInterviewSetToWizardForm } from '../components/jeeves/create/fromPreInterviewSet'
import { StepSetDetails } from '../components/jeeves/create/StepSetDetails'
import { StepSetQuestions } from '../components/jeeves/create/StepSetQuestions'
import { StepSetReview } from '../components/jeeves/create/StepSetReview'
import { getPreInterviewSetById } from '../data/jeevesPreInterviewSets'

const LAST_STEP = CREATE_PRE_INTERVIEW_STEPS.length - 1
const LIST_PATH = '/jeeves-ai'

/**
 * Create Pre-Interview Set wizard — Details → Questions → Review.
 * With a `setId` route param it edits that set instead.
 */
export function CreatePreInterviewSetPage() {
  const navigate = useNavigate()
  const { setId } = useParams()
  const editing = useMemo(
    () => (setId ? getPreInterviewSetById(setId) : undefined),
    [setId],
  )
  const initialForm = useMemo(
    () =>
      editing
        ? preInterviewSetToWizardForm(editing)
        : defaultCreatePreInterviewSetForm,
    [editing],
  )
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(editing ? LAST_STEP : 0)
  const [form, setForm] = useState<CreatePreInterviewSetForm>(initialForm)
  const [nameError, setNameError] = useState('')
  const [success, setSuccess] = useState(false)

  const detailPath = editing
    ? `${LIST_PATH}/pre-interview-sets/${editing.id}`
    : LIST_PATH
  const backLabel = editing
    ? 'Back to set'
    : 'Back to Pre-Interview Sets'

  function patchForm(patch: Partial<CreatePreInterviewSetForm>) {
    setForm((current) => ({ ...current, ...patch }))
    if (patch.name !== undefined && nameError) setNameError('')
  }

  function goTo(next: number) {
    setStep(next)
    setMaxReached((max) => Math.max(max, next))
  }

  function handleContinue() {
    if (step === 0 && !form.name.trim()) {
      setNameError('Set name is required')
      return
    }
    if (step === 0) setNameError('')

    if (step >= LAST_STEP) {
      setSuccess(true)
      return
    }
    goTo(step + 1)
  }

  function handlePrevious() {
    if (step === 0) {
      navigate(detailPath)
      return
    }
    setStep((s) => Math.max(0, s - 1))
  }

  function resetWizard() {
    setForm(defaultCreatePreInterviewSetForm)
    setStep(0)
    setMaxReached(0)
    setNameError('')
    setSuccess(false)
  }

  if (setId && !editing) {
    return (
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col bg-white">
        <AppTopBar />
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-8">
          <p className="text-sm font-semibold text-[#2D2061]">Set not found</p>
          <Button type="button" variant="outline" onClick={() => navigate(LIST_PATH)}>
            Back to Pre-Interview Sets
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col bg-white">
      <AppTopBar />

      {success ? (
        <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-8">
          <SuccessMessage
            title={
              editing
                ? 'Pre-Interview Set Updated Successfully!'
                : 'Pre-Interview Set Created Successfully!'
            }
            primaryAction={{
              label: 'View All Sets',
              onClick: () => navigate(LIST_PATH),
            }}
            secondaryAction={
              editing
                ? {
                    label: 'Back to Set',
                    onClick: () => navigate(detailPath),
                  }
                : {
                    label: 'Create Another',
                    onClick: resetWizard,
                  }
            }
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="flex min-h-0 flex-1 flex-col px-8 pt-8">
            <header className="shrink-0 border-b border-[#eceaf3] bg-white pb-3">
              <button
                type="button"
                onClick={() => navigate(detailPath)}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
              >
                <ArrowLeft
                  className="size-3.5 shrink-0"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {backLabel}
              </button>

              <PageHeader
                className="mt-1"
                title={
                  editing
                    ? 'Edit Pre-Interview Set'
                    : 'Create Pre-Interview Set'
                }
                subtitle={
                  editing
                    ? `Update the details and questions of “${editing.name}”. Saving creates a new version.`
                    : 'Name the set, choose its type, add the questions, then review.'
                }
              />
            </header>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
              <aside className="relative z-20 w-full shrink-0 overflow-visible border-b border-[#eceaf3] bg-white pt-3 pb-2 lg:w-[15rem] lg:border-b-0 lg:border-r lg:border-[#E4E3EC] lg:pt-3 xl:w-[15.75rem]">
                <StepsWizard
                  steps={[...CREATE_PRE_INTERVIEW_STEPS]}
                  currentStep={step}
                  completedThrough={maxReached}
                  onStepClick={(index) => {
                    if (index <= maxReached) goTo(index)
                  }}
                />
              </aside>

              <div className="relative z-0 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white py-3 pl-6 pr-0 scrollbar-none">
                {step === 0 ? (
                  <StepSetDetails
                    value={form}
                    onChange={patchForm}
                    nameError={nameError}
                  />
                ) : null}
                {step === 1 ? (
                  <StepSetQuestions value={form} onChange={patchForm} />
                ) : null}
                {step === 2 ? (
                  <StepSetReview
                    value={form}
                    onEditDetails={() => goTo(0)}
                    onEditQuestions={() => goTo(1)}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <footer className="z-30 shrink-0 border-t border-[#eceaf3] bg-white px-8 py-4">
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="min-w-[6.5rem] border-[#2D2061]/40 text-[#2D2061] hover:bg-[#f7f6fb]"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleContinue}
                className="min-w-[6.5rem] !bg-[#2D2061] hover:!bg-[#241a52]"
              >
                {step >= LAST_STEP
                  ? editing
                    ? 'Save Changes'
                    : 'Create'
                  : 'Continue'}
              </Button>
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}
