import type { ReactNode } from 'react'
import {
  Briefcase,
  Check,
  Clock3,
  Download,
  GitBranch,
  Paperclip,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { Button, SidePanel, toast } from '../ui'
import { cn } from '../../lib/cn'
import {
  getOfferViewModel,
  offerAvatarClass,
  type OfferApprovalStatus,
  type OfferApprover,
  type OfferTimelineStatus,
  type OfferTimelineStep,
} from '../../data/offerView'
import { formatCompensationAed, type OfferRecord } from '../../data/offers'
import { OfferStatusBadge } from './OfferStatusBadge'

export type OfferViewPanelProps = {
  open: boolean
  offer: OfferRecord | null
  onClose: () => void
  onSend: (offer: OfferRecord) => void
  onEdit: (offer: OfferRecord) => void
}

/**
 * Offer Management — View Offer drawer with specs, approvals, and compensation.
 */
export function OfferViewPanel({
  open,
  offer,
  onClose,
  onSend,
  onEdit,
}: OfferViewPanelProps) {
  const details = offer ? getOfferViewModel(offer) : null

  return (
    <SidePanel
      open={open && Boolean(offer)}
      onClose={onClose}
      title="View Offer"
      widthClassName="w-full max-w-full sm:max-w-[min(100%,56rem)] xl:max-w-[72rem]"
      bodyClassName="bg-[#F4F5F8] p-0"
      footer={
        offer ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSend(offer)}
              className="!h-10 !min-w-[6.5rem] !rounded-md border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              Send Offer
            </Button>
            <Button
              type="button"
              onClick={() => onEdit(offer)}
              className="!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Edit Offer
            </Button>
          </>
        ) : null
      }
    >
      {offer && details ? (
        <div className="flex flex-col">
          <div className="bg-[#2D2061] px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                {offer.candidateName}
              </h3>
              <span className="rounded-full bg-white/15 px-0.5 py-0.5">
                <OfferStatusBadge status={offer.status} />
              </span>
            </div>
            <p className="mt-1.5 text-sm text-[#C9C4E0]">{details.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-2 lg:gap-5">
            <div className="flex flex-col gap-4">
              <OfferViewCard icon={Briefcase} title="Offer & Position Specifications">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SpecField
                    label="Candidate Email Address"
                    value={offer.email}
                  />
                  <SpecField
                    label="Proposed Joining Date"
                    value={offer.joiningDate}
                  />
                  <SpecField
                    label="Offer Expiry Date"
                    value={offer.expiryDate}
                  />
                  <SpecField
                    label="Hiring Manager"
                    value={details.hiringManager}
                  />
                  <SpecField
                    label="Offer Sent On"
                    value={offer.sentOn || '—'}
                  />
                </div>
              </OfferViewCard>

              <OfferViewCard
                icon={Users}
                title="Internal Approval Chain & Sign-offs"
              >
                <ul className="flex flex-col gap-3">
                  {details.approvers.map((approver, index) => (
                    <ApproverRow
                      key={approver.name}
                      approver={approver}
                      index={index}
                    />
                  ))}
                </ul>
              </OfferViewCard>

              <OfferViewCard
                icon={Paperclip}
                title="Attached Documents & Agreements"
              >
                <ul className="flex flex-col gap-3">
                  {details.documents.map((document) => (
                    <li
                      key={document.name}
                      className="flex items-center gap-3 rounded-lg border border-[#EEEAF5] bg-[#FAFAFC] px-3 py-2.5"
                    >
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-[#EDE9F8] text-[#2D2061]">
                        <Paperclip className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#1a1a2e]">
                          {document.name}
                        </p>
                        <p className="truncate text-xs text-[#8B8B9E]">
                          {document.description}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          toast.success(`Downloading ${document.name}.`, {
                            title: 'Offer Management',
                          })
                        }
                        className="!h-8 shrink-0 !rounded-md border-[#d5d2e2] bg-white px-2.5 text-xs font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
                      >
                        <Download className="size-3.5" aria-hidden="true" />
                        Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </OfferViewCard>
            </div>

            <div className="flex flex-col gap-4">
              <OfferViewCard icon={Wallet} title="Compensation Summary">
                <div className="flex flex-col gap-3">
                  <CompRow
                    label="Monthly Base Salary"
                    value={formatCompensationAed(details.baseSalaryAed)}
                  />
                  <CompRow
                    label="Performance Bonus"
                    value={formatCompensationAed(details.bonusAed)}
                  />
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-[#EAF2FF] px-3 py-3">
                    <p className="text-sm font-semibold text-[#2D2061]">
                      Total Monthly Package
                    </p>
                    <p className="text-base font-bold tabular-nums text-[#2D2061]">
                      {formatCompensationAed(details.totalMonthlyAed)}
                    </p>
                  </div>
                  <CompRow
                    label="Annualized Total Equivalent"
                    value={formatCompensationAed(details.annualizedAed)}
                  />
                  <CompRow
                    label="Disbursement Schedule"
                    value={details.disbursementSchedule}
                  />
                </div>
              </OfferViewCard>

              <OfferViewCard icon={Clock3} title="Offer Status Timeline & Activity Log">
                <ol className="relative">
                  {details.timeline.map((step, index) => (
                    <TimelineRow
                      key={step.id}
                      step={step}
                      isLast={index === details.timeline.length - 1}
                    />
                  ))}
                </ol>
                <div className="mt-4 border-t border-[#EEEAF5] pt-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
                    Recent Activity Log
                  </p>
                  <ul className="flex flex-col gap-3">
                    {details.activity.map((item) => (
                      <li key={item.title}>
                        <p className="text-sm font-medium text-[#1a1a2e]">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs text-[#8B8B9E]">
                          {item.meta}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </OfferViewCard>

              <OfferViewCard icon={GitBranch} title="Version History">
                <div className="rounded-lg border border-[#B7E4C7] bg-[#F3FBF6] px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[#1a1a2e]">
                      {details.versionLabel}
                    </p>
                    <span className="inline-flex shrink-0 rounded-full bg-[#E7F6EC] px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em] text-[#1B7A3D]">
                      ACTIVE
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[#2D2061]">
                    {details.versionAmount}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8B8B9E]">
                    Effective {details.versionEffectiveDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast.success('Full audit history is not wired in this demo.', {
                      title: 'Offer Management',
                    })
                  }
                  className="mt-3 text-sm font-semibold text-[#2D2061] hover:underline"
                >
                  View Full Audit History
                </button>
              </OfferViewCard>
            </div>
          </div>
        </div>
      ) : null}
    </SidePanel>
  )
}

type OfferViewCardProps = {
  icon: LucideIcon
  title: string
  children: ReactNode
}

function OfferViewCard({ icon: Icon, title, children }: OfferViewCardProps) {
  return (
    <section className="rounded-xl border border-[#E8E6F0] bg-white p-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-[#2D2061]" aria-hidden="true" />
        <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
      </div>
      {children}
    </section>
  )
}

type SpecFieldProps = {
  label: string
  value: string
}

function SpecField({ label, value }: SpecFieldProps) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#1a1a2e]">{value || '—'}</p>
    </div>
  )
}

type CompRowProps = {
  label: string
  value: string
}

function CompRow({ label, value }: CompRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-[#626889]">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-[#1a1a2e]">{value}</p>
    </div>
  )
}

type ApproverRowProps = {
  approver: OfferApprover
  index: number
}

function ApproverRow({ approver, index }: ApproverRowProps) {
  const badge = approverBadge(approver.status)

  return (
    <li className="flex items-center gap-3">
      <span
        className={cn(
          'inline-flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          offerAvatarClass(index),
        )}
      >
        {approver.initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1a1a2e]">{approver.name}</p>
        <p className="text-xs text-[#8B8B9E]">
          {approver.role}
          {approver.date ? ` • ${approver.date}` : ''}
        </p>
      </div>
      <span
        className={cn(
          'inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em]',
          badge.className,
        )}
      >
        {badge.label}
      </span>
    </li>
  )
}

function approverBadge(status: OfferApprovalStatus): {
  className: string
  label: string
} {
  switch (status) {
    case 'approved':
      return { className: 'bg-[#E7F6EC] text-[#1B7A3D]', label: 'APPROVED' }
    case 'pending':
      return { className: 'bg-[#FEF3C7] text-[#B45309]', label: 'PENDING' }
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

type TimelineRowProps = {
  step: OfferTimelineStep
  isLast: boolean
}

function TimelineRow({ step, isLast }: TimelineRowProps) {
  const visual = timelineVisual(step.status)

  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {!isLast ? (
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-[11px] top-6 bottom-0 w-px',
            visual.connector,
          )}
        />
      ) : null}
      <span
        className={cn(
          'relative z-[1] inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2',
          visual.circle,
        )}
      >
        {visual.marker}
      </span>
      <p className={cn('pt-0.5 text-sm', visual.label)}>{step.label}</p>
    </li>
  )
}

function timelineVisual(status: OfferTimelineStatus): {
  connector: string
  circle: string
  label: string
  marker: ReactNode
} {
  switch (status) {
    case 'completed':
      return {
        connector: 'bg-[#1B9E4B]',
        circle: 'border-[#1B9E4B] bg-[#1B9E4B] text-white',
        label: 'font-medium text-[#1a1a2e]',
        marker: (
          <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
        ),
      }
    case 'current':
      return {
        connector: 'bg-[#E4E3EC]',
        circle: 'border-[#E8A317] bg-white',
        label: 'font-semibold text-[#2D2061]',
        marker: <span className="size-2.5 rounded-full bg-[#E8A317]" />,
      }
    case 'upcoming':
      return {
        connector: 'bg-[#E4E3EC]',
        circle: 'border-[#D5D2E2] bg-white',
        label: 'font-medium text-[#8B8B9E]',
        marker: null,
      }
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}
