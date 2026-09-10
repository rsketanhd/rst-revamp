import type { OfferRecord } from '../../../data/offers'
import { defaultCreateOfferForm, type CreateOfferForm } from './types'

/** Sample values from the attached Create Offer / View Offer designs. */
export const DESIGN_CREATE_OFFER_FORM: CreateOfferForm = {
  ...defaultCreateOfferForm,
  candidateName: 'David Kim',
  email: 'david.kim@example.com',
  job: 'Data Platform Engineer',
  joiningDate: '2026-05-10',
  expiryDate: '2026-04-01',
  compensationAed: '29000',
}

function parseLocalDate(value: string): Date | null {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function toIsoDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = parseLocalDate(value)
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatListingDate(iso: string): string {
  const date = parseLocalDate(iso)
  if (!date) return iso
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function parseCompensationAed(raw: string): number {
  return Number(raw.replace(/,/g, '')) || 0
}

export function cloneCreateOfferForm(form: CreateOfferForm): CreateOfferForm {
  return {
    ...form,
    attachments: form.attachments.map((file) => ({ ...file })),
  }
}

export function offerRecordToForm(offer: OfferRecord): CreateOfferForm {
  return cloneCreateOfferForm({
    ...defaultCreateOfferForm,
    candidateName: offer.candidateName,
    email: offer.email,
    job: offer.job,
    joiningDate: offer.joiningDateIso,
    expiryDate: toIsoDate(offer.expiryDate),
    compensationAed: String(offer.compensationAed),
  })
}

export function formToOfferRecord(
  form: CreateOfferForm,
  existing?: OfferRecord | null,
): OfferRecord {
  return {
    id: existing?.id ?? `offer-${Date.now()}`,
    candidateName: form.candidateName.trim(),
    email: form.email.trim(),
    job: form.job,
    compensationAed: parseCompensationAed(form.compensationAed),
    joiningDate: formatListingDate(form.joiningDate),
    joiningDateIso: form.joiningDate,
    expiryDate: formatListingDate(form.expiryDate) || form.expiryDate,
    status: existing?.status ?? 'draft',
    sentOn: existing?.sentOn ?? '',
  }
}
