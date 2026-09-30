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
import { JOBS } from '../data/jobs'
import {
  CREATE_ONE_WAY_STEPS,
  defaultCreateOneWayForm,
  type CreateOneWayInterviewForm,
} from '../components/interviews/create/types'
import { StepInterviewDetails } from '../components/interviews/create/StepInterviewDetails'
import { StepInterviewRounds } from '../components/interviews/create/StepInterviewRounds'
import type { InterviewTemplateOption } from '../components/interviews/create/templates'
import { StepInterviewReview } from '../components/interviews/create/StepInterviewReview'
import { interviewSetToWizardState } from '../components/interviews/create/fromInterviewSet'
import { getOneWayInterviewById } from '../data/oneWayInterviews'

const LAST_STEP = CREATE_ONE_WAY_STEPS.length - 1
const LIST_PATH = '/e2e-interviews/one-way'

/**
 * Create One-Way Interview wizard — Details → Rounds & Templates → Review.
 * With an `interviewId` route param it edits that interview set instead.
 */
export function CreateOneWayInterviewPage() {
  const navigate = useNavigate()
  const { interviewId } = useParams()
  const editing = useMemo(
    () => (interviewId ? getOneWayInterviewById(interviewId) : undefined),
    [interviewId],
  )
  const initial = useMemo(
    () =>
      editing
        ? interviewSetToWizardState(editing)
        : { form: defaultCreateOneWayForm, templates: [] },
    [editing],
  )
  const [step, setStep] = useState(0)
  // Every step of an existing interview is already filled in, so all are reachable
  const [maxReached, setMaxReached] = useState(editing ? LAST_STEP : 0)
  const [form, setForm] = useState<CreateOneWayInterviewForm>(initial.form)
  const [success, setSuccess] = useState(false)
  const [templates, setTemplates] = useState<InterviewTemplateOption[]>(
    initial.templates,
  )
  const detailPath = editing ? `${LIST_PATH}/${editing.id}` : LIST_PATH

  const jobOptions = useMemo(
    () =>
      JOBS.filter((job) => job.status === 'active').map((job) => ({
        value: job.code,
        label: `${job.code} — ${job.title}`,
      })),
    [],
  )

  const jobLabel = useMemo(
    () =>
      jobOptions.find((j) => j.value === form.jobCode)?.label ?? form.jobCode,
    [form.jobCode, jobOptions],
  )

  function patchForm(patch: Partial<CreateOneWayInterviewForm>) {
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
      navigate(detailPath)
      return
    }
    setStep((s) => Math.max(0, s - 1))
  }

  function resetWizard() {
    setForm(initial.form)
    setTemplates(initial.templates)
    setStep(0)
    setMaxReached(editing ? LAST_STEP : 0)
    setSuccess(false)
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col bg-white">
      <AppTopBar />

      {success ? (
        <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-8">
          <SuccessMessage
            title={
              editing
                ? 'Interview Updated Successfully!'
                : 'Interview Created Successfully!'
            }
            primaryAction={{
              label: 'View All Interviews',
              onClick: () => navigate(LIST_PATH),
            }}
            secondaryAction={
              editing
                ? { label: 'Back to Interview', onClick: () => navigate(detailPath) }
                : { label: 'Create Another', onClick: resetWizard }
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
                Go Back
              </button>

              <PageHeader
                className="mt-1"
                title={editing ? 'Edit Interview Set' : 'Create Interview'}
                subtitle={
                  editing
                    ? `Update the details, rounds and templates of “${editing.title}”.`
                    : 'Configure questions, branding, and invite settings for this interview.'
                }
              />
            </header>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
              <aside className="relative z-20 w-full shrink-0 overflow-visible border-b border-[#eceaf3] bg-white pt-3 pb-2 lg:w-[15rem] lg:border-b-0 lg:border-r lg:border-[#E4E3EC] lg:pt-3 xl:w-[15.75rem]">
                <StepsWizard
                  steps={[...CREATE_ONE_WAY_STEPS]}
                  currentStep={step}
                  completedThrough={maxReached}
                  onStepClick={(index) => {
                    if (index <= maxReached) goTo(index)
                  }}
                />
              </aside>

              <div className="relative z-0 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white py-3 pl-6 pr-0 scrollbar-none">
                {step === 0 ? (
                  <StepInterviewDetails
                    value={form}
                    onChange={patchForm}
                    jobOptions={jobOptions}
                  />
                ) : null}
                {step === 1 ? (
                  <StepInterviewRounds
                    value={form}
                    onChange={patchForm}
                    templates={templates}
                    onTemplatesChange={setTemplates}
                  />
                ) : null}
                {step === 2 ? (
                  <StepInterviewReview
                    value={form}
                    jobLabel={jobLabel}
                    templates={templates}
                    onEditDetails={() => goTo(0)}
                    onEditRounds={() => goTo(1)}
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
                className="min-w-[6.5rem] border-[#2D2061]/40 text-[#2D2061] hover:bg-[#f7f6fb]"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleContinue}
                className="min-w-[6.5rem] !bg-[#2D2061] hover:!bg-[#241a52]"
              >
                {step >= LAST_STEP ? (editing ? 'Save Changes' : 'Create') : 'Continue'}
              </Button>
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}
