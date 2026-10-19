import type { ApprovalRecord } from '../../data/approvals'
import { Textarea } from '../ui'

export type ApprovalDecisionSectionProps = {
  record: ApprovalRecord
  comment: string
  commentError?: string
  onCommentChange: (value: string) => void
}

/**
 * Decision card shown at the top of job details when the approval is Waiting for me.
 * Approve / Request changes / Reject live in the panel footer.
 */
export function ApprovalDecisionSection({
  record,
  comment,
  commentError,
  onCommentChange,
}: ApprovalDecisionSectionProps) {
  const statusLabel = `PENDING APPROVAL · ${record.levelLabel}`
  const levelNumber = record.levelLabel.split('/')[0]?.replace(/^L/i, '') || '1'

  return (
    <section className="rounded-[10px] border border-[#E0D9F2] bg-[#F5F2FB] px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#2D2061]">
            Approval · {record.fromStatus} → {record.toStatus} (then the careers
            page)
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#8B8B9E]">
            Rule &quot;{record.ruleName}&quot; · submitted {record.submittedAt} by{' '}
            {record.submittedBy}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center self-start rounded-full bg-[#FFF1E6] px-2.5 py-1 text-[11px] font-semibold leading-none tracking-[0.04em] text-[#C2410C]">
          {statusLabel}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-sm text-[#4A4A60]">
          <span className="font-semibold text-[#2D2061]">Level {levelNumber}</span>
          <span className="text-[#8B8B9E]"> Any one approves</span>
        </p>
        <span className="mt-2 inline-flex items-center rounded-full bg-[#FFF1E6] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#C2410C]">
          {record.waitingFor} — waiting
        </span>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm text-[#6B6B80]">
          Your decision · a comment is required for every decision
        </p>
        <Textarea
          id={`approval-decision-comment-${record.id}`}
          rows={4}
          placeholder="Comment for the submitter and the other approvers"
          value={comment}
          error={commentError}
          onChange={(event) => onCommentChange(event.target.value)}
        />
      </div>
    </section>
  )
}
