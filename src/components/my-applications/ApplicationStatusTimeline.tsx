import { Check } from 'lucide-react'
import type { ApplicationTimelineStage } from '../../data/myApplications'
import { cn } from '../../lib/cn'

export type ApplicationStatusTimelineProps = {
  stages: ApplicationTimelineStage[]
  className?: string
}

/**
 * Vertical application pipeline timeline (candidate My Applications detail).
 */
export function ApplicationStatusTimeline({
  stages,
  className,
}: ApplicationStatusTimelineProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <h3 className="text-sm font-bold text-[#2D2061]">Application Timeline</h3>
      <ol className="relative mt-5 space-y-0">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1
          const isCompleted = stage.status === 'completed'
          const isCurrent = stage.status === 'current'

          return (
            <li key={stage.id} className="relative flex gap-3 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute left-[11px] top-6 bottom-0 w-px',
                    isCompleted ? 'bg-[#2D2061]' : 'bg-[#E0DDEA]',
                  )}
                />
              ) : null}

              <span
                className={cn(
                  'relative z-[1] inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                  isCompleted && 'border-[#2D2061] bg-[#2D2061] text-white',
                  isCurrent && 'border-[#2D2061] bg-white',
                  !isCompleted &&
                    !isCurrent &&
                    'border-[#D5D2E2] bg-white',
                )}
              >
                {isCompleted ? (
                  <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                ) : isCurrent ? (
                  <span className="size-2.5 rounded-full bg-[#2D2061]" />
                ) : null}
              </span>

              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={cn(
                    'text-sm',
                    isCurrent
                      ? 'font-semibold text-[#2D2061]'
                      : isCompleted
                        ? 'font-medium text-[#2D2061]'
                        : 'font-medium text-[#8B8B9E]',
                  )}
                >
                  {stage.label}
                </p>
                {stage.date ? (
                  <p className="mt-0.5 text-xs text-[#8B8B9E]">{stage.date}</p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
