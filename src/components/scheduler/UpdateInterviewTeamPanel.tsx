import { useEffect, useState } from 'react'
import { AlertTriangle, CalendarDays, Check } from 'lucide-react'
import {
  Button,
  Select,
  SidePanel,
  toast,
} from '../ui'
import { cn } from '../../lib/cn'

export type UpdateInterviewTeamContext = {
  candidateName: string
  jobReference: string
  /** Display label, e.g. "HR SCREENING" */
  roundCategory: string
  /** Optional pre-filled datetime-local value */
  initialSlot?: string
}

export type UpdateInterviewTeamPanelProps = {
  open: boolean
  onClose: () => void
  context: UpdateInterviewTeamContext | null
  onConfirm?: (payload: {
    slot: string
    timezone: string
  }) => void
  onPostpone?: () => void
}

const TIMEZONE_OPTIONS = [
  'Asia/Calcutta (UTC+05:30)',
  'Asia/Dubai (UTC+04:00)',
  'Europe/London (UTC+00:00)',
  'America/New_York (UTC-05:00)',
  'UTC (UTC+00:00)',
]

const CHECKLIST_ITEMS = [
  {
    id: 'organizer',
    getText: (name: string) =>
      `Technical Organizer (${name}) is AVAILABLE at chosen Slot time.`,
    organizerName: 'Heli Shah',
  },
  {
    id: 'mandatory',
    getText: (name: string) =>
      `Mandatory Participants (${name}) calendar overlaps successfully.`,
    organizerName: 'Sarah Miller',
  },
  {
    id: 'duration',
    getText: () =>
      'Chosen duration fits well within recruiter working hours limit.',
    organizerName: '',
  },
] as const

/**
 * Book Candidates → + Assign — setup interviewee slot & team validation.
 */
export function UpdateInterviewTeamPanel({
  open,
  onClose,
  context,
  onConfirm,
  onPostpone,
}: UpdateInterviewTeamPanelProps) {
  const [slot, setSlot] = useState('2026-06-15T14:00')
  const [timezone, setTimezone] = useState(TIMEZONE_OPTIONS[0] ?? '')

  useEffect(() => {
    if (!open) return
    setSlot(context?.initialSlot || '2026-06-15T14:00')
    setTimezone(TIMEZONE_OPTIONS[0] ?? '')
  }, [open, context])

  const name = context?.candidateName ?? '—'
  const jobRef = context?.jobReference ?? '—'
  const round = context?.roundCategory ?? '—'

  function handleConfirm() {
    onConfirm?.({ slot, timezone })
    toast.success(`Interview team updated for ${name}.`, {
      title: 'Confirm & Update',
    })
    onClose()
  }

  function handlePostpone() {
    onPostpone?.()
    toast.success(`Interview postponed for ${name}.`, {
      title: 'Postpone',
    })
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Update Interview Team"
      widthClassName="w-full max-w-[32rem]"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={handlePostpone}
            className="!h-10 !rounded-md !bg-[#EEF2FA] px-4 text-sm font-semibold text-[#2D2061] hover:!bg-[#E4EAF6]"
          >
            Postpone
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="!h-10 !rounded-md !bg-[#2D2061] px-4 text-xs font-semibold uppercase tracking-wide text-white hover:!bg-[#241a52] sm:px-5"
          >
            Confirm &amp; Update
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <p className="-mt-1 text-sm text-[#8B8B9E]">
          Setup candidate slot availability and overlap rosters
        </p>

        {/* Interviewee summary */}
        <div className="rounded-lg border border-[#E4E1EE] bg-[#F7F7FA] px-3.5 py-3.5 sm:px-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Target Interviewee:
              </p>
              <p className="mt-0.5 text-sm font-bold text-[#2D2061]">{name}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B9E]">
                Round Category:{' '}
                <span className="text-[#6B6B80]">{round}</span>
              </p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Job Reference:
              </p>
              <span className="mt-1 inline-flex rounded-md border border-[#E0DDEA] bg-white px-2.5 py-1 text-xs font-semibold text-[#6B6B80]">
                {jobRef}
              </span>
            </div>
          </div>
        </div>

        {/* Slot + timezone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-1.5">
            <label
              htmlFor="interview-slot"
              className="text-xs font-medium text-[#2D2061]"
            >
              Interview Date &amp; Time Slot:
            </label>
            <div className="relative">
              <input
                id="interview-slot"
                type="datetime-local"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className={cn(
                  'h-11 w-full rounded-md border border-[#ddd9e8] bg-white py-2 pl-3 pr-10 text-sm text-[#2D2061]',
                  'outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
                )}
              />
              <CalendarDays
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </div>
          </div>
          <Select
            label="Target Workspace Timezone:"
            options={TIMEZONE_OPTIONS}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="bg-white"
          />
        </div>

        {/* Overlap validation */}
        <div className="rounded-lg border border-[#E4E1EE] bg-white px-3.5 py-3.5 sm:px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#5C5878]">
            Automatic Overlap Validation Checklists:
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {CHECKLIST_ITEMS.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#12B76A] text-white">
                  <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <p className="text-xs leading-relaxed text-[#3D3A52]">
                  {item.getText(item.organizerName)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2.5 rounded-lg bg-[#F2F1F6] px-3.5 py-3">
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded text-[#D97706]">
            <AlertTriangle className="size-4" strokeWidth={2} aria-hidden="true" />
          </span>
          <p className="text-xs leading-relaxed text-[#5C5878]">
            Updating this team configuration will notify both the candidate and
            selected interview organizers. A secure calendar invitation with the
            meeting coordinates will be dispatched.
          </p>
        </div>
      </div>
    </SidePanel>
  )
}
