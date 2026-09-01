import type { MyJob } from '../../data/myJobs'
import { cn } from '../../lib/cn'
import { Button, toast } from '../ui'
import { MyJobCard } from './MyJobCard'

export type MyJobDetailsSectionProps = {
  job: MyJob | null
  suggestedJobs: MyJob[]
  onSelectJob: (job: MyJob) => void
  className?: string
}

/**
 * My Jobs — middle column with job description and suggested jobs.
 */
export function MyJobDetailsSection({
  job,
  suggestedJobs,
  onSelectJob,
  className,
}: MyJobDetailsSectionProps) {
  function handleApply() {
    if (!job) return
    toast.success(`Application started for ${job.title}.`, {
      title: 'Apply Now',
    })
  }

  return (
    <section
      className={cn(
        'flex min-h-0 min-w-0 flex-col bg-white',
        className,
      )}
    >
      {!job ? (
        <EmptyDetailsState message="Select a job from the list to view details." />
      ) : (
        <>
          <div className="shrink-0 border-b border-[#E8E6F0] px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[#2D2061] sm:text-xl">
                  {job.title}
                </h2>
                <p className="mt-0.5 text-sm font-semibold uppercase tracking-wide text-[#6B6B80]">
                  {job.company}
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleApply}
                className="!h-10 shrink-0 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold hover:bg-[#241a52]"
              >
                Apply Now
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <h3 className="text-sm font-bold text-[#2D2061]">Job Descriptions</h3>

            <div className="mt-4 flex flex-col gap-6">
              {job.descriptionSections.map((section) => (
                <div key={section.id}>
                  <h4 className="text-sm font-semibold text-[#2D2061]">
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

            {suggestedJobs.length > 0 ? (
              <div className="mt-8 border-t border-[#E8E6F0] pt-6">
                <h3 className="text-sm font-bold text-[#2D2061]">Suggested Jobs</h3>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {suggestedJobs.map((suggestedJob) => (
                    <MyJobCard
                      key={suggestedJob.id}
                      job={suggestedJob}
                      compact
                      onSelect={onSelectJob}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  )
}

function EmptyDetailsState({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-sm rounded-lg border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-6 py-12 text-center">
        <p className="text-sm text-[#8B8B9E]">{message}</p>
      </div>
    </div>
  )
}
