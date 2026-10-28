import { useEffect, useId, useState, type ReactNode } from 'react'
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react'
import { cn } from '../../../lib/cn'
import {
  CAMPAIGN_MONTH_DAY_OPTIONS,
  CAMPAIGN_MONTH_ORDINAL_OPTIONS,
  CAMPAIGN_RECURRING_INTERVAL_OPTIONS,
  CAMPAIGN_RECURRING_UNIT_OPTIONS,
  CAMPAIGN_TIME_OPTIONS,
  CAMPAIGN_TIMEZONE_OPTIONS,
  CAMPAIGN_WEEKDAY_OPTIONS,
  CAMPAIGN_YEAR_MONTH_OPTIONS,
  formatCampaignRecurringSummary,
  fromCampaignDateInputValue,
  toCampaignDateInputValue,
  type CampaignChannel,
  type CampaignMonthOrdinal,
  type CampaignRecurringEnd,
  type CampaignRecurringUnit,
  type CampaignSendMode,
  type CampaignWeekday,
  type CreateCampaignFormState,
} from '../createCampaignData'

export type StepCampaignSettingsProps = {
  channel: CampaignChannel
  value: CreateCampaignFormState
  onChange: (patch: Partial<CreateCampaignFormState>) => void
}

const SEND_OPTIONS: Array<{
  mode: CampaignSendMode
  title: string
  description: string
}> = [
  {
    mode: 'now',
    title: 'Send Now',
    description: 'Campaign will be sent immediately as you continue',
  },
  {
    mode: 'schedule',
    title: 'Schedule',
    description: 'Pick a specific date and time for your campaign to go out',
  },
  {
    mode: 'recurring',
    title: 'Recurring',
    description:
      'Set up a repeating schedule — daily, weekly, monthly, or yearly',
  },
]

function channelLabel(channel: CampaignChannel): string {
  switch (channel) {
    case 'email':
      return 'Email'
    case 'sms':
      return 'SMS'
    case 'telephonic':
      return 'Telephonic'
    case '':
      return 'Email'
    default: {
      const exhaustive: never = channel
      return exhaustive
    }
  }
}

const fieldShell =
  'flex h-11 w-full items-center gap-2 rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] transition-colors focus-within:border-[#2D2061] focus-within:ring-2 focus-within:ring-[#2D2061]/10'
const nativeInputClass =
  'min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2]'
const cardShell =
  'w-full rounded-xl border border-[#E4E1EE] bg-white text-left transition-colors'

/**
 * Create Campaign — Settings: Send Now / Schedule / Recurring.
 */
export function StepCampaignSettings({
  channel,
  value,
  onChange,
}: StepCampaignSettingsProps) {
  const label = channelLabel(channel)
  const groupName = useId()
  const [peakDismissed, setPeakDismissed] = useState(false)

  return (
    <div className="flex w-full flex-col gap-4 pb-8">
      <header className="border-b border-[#ECEAF3] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-[#2D2061]">Settings</h2>
          <span className="inline-flex items-center rounded-full bg-[#EEF0F4] px-2.5 py-0.5 text-[11px] font-semibold text-[#5B6178]">
            {label}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-[#8B8B9E]">
          Build your outreach sequence.
        </p>
      </header>

      {!peakDismissed ? (
        <div className="flex items-center gap-3 rounded-xl bg-[#F3F0FF] px-4 py-3">
          <Sparkles
            className="size-4 shrink-0 text-[#6B5A9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <p className="min-w-0 flex-1 text-sm font-medium text-[#2D2061]">
            Email Peak: Tue-Thu 9-11 AM
          </p>
          <button
            type="button"
            onClick={() => setPeakDismissed(true)}
            className="shrink-0 text-sm font-semibold text-[#6B5A9E] transition-colors hover:text-[#2D2061]"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="flex w-full flex-col gap-3" role="radiogroup" aria-label="Send timing">
        {SEND_OPTIONS.map((option) => {
          const selected = value.sendMode === option.mode
          return (
            <div
              key={option.mode}
              className={cn(
                cardShell,
                selected ? 'border-[#C9C4D8] shadow-sm' : 'hover:border-[#D5D2E2]',
              )}
            >
              <label className="flex cursor-pointer items-start gap-3 px-4 py-3.5 sm:px-5">
                <input
                  type="radio"
                  name={groupName}
                  value={option.mode}
                  checked={selected}
                  onChange={() => onChange({ sendMode: option.mode })}
                  className="mt-0.5 size-4 shrink-0 accent-[#2D2061]"
                />
                <span className="min-w-0 text-sm leading-snug text-[#2D2061]">
                  <span className="font-semibold">{option.title}</span>
                  <span className="font-medium text-[#5B6178]">
                    {' '}
                    ({option.description})
                  </span>
                </span>
              </label>

              {selected && option.mode === 'schedule' ? (
                <div className="border-t border-[#ECEAF3] px-4 pb-4 pt-3 sm:px-5">
                  <ScheduleFields value={value} onChange={onChange} />
                </div>
              ) : null}

              {selected && option.mode === 'recurring' ? (
                <div className="border-t border-[#ECEAF3] px-4 pb-4 pt-3 sm:px-5">
                  <RecurringFields value={value} onChange={onChange} />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ScheduleFields({
  value,
  onChange,
}: {
  value: CreateCampaignFormState
  onChange: (patch: Partial<CreateCampaignFormState>) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <IconDateField
        ariaLabel="Date"
        value={value.scheduleDate}
        onChange={(scheduleDate) => onChange({ scheduleDate })}
      />
      <IconSelectField
        ariaLabel="Time"
        icon={<Clock className="size-4 text-[#8B8B9E]" strokeWidth={1.75} aria-hidden="true" />}
        value={value.scheduleTime}
        options={CAMPAIGN_TIME_OPTIONS}
        onChange={(scheduleTime) => onChange({ scheduleTime })}
      />
      <IconSelectField
        ariaLabel="Timezone"
        icon={<MapPin className="size-4 text-[#8B8B9E]" strokeWidth={1.75} aria-hidden="true" />}
        value={value.scheduleTimezone}
        options={CAMPAIGN_TIMEZONE_OPTIONS}
        onChange={(scheduleTimezone) => onChange({ scheduleTimezone })}
      />
    </div>
  )
}

const labelClass = 'text-xs font-medium text-[#8B8B9E]'
const compactSelectClass =
  'h-10 rounded-lg border border-[#D5D2E2] bg-white px-2.5 pr-8 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'

function RecurringFields({
  value,
  onChange,
}: {
  value: CreateCampaignFormState
  onChange: (patch: Partial<CreateCampaignFormState>) => void
}) {
  const end = value.recurringEnd
  const summary = formatCampaignRecurringSummary(value)

  function setEnd(next: CampaignRecurringEnd) {
    onChange({ recurringEnd: next })
  }

  function toggleWeekday(day: CampaignWeekday) {
    const selected = value.recurringWeekdays.includes(day)
    const next = selected
      ? value.recurringWeekdays.filter((item) => item !== day)
      : [...value.recurringWeekdays, day]
    onChange({
      recurringWeekdays: next.length > 0 ? next : [day],
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Repeat Every</span>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Repeat interval"
            value={String(value.recurringInterval)}
            onChange={(event) =>
              onChange({
                recurringInterval: Math.max(1, Number(event.target.value) || 1),
              })
            }
            className={cn(compactSelectClass, 'w-16')}
          >
            {CAMPAIGN_RECURRING_INTERVAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Repeat unit"
            value={value.recurringUnit}
            onChange={(event) =>
              onChange({
                recurringUnit: event.target.value as CampaignRecurringUnit,
              })
            }
            className={cn(compactSelectClass, 'min-w-[7.5rem]')}
          >
            {CAMPAIGN_RECURRING_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {value.recurringUnit === 'week' ? (
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>On these days</span>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Days of the week"
          >
            {CAMPAIGN_WEEKDAY_OPTIONS.map((day) => {
              const selected = value.recurringWeekdays.includes(day.value)
              return (
                <button
                  key={day.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleWeekday(day.value)}
                  className={cn(
                    'inline-flex h-9 min-w-[2.75rem] items-center justify-center rounded-lg border px-2 text-[12px] font-semibold transition-colors',
                    selected
                      ? 'border-[#2D2061] bg-[#2D2061] text-white'
                      : 'border-[#D5D2E2] bg-white text-[#2D2061] hover:border-[#C9C4D8]',
                  )}
                >
                  {day.short}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {value.recurringUnit === 'month' ? (
        <fieldset className="flex flex-col gap-2.5">
          <legend className={labelClass}>Repeat on</legend>
          <label className="inline-flex cursor-pointer flex-wrap items-center gap-2">
            <input
              type="radio"
              name="campaign-month-mode"
              checked={value.recurringMonthMode === 'day-of-month'}
              onChange={() =>
                onChange({ recurringMonthMode: 'day-of-month' })
              }
              className="size-4 accent-[#2D2061]"
            />
            <span className="text-sm font-medium text-[#2D2061]">On day</span>
            <select
              aria-label="Day of month"
              value={String(value.recurringMonthDay)}
              onChange={(event) => {
                onChange({
                  recurringMonthMode: 'day-of-month',
                  recurringMonthDay: Number(event.target.value),
                })
              }}
              onFocus={() =>
                onChange({ recurringMonthMode: 'day-of-month' })
              }
              className={cn(compactSelectClass, 'w-16')}
            >
              {CAMPAIGN_MONTH_DAY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-[#2D2061]">
              of the month
            </span>
          </label>
          <label className="inline-flex cursor-pointer flex-wrap items-center gap-2">
            <input
              type="radio"
              name="campaign-month-mode"
              checked={value.recurringMonthMode === 'nth-weekday'}
              onChange={() =>
                onChange({ recurringMonthMode: 'nth-weekday' })
              }
              className="size-4 accent-[#2D2061]"
            />
            <span className="text-sm font-medium text-[#2D2061]">On the</span>
            <select
              aria-label="Week of month"
              value={value.recurringMonthOrdinal}
              onChange={(event) =>
                onChange({
                  recurringMonthMode: 'nth-weekday',
                  recurringMonthOrdinal: event.target
                    .value as CampaignMonthOrdinal,
                })
              }
              onFocus={() => onChange({ recurringMonthMode: 'nth-weekday' })}
              className={cn(compactSelectClass, 'min-w-[6.5rem]')}
            >
              {CAMPAIGN_MONTH_ORDINAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Weekday"
              value={value.recurringMonthWeekday}
              onChange={(event) =>
                onChange({
                  recurringMonthMode: 'nth-weekday',
                  recurringMonthWeekday: event.target.value as CampaignWeekday,
                })
              }
              onFocus={() => onChange({ recurringMonthMode: 'nth-weekday' })}
              className={cn(compactSelectClass, 'min-w-[7rem]')}
            >
              {CAMPAIGN_WEEKDAY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      ) : null}

      {value.recurringUnit === 'year' ? (
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>Repeat on</span>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Month"
              value={String(value.recurringYearMonth)}
              onChange={(event) =>
                onChange({ recurringYearMonth: Number(event.target.value) })
              }
              className={cn(compactSelectClass, 'min-w-[8.5rem]')}
            >
              {CAMPAIGN_YEAR_MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Day of month"
              value={String(value.recurringYearDay)}
              onChange={(event) =>
                onChange({ recurringYearDay: Number(event.target.value) })
              }
              className={cn(compactSelectClass, 'w-16')}
            >
              {CAMPAIGN_MONTH_DAY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Send at</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <IconSelectField
            ariaLabel="Send time"
            icon={
              <Clock
                className="size-4 text-[#8B8B9E]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            }
            value={value.recurringTime}
            options={CAMPAIGN_TIME_OPTIONS}
            onChange={(recurringTime) => onChange({ recurringTime })}
          />
          <IconSelectField
            ariaLabel="Timezone"
            icon={
              <MapPin
                className="size-4 text-[#8B8B9E]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            }
            value={value.recurringTimezone}
            options={CAMPAIGN_TIMEZONE_OPTIONS}
            onChange={(recurringTimezone) => onChange({ recurringTimezone })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Starts</span>
        <IconDateField
          ariaLabel="Start date"
          value={value.recurringStartDate}
          onChange={(recurringStartDate) => onChange({ recurringStartDate })}
        />
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className={labelClass}>Ends</legend>

        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="campaign-recurring-end"
            checked={end.type === 'never'}
            onChange={() => setEnd({ type: 'never' })}
            className="size-4 accent-[#2D2061]"
          />
          <span className="text-sm font-medium text-[#2D2061]">Never</span>
        </label>

        <label className="inline-flex cursor-pointer flex-wrap items-center gap-2">
          <input
            type="radio"
            name="campaign-recurring-end"
            checked={end.type === 'after'}
            onChange={() =>
              setEnd({
                type: 'after',
                occurrences: end.type === 'after' ? end.occurrences : 3,
              })
            }
            className="size-4 accent-[#2D2061]"
          />
          <span className="text-sm font-medium text-[#2D2061]">After</span>
          <input
            type="number"
            min={1}
            max={999}
            disabled={end.type !== 'after'}
            value={end.type === 'after' ? end.occurrences : 3}
            onChange={(event) =>
              setEnd({
                type: 'after',
                occurrences: Math.max(1, Number(event.target.value) || 1),
              })
            }
            onFocus={() =>
              setEnd({
                type: 'after',
                occurrences: end.type === 'after' ? end.occurrences : 3,
              })
            }
            aria-label="Number of occurrences"
            className="h-9 w-14 rounded-md border border-[#D5D2E2] bg-white px-2 text-center text-sm text-[#2D2061] outline-none disabled:bg-[#F7F6FB] disabled:text-[#A0A0B2]"
          />
          <span className="text-sm font-medium text-[#2D2061]">Occurrences</span>
        </label>

        <label className="inline-flex cursor-pointer flex-wrap items-center gap-2">
          <input
            type="radio"
            name="campaign-recurring-end"
            checked={end.type === 'on-date'}
            onChange={() =>
              setEnd({
                type: 'on-date',
                date:
                  end.type === 'on-date'
                    ? end.date
                    : value.recurringStartDate || '2025-01-07',
              })
            }
            className="size-4 accent-[#2D2061]"
          />
          <span className="text-sm font-medium text-[#2D2061]">On Date</span>
          <div
            className={cn(
              'min-w-[10rem] max-w-[12rem]',
              end.type !== 'on-date' && 'pointer-events-none opacity-50',
            )}
          >
            <IconDateField
              ariaLabel="End date"
              value={
                end.type === 'on-date'
                  ? end.date
                  : value.recurringStartDate || '2025-01-07'
              }
              onChange={(date) => setEnd({ type: 'on-date', date })}
            />
          </div>
        </label>
      </fieldset>

      <div className="rounded-lg bg-[#F5F4F9] px-4 py-3 text-sm text-[#5B6178]">
        {summary}
      </div>
    </div>
  )
}

function IconDateField({
  value,
  onChange,
  ariaLabel,
}: {
  value: string
  onChange: (iso: string) => void
  ariaLabel: string
}) {
  const [draft, setDraft] = useState(() => toCampaignDateInputValue(value))

  useEffect(() => {
    setDraft(toCampaignDateInputValue(value))
  }, [value])

  return (
    <div className={fieldShell}>
      <Calendar
        className="size-4 shrink-0 text-[#8B8B9E]"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <input
        type="text"
        inputMode="numeric"
        placeholder="DD-MM-YYYY"
        aria-label={ariaLabel}
        value={draft}
        onChange={(event) => {
          const next = event.target.value
          setDraft(next)
          if (/^\d{2}-\d{2}-\d{4}$/.test(next.trim())) {
            onChange(fromCampaignDateInputValue(next.trim()))
          }
        }}
        onBlur={() => {
          const next = draft.trim()
          if (/^\d{2}-\d{2}-\d{4}$/.test(next)) {
            onChange(fromCampaignDateInputValue(next))
            return
          }
          setDraft(toCampaignDateInputValue(value))
        }}
        className={nativeInputClass}
      />
    </div>
  )
}

function IconSelectField({
  value,
  onChange,
  options,
  ariaLabel,
  icon,
}: {
  value: string
  onChange: (value: string) => void
  options: Array<string | { value: string; label: string }>
  ariaLabel: string
  icon: ReactNode
}) {
  const normalized = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  )
  return (
    <div className={fieldShell}>
      {icon}
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(nativeInputClass, 'cursor-pointer appearance-none pr-1')}
      >
        {normalized.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
