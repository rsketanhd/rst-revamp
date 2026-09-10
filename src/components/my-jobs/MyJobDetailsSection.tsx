import type { MyJob } from '../../data/myJobs'
import { cn } from '../../lib/cn'
import { Button, toast } from '../ui'

export type MyJobDetailsSectionProps = {
  job: MyJob | null
  saved?: boolean
  applied?: boolean
  onToggleSave?: (job: MyJob) => void
  onToggleApply?: (job: MyJob) => void
  className?: string
}

type JobApplyState = 'open' | 'applied'

/**
 * All Jobs — job description pane with Save / Apply actions.
 */
export function MyJobDetailsSection({
  job,
  saved = false,
  applied = false,
  onToggleSave,
  onToggleApply,
  className,
}: MyJobDetailsSectionProps) {
  const applyState: JobApplyState = applied ? 'applied' : 'open'

  function handleSave() {
    if (!job) return
    onToggleSave?.(job)
    toast.success(saved ? `${job.title} removed from saved jobs.` : `${job.title} saved.`, {
      title: saved ? 'Removed' : 'Saved',
    })
  }

  function handleApply() {
    if (!job) return
    onToggleApply?.(job)
    toast.success(`You applied to ${job.title}.`, { title: 'Applied' })
  }

  function handleWithdraw() {
    if (!job) return
    onToggleApply?.(job)
    toast.success(`Application withdrawn for ${job.title}.`, {
      title: 'Withdrawn',
    })
  }

  return (
    <section
      className={cn(
        'flex min-h-0 min-w-0 flex-col rounded-xl border border-[#E8E6F0] bg-white',
        className,
      )}
    >
      {!job ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-sm rounded-lg border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-6 py-12 text-center">
            <p className="text-sm text-[#8B8B9E]">
              Select a job from the list to view details.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="shrink-0 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-[#2D2061] sm:text-xl">
                    {job.title}
                  </h2>
                  {applied ? <AppliedStatusBadge /> : null}
                </div>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[#6B6B80]">
                  {job.company}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="!rounded-md"
                >
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <ApplyActionButton
                  applyState={applyState}
                  onApply={handleApply}
                  onWithdraw={handleWithdraw}
                />
              </div>
            </div>
            <div className="mt-4 border-t border-[#ECEAF3]" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 sm:px-6">
            <h3 className="text-sm font-bold text-[#2D2061]">Job Descriptions</h3>

            <div className="mt-4 flex flex-col gap-5">
              {job.descriptionSections.map((section) => (
                <div key={section.id}>
                  <h4 className="text-sm font-semibold text-[#1A9B8A]">
                    {section.title}
                  </h4>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#5c5878]">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function AppliedStatusBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-[#E7F6EC] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#1B7A3D]">
      Applied
    </span>
  )
}

function ApplyActionButton({
  applyState,
  onApply,
  onWithdraw,
}: {
  applyState: JobApplyState
  onApply: () => void
  onWithdraw: () => void
}) {
  switch (applyState) {
    case 'open':
      return (
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onApply}
          className="!rounded-md bg-[#2D2061] px-4 font-semibold hover:bg-[#241a52]"
        >
          Apply Now
        </Button>
      )
    case 'applied':
      return (
        <Button
          type="button"
          size="sm"
          onClick={onWithdraw}
          className="!rounded-md bg-accent-500 px-4 font-semibold text-white hover:bg-accent-400"
        >
          Withdraw
        </Button>
      )
    default: {
      const _exhaustive: never = applyState
      return _exhaustive
    }
  }
}
