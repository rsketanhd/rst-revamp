import { StepHeader, ReviewField } from '../../jobs/create/StepChrome'
import {
  BELOW_PASS_OPTIONS,
  bestPossibleScore,
  setTypeLabel,
  type CreatePreInterviewSetForm,
} from './types'

type Props = {
  value: CreatePreInterviewSetForm
  onEditDetails: () => void
  onEditQuestions: () => void
}

export function StepSetReview({
  value,
  onEditDetails,
  onEditQuestions,
}: Props) {
  const enabledCount = value.questions.filter((q) => q.enabled).length
  const isAssessment = value.kind === 'assessment'
  const belowPassLabel =
    BELOW_PASS_OPTIONS.find((option) => option.value === value.belowPassAction)
      ?.label ?? value.belowPassAction

  return (
    <div>
      <StepHeader
        title="Review"
        description="Confirm the set details before creating. You can edit questions after the set is saved."
      />

      <div className="flex flex-col gap-4">
        <div className="rounded-[10px] border border-[#E8E6F0] bg-white p-5 shadow-[0_4px_18px_rgba(45,32,97,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[#2D2061]">Details</h3>
            <button
              type="button"
              onClick={onEditDetails}
              className="text-xs font-semibold text-[#2D2061] underline-offset-2 hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ReviewField label="Set Name" value={value.name.trim() || '—'} />
            <ReviewField label="Set Type" value={setTypeLabel(value.kind)} />
            <ReviewField
              label="Default set"
              value={value.isDefault ? 'Yes' : 'No'}
            />
          </div>
        </div>

        <div className="rounded-[10px] border border-[#E8E6F0] bg-white p-5 shadow-[0_4px_18px_rgba(45,32,97,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[#2D2061]">Questions</h3>
            <button
              type="button"
              onClick={onEditQuestions}
              className="text-xs font-semibold text-[#2D2061] underline-offset-2 hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ReviewField
              label="Intro / greeting"
              value={value.intro.trim() || '—'}
            />
            <ReviewField
              label="Closing / thank-you"
              value={value.closing.trim() || '—'}
            />
            <ReviewField
              label="Questions"
              value={
                isAssessment
                  ? `${value.questions.length} total · ${enabledCount} on · ${bestPossibleScore(value.questions)} pts`
                  : `${value.questions.length} total · ${enabledCount} switched on`
              }
            />
            {isAssessment ? (
              <>
                <ReviewField
                  label="Pass mark"
                  value={
                    value.requirePassMark
                      ? `${value.passMarkPercent}% to pass`
                      : 'Not required'
                  }
                />
                <ReviewField
                  label="If below the pass mark"
                  value={value.requirePassMark ? belowPassLabel : '—'}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
