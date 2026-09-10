import type { ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import { ReviewField, StepHeader } from '../../jobs/create/StepChrome'
import { formatCompensationAed } from '../../../data/offers'
import { formatListingDate } from './offerForm'
import type { CreateOfferForm } from './types'

type StepOfferReviewProps = {
  value: CreateOfferForm
  onEditDetails: () => void
  onEditCompensation: () => void
  onEditLetter: () => void
}

function formatReviewCompensation(raw: string): string {
  const amount = Number(raw.replace(/,/g, ''))
  if (Number.isFinite(amount) && amount > 0) {
    return formatCompensationAed(amount)
  }
  return raw
}

/**
 * Step 04 — Confirm offer details before create.
 */
export function StepOfferReview({
  value,
  onEditDetails,
  onEditCompensation,
  onEditLetter,
}: StepOfferReviewProps) {
  return (
    <div className="flex flex-col gap-5">
      <StepHeader
        title="Review & Send"
        description="Confirm the offer details before creating the record."
      />

      <ReviewSection title="Candidate & Job" onEdit={onEditDetails}>
        <ReviewField label="Candidate Name" value={value.candidateName} />
        <ReviewField label="Email" value={value.email} />
        <ReviewField label="Job" value={value.job} />
        <ReviewField
          label="Joining Date"
          value={formatListingDate(value.joiningDate)}
        />
        <ReviewField
          label="Expiry Date"
          value={formatListingDate(value.expiryDate)}
        />
      </ReviewSection>

      <ReviewSection title="Compensation" onEdit={onEditCompensation}>
        <ReviewField
          label="Compensation"
          value={formatReviewCompensation(value.compensationAed)}
        />
        <ReviewField label="Pay Frequency" value={value.payFrequency} />
        <ReviewField label="Notes" value={value.notes} />
      </ReviewSection>

      <ReviewSection title="Offer Letter" onEdit={onEditLetter}>
        <div className="min-w-0 sm:col-span-2">
          <p className="text-xs text-[#8B8B9E]">Letter content</p>
          <p className="mt-0.5 whitespace-pre-wrap text-sm font-semibold text-[#1a1a2e]">
            {value.letterContent || '—'}
          </p>
        </div>
        <ReviewField
          label="Attached files"
          value={value.attachments.map((file) => file.name).join(', ')}
        />
      </ReviewSection>
    </div>
  )
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#E8E6F0] bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D2061] hover:underline"
        >
          <Pencil className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}
