import { useEffect, useState } from 'react'
import type { ApprovalRecord } from '../../data/approvals'
import { Button, Textarea, toast } from '../ui'

export type ApprovalDecisionSectionProps = {
  record: ApprovalRecord
  onDecided?: (decision: 'approve' | 'request-changes' | 'reject') => void
}

/**
 * Decision card shown at the top of job details when the approval is Waiting for me.
 */
export function ApprovalDecisionSection({
  record,
  onDecided,
}: ApprovalDecisionSectionProps) {
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState<string | undefined>()

  useEffect(() => {
    setComment('')
    setCommentError(undefined)
  }, [record.id])

  const statusLabel = `PENDING APPROVAL · ${record.levelLabel}`
  const levelNumber = record.levelLabel.split('/')[0]?.replace(/^L/i, '') || '1'

  function requireComment(): boolean {
    if (comment.trim()) {
      setCommentError(undefined)
      return true
    }
    setCommentError('A comment is required for every decision')
    return false
  }

  function handleDecision(decision: 'approve' | 'request-changes' | 'reject') {
    if (!requireComment()) return
    const labels = {
      approve: 'Approved',
      'request-changes': 'Changes requested',
      reject: 'Rejected',
    } as const
    toast.success(labels[decision], { title: 'Approvals' })
    onDecided?.(decision)
  }

  return (
    <section className="rounded-[10px] border border-[#E4E1EE] bg-white px-4 py-4 sm:px-5">
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
          onChange={(event) => {
            setComment(event.target.value)
            if (commentError) setCommentError(undefined)
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <Button
          type="button"
          onClick={() => handleDecision('approve')}
          className="!rounded-md"
        >
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDecision('request-changes')}
          className="!rounded-md !border-[#D5D2E2] !text-[#2D2061]"
        >
          Request changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDecision('reject')}
          className="!rounded-md !border-[#F5C2C2] !text-[#C44B4B] hover:!bg-[#FFF5F5]"
        >
          Reject
        </Button>
      </div>
    </section>
  )
}
