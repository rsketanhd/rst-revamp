import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MonitorPlay, Target, User, Users, X } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  Button,
  Modal,
  SegmentedControl,
  StarRating,
  Tooltip,
  toast,
} from '../components/ui'
import { cn } from '../lib/cn'
import { RescheduleInterviewPanel } from '../components/interviews/two-way/RescheduleInterviewPanel'
import {
  INTERVIEW_PANEL,
  getScheduledInterviews,
  type ScheduledInterview,
  type ScheduledInterviewResult,
} from '../data/scheduledInterviews'

type InterviewTab = 'upcoming' | 'cancelled' | 'completed' | 'reschedule'

const RESULT_TAG: Record<ScheduledInterviewResult, { label: string; className: string }> = {
  selected: { label: 'Selected', className: 'bg-[#E6F6EC] text-[#15803D]' },
  awaiting: { label: 'Awaiting', className: 'bg-[#FDF3D7] text-[#B7791F]' },
  rejected: { label: 'Rejected', className: 'bg-[#FDECEC] text-[#D92D20]' },
}

const PANEL_COLORS: Record<string, string> = {
  'Hiring Manager': 'bg-[#15A05B]',
  Recruiter: 'bg-[#5BC8D6]',
}

const OUTLINE_BTN =
  '!h-8 !rounded-md border-[#E4E1EE] bg-white px-3 text-[13px] font-medium text-[#1A1A2E] hover:bg-[#F7F6FB]'
const PRIMARY_BTN =
  '!h-8 !rounded-md !bg-[#2D2061] px-3 text-[13px] font-semibold text-white hover:!bg-[#241a52]'

/**
 * E2E Interviews → Two-Way Interviews → Interviews (Two-way AI only).
 */
export function TwoWayInterviewsPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState(() =>
    getScheduledInterviews().filter((r) => r.type === 'twoWayAi' && r.slot),
  )
  const [tab, setTab] = useState<InterviewTab>('upcoming')
  const [pendingCancel, setPendingCancel] = useState<ScheduledInterview | null>(null)
  const [rescheduling, setRescheduling] = useState<ScheduledInterview | null>(null)

  const byTab = useMemo(
    () => ({
      upcoming: rows.filter((r) => r.status === 'scheduled'),
      cancelled: rows.filter((r) => r.status === 'cancelled'),
      completed: rows.filter((r) => r.status === 'completed'),
      reschedule: rows.filter((r) => r.status === 'scheduled' && r.rescheduleRequested),
    }),
    [rows],
  )
  const visible = byTab[tab]

  function patchRow(id: string, patch: Partial<ScheduledInterview>) {
    setRows((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function notify(title: string, message: string) {
    toast.success(message, { title })
  }

  function confirmCancel() {
    if (!pendingCancel) return
    patchRow(pendingCancel.id, {
      status: 'cancelled',
      statusNote: 'Cancelled by recruiter',
      cancelledBy: 'You',
      rescheduleRequested: false,
    })
    notify('Cancel', `Interview with ${pendingCancel.candidate} cancelled.`)
    setPendingCancel(null)
  }

  function actionsFor(row: ScheduledInterview) {
    const plan = (
      <Button
        type="button"
        variant="outline"
        className={OUTLINE_BTN}
        onClick={() => navigate(`/e2e-interviews/two-way/interviews/${row.id}/plan`)}
      >
        Interview plan
      </Button>
    )
    switch (tab) {
      case 'upcoming':
        return (
          <>
            {plan}
            <Button
              type="button"
              variant="outline"
              className={OUTLINE_BTN}
              onClick={() => setRescheduling(row)}
            >
              Reschedule
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn(OUTLINE_BTN, '!border-[#F4B4AE] !text-[#D92D20] hover:!bg-[#FEF3F2]')}
              onClick={() => setPendingCancel(row)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className={PRIMARY_BTN}
              onClick={() => notify('Join interview', `Joining the ${row.platform} meeting with ${row.candidate}.`)}
            >
              Join interview
            </Button>
          </>
        )
      case 'reschedule':
        return (
          <>
            {plan}
            <Button
              type="button"
              variant="outline"
              className={OUTLINE_BTN}
              onClick={() => {
                patchRow(row.id, { rescheduleRequested: false })
                notify('Reschedule request', `${row.candidate}'s request declined. The original slot stays.`)
              }}
            >
              Decline
            </Button>
            <Button
              type="button"
              className={PRIMARY_BTN}
              onClick={() => {
                patchRow(row.id, { rescheduleRequested: false })
                notify('Reschedule request', `New slot options sent to ${row.candidate}.`)
              }}
            >
              Approve
            </Button>
          </>
        )
      case 'completed':
        return (
          <>
            {row.result ? (
              <span
                className={cn(
                  'rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-[0.04em]',
                  RESULT_TAG[row.result].className,
                )}
              >
                {RESULT_TAG[row.result].label}
              </span>
            ) : null}
            <Button
              type="button"
              className={PRIMARY_BTN}
              onClick={() => notify('Open result', `Opening Jeeves results for ${row.candidate}.`)}
            >
              Open result
            </Button>
          </>
        )
      case 'cancelled':
        return (
          <>
            <span className="rounded-md bg-[#FDECEC] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[#D92D20]">
              Cancelled
            </span>
            <Button
              type="button"
              className={PRIMARY_BTN}
              onClick={() => notify('Re-invite', `A new invite was sent to ${row.candidate}.`)}
            >
              Re-invite
            </Button>
          </>
        )
    }
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            Interviews
            <span className="rounded-md bg-[#FDE7EF] px-1.5 py-0.5 text-[11px] font-bold text-[#C2185B]">
              AI
            </span>
          </span>
        }
        subtitle="Two-way AI interviews — upcoming, completed, cancelled and reschedule requests — with the results Jeeves produced."
      />

      <SegmentedControl
        value={tab}
        aria-label="Interview status"
        onChange={setTab}
        className="w-fit max-w-full self-start overflow-x-auto"
        options={[
          { value: 'upcoming', label: `Upcoming (${byTab.upcoming.length})` },
          { value: 'cancelled', label: `Cancelled (${byTab.cancelled.length})` },
          { value: 'completed', label: `Completed (${byTab.completed.length})` },
          { value: 'reschedule', label: `Reschedule Requests (${byTab.reschedule.length})` },
        ]}
      />

      <div key={tab} className="flex animate-fade-up flex-col gap-2.5">
        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E0DDEA] bg-white px-6 py-12 text-center">
            <p className="text-sm font-semibold text-[#2D2061]">Nothing here yet</p>
            <p className="mt-1 text-sm text-[#8B8B9E]">Interviews will appear here as they move through this stage.</p>
          </div>
        ) : (
          visible.map((row) => (
            <InterviewCard key={row.id} row={row} tab={tab} actions={actionsFor(row)} />
          ))
        )}
      </div>

      <RescheduleInterviewPanel
        open={rescheduling !== null}
        interview={rescheduling}
        panel={INTERVIEW_PANEL}
        onClose={() => setRescheduling(null)}
        onConfirm={(result) => {
          if (!rescheduling) return
          if (result.mode === 'pick') {
            patchRow(rescheduling.id, { slot: result.slot, rescheduleRequested: false })
            notify('Reschedule', `${rescheduling.candidate} moved to ${result.slot}.`)
          } else {
            notify('Reschedule', `Booking link sent to ${rescheduling.candidate}.`)
          }
          setRescheduling(null)
        }}
      />

      <Modal
        open={Boolean(pendingCancel)}
        onClose={() => setPendingCancel(null)}
        title="Cancel Interview"
        className="max-w-md"
        zClassName="z-[70]"
      >
        <p className="text-sm leading-relaxed text-[#4A4A5A]">
          Cancel the interview with{' '}
          <span className="font-semibold text-[#2D2061]">{pendingCancel?.candidate}</span> on{' '}
          {pendingCancel?.slot}? The candidate and panel will be notified.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPendingCancel(null)}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Keep interview
          </Button>
          <Button
            type="button"
            onClick={confirmCancel}
            className="!h-10 !rounded-md !bg-[#E53935] !px-5 text-sm font-semibold text-white hover:!bg-[#C62828]"
          >
            Cancel interview
          </Button>
        </div>
      </Modal>
    </PageContainer>
  )
}

function InterviewCard({
  row,
  tab,
  actions,
}: {
  row: ScheduledInterview
  tab: InterviewTab
  actions: ReactNode
}) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:px-5 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2D2061] text-base font-bold text-white">
          {row.candidate.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm">
            <span className="font-bold text-[#1A1A2E]">{row.candidate}</span>
            <span className="text-[#8B8B9E]">
              {' '}
              · {row.job} · {row.roundName}
            </span>
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[#6B6B80]">
            {tab === 'cancelled' ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                  Was {row.slot}
                </span>
                {row.statusNote ? (
                  <span className="inline-flex items-center gap-1.5">
                    <X className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                    {row.statusNote}
                  </span>
                ) : null}
                {row.cancelledBy ? (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                    Cancelled by {row.cancelledBy}
                  </span>
                ) : null}
              </>
            ) : (
            <>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              {row.slot}
            </span>
            {tab !== 'completed' ? (
              <span className="inline-flex items-center gap-1.5">
                <MonitorPlay className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                {row.platform}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              <span className="flex -space-x-1">
                {INTERVIEW_PANEL.map((person) => (
                  <Tooltip key={person} content={person} side="top">
                    <span
                      tabIndex={0}
                      aria-label={person}
                      className={cn(
                        'inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white',
                        PANEL_COLORS[person] ?? 'bg-[#8B8B9E]',
                      )}
                    >
                      {person.charAt(0)}
                    </span>
                  </Tooltip>
                ))}
              </span>
            </span>
            {row.rescheduleRequested ? (
              <span className="rounded-md bg-[#FDF3D7] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-[#B7791F]">
                Reschedule requested
              </span>
            ) : null}
            {tab === 'completed' ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <StarRating value={Math.round(row.rating ?? 0)} />
                  <span className="text-xs">({(row.rating ?? 0).toFixed(1)})</span>
                </span>
                {row.aiFit != null ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Target className="size-3.5 text-[#C2185B]" strokeWidth={1.75} aria-hidden="true" />
                    AI fit <span className="font-bold text-[#1F1B4D]">{row.aiFit}%</span>
                  </span>
                ) : null}
              </>
            ) : null}
            </>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">{actions}</div>
    </article>
  )
}
