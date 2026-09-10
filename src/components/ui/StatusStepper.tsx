import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

export type StatusStep = {
  id: string
  label: string
}

export type StatusStepperProps = {
  steps: readonly StatusStep[]
  /** Zero-based index of the active step */
  currentStep: number
  /** Highest step the user has reached (inclusive). Defaults to currentStep. */
  completedThrough?: number
  onStepClick?: (index: number) => void
  className?: string
}

type StepTone = 'active' | 'completed' | 'upcoming'

function getStepTone(index: number, currentStep: number): StepTone {
  if (index === currentStep) return 'active'
  if (index < currentStep) return 'completed'
  return 'upcoming'
}

function stepClasses(tone: StepTone): { circle: string; label: string } {
  switch (tone) {
    case 'active':
      return {
        circle: 'bg-[#2D2061] text-white',
        label: 'font-semibold text-[#2D2061]',
      }
    case 'completed':
      return {
        circle: 'bg-[#1B9E4B] text-white',
        label: 'font-medium text-[#1B9E4B]',
      }
    case 'upcoming':
      return {
        circle: 'bg-[#EBECF2] text-[#8B8FA3]',
        label: 'font-medium text-[#8B8FA3]',
      }
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}

/**
 * Horizontal status / process stepper for Create Offer and similar wizards.
 */
export function StatusStepper({
  steps,
  currentStep,
  completedThrough = currentStep,
  onStepClick,
  className,
}: StatusStepperProps) {
  return (
    <nav aria-label="Process steps" className={cn('w-full min-w-0', className)}>
      <ol className="flex w-full min-w-0 items-start">
        {steps.map((step, index) => (
          <StatusStepItem
            key={step.id}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
            currentStep={currentStep}
            completedThrough={completedThrough}
            onStepClick={onStepClick}
          />
        ))}
      </ol>
    </nav>
  )
}

function StatusStepItem({
  step,
  index,
  isLast,
  currentStep,
  completedThrough,
  onStepClick,
}: {
  step: StatusStep
  index: number
  isLast: boolean
  currentStep: number
  completedThrough: number
  onStepClick?: (index: number) => void
}) {
  const tone = getStepTone(index, currentStep)
  const classes = stepClasses(tone)
  const isClickable =
    Boolean(onStepClick) &&
    (tone === 'completed' || index <= completedThrough)

  return (
    <li className={cn('flex min-w-0', isLast ? 'flex-none' : 'flex-1')}>
      <button
        type="button"
        disabled={!isClickable}
        onClick={() => onStepClick?.(index)}
        aria-current={tone === 'active' ? 'step' : undefined}
        className={cn(
          'flex min-w-0 flex-col items-center gap-2',
          isLast ? 'w-auto' : 'w-full',
          !isClickable && 'cursor-default',
        )}
      >
        <span className="flex w-full items-center">
          <span
            className={cn(
              'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold',
              classes.circle,
            )}
          >
            {tone === 'completed' ? (
              <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            ) : (
              String(index + 1)
            )}
          </span>
          {!isLast ? (
            <span
              className={cn(
                'mx-2 h-px min-w-[1.5rem] flex-1',
                tone === 'completed' ? 'bg-[#1B9E4B]' : 'bg-[#E4E3EC]',
              )}
              aria-hidden="true"
            />
          ) : null}
        </span>
        <span
          className={cn(
            'w-full text-left text-[12px] leading-tight sm:text-[13px]',
            classes.label,
          )}
        >
          {step.label}
        </span>
      </button>
    </li>
  )
}
