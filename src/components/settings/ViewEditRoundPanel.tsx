import { useState, type ReactNode } from 'react'
import {
  Button,
  Checkbox,
  Input,
  Select,
  SidePanel,
  Textarea,
} from '../ui'
import { cn } from '../../lib/cn'

export type ViewEditRoundValues = {
  name: string
  defaultDurationMins: number
  gapMins: number
  slotsOpenAfter: string
  lookAheadDays: number
  allowedDurations: number[]
  fallbackTimezone: string
  statusWhenLinkSent: string
  statusWhenBooked: string
  statusWhenSelected: string
  statusWhenRejected: string
  statusWhenCancelled: string
  autoSendBookingLink: string
  aiCopilot: boolean
  calendarInviteText: string
  active: boolean
}

export type ViewEditRoundPanelProps = {
  open: boolean
  /** Stable id used to reset the form when a different round opens */
  roundId: string
  /** Panel title — e.g. "Add Round" or "View & Edit Round 1" */
  title: string
  /** Primary footer button label — e.g. "Add" or "Save Round" */
  saveLabel?: string
  values: ViewEditRoundValues
  takenNames: string[]
  onClose: () => void
  onSave: (values: ViewEditRoundValues) => void
}

type StatusFieldKey = keyof Pick<
  ViewEditRoundValues,
  | 'statusWhenLinkSent'
  | 'statusWhenBooked'
  | 'statusWhenSelected'
  | 'statusWhenRejected'
  | 'statusWhenCancelled'
>

const DURATION_OPTIONS = [
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
  { value: '75', label: '75 minutes' },
  { value: '90', label: '90 minutes' },
  { value: '105', label: '105 minutes' },
  { value: '120', label: '120 minutes' },
]

const GAP_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
]

const SLOTS_OPEN_AFTER_OPTIONS = [
  { value: '0m', label: 'Immediately' },
  { value: '30m', label: '30 minutes' },
  { value: '60m', label: '60 minutes' },
  { value: '1d', label: '1 day' },
  { value: '2d', label: '2 days' },
  { value: '3d', label: '3 days' },
]

const SLOTS_OPEN_AFTER_SHORT: Record<string, string> = {
  '0m': 'Immediately',
  '30m': '30 min',
  '60m': '60 min',
  '1d': '1 day',
  '2d': '2 days',
  '3d': '3 days',
}

const LOOK_AHEAD_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '10', label: '10 days' },
  { value: '14', label: '14 days' },
  { value: '21', label: '21 days' },
  { value: '30', label: '30 days' },
]

const TEAM_DURATION_CHIPS = [30, 45, 60, 75, 90, 105, 120]

const TIMEZONE_OPTIONS = [
  { value: 'company', label: 'Company Time zone' },
  { value: 'utc', label: 'UTC' },
  { value: 'asia-dubai', label: '(GMT+04:00) Asia/Dubai' },
  { value: 'asia-kolkata', label: '(GMT+05:30) Asia/Kolkata' },
  { value: 'europe-london', label: '(GMT+00:00) Europe/London' },
]

const STATUS_NO_CHANGE = 'no-change'

const PIPELINE_STATUS_FIELDS: ReadonlyArray<{
  id: string
  label: string
  key: StatusFieldKey
}> = [
  {
    id: 'status-link-sent',
    label: 'When the booking link is sent',
    key: 'statusWhenLinkSent',
  },
  {
    id: 'status-booked',
    label: 'When a slot is booked',
    key: 'statusWhenBooked',
  },
  {
    id: 'status-selected',
    label: 'When the candidate is Selected',
    key: 'statusWhenSelected',
  },
  {
    id: 'status-rejected',
    label: 'When the candidate is Rejected',
    key: 'statusWhenRejected',
  },
  {
    id: 'status-cancelled',
    label: 'When the interview is cancelled',
    key: 'statusWhenCancelled',
  },
]

const AUTO_SEND_OPTIONS = [
  { value: 'never', label: 'Never — recruiters send it by hand' },
  { value: 'invite', label: 'When status becomes the Invite status' },
  { value: 'booked', label: 'When status becomes the Booked status' },
]

const CALENDAR_FIELDS = [
  'CANDIDATE NAME',
  'JOB TITLE',
  'COMPANY NAME',
  'INTERVIEW DATETIME',
  'MEETING LINK',
] as const

const DEFAULT_INVITE_TEXT =
  'Interview for [JOB_TITLE] with [COMPANY_NAME]. Please join on time using the meeting link.'

export const DEFAULT_VIEW_EDIT_ROUND_VALUES: ViewEditRoundValues = {
  name: '',
  defaultDurationMins: 60,
  gapMins: 30,
  slotsOpenAfter: '1d',
  lookAheadDays: 10,
  allowedDurations: [30, 45, 60],
  fallbackTimezone: 'company',
  statusWhenLinkSent: 'invite',
  statusWhenBooked: 'booked',
  statusWhenSelected: STATUS_NO_CHANGE,
  statusWhenRejected: STATUS_NO_CHANGE,
  statusWhenCancelled: STATUS_NO_CHANGE,
  autoSendBookingLink: 'never',
  aiCopilot: false,
  calendarInviteText: DEFAULT_INVITE_TEXT,
  active: true,
}

/** Empty form values for Add Round. */
export const BLANK_VIEW_EDIT_ROUND_VALUES: ViewEditRoundValues = {
  name: '',
  defaultDurationMins: 0,
  gapMins: 0,
  slotsOpenAfter: '',
  lookAheadDays: 0,
  allowedDurations: [],
  fallbackTimezone: '',
  statusWhenLinkSent: '',
  statusWhenBooked: '',
  statusWhenSelected: '',
  statusWhenRejected: '',
  statusWhenCancelled: '',
  autoSendBookingLink: '',
  aiCopilot: false,
  calendarInviteText: '',
  active: false,
}

/**
 * Settings → 2 Way Interview → Rounds → View & Edit / Add Round side panel.
 */
export function ViewEditRoundPanel({
  open,
  roundId,
  title,
  saveLabel = 'Save Round',
  values: initialValues,
  takenNames,
  onClose,
  onSave,
}: ViewEditRoundPanelProps) {
  const [values, setValues] = useState(initialValues)
  const [nameError, setNameError] = useState('')
  const [openedFor, setOpenedFor] = useState<string | null>(null)

  const openKey = open ? roundId : null
  if (openKey !== openedFor) {
    setOpenedFor(openKey)
    if (openKey) {
      setValues(initialValues)
      setNameError('')
    }
  }

  function patch(partial: Partial<ViewEditRoundValues>) {
    setValues((current) => ({ ...current, ...partial }))
  }

  function toggleDuration(mins: number) {
    setValues((current) => {
      const selected = current.allowedDurations.includes(mins)
      const next = selected
        ? current.allowedDurations.filter((value) => value !== mins)
        : [...current.allowedDurations, mins].sort((a, b) => a - b)
      return { ...current, allowedDurations: next }
    })
  }

  function insertField(field: string) {
    const token = `[${field.replace(/ /g, '_')}]`
    const current = values.calendarInviteText
    const spacer = current && !current.endsWith(' ') ? ' ' : ''
    patch({ calendarInviteText: `${current}${spacer}${token}` })
  }

  function handleSave() {
    const name = values.name.trim()
    if (!name) {
      setNameError('Enter a round name.')
      return
    }
    const taken = takenNames.some(
      (existing) => existing.toLowerCase() === name.toLowerCase(),
    )
    if (taken) {
      setNameError('This name is already used.')
      return
    }
    onSave({ ...values, name })
  }

  const roundLabel = values.name.trim() || 'Round'
  const statusOptions = [
    { value: 'invite', label: `${roundLabel} Invite` },
    { value: 'booked', label: roundLabel },
    { value: STATUS_NO_CHANGE, label: "Don't change the status" },
  ]

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={title}
      widthClassName="w-full max-w-[40rem]"
      bodyClassName="!bg-[#F5F5F8] space-y-4"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            {saveLabel}
          </Button>
        </>
      }
    >
      <SectionCard>
        <Input
          id="view-edit-round-name"
          label="Round Name"
          value={values.name}
          placeholder="Enter Round Name"
          onChange={(event) => {
            patch({ name: event.target.value })
            if (nameError) setNameError('')
          }}
          error={nameError || undefined}
        />
      </SectionCard>

      <SectionCard
        title="Slots"
        description="How the booking calendar is built"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="default-duration"
            label="Default duration"
            value={
              values.defaultDurationMins
                ? String(values.defaultDurationMins)
                : ''
            }
            onChange={(event) =>
              patch({
                defaultDurationMins: event.target.value
                  ? Number(event.target.value)
                  : 0,
              })
            }
            options={DURATION_OPTIONS}
            placeholder="Select"
          />
          <Select
            id="gap-mins"
            label="Gap between slot start times"
            value={values.gapMins ? String(values.gapMins) : ''}
            onChange={(event) =>
              patch({
                gapMins: event.target.value ? Number(event.target.value) : 0,
              })
            }
            options={GAP_OPTIONS}
            placeholder="Select"
          />
          <Select
            id="slots-open-after"
            label="Slots open after"
            value={values.slotsOpenAfter}
            onChange={(event) => patch({ slotsOpenAfter: event.target.value })}
            options={SLOTS_OPEN_AFTER_OPTIONS}
            placeholder="Select"
          />
          <Select
            id="look-ahead"
            label="Look ahead"
            value={values.lookAheadDays ? String(values.lookAheadDays) : ''}
            onChange={(event) =>
              patch({
                lookAheadDays: event.target.value
                  ? Number(event.target.value)
                  : 0,
              })
            }
            options={LOOK_AHEAD_OPTIONS}
            placeholder="Select"
          />
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-[#2D2061]">
            Durations the Interview Team may choose
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {TEAM_DURATION_CHIPS.map((mins) => {
              const selected = values.allowedDurations.includes(mins)
              return (
                <button
                  key={mins}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleDuration(mins)}
                  className={cn(
                    'inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors',
                    selected
                      ? 'border-[#2D2061] bg-[#2D2061] text-white'
                      : 'border-[#D5D2E2] bg-white text-[#2D2061] hover:border-[#2D2061]/50',
                  )}
                >
                  {mins} min
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-5">
          <Select
            id="fallback-timezone"
            label="Fallback Time zone"
            value={values.fallbackTimezone}
            onChange={(event) => patch({ fallbackTimezone: event.target.value })}
            options={TIMEZONE_OPTIONS}
            placeholder="Select"
          />
          <p className="mt-1.5 text-xs leading-relaxed text-[#8B8B9E]">
            Used for panel members who have no timezone on their profile.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Pipeline Status Mapping"
        description="What happens to the application"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PIPELINE_STATUS_FIELDS.map((field) => (
            <Select
              key={field.id}
              id={field.id}
              label={field.label}
              value={values[field.key]}
              onChange={(event) =>
                patch({ [field.key]: event.target.value })
              }
              options={statusOptions}
              placeholder="Select"
            />
          ))}
        </div>

        <div className="mt-4">
          <Select
            id="auto-send-booking"
            label="Send the booking link automatically when the status becomes"
            value={values.autoSendBookingLink}
            onChange={(event) =>
              patch({ autoSendBookingLink: event.target.value })
            }
            options={AUTO_SEND_OPTIONS}
            placeholder="Select"
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-[#8B8B9E]">
          {`Every round gets two pipeline statuses of its own, “${roundLabel}” and “${roundLabel} Invite”, in Settings → Pipeline Workflow. Only applied while the candidate isn’t rejected, withdrawn or hired.`}
        </p>
      </SectionCard>

      <SectionCard title="AI Co-Pilot & Calendar">
        <Checkbox
          id="ai-copilot"
          checked={values.aiCopilot}
          onChange={(event) => patch({ aiCopilot: event.target.checked })}
          label="Jeeves AI co-pilot joins the meeting (Two-Way interview)"
        />

        <div className="mt-4">
          <Textarea
            id="calendar-invite-text"
            label="Calendar invite text"
            rows={4}
            value={values.calendarInviteText}
            onChange={(event) =>
              patch({ calendarInviteText: event.target.value })
            }
          />
          <p className="mt-2 text-xs leading-relaxed text-[#8B8B9E]">
            Fields:{' '}
            {CALENDAR_FIELDS.map((field, index) => (
              <span key={field}>
                <button
                  type="button"
                  onClick={() => insertField(field)}
                  className="font-medium text-[#5B7C99] hover:underline"
                >
                  {`|${field}|`}
                </button>
                {index < CALENDAR_FIELDS.length - 1 ? ' ' : null}
              </span>
            ))}
          </p>
        </div>

        <div className="mt-4">
          <Checkbox
            id="round-active"
            checked={values.active}
            onChange={(event) => patch({ active: event.target.checked })}
            label="Active"
          />
        </div>
      </SectionCard>
    </SidePanel>
  )
}

function SectionCard({
  title,
  description,
  children,
}: {
  title?: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="rounded-[8px] border border-[#E4E1EE] bg-white p-4 sm:p-5">
      {title ? (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#1F1F2E]">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-xs text-[#8B8B9E]">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function formatSlotsOpenAfter(value: string): string {
  return SLOTS_OPEN_AFTER_SHORT[value] ?? value
}
