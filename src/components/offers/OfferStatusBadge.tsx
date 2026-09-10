import { cn } from '../../lib/cn'
import { OFFER_STATUS_META, type OfferStatus } from '../../data/offers'

type OfferStatusBadgeProps = {
  status: OfferStatus
}

export function OfferStatusBadge({ status }: OfferStatusBadgeProps) {
  const meta = OFFER_STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none tracking-[0.04em]',
        meta.className,
      )}
    >
      {meta.label}
    </span>
  )
}
