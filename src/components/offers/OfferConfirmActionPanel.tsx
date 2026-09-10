import { useEffect, useState, type ReactNode } from 'react'
import { Button, Checkbox, Select, SidePanel, Textarea } from '../ui'
import type { OfferRecord } from '../../data/offers'

export type OfferConfirmAction = 'withdraw' | 'rescind'

export type OfferConfirmPayload = {
  reason: string
  notes: string
  notifyCandidate: boolean
}

export type OfferConfirmActionPanelProps = {
  open: boolean
  offer: OfferRecord | null
  action: OfferConfirmAction
  onClose: () => void
  onConfirm: (offer: OfferRecord, payload: OfferConfirmPayload) => void
}

const CONFIRM_REASONS = [
  'Candidate Unresponsive (No response to follow-ups)',
  'Role filled internally',
  'Budget / headcount change',
  'Duplicate offer',
  'Other',
]

const CAUTION_BODY =
  'The digital offer letter link will be immediately invalidated and the candidate will no longer be able to sign or accept the agreement.'

/**
 * Shared confirm drawer for Withdraw Offer and Rescind Offer.
 */
export function OfferConfirmActionPanel({
  open,
  offer,
  action,
  onClose,
  onConfirm,
}: OfferConfirmActionPanelProps) {
  const copy = getConfirmCopy(action, offer)
  const [reason, setReason] = useState(copy.defaultReason)
  const [notes, setNotes] = useState('')
  const [notifyCandidate, setNotifyCandidate] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setReason(copy.defaultReason)
    setNotes('')
    setNotifyCandidate(true)
    setError('')
  }, [open, action, offer?.id, copy.defaultReason])

  function handleCancel() {
    setError('')
    onClose()
  }

  function handleConfirm() {
    if (!offer) return
    if (!reason) {
      setError('Select a reason to continue.')
      return
    }
    onConfirm(offer, { reason, notes: notes.trim(), notifyCandidate })
  }

  return (
    <SidePanel
      open={open && Boolean(offer)}
      onClose={handleCancel}
      title={copy.title}
      widthClassName="w-full max-w-[32rem]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="!h-10 !min-w-[5.5rem] !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Confirm
          </Button>
        </>
      }
    >
      {offer ? (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-base font-bold text-[#1a1a2e]">
              {offer.candidateName}
            </p>
            <p className="mt-0.5 text-sm text-[#8B8B9E]">{offer.job}</p>
          </div>

          <div className="rounded-lg bg-[#FDE8DC] px-4 py-3">
            <p className="text-sm font-bold text-[#B42318]">{copy.cautionTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#C2410C]">
              {copy.cautionBody}
            </p>
          </div>

          <Select
            label={copy.reasonLabel}
            requiredMark
            options={copy.reasons}
            value={reason}
            error={error}
            onChange={(event) => {
              setReason(event.target.value)
              setError('')
            }}
          />

          <Textarea
            label="Internal Audit Notes / Comments (Optional)"
            placeholder="Add internal context or justification for the audit trail..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={5}
            className="resize-y"
          />

          <Checkbox
            id={`offer-${action}-notify`}
            checked={notifyCandidate}
            onChange={(event) => setNotifyCandidate(event.target.checked)}
            label={copy.notifyLabel}
          />
        </div>
      ) : null}
    </SidePanel>
  )
}

type ConfirmCopy = {
  title: string
  cautionTitle: string
  cautionBody: string
  reasonLabel: string
  reasons: string[]
  defaultReason: string
  notifyLabel: ReactNode
}

function candidateNotifyLabel(
  kind: 'withdrawal' | 'rescind',
  email: string,
): ReactNode {
  return (
    <>
      Send formal {kind} notification email to candidate (
      <span className="font-semibold">{email}</span>)
    </>
  )
}

function getConfirmCopy(
  action: OfferConfirmAction,
  offer: OfferRecord | null,
): ConfirmCopy {
  const email = offer?.email ?? 'the candidate'

  switch (action) {
    case 'withdraw':
      return {
        title: 'Withdraw Offer',
        cautionTitle: 'Caution: This will officially withdraw the offer.',
        cautionBody: CAUTION_BODY,
        reasonLabel: 'Reason for Withdrawal',
        reasons: CONFIRM_REASONS,
        defaultReason: CONFIRM_REASONS[0],
        notifyLabel: candidateNotifyLabel('withdrawal', email),
      }
    case 'rescind':
      return {
        title: 'Rescind Offer',
        cautionTitle: 'Caution: This will officially rescind the offer.',
        cautionBody: CAUTION_BODY,
        reasonLabel: 'Reason for Rescinding',
        reasons: CONFIRM_REASONS,
        defaultReason: CONFIRM_REASONS[0],
        notifyLabel: candidateNotifyLabel('rescind', email),
      }
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}
