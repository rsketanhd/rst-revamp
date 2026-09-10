export type OfferStatus =
  | 'accepted'
  | 'sent'
  | 'withdrawn'
  | 'declined'
  | 'expired'
  | 'draft'

export type OfferRecord = {
  id: string
  candidateName: string
  email: string
  job: string
  compensationAed: number
  joiningDate: string
  joiningDateIso: string
  expiryDate: string
  status: OfferStatus
  sentOn: string
}

export type OffersFilters = {
  statuses: OfferStatus[]
  jobs: string[]
  joiningDate: string
}

export type OfferMetrics = {
  totalOffers: number
  drafts: number
  sentViewed: number
  acceptedSigned: number
  declinedOther: number
}

export const OFFER_STATUS_META: Record<
  OfferStatus,
  { label: string; className: string }
> = {
  accepted: {
    label: 'ACCEPTED',
    className: 'bg-[#E7F6EC] text-[#1B7A3D]',
  },
  sent: {
    label: 'SENT',
    className: 'bg-[#E6F0FB] text-[#1A6FD0]',
  },
  withdrawn: {
    label: 'WITHDRAWN',
    className: 'bg-[#FBEBDC] text-[#C05621]',
  },
  declined: {
    label: 'DECLINED',
    className: 'bg-[#FDECEC] text-[#C62828]',
  },
  expired: {
    label: 'EXPIRED',
    className: 'bg-[#E8EEF4] text-[#5B6B7C]',
  },
  draft: {
    label: 'DRAFT',
    className: 'bg-[#F0F0F3] text-[#5C5C6B]',
  },
}

export const OFFER_STATUS_OPTIONS: OfferStatus[] = [
  'accepted',
  'sent',
  'withdrawn',
  'declined',
  'expired',
  'draft',
]

export const INITIAL_OFFERS: OfferRecord[] = [
  {
    id: 'offer-1',
    candidateName: 'John Smith',
    email: 'john.smith@example.com',
    job: 'Senior Software Engineer',
    compensationAed: 28000,
    joiningDate: '12 Apr 2026',
    joiningDateIso: '2026-04-12',
    expiryDate: '11 May 2026',
    status: 'accepted',
    sentOn: '10 Mar 2026',
  },
  {
    id: 'offer-2',
    candidateName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    job: 'Product Manager',
    compensationAed: 32000,
    joiningDate: '01 May 2026',
    joiningDateIso: '2026-05-01',
    expiryDate: '30 May 2026',
    status: 'sent',
    sentOn: '15 Mar 2026',
  },
  {
    id: 'offer-3',
    candidateName: 'Michael Chen',
    email: 'm.chen@example.com',
    job: 'UX Designer',
    compensationAed: 24000,
    joiningDate: '20 Apr 2026',
    joiningDateIso: '2026-04-20',
    expiryDate: '19 May 2026',
    status: 'withdrawn',
    sentOn: '08 Mar 2026',
  },
  {
    id: 'offer-4',
    candidateName: 'Emily Davis',
    email: 'emily.d@example.com',
    job: 'Data Analyst',
    compensationAed: 22000,
    joiningDate: '05 May 2026',
    joiningDateIso: '2026-05-05',
    expiryDate: '04 Jun 2026',
    status: 'declined',
    sentOn: '12 Mar 2026',
  },
  {
    id: 'offer-5',
    candidateName: 'David Wilson',
    email: 'd.wilson@example.com',
    job: 'DevOps Engineer',
    compensationAed: 30000,
    joiningDate: '15 Apr 2026',
    joiningDateIso: '2026-04-15',
    expiryDate: '14 May 2026',
    status: 'expired',
    sentOn: '01 Mar 2026',
  },
  {
    id: 'offer-6',
    candidateName: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    job: 'Marketing Lead',
    compensationAed: 26000,
    joiningDate: '10 May 2026',
    joiningDateIso: '2026-05-10',
    expiryDate: '09 Jun 2026',
    status: 'draft',
    sentOn: '',
  },
]

export const emptyOffersFilters: OffersFilters = {
  statuses: [],
  jobs: [],
  joiningDate: '',
}

export function formatOfferStat(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatCompensationAed(value: number): string {
  return `AED ${value.toLocaleString('en-US')}`
}

export function countOffersFilters(filters: OffersFilters): number {
  let count = 0
  if (filters.statuses.length > 0) count += 1
  if (filters.jobs.length > 0) count += 1
  if (filters.joiningDate) count += 1
  return count
}

export function getOfferMetrics(offers: OfferRecord[]): OfferMetrics {
  const metrics: OfferMetrics = {
    totalOffers: offers.length,
    drafts: 0,
    sentViewed: 0,
    acceptedSigned: 0,
    declinedOther: 0,
  }

  for (const offer of offers) {
    switch (offer.status) {
      case 'draft':
        metrics.drafts += 1
        break
      case 'sent':
        metrics.sentViewed += 1
        break
      case 'accepted':
        metrics.acceptedSigned += 1
        break
      case 'declined':
      case 'withdrawn':
      case 'expired':
        metrics.declinedOther += 1
        break
      default: {
        const _exhaustive: never = offer.status
        throw new Error(`Unhandled offer status: ${_exhaustive}`)
      }
    }
  }

  return metrics
}

export function matchesOffersFilters(
  offer: OfferRecord,
  filters: OffersFilters,
): boolean {
  if (filters.statuses.length > 0 && !filters.statuses.includes(offer.status)) {
    return false
  }
  if (filters.jobs.length > 0 && !filters.jobs.includes(offer.job)) {
    return false
  }
  if (filters.joiningDate && offer.joiningDateIso !== filters.joiningDate) {
    return false
  }
  return true
}

export function filterOffers(
  offers: OfferRecord[],
  query: string,
  filters: OffersFilters,
): OfferRecord[] {
  const needle = query.trim().toLowerCase()

  return offers.filter((offer) => {
    if (!matchesOffersFilters(offer, filters)) return false
    if (!needle) return true
    const haystack =
      `${offer.candidateName} ${offer.email} ${offer.job}`.toLowerCase()
    return haystack.includes(needle)
  })
}
