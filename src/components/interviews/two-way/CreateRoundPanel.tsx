import { useState, type ReactNode } from 'react'
import { Button, Select, SidePanel } from '../../ui'
import { FieldInput } from '../../jobs/create/StepChrome'
import { cn } from '../../../lib/cn'

export type PanelRound = {
  id: string
  name: string
  meetingPlatform: string
  durationMins: number
  /** Two-Way AI joins — managed later in Interviews › Set up two-way */
  aiJoins: boolean
  active: boolean
  /** Interview organiser (one person) */
  organiser: string | null
  mandatoryParticipants: string[]
  optionalParticipants: string[]
  fallbackTimezone: string
  /** Minutes between bookable slot start times */
  gapMins: number
  slotsOpenAfterDays: number
  lookAheadDays: number
}

/** Fields edited in the Create / Edit Round panel */
export type RoundValues = Pick<PanelRound, 'name' | 'meetingPlatform' | 'durationMins' | 'aiJoins'>

/** Defaults for the slot / panel settings of a new round */
export const NEW_ROUND_DEFAULTS: Omit<PanelRound, 'id' | keyof RoundValues> = {
  active: true,
  organiser: null,
  mandatoryParticipants: [],
  optionalParticipants: [],
  fallbackTimezone: '(GMT+04:00) Asia/Dubai',
  gapMins: 30,
  slotsOpenAfterDays: 0,
  lookAheadDays: 7,
}

export const MEETING_PLATFORM_OPTIONS = [
  'Microsoft Teams',
  'Zoom',
  'Google Meet',
  'Webex',
  'In person',
]

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120].map(String)

export type CreateRoundPanelProps = {
  open: boolean
  /** null = create a new round */
  round: PanelRound | null
  /** Suggested name for a new round, e.g. "Round 2" */
  defaultName: string
  /** Names already used in this panel (uniqueness check) */
  takenNames: string[]
  onClose: () => void
  onSave: (values: RoundValues) => void
}

/**
 * Configure Panel → Rounds → Create new round side panel.
 */
export function CreateRoundPanel({
  open,
  round,
  defaultName,
  takenNames,
  onClose,
  onSave,
}: CreateRoundPanelProps) {
  const [values, setValues] = useState<RoundValues>({
    name: defaultName,
    meetingPlatform: MEETING_PLATFORM_OPTIONS[0],
    durationMins: 60,
    aiJoins: false,
  })
  const [nameError, setNameError] = useState('')
  const [openedFor, setOpenedFor] = useState<string | null>(null)

  // Reset the form each time the panel opens
  const key = open ? (round?.id ?? 'new') : null
  if (key !== openedFor) {
    setOpenedFor(key)
    if (key) {
      setValues(
        round
          ? { name: round.name, meetingPlatform: round.meetingPlatform, durationMins: round.durationMins, aiJoins: round.aiJoins }
          : { name: defaultName, meetingPlatform: MEETING_PLATFORM_OPTIONS[0], durationMins: 60, aiJoins: false },
      )
      setNameError('')
    }
  }

  function handleSave() {
    const name = values.name.trim()
    if (!name) {
      setNameError('Enter a round name.')
      return
    }
    const taken = takenNames
      .filter((n) => !round || n.toLowerCase() !== round.name.toLowerCase())
      .some((n) => n.toLowerCase() === name.toLowerCase())
    if (taken) {
      setNameError('This name is already used in this panel.')
      return
    }
    onSave({ ...values, name })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={round ? 'Edit Round' : 'Create New Round'}
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
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            {round ? 'Save' : 'Create New'}
          </Button>
        </>
      }
    >
      <div className="divide-y divide-[#ECEAF3]">
        <SettingRow
          label="Interview round name"
          required
          htmlFor="round-name-input"
          description="Name recruiters see. Must be unique in this panel."
        >
          <div className="flex flex-col gap-1">
            <FieldInput
              id="round-name-input"
              value={values.name}
              onChange={(e) => {
                setValues((v) => ({ ...v, name: e.target.value }))
                if (nameError) setNameError('')
              }}
              aria-invalid={nameError ? true : undefined}
              className={nameError ? '!border-[#E53935]' : undefined}
            />
            {nameError ? <p className="text-xs text-[#E53935]">{nameError}</p> : null}
          </div>
        </SettingRow>

        <SettingRow
          label="Meeting platform"
          htmlFor="round-platform"
          description="Where the interview happens."
        >
          <Select
            id="round-platform"
            options={MEETING_PLATFORM_OPTIONS}
            value={values.meetingPlatform}
            onChange={(e) => setValues((v) => ({ ...v, meetingPlatform: e.target.value }))}
          />
        </SettingRow>

        <SettingRow
          label="Interview duration"
          required
          htmlFor="round-duration"
          description="Length of each bookable slot."
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <Select
                id="round-duration"
                options={DURATION_OPTIONS}
                value={String(values.durationMins)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, durationMins: Number(e.target.value) }))
                }
              />
            </div>
            <span className="text-sm text-[#6B6B80]">minutes</span>
          </div>
        </SettingRow>

        <SettingRow
          label="Two-way AI"
          description="The AI joins the meeting and creates results. Managed in Interviews › Set up two-way."
        >
          <span
            className={cn(
              'inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-semibold',
              values.aiJoins ? 'bg-[#FDE7EF] text-[#C2185B]' : 'bg-[#EEEDF5] text-[#6B6B80]',
            )}
          >
            {values.aiJoins ? 'On' : 'Off'}
          </span>
        </SettingRow>
      </div>
    </SidePanel>
  )
}

/** Label + helper text on the left, control on the right. */
function SettingRow({
  label,
  description,
  required = false,
  htmlFor,
  children,
}: {
  label: string
  description: string
  required?: boolean
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-3 py-4 first:pt-0 sm:grid-cols-[minmax(0,1fr)_14rem] sm:gap-6">
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-[#1A1A2E]">
          {label}
          {required ? (
            <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        <p className="mt-0.5 text-xs leading-relaxed text-[#6B6B80]">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
