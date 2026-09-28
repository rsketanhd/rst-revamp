import { useState, type ReactNode } from 'react'
import { ArrowLeft, Database, Sparkles, Upload } from 'lucide-react'
import { Button, SidePanel, toast } from '../ui'
import { cn } from '../../lib/cn'
import { useImportCandidatesFlow } from '../candidates/ImportCandidatesPanel'
import { CandidateSearchResults } from './CandidateSearchResults'

export type AddCandidateMethod = 'upload' | 'global' | 'database'

type PanelStep = 'choose' | AddCandidateMethod

export type AddFetchCandidatePanelProps = {
  open: boolean
  onClose: () => void
  job: { id: string; code: string; title: string }
}

type MethodOption = {
  value: AddCandidateMethod
  title: string
  description: string
  icon: ReactNode
  iconClassName: string
  ai?: boolean
}

const METHODS: MethodOption[] = [
  {
    value: 'upload',
    title: 'Upload Resumes',
    description: 'Single or bulk (up to 50). Parsed and scored on arrival.',
    icon: <Upload className="size-4" strokeWidth={2} aria-hidden="true" />,
    iconClassName: 'bg-[#F1ECFB] text-[#2D2061]',
  },
  {
    value: 'global',
    title: 'Global Candidate Search',
    description:
      'SniperAI recommends the closest profiles from 750M+, starting from this job.',
    icon: <Sparkles className="size-4" strokeWidth={2} aria-hidden="true" />,
    iconClassName: 'bg-gradient-to-br from-[#8E2DB5] to-[#D6336C] text-white',
    ai: true,
  },
  {
    value: 'database',
    title: 'Candidate Database Search',
    description: 'Search your own 12,480 profiles. No external sourcing.',
    icon: <Database className="size-4" strokeWidth={2} aria-hidden="true" />,
    iconClassName: 'bg-[#E3F5EA] text-[#15803D]',
  },
]

const PANEL_WIDTH = 'w-full max-w-[42rem]'

const OUTLINE_BTN =
  '!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]'
const PRIMARY_BTN =
  '!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]'

/**
 * Job Applications → Add/Fetch Candidate. Pick a method, then the same panel
 * shows the upload flow or the search results for this job.
 */
export function AddFetchCandidatePanel({
  open,
  onClose,
  job,
}: AddFetchCandidatePanelProps) {
  const [method, setMethod] = useState<AddCandidateMethod>('global')
  const [step, setStep] = useState<PanelStep>('choose')
  const [wasOpen, setWasOpen] = useState(open)
  /** Candidates added from the current search list */
  const [addedCount, setAddedCount] = useState(0)
  const jobLabel = `${job.code} : ${job.title}`

  // Start from the method list every time the panel opens
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setStep('choose')
      setMethod('global')
    }
  }

  const upload = useImportCandidatesFlow({
    active: open && step === 'upload',
    onDone: onClose,
    defaultIntent: 'application',
    defaultJobId: job.id,
    compact: true,
    onBack: () => setStep('choose'),
  })

  const methodInfo = METHODS.find((m) => m.value === step)
  const intro = methodInfo ? (
    <StepIntro
      title={methodInfo.title}
      subtitle={methodInfo.description}
      onBack={() => setStep('choose')}
    />
  ) : null

  if (step === 'upload') {
    return (
      <SidePanel
        open={open}
        onClose={onClose}
        title="Add/Fetch Candidate"
        widthClassName={upload.widthClassName}
        bodyClassName={upload.bodyClassName}
        footerClassName={upload.footerClassName}
        footer={upload.footer}
      >
        {upload.onUploadStep ? intro : null}
        {upload.body}
      </SidePanel>
    )
  }

  if (step === 'global' || step === 'database') {
    return (
      <SidePanel
        open={open}
        onClose={onClose}
        title="Add/Fetch Candidate"
        widthClassName={PANEL_WIDTH}
        footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
        footer={
          <>
            <Button type="button" variant="outline" onClick={onClose} className={OUTLINE_BTN}>
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                toast.success(
                  addedCount > 0
                    ? `${addedCount} ${addedCount === 1 ? 'candidate' : 'candidates'} added to ${jobLabel}.`
                    : 'No candidates added.',
                  { title: methodInfo?.title },
                )
                onClose()
              }}
              className={PRIMARY_BTN}
            >
              Continue
            </Button>
          </>
        }
      >
        {intro}
        <CandidateSearchResults
          source={step}
          jobLabel={jobLabel}
          onAddedCountChange={setAddedCount}
        />
      </SidePanel>
    )
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Add/Fetch Candidate"
      widthClassName={PANEL_WIDTH}
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} className={OUTLINE_BTN}>
            Close
          </Button>
          <Button type="button" onClick={() => setStep(method)} className={PRIMARY_BTN}>
            Continue
          </Button>
        </>
      }
    >
      <fieldset>
        <legend className="mb-4 text-[15px] font-semibold text-[#1A1A2E]">
          How would you like to add candidates?
        </legend>
        <div className="flex flex-col gap-3">
          {METHODS.map((option) => {
            const selected = option.value === method
            return (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-4 transition-colors',
                  selected
                    ? 'border-[#2D2061] bg-[#F7F5FC]'
                    : 'border-[#E4E1EE] bg-white hover:border-[#C8C2DE]',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
                    option.iconClassName,
                  )}
                >
                  {option.icon}
                </span>
                <input
                  type="radio"
                  name="add-candidate-method"
                  value={option.value}
                  checked={selected}
                  onChange={() => setMethod(option.value)}
                  className="size-4 shrink-0 accent-[#2D2061]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#1A1A2E]">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#6B6B80]">
                    {option.description}
                  </span>
                </span>
                {option.ai ? (
                  <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-gradient-to-r from-[#8E2DB5] to-[#D6336C] px-2 py-0.5 text-[10px] font-semibold text-white">
                    <Sparkles className="size-2.5" strokeWidth={2.5} aria-hidden="true" />
                    AI
                  </span>
                ) : null}
              </label>
            )
          })}
        </div>
      </fieldset>
    </SidePanel>
  )
}

/** "← Go Back" link, then the method's title and description. */
function StepIntro({
  title,
  subtitle,
  onBack,
}: {
  title: string
  subtitle: string
  onBack: () => void
}) {
  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2D2061] transition-colors hover:text-[#241a52] hover:underline"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
        Go Back
      </button>
      <h2 className="mt-2 text-xl font-bold text-[#1A1A2E]">{title}</h2>
      <p className="mt-1 text-[13px] text-[#6B6B80]">{subtitle}</p>
    </div>
  )
}
