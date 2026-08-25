import { useEffect, useState } from 'react'
import { Briefcase, Info } from 'lucide-react'
import { Button, SidePanel } from '../../ui'
import { cn } from '../../../lib/cn'
import {
  AI_SIMILAR_JOBS,
  type SimilarJobMatch,
} from './aiCreateJobData'

export type AiCreateJobDuplicatePanelProps = {
  open: boolean
  onClose: () => void
  /** Skip AI flow and open the manual create wizard at step 1 */
  onSkipToManual: () => void
  /**
   * Continue into the wizard. Passes the selected similar job when one
   * was chosen; otherwise continues without copying.
   */
  onSkipAndContinue: (selected: SimilarJobMatch | null) => void
  similarJobs?: SimilarJobMatch[]
}

/**
 * Second AI Create Job panel — similar/duplicate job detection.
 */
export function AiCreateJobDuplicatePanel({
  open,
  onClose,
  onSkipToManual,
  onSkipAndContinue,
  similarJobs = AI_SIMILAR_JOBS,
}: AiCreateJobDuplicatePanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setSelectedId(null)
  }, [open])

  const selected =
    similarJobs.find((job) => job.id === selectedId) ?? null

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Create Job"
      width="60%"
      footerClassName="justify-between gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onSkipToManual}
            className="!h-10 !rounded-md !border-[#2D2061]/40 !px-4 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Skip to Manual
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="!h-10 !rounded-md !border-[#2D2061]/40 !px-4 !text-[#2D2061] hover:!bg-[#F7F6FA]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => onSkipAndContinue(selected)}
              className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              Skip & Continue
            </Button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F0ECF8] px-3 py-1.5">
          <Info
            className="size-3.5 text-[#6B5A9E]"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-[#6B5A9E]">
            Similar Jobs Detected
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1a1a2e]">
            Avoid duplicate listings
          </h2>
          <p className="mt-1 text-sm text-[#8B8B9E]">
            We found active roles that are highly similar to your description.
            Duplicate listings may confuse candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {similarJobs.map((job) => {
            const active = selectedId === job.id
            return (
              <button
                key={job.id}
                type="button"
                onClick={() =>
                  setSelectedId((current) =>
                    current === job.id ? null : job.id,
                  )
                }
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                  active
                    ? 'border-[#9B8BC8] bg-[#F5F2FB]'
                    : 'border-[#E4E1EE] bg-white hover:border-[#9B8BC8]/50 hover:bg-[#FAF9FC]',
                )}
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#D8D3E8] bg-white text-[#6B5A9E]">
                  <Briefcase
                    className="size-4"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#1a1a2e]">
                    {job.title}
                  </span>
                  <span className="mt-1 block text-xs text-[#6B6B80]">
                    {job.department}{' '}
                    <span className="font-semibold text-[#22A45A]">
                      • {job.matchPercent}% match
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </SidePanel>
  )
}
