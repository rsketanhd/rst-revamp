import { Button, SidePanel, StatusPillBadge, type StatusPillOption } from '../../ui'
import { cn } from '../../../lib/cn'
import {
  INTERVIEW_PANEL,
  type ScheduledInterview,
  type ScheduledInterviewResult,
  type ScheduledInterviewStatus,
} from '../../../data/scheduledInterviews'

export type ViewScheduledInterviewPanelProps = {
  open: boolean
  interview: ScheduledInterview | null
  onClose: () => void
}

const STATUS_PILL: Record<ScheduledInterviewStatus, StatusPillOption> = {
  completed: {
    value: 'completed',
    label: 'Completed',
    className: 'bg-[#E6F6EC] text-[#15803D]',
    dotClassName: 'bg-[#15803D]',
  },
  scheduled: {
    value: 'scheduled',
    label: 'Scheduled',
    className: 'bg-[#FDE7EF] text-[#C2185B]',
    dotClassName: 'bg-[#C2185B]',
  },
  invited: {
    value: 'invited',
    label: 'Invited',
    className: 'bg-[#E8EEFC] text-[#2F5BD3]',
    dotClassName: 'bg-[#2F5BD3]',
  },
  cancelled: {
    value: 'cancelled',
    label: 'Cancelled',
    className: 'bg-[#FDECEC] text-[#D92D20]',
    dotClassName: 'bg-[#D92D20]',
  },
}

const RESULT_PILL: Record<ScheduledInterviewResult, StatusPillOption> = {
  selected: {
    value: 'selected',
    label: 'Selected',
    className: 'bg-[#E6F6EC] text-[#15803D]',
    dotClassName: 'bg-[#15803D]',
  },
  awaiting: {
    value: 'awaiting',
    label: 'Awaiting',
    className: 'bg-[#FDF3D7] text-[#B7791F]',
    dotClassName: 'bg-[#B7791F]',
  },
  rejected: {
    value: 'rejected',
    label: 'Rejected',
    className: 'bg-[#FDECEC] text-[#D92D20]',
    dotClassName: 'bg-[#D92D20]',
  },
}

const PANEL_COLORS: Record<string, string> = {
  'Hiring Manager': 'bg-[#15A05B]',
  Recruiter: 'bg-[#5BC8D6]',
}

/**
 * Scheduled Interviews → View details side panel.
 */
export function ViewScheduledInterviewPanel({
  open,
  interview,
  onClose,
}: ViewScheduledInterviewPanelProps) {
  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Interview details"
      widthClassName="w-full max-w-[28rem]"
      footer={
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
        >
          Close
        </Button>
      }
    >
      {interview ? <InterviewDetailsBody interview={interview} /> : null}
    </SidePanel>
  )
}

function InterviewDetailsBody({ interview }: { interview: ScheduledInterview }) {
  return (
    <div className="flex flex-col gap-5">
      <section>
        <p className="text-[11px] font-semibold tracking-[0.06em] text-[#9A98A8] uppercase">
          Candidate
        </p>
        <p className="mt-1 text-base font-bold text-[#1A1A2E]">{interview.candidate}</p>
        <p className="mt-0.5 text-sm text-[#6B6B80]">{interview.email}</p>
      </section>

      <DetailGrid
        items={[
          { label: 'Job', value: interview.job },
          {
            label: 'Round',
            value: `Round ${interview.round} of ${interview.totalRounds}: ${interview.roundName}`,
          },
          {
            label: 'Type',
            value: interview.type === 'twoWayAi' ? 'AI Assisted' : 'Human Led',
          },
          { label: 'Platform', value: interview.platform },
          { label: 'Slot', value: interview.slot ?? 'Not booked' },
        ]}
      />

      <section className="flex flex-wrap items-center gap-3">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-[#9A98A8] uppercase">
            Status
          </p>
          <StatusPillBadge option={STATUS_PILL[interview.status]} />
          {interview.statusNote ? (
            <p className="mt-1 text-xs text-[#6B6B80]">{interview.statusNote}</p>
          ) : null}
          {interview.cancelledBy ? (
            <p className="mt-0.5 text-xs text-[#6B6B80]">Cancelled by {interview.cancelledBy}</p>
          ) : null}
        </div>
        {interview.result ? (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-[#9A98A8] uppercase">
              Result
            </p>
            <StatusPillBadge option={RESULT_PILL[interview.result]} />
            {interview.ratedSummary || interview.aiFit != null ? (
              <p className="mt-1 text-xs text-[#6B6B80]">
                {[
                  interview.ratedSummary,
                  interview.aiFit != null ? `AI fit ${interview.aiFit}%` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      {interview.rescheduleRequested ? (
        <p className="rounded-lg bg-[#FFF7ED] px-3 py-2 text-xs font-medium text-[#C2610C]">
          Candidate requested a reschedule.
        </p>
      ) : null}

      <section>
        <p className="text-[11px] font-semibold tracking-[0.06em] text-[#9A98A8] uppercase">
          Panel
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {INTERVIEW_PANEL.map((member) => (
            <li
              key={member}
              className="inline-flex items-center gap-2 rounded-full border border-[#E8E6F0] bg-white px-2.5 py-1 text-xs font-semibold text-[#2A2740]"
            >
              <span
                className={cn(
                  'inline-flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white',
                  PANEL_COLORS[member] ?? 'bg-[#6B6B80]',
                )}
                aria-hidden="true"
              >
                {initials(member)}
              </span>
              {member}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function DetailGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg bg-[#F7F8FB] px-3 py-2.5">
          <dt className="text-[11px] font-semibold tracking-[0.04em] text-[#9A98A8] uppercase">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-[#1A1A2E]">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
