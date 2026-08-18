import { cn } from '../../lib/cn'
import type { PipelineStage, PipelineStageId } from '../../data/applications'

export type PipelineFunnelProps = {
  stages: PipelineStage[]
  activeId: PipelineStageId
  onChange: (id: PipelineStageId) => void
  className?: string
}

/**
 * Horizontal application-stage pipeline.
 * Rounded rectangle tiles. Overflow scrolls horizontally without a visible scrollbar.
 */
export function PipelineFunnel({
  stages,
  activeId,
  onChange,
  className,
}: PipelineFunnelProps) {
  return (
    <section
      aria-label="Application pipeline"
      className={cn('w-full min-w-0 bg-white', className)}
    >
      <div className="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain scrollbar-none">
        <div className="flex w-max items-stretch gap-1.5 sm:gap-2">
          {stages.map((stage) => {
            const active = stage.id === activeId

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onChange(stage.id)}
                aria-pressed={active}
                className={cn(
                  'flex min-h-[4.75rem] min-w-[11.5rem] shrink-0 flex-col justify-center rounded-lg px-3 py-2.5 text-left transition-colors sm:min-h-[5.25rem] sm:min-w-[15rem] sm:px-4 sm:py-3',
                  active
                    ? 'bg-[#2D2061] text-white shadow-sm'
                    : 'bg-[#F3F2F7] text-[#2D2061] hover:bg-[#ebe9f2]',
                )}
              >
                <span
                  className={cn(
                    'whitespace-nowrap text-[1.25rem] font-bold tabular-nums leading-none tracking-tight sm:text-[1.375rem] lg:text-[1.5rem]',
                    active ? 'text-white' : 'text-[#4A3F8C]',
                  )}
                >
                  {String(stage.count).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'mt-1.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.04em]',
                    active ? 'text-white' : 'text-[#2D2061]',
                  )}
                >
                  {stage.label}
                </span>
                <span
                  className={cn(
                    'mt-1 whitespace-nowrap text-[10px] font-medium leading-none',
                    stage.weeklyChange === null
                      ? active
                        ? 'text-white/70'
                        : 'text-[#9CA3AF]'
                      : active
                        ? 'text-white'
                        : 'text-[#22A35A]',
                  )}
                >
                  {stage.weeklyChange === null
                    ? 'No Change'
                    : `+${stage.weeklyChange} this week`}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
