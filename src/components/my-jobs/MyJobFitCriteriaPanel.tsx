import { Check, Lock } from 'lucide-react'
import {
  getMatchScoreMeta,
  type MatchScoreMeta,
  type MyJob,
  type MyJobComparison,
} from '../../data/myJobs'
import { cn } from '../../lib/cn'
import { Button } from '../ui'

export type MyJobFitCriteriaPanelProps = {
  job: MyJob | null
  hasResume: boolean
  onUploadResume?: () => void
  className?: string
}

const fitPanelScrollClass = cn(
  'min-h-0 flex-1 overflow-y-auto overflow-x-hidden',
  '[-ms-overflow-style:auto]',
  '[scrollbar-width:thin]',
  '[scrollbar-color:#C8C5D6_transparent]',
  '[&::-webkit-scrollbar]:w-1.5',
  '[&::-webkit-scrollbar-track]:bg-transparent',
  '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C8C5D6]',
  '[&::-webkit-scrollbar-thumb:hover]:bg-[#A0A0B2]',
)

/**
 * My Jobs — right column fit analysis based on resume and job description.
 */
export function MyJobFitCriteriaPanel({
  job,
  hasResume,
  onUploadResume,
  className,
}: MyJobFitCriteriaPanelProps) {
  const isLocked = !hasResume
  const matchScore = job ? getMatchScoreMeta(job.resumeMatchScore) : null

  return (
    <aside
      className={cn(
        'flex min-h-0 min-w-0 flex-col overflow-hidden border-l border-[#E8E6F0] bg-white',
        className,
      )}
    >
      {isLocked ? (
        <LockedFitHeader />
      ) : (
        <UnlockedFitHeader matchScore={matchScore} />
      )}

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {isLocked ? (
          <LockedFitBody onUploadResume={onUploadResume} />
        ) : !job ? (
          <div className={cn(fitPanelScrollClass, 'p-4 sm:p-5')}>
            <EmptyFitState message="Select a job to view your fit analysis." />
          </div>
        ) : (
          <div className={cn(fitPanelScrollClass, 'px-4 py-4 sm:px-5 sm:py-5')}>
            <FitCriteriaBody job={job} />
          </div>
        )}
      </div>
    </aside>
  )
}

function LockedFitHeader() {
  return (
    <div className="shrink-0 bg-gradient-to-br from-[#FF7043] via-[#F06292] to-[#E84393] px-4 py-4 text-center sm:px-5">
      <h2 className="text-sm font-bold text-white sm:text-[15px]">
        Why Am I Right Fit For This Job?
      </h2>
      <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-white/70 px-4 py-2">
        <Lock className="size-4 text-white" strokeWidth={2} aria-hidden="true" />
        <span className="text-sm font-medium text-white">Match Score Locked</span>
      </div>
    </div>
  )
}

function UnlockedFitHeader({ matchScore }: { matchScore: MatchScoreMeta | null }) {
  return (
    <div className="shrink-0 bg-gradient-to-br from-[#FF7043] via-[#F06292] to-[#E84393] px-4 pb-4 pt-4 text-center sm:px-5 sm:pb-5">
      <h2 className="text-sm font-bold text-white sm:text-[15px]">
        Why Am I Right Fit For This Job?
      </h2>
      {matchScore ? (
        <div
          className="mx-auto mt-3 max-w-[14rem] rounded-xl px-4 py-3 text-center"
          style={{ backgroundColor: matchScore.color }}
        >
          <p className="text-[11px] font-medium text-white/95">
            Overall Match Score
          </p>
          <p className="mt-0.5 text-lg font-bold text-white">{matchScore.label}</p>
        </div>
      ) : null}
    </div>
  )
}

function LockedFitBody({ onUploadResume }: { onUploadResume?: () => void }) {
  return (
    <>
      <div
        className={cn(
          fitPanelScrollClass,
          'pointer-events-none absolute inset-0 blur-[3px]',
          'px-4 py-4 sm:px-5 sm:py-5',
        )}
        aria-hidden="true"
      >
        <LockedFitPreview />
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-white/25 p-4 sm:p-5">
        <div className="w-full max-w-[15.5rem] rounded-xl border border-[#E8E6F0] bg-white px-5 py-6 text-center shadow-[0_8px_24px_rgba(45,32,97,0.12)]">
          <span className="mx-auto inline-flex size-11 items-center justify-center rounded-full bg-[#EEF0FF] text-[#2D2061]">
            <Lock className="size-5" strokeWidth={2} aria-hidden="true" />
          </span>
          <h3 className="mt-3 text-base font-bold text-[#2D2061]">
            Unlock your match analysis
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#8B8B9E]">
            Upload your resume to see your score, qualification checks, and how
            you compare with other applicants.
          </p>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onUploadResume}
            className="mt-4 w-full !rounded-md bg-[#2D2061] py-2.5 text-sm font-semibold hover:bg-[#241a52]"
          >
            Upload Resume
          </Button>
        </div>
      </div>
    </>
  )
}

function LockedFitPreview() {
  return (
    <div className="flex flex-col gap-5">
      <FitSectionHeading
        title="Am I Qualified?"
        subtitle="Your match with job requirements"
      />
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <li
            key={index}
            className="flex items-center gap-2.5 rounded-lg border border-[#B8E6C8] bg-[#F0FAF4] px-3 py-2.5"
          >
            <span className="inline-flex size-5 shrink-0 rounded-full bg-[#21A54E]" />
            <span className="h-3 flex-1 rounded bg-[#D5D2E2]" />
          </li>
        ))}
      </ul>

      <FitSectionHeading
        title="How Do I Compare?"
        subtitle="Your position among applicants"
      />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-[#E8E6F0] bg-white p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="h-3 w-28 rounded bg-[#D5D2E2]" />
              <span className="h-3 w-8 rounded bg-[#D5D2E2]" />
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E6F0]">
              <div className="h-full w-3/4 rounded-full bg-[#21A54E]/60" />
            </div>
            <div className="mt-2 h-2.5 w-full rounded bg-[#E8E6F0]" />
          </div>
        ))}
      </div>

      <FitSectionHeading
        title="What Should I Focus On?"
        subtitle="Maximize your chances"
      />
      <div className="rounded-lg border border-[#E8E6F0] bg-white p-3">
        <ol className="flex flex-col gap-2.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="flex items-center gap-2.5">
              <span className="inline-flex size-5 shrink-0 rounded-full bg-[#2D2061]/70" />
              <span className="h-3 flex-1 rounded bg-[#D5D2E2]" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function FitCriteriaBody({ job }: { job: MyJob }) {
  const { fitCriteria } = job

  return (
    <div className="flex flex-col gap-5">
      <section>
        <FitSectionHeading
          title="Am I Qualified?"
          subtitle="Your match with job requirements"
        />
        <ul className="mt-3 flex flex-col gap-2">
          {fitCriteria.qualifications.map((item) =>
            item.matched ? (
              <li
                key={item.id}
                className="flex items-start gap-2.5 rounded-lg border border-[#B8E6C8] bg-[#F0FAF4] px-3 py-2.5"
              >
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#21A54E] text-white">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-sm leading-snug text-[#4A4A5E]">
                  {item.text}
                </span>
              </li>
            ) : (
              <li
                key={item.id}
                className="flex items-start gap-2.5 rounded-lg border border-[#E8E6F0] bg-[#FAFAFC] px-3 py-2.5"
              >
                <span className="mt-0.5 inline-flex size-5 shrink-0 rounded-full border border-[#D5D2E2] bg-white" />
                <span className="text-sm leading-snug text-[#8B8B9E]">
                  {item.text}
                </span>
              </li>
            ),
          )}
        </ul>
      </section>

      <section>
        <FitSectionHeading
          title="How Do I Compare?"
          subtitle="Your position among applicants"
        />
        <div className="mt-3 flex flex-col gap-2.5">
          {fitCriteria.comparisons.map((comparison) => (
            <ComparisonCard key={comparison.id} comparison={comparison} />
          ))}
        </div>
      </section>

      <section>
        <FitSectionHeading
          title="What Should I Focus On?"
          subtitle="Maximize your chances"
        />
        <div className="mt-3 rounded-lg border border-[#E8E6F0] bg-white p-3">
          <ol className="flex flex-col gap-2.5">
            {fitCriteria.focusItems.map((item, index) => (
              <li key={item.id} className="flex items-start gap-2.5">
                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2D2061] text-[11px] font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-snug text-[#4A4A5E]">
                  {item.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}

function FitSectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
      <p className="mt-0.5 text-xs text-[#8B8B9E]">{subtitle}</p>
    </div>
  )
}

function ComparisonCard({ comparison }: { comparison: MyJobComparison }) {
  return (
    <div className="rounded-lg border border-[#E8E6F0] bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-[#5c5878]">{comparison.label}</p>
        <span className="text-sm font-bold text-[#2D2061]">
          {comparison.percentage}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8E6F0]">
        <div
          className={cn('h-full rounded-full transition-all', barClass(comparison.tone))}
          style={{ width: `${comparison.percentage}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[#8B8B9E]">
        {comparison.description}
      </p>
    </div>
  )
}

function barClass(tone: MyJobComparison['tone']): string {
  switch (tone) {
    case 'positive':
      return 'bg-[#21A54E]'
    case 'neutral':
      return 'bg-[#2D2061]'
    case 'warning':
      return 'bg-[#E54B4B]'
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}

function EmptyFitState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-4 py-10 text-center">
      <p className="text-sm text-[#8B8B9E]">{message}</p>
    </div>
  )
}
