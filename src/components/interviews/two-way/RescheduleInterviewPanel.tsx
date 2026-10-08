import { useMemo, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import {
  Button,
  Checkbox,
  SegmentedControl,
  Select,
  SidePanel,
  Textarea,
  Tooltip,
} from '../../ui'
import { cn } from '../../../lib/cn'
import type { ScheduledInterview } from '../../../data/scheduledInterviews'

type Mode = 'pick' | 'candidate'

export type RescheduleResult =
  | { mode: 'pick'; slot: string; reason: string; note: string; notify: boolean }
  | { mode: 'candidate'; reason: string; note: string; notify: boolean }

export type RescheduleInterviewPanelProps = {
  open: boolean
  interview: ScheduledInterview | null
  /** Panel members who must all be free */
  panel: string[]
  onClose: () => void
  onConfirm: (result: RescheduleResult) => void
}

const REASONS = [
  'Panel unavailable',
  'Candidate request',
  'Technical issue',
  'Scheduling conflict',
  'Other',
]

const TIMES = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:30 PM', '03:30 PM', '04:30 PM']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const PANEL_COLORS: Record<string, string> = {
  'Hiring Manager': 'bg-[#15A05B]',
  Recruiter: 'bg-[#5BC8D6]',
}

type Day = { key: string; weekday: string; date: number; label: string; weekend: boolean; index: number }

/** Seven days starting from the demo week (Thu 8 Oct 2026). */
function buildDays(): Day[] {
  const start = new Date(2026, 9, 8)
  return Array.from({ length: 7 }, (_, index) => {
    const d = new Date(start)
    d.setDate(start.getDate() + index)
    const weekday = WEEKDAYS[d.getDay()]
    return {
      key: d.toISOString().slice(0, 10),
      weekday,
      date: d.getDate(),
      label: `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      weekend: weekday === 'Sat' || weekday === 'Sun',
      index,
    }
  })
}

/** Demo availability: one slot per weekday is blocked by a panel member. */
function busySlot(day: Day): { time: string; who: string } | null {
  if (day.weekend) return null
  return { time: TIMES[(day.index + 1) % TIMES.length], who: day.index % 2 ? 'Recruiter' : 'Heli' }
}

/**
 * Two-Way Interviews → Reschedule: pick a new free panel slot, or let the
 * candidate choose one.
 */
export function RescheduleInterviewPanel({
  open,
  interview,
  panel,
  onClose,
  onConfirm,
}: RescheduleInterviewPanelProps) {
  const days = useMemo(buildDays, [])
  const [mode, setMode] = useState<Mode>('pick')
  const [dayKey, setDayKey] = useState(days[1].key)
  const [time, setTime] = useState(TIMES[0])
  const [reason, setReason] = useState(REASONS[0])
  const [note, setNote] = useState('')
  const [notify, setNotify] = useState(true)
  const [openedFor, setOpenedFor] = useState<string | null>(null)

  // Fresh form each time the panel opens for an interview
  const key = open && interview ? interview.id : null
  if (key !== openedFor) {
    setOpenedFor(key)
    if (key) {
      setMode('pick')
      setDayKey(days[1].key)
      setTime(TIMES[0])
      setReason(interview?.rescheduleRequested ? 'Candidate request' : REASONS[0])
      setNote('')
      setNotify(true)
    }
  }

  const day = days.find((d) => d.key === dayKey) ?? days[1]
  const busy = busySlot(day)
  const freeCount = (d: Day) => (d.weekend ? 0 : TIMES.length - (busySlot(d) ? 1 : 0))
  // If the chosen time is blocked on this day, fall back to its first free time
  const slotTime = busy?.time === time ? (TIMES.find((t) => t !== busy.time) ?? time) : time
  const newSlot = `${day.label} · ${slotTime}`
  const isTwoWayAi = interview?.type === 'twoWayAi'

  function handleConfirm() {
    if (mode === 'pick') onConfirm({ mode, slot: newSlot, reason, note: note.trim(), notify })
    else onConfirm({ mode, reason, note: note.trim(), notify })
  }

  return (
    <SidePanel
      open={open && Boolean(interview)}
      onClose={onClose}
      title="Reschedule Interview"
      widthClassName="w-full max-w-[40rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Keep current slot
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            {mode === 'pick' ? 'Confirm new slot' : 'Send booking link'}
          </Button>
        </>
      }
    >
      {interview ? (
        <div className="flex flex-col gap-5">
          {/* Interview summary */}
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E1EE] bg-[#F7F7FA] p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2D2061] text-base font-bold text-white">
                {interview.candidate.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#1A1A2E]">{interview.candidate}</p>
                <p className="mt-0.5 text-xs text-[#6B6B80]">
                  {interview.job} · {interview.roundName} · 60 min · {interview.platform}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#8B8B9E]">Current slot</p>
              <p className="mt-0.5 text-sm font-bold text-[#1F1B4D]">{interview.slot}</p>
            </div>
          </section>

          <SegmentedControl
            value={mode}
            aria-label="Reschedule method"
            onChange={setMode}
            className="w-fit"
            options={[
              { value: 'pick', label: 'Pick a new slot' },
              { value: 'candidate', label: 'Let the candidate choose' },
            ]}
          />

          {mode === 'pick' ? (
            <div key="pick" className="flex animate-fade-up flex-col gap-4">
              <div>
                <p className="mb-2 text-sm text-[#6B6B80]">
                  <span className="font-semibold text-[#1A1A2E]">New date</span> · free slots from
                  the panel&apos;s {interview.platform} calendars, (GMT+04:00) Asia/Dubai
                </p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7" role="radiogroup" aria-label="New date">
                  {days.map((d) => {
                    const selected = d.key === day.key
                    const free = freeCount(d)
                    return (
                      <button
                        key={d.key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={free === 0}
                        onClick={() => setDayKey(d.key)}
                        className={cn(
                          'flex flex-col items-center rounded-lg border px-1 py-2 transition-colors disabled:cursor-not-allowed',
                          selected
                            ? 'border-[#2D2061] bg-[#2D2061] text-white'
                            : free === 0
                              ? 'border-[#ECEAF3] bg-[#FAFAFC] text-[#B8B5C9]'
                              : 'border-[#E4E1EE] bg-white text-[#1A1A2E] hover:border-[#2D2061]/40',
                        )}
                      >
                        <span className="text-xs">{d.weekday}</span>
                        <span className="text-lg font-bold leading-tight">{d.date}</span>
                        <span
                          className={cn(
                            'text-[11px] font-semibold',
                            selected ? 'text-[#7EE2B8]' : free ? 'text-[#15A05B]' : 'text-[#B8B5C9]',
                          )}
                        >
                          {free ? `${free} free` : '—'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="New time">
                {TIMES.map((t) => {
                  const blocked = busy?.time === t
                  const selected = t === slotTime
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={blocked}
                      onClick={() => setTime(t)}
                      className={cn(
                        'inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm transition-colors disabled:cursor-not-allowed',
                        selected
                          ? 'border-[#2D2061] bg-[#F1F0F7] font-semibold text-[#2D2061] ring-1 ring-[#2D2061]'
                          : blocked
                            ? 'border-[#ECEAF3] bg-[#FAFAFC] text-[#B8B5C9]'
                            : 'border-[#E4E1EE] bg-white font-medium text-[#1A1A2E] hover:border-[#2D2061]/40',
                      )}
                    >
                      <span className={blocked ? 'line-through' : undefined}>{t}</span>
                      {blocked ? <span className="text-xs">{busy?.who} busy</span> : null}
                    </button>
                  )
                })}
              </div>

              <PanelLine panel={panel} />

              <p className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#E6F6EC] px-4 py-3 text-sm text-[#15803D]">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                  New slot: <span className="font-bold">{newSlot}</span>
                </span>
                <span className="text-xs text-[#4A7A5C]">
                  {interview.platform} meeting will be moved; the link stays the same.
                </span>
              </p>
            </div>
          ) : (
            <div key="candidate" className="flex animate-fade-up flex-col gap-3">
              <p className="rounded-lg border border-[#E4E1EE] bg-[#F7F7FA] px-4 py-3 text-sm leading-relaxed text-[#4A4760]">
                {interview.candidate} gets a link to pick any free slot in the next 7 days. Only
                times when the whole panel is free are offered, and the current slot is released
                once they book.
              </p>
              <PanelLine panel={panel} />
            </div>
          )}

          <Select
            id="reschedule-reason"
            label="Reason"
            options={REASONS}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <Textarea
            label="Note to the candidate (optional)"
            placeholder="e.g. Apologies for the change — the panel has a clash at the original time."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />

          <Checkbox
            id="reschedule-notify"
            label="Email the candidate and panel, and update the calendar invite"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
          />

          {isTwoWayAi ? (
            <p className="-mt-2 inline-flex items-center gap-1.5 text-xs text-[#6B6B80]">
              <Sparkles className="size-3.5 text-[#C2185B]" strokeWidth={2} aria-hidden="true" />
              Two-way: Jeeves AI moves with the meeting — its plan and summary stay attached.
            </p>
          ) : null}
        </div>
      ) : null}
    </SidePanel>
  )
}

function PanelLine({ panel }: { panel: string[] }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm text-[#6B6B80]">
      Panel
      <span className="flex -space-x-1">
        {panel.map((person) => (
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
      must all be free · slots are 60 min with a 30 min gap
    </p>
  )
}
