import { useState, type ReactNode } from 'react'
import { Printer, Share2, ThumbsDown, ThumbsUp } from 'lucide-react'
import type { AiAssessmentPanel } from '../../../data/oneWayAssessment'
import { cn } from '../../../lib/cn'
import { Button, StarRating, toast } from '../../ui'

export type AiAssessmentSectionProps = {
  data: AiAssessmentPanel
}

type FeedbackVote = 'up' | 'down'

const OUTLINE_ACTION_CLASS =
  '!h-9 !rounded-md border-[#D5D2E2] px-3.5 text-[13px] font-semibold text-[#2D2061]'

const PANEL_CLASS = 'rounded-xl border border-[#E8E6F0] bg-white p-4 sm:p-5'

const CARD_CLASS = 'rounded-xl border border-[#F0EEF5] bg-[#FAFAFC] p-3.5'

/**
 * AI Assessment tab — overall summary, skill categories, and per-question evaluations.
 */
export function AiAssessmentSection({ data }: AiAssessmentSectionProps) {
  const [vote, setVote] = useState<FeedbackVote | null>(data.feedbackVote)

  function handleVote(next: FeedbackVote) {
    setVote((current) => (current === next ? null : next))
    toast.success(
      next === 'up'
        ? 'Marked assessment as helpful.'
        : 'Marked assessment as unhelpful.',
      { title: 'AI Assessment' },
    )
  }

  return (
    <div className="space-y-4">
      <section className={PANEL_CLASS}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-3xl flex-1">
            <h3 className="text-[15px] font-bold text-[#2D2061]">
              Overall Candidate Assessment
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#4B4A66]">
              {data.overallSummary}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5">
              <StarRating value={data.overallStars} size="md" />
              <span className="text-sm font-bold tabular-nums text-[#2D2061]">
                {data.overallStars}/5
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FeedbackVoteButton
                label="Helpful assessment"
                active={vote === 'up'}
                tone="up"
                onClick={() => handleVote('up')}
              >
                <ThumbsUp className="size-3.5" strokeWidth={2} />
              </FeedbackVoteButton>
              <FeedbackVoteButton
                label="Unhelpful assessment"
                active={vote === 'down'}
                tone="down"
                onClick={() => handleVote('down')}
              >
                <ThumbsDown className="size-3.5" strokeWidth={2} />
              </FeedbackVoteButton>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                window.print()
                toast.success('Print dialog opened.', { title: 'Print' })
              }}
              className={OUTLINE_ACTION_CLASS}
            >
              <Printer className="size-3.5" strokeWidth={1.75} />
              Print
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void navigator.clipboard
                  ?.writeText(window.location.href)
                  .then(() =>
                    toast.success('Assessment link copied.', {
                      title: 'Share',
                    }),
                  )
                  .catch(() =>
                    toast.error('Could not copy to clipboard.', {
                      title: 'Share',
                    }),
                  )
              }}
              className={OUTLINE_ACTION_CLASS}
            >
              <Share2 className="size-3.5" strokeWidth={1.75} />
              Share
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:items-start">
        <section className={PANEL_CLASS}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-bold text-[#2D2061]">AI Summary</h3>
            <span className="text-lg font-bold tabular-nums text-[#1F8F57]">
              {data.summaryPercent}%
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {data.categories.map((category) => (
              <article key={category.id} className={CARD_CLASS}>
                <h4 className="text-[13px] font-bold text-[#2D2061]">
                  {category.title}
                </h4>
                <p className="mt-1 text-[12px] leading-snug text-[#8B8B9E]">
                  {category.prompt}
                </p>
                <StarRating
                  value={category.stars}
                  size="sm"
                  className="mt-2"
                />
                <p className="mt-2 text-[12.5px] leading-relaxed text-[#4B4A66]">
                  {category.feedback}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={PANEL_CLASS}>
          <h3 className="text-[15px] font-bold text-[#2D2061]">
            AI Evaluation Details
          </h3>
          <div className="mt-3 space-y-3">
            {data.evaluations.map((item) => (
              <article
                key={item.id}
                className={cn(CARD_CLASS, 'sm:p-4')}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 text-[13px] font-bold leading-snug text-[#2D2061]">
                    Q{item.number}. {item.question}
                  </p>
                  <StarRating value={item.stars} size="sm" />
                </div>
                <div className="mt-3 space-y-3">
                  <DetailBlock
                    label="Candidate Answer"
                    body={item.candidateAnswer}
                  />
                  <DetailBlock
                    label="AI Evaluation"
                    body={item.aiEvaluation}
                  />
                  <DetailBlock label="Score" body={`${item.scorePercent}%`} bold />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function DetailBlock({
  label,
  body,
  bold = false,
}: {
  label: string
  body: string
  bold?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8B8B9E]">
        {label}
      </p>
      <p
        className={cn(
          'mt-1',
          bold
            ? 'text-sm font-bold tabular-nums text-[#2D2061]'
            : 'text-[13px] leading-relaxed text-[#4B4A66]',
        )}
      >
        {body}
      </p>
    </div>
  )
}

function feedbackVoteClass(active: boolean, tone: FeedbackVote): string {
  if (!active) {
    return 'border-[#E0DDEA] bg-white text-[#8B8B9E] hover:bg-[#F7F6FA]'
  }
  if (tone === 'up') {
    return 'border-[#86EFAC] bg-[#E8F8EF] text-[#15803D]'
  }
  return 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
}

function FeedbackVoteButton({
  label,
  active,
  tone,
  onClick,
  children,
}: {
  label: string
  active: boolean
  tone: FeedbackVote
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'grid size-8 place-items-center rounded-full border transition-colors',
        feedbackVoteClass(active, tone),
      )}
    >
      {children}
    </button>
  )
}
