import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select, Switch } from '../ui'
import { FieldLabel, OneWayCard, OneWaySettingsShell } from './OneWaySettingsChrome'

const DAY_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: '1', label: '1 day before expiry' },
  { value: '2', label: '2 days before expiry' },
  { value: '3', label: '3 days before expiry' },
  { value: '5', label: '5 days before expiry' },
  { value: '7', label: '7 days before expiry' },
]

const SEND_OPTIONS = [
  { value: '1', label: '1 send per candidate' },
  { value: '2', label: '2 sends per candidate' },
  { value: '3', label: '3 sends per candidate' },
  { value: '5', label: '5 sends per candidate' },
]

const PREP_MIN_OPTIONS = ['0 mins', '1 min', '2 mins']
const PREP_MAX_OPTIONS = ['3 mins', '5 mins', '10 mins']
const ANSWER_MIN_OPTIONS = ['0.5 mins', '1 min', '2 mins']
const ANSWER_MAX_OPTIONS = ['5 mins', '10 mins', '15 mins']

/**
 * Settings → Module Configuration → 1 Way Interview → Default Settings.
 */
export function OneWayDefaultSettingsPanel() {
  const navigate = useNavigate()
  const [multiLanguage, setMultiLanguage] = useState(true)
  const [firstReminder, setFirstReminder] = useState('2')
  const [secondReminder, setSecondReminder] = useState('5')
  const [sendLimit, setSendLimit] = useState('3')
  const [prepMin, setPrepMin] = useState('0 mins')
  const [prepMax, setPrepMax] = useState('5 mins')
  const [answerMin, setAnswerMin] = useState('0.5 mins')
  const [answerMax, setAnswerMax] = useState('10 mins')
  const [allowResend, setAllowResend] = useState(true)
  const [assessIncomplete, setAssessIncomplete] = useState(true)
  const [autoSubmit, setAutoSubmit] = useState(true)

  return (
    <OneWaySettingsShell
      title="Default Settings"
      description="Rules that apply to every one-way interview set: languages, reminders, invite limits and question time limits."
    >
      <OneWayCard title="Languages">
        <div className="flex items-center justify-between gap-4">
          <FieldLabel
            label="Multi-Language Interviews"
            hint="Let candidates take the interview in more than one language."
          />
          <Switch
            checked={multiLanguage}
            onCheckedChange={setMultiLanguage}
            aria-label="Multi-Language Interviews"
          />
        </div>
      </OneWayCard>

      <OneWayCard title="Expiry Reminders and Invite Limits">
        <div className="flex flex-col gap-4">
          <ReminderField
            label="First Expiry Reminder"
            hint="Send the first reminder before the invite expires."
            helper="Set to OFF to skip it"
            value={firstReminder}
            options={DAY_OPTIONS}
            onChange={setFirstReminder}
          />
          <ReminderField
            label="Second Expiry Reminder"
            hint="Send a later reminder. It must be further from expiry than the first."
            helper="Must be more days than the first"
            value={secondReminder}
            options={DAY_OPTIONS.filter((option) => option.value !== 'off')}
            onChange={setSecondReminder}
          />
          <ReminderField
            label="Invite Send Limit"
            hint="Maximum times an invite can be sent, including resends."
            helper="Includes resends"
            value={sendLimit}
            options={SEND_OPTIONS}
            onChange={setSendLimit}
          />
        </div>
      </OneWayCard>

      <OneWayCard
        title="Question Time Limits"
        description="Recruiters can only set times inside these ranges when they build a question template."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TimeRange
            label="Preparation Time"
            hint="How long a candidate can prepare before answering."
            min={prepMin}
            max={prepMax}
            minOptions={PREP_MIN_OPTIONS}
            maxOptions={PREP_MAX_OPTIONS}
            onMinChange={setPrepMin}
            onMaxChange={setPrepMax}
          />
          <TimeRange
            label="Answer Time"
            hint="How long a candidate can spend answering a question."
            min={answerMin}
            max={answerMax}
            minOptions={ANSWER_MIN_OPTIONS}
            maxOptions={ANSWER_MAX_OPTIONS}
            onMinChange={setAnswerMin}
            onMaxChange={setAnswerMax}
          />
        </div>
      </OneWayCard>

      <OneWayCard title="Submission and Assessment">
        <div className="flex flex-col gap-3">
          <ToggleRow
            label="Allow Resend After Submission"
            hint="Let a candidate send the interview again after they submit."
            checked={allowResend}
            onChange={setAllowResend}
          />
          <ToggleRow
            label="Assess Incomplete Interviews"
            hint="Score interviews that were not fully completed."
            checked={assessIncomplete}
            onChange={setAssessIncomplete}
          />
          <ToggleRow
            label="Auto-Submit When Answer Time Ends"
            hint="Submit the answer automatically when the timer runs out."
            checked={autoSubmit}
            onChange={setAutoSubmit}
          />
        </div>
      </OneWayCard>

      <OneWayCard title="Candidate Emails">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FieldLabel
            label="Invite and Reminder Emails"
            hint="Messages sent when a candidate is invited or reminded."
          />
          <button
            type="button"
            onClick={() => navigate('/settings/templates')}
            className="h-8 rounded-md border border-[#D5D2E2] bg-white px-3 text-xs font-semibold text-[#2D2061] hover:bg-[#F7F6FB]"
          >
            Edit Email Templates
          </button>
        </div>
      </OneWayCard>
    </OneWaySettingsShell>
  )
}

function ReminderField({
  label,
  hint,
  helper,
  value,
  options,
  onChange,
}: {
  label: string
  hint: string
  helper: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <FieldLabel label={label} hint={hint} />
      <p className="text-[11px] leading-relaxed text-[#8B8B9E]">{helper}</p>
      <Select
        aria-label={label}
        options={options}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="!h-9 text-[13px]"
      />
    </div>
  )
}

function TimeRange({
  label,
  hint,
  min,
  max,
  minOptions,
  maxOptions,
  onMinChange,
  onMaxChange,
}: {
  label: string
  hint: string
  min: string
  max: string
  minOptions: string[]
  maxOptions: string[]
  onMinChange: (value: string) => void
  onMaxChange: (value: string) => void
}) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <BoundSelect label="Min" value={min} options={minOptions} onChange={onMinChange} />
        <BoundSelect label="Max" value={max} options={maxOptions} onChange={onMaxChange} />
      </div>
    </div>
  )
}

function BoundSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-[#8B8B9E]">
      {label}
      <Select
        aria-label={`${label} time`}
        options={options}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="!h-9 w-[7.5rem] text-[13px]"
      />
    </label>
  )
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <FieldLabel label={label} hint={hint} />
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  )
}
