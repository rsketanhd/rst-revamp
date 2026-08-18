import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

export type WizardStep = {
  id: string
  label: string
}

export type StepsWizardProps = {
  steps: WizardStep[]
  /** Zero-based index of the active (current) step */
  currentStep: number
  /**
   * Highest step the user has reached (inclusive).
   * Defaults to `currentStep`.
   */
  completedThrough?: number
  onStepClick?: (index: number) => void
  className?: string
}

/**
 * Vertical multi-step wizard navigation (Create Job design).
 * - Active: square navy fill (no radius), white badge, caret past rail border
 * - Default: light badge + full-width bottom rule
 * - Completed: green check
 *
 * Note: parent rail should not use overflow that clips the caret
 * (see CreateJobPage). Prefer vertical scroll only when needed with scrollbar-none.
 */
export function StepsWizard({
  steps,
  currentStep,
  completedThrough = currentStep,
  onStepClick,
  className,
}: StepsWizardProps) {
  return (
    <nav
      aria-label="Wizard steps"
      className={cn('w-full min-w-0', className)}
    >
      <ol className="flex w-full min-w-0 flex-col">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const showCompleted = index < currentStep
          const isClickable =
            Boolean(onStepClick) && (showCompleted || index <= completedThrough)
          const stepNumber = String(index + 1).padStart(2, '0')
          const isLast = index === steps.length - 1

          return (
            <li
              key={step.id}
              className={cn(
                'relative min-w-0',
                !isActive && !isLast && 'border-b border-[#E4E3EC]',
              )}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(index)}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'relative flex w-full min-w-0 items-center gap-2.5 py-3 pl-3 pr-2.5 text-left sm:pl-3.5',
                  isActive && 'bg-[#2D2061] text-white',
                  !isActive && 'bg-white text-[#8B8FA3]',
                  !isActive && isClickable && 'hover:bg-[#f8f7fb]',
                  !isClickable && !isActive && 'cursor-default',
                )}
              >
                {isActive ? (
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold leading-none text-[#2D2061]">
                    {stepNumber}
                  </span>
                ) : showCompleted ? (
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1B9E4B] text-white">
                    <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EBECF2] text-[11px] font-semibold leading-none text-[#8B8FA3]">
                    {stepNumber}
                  </span>
                )}

                <span
                  className={cn(
                    'min-w-0 truncate text-[13px] leading-none',
                    isActive && 'font-semibold text-white',
                    !isActive && showCompleted && 'font-medium text-[#1B9E4B]',
                    !isActive && !showCompleted && 'font-medium text-[#8B8FA3]',
                  )}
                >
                  {step.label}
                </span>

                {/*
                  Caret is positioned on the right edge and shifted fully past
                  the rail border (parent aside must allow overflow).
                */}
                {isActive ? (
                  <span
                    className="pointer-events-none absolute top-1/2 right-0 z-30 size-0 translate-x-full -translate-y-1/2 border-y-[7px] border-l-[8px] border-y-transparent border-l-[#2D2061]"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
