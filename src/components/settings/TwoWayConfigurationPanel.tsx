import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button, Checkbox, Input, Select, Switch, toast } from '../ui'
import { cn } from '../../lib/cn'
import { SettingsPanel } from './SettingsPanel'

type CompanyType = 'standalone' | 'ats'
type MeetingPlatform = 'teams' | 'google'
type SlotBooker = 'candidate' | 'recruiter' | 'hiringManager'

const BOOKING_LINK_OPTIONS = [
  { value: '1', label: '1 day' },
  { value: '3', label: '3 days' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
]

const RESCHEDULE_CUTOFF_OPTIONS = [
  { value: '15', label: '15 minutes before the start' },
  { value: '30', label: '30 minutes before the start' },
  { value: '60', label: '1 hour before the start' },
  { value: '120', label: '2 hours before the start' },
  { value: '1440', label: '1 day before the start' },
]

/**
 * Settings → Module Configuration → 2 Way Interview → Configuration.
 */
export function TwoWayConfigurationPanel() {
  const [schedulerOn, setSchedulerOn] = useState(true)
  const [companyType, setCompanyType] = useState<CompanyType>('standalone')
  const [meetingPlatform, setMeetingPlatform] = useState<MeetingPlatform>('teams')
  const [tenantId, setTenantId] = useState('')
  const [slotBooker, setSlotBooker] = useState<SlotBooker>('candidate')
  const [bookingLinkDays, setBookingLinkDays] = useState('7')
  const [rescheduleCutoff, setRescheduleCutoff] = useState('30')
  const [candidateMayReschedule, setCandidateMayReschedule] = useState(true)

  function handleSave() {
    toast.success('Configuration saved.', { title: '2 Way Interview' })
  }

  return (
    <SettingsPanel
      eyebrow="2 WAY INTERVIEW"
      title="Configuration"
      description="Hide candidate details inside jobs. Only Super Users can change these settings."
    >
      <SectionCard
        title="Interview Scheduler"
        description="Booking links can only be sent while the scheduler is ON and at least one round is active."
        trailing={
          <Switch
            checked={schedulerOn}
            onCheckedChange={setSchedulerOn}
            aria-label="Interview Scheduler"
          />
        }
      />

      <div
        className={cn(
          'flex flex-col gap-4',
          !schedulerOn && 'pointer-events-none opacity-50',
        )}
        aria-disabled={!schedulerOn}
      >
        <SectionCard title="Company Type">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <OptionCard
              title="Standalone"
              description="Interviews and statuses live in this platform."
              selected={companyType === 'standalone'}
              disabled={!schedulerOn}
              onSelect={() => setCompanyType('standalone')}
            />
            <OptionCard
              title="ATS Integrated"
              description="Not available yet — Post Backs to an ATS come with the ATS connectors."
              selected={companyType === 'ats'}
              disabled
              onSelect={() => setCompanyType('ats')}
            />
          </div>
        </SectionCard>

        <SectionCard title="Meeting Platform">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <OptionCard
              title="Microsoft Teams"
              description="Teams meetings in your tenant. Needed for the AI co-pilot (Two-Way)."
              selected={meetingPlatform === 'teams'}
              disabled={!schedulerOn}
              onSelect={() => setMeetingPlatform('teams')}
            />
            <OptionCard
              title="Google Workspace"
              description="Google Meet links. Booking only — no AI co-pilot."
              selected={meetingPlatform === 'google'}
              disabled={!schedulerOn}
              onSelect={() => setMeetingPlatform('google')}
            />
          </div>
          {meetingPlatform === 'teams' ? (
            <div className="mt-4 max-w-xl">
              <Input
                id="ms-tenant-id"
                label="Microsoft 365 Tenant ID"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                placeholder="e.g. 72f988bf-86f1-41af-91ab-2d7cd011cb47"
                disabled={!schedulerOn}
              />
              <p className="mt-1.5 text-xs leading-relaxed text-[#8B8B9E]">
                Your IT admin finds it in Microsoft Entra → Overview. Meetings and calendar invites
                are created in this tenant.
              </p>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="Who Books the Slot">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <OptionCard
              title="Candidate"
              description="The candidate picks a slot from the booking link."
              selected={slotBooker === 'candidate'}
              disabled={!schedulerOn}
              onSelect={() => setSlotBooker('candidate')}
            />
            <OptionCard
              title="Recruiter"
              description="The recruiter picks the slot; the candidate gets the confirmation."
              selected={slotBooker === 'recruiter'}
              disabled={!schedulerOn}
              onSelect={() => setSlotBooker('recruiter')}
            />
            <OptionCard
              title="Hiring Manager"
              description="The job's hiring manager picks the slot."
              selected={slotBooker === 'hiringManager'}
              disabled={!schedulerOn}
              onSelect={() => setSlotBooker('hiringManager')}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              id="booking-link-days"
              label="Booking link works for"
              value={bookingLinkDays}
              onChange={(e) => setBookingLinkDays(e.target.value)}
              options={BOOKING_LINK_OPTIONS}
              placeholder=""
              disabled={!schedulerOn}
            />
            <Select
              id="reschedule-cutoff"
              label="Reschedule cut-off"
              value={rescheduleCutoff}
              onChange={(e) => setRescheduleCutoff(e.target.value)}
              options={RESCHEDULE_CUTOFF_OPTIONS}
              placeholder=""
              disabled={!schedulerOn}
              helperText="Nobody can reschedule inside the cut-off or after the interview has started."
            />
          </div>

          <div className="mt-4">
            <Checkbox
              id="candidate-may-reschedule"
              checked={candidateMayReschedule}
              onChange={(e) => setCandidateMayReschedule(e.target.checked)}
              disabled={!schedulerOn}
              label="Candidates may reschedule themselves from the confirmation email (until the cut-off)."
            />
          </div>

          <div className="mt-5">
            <Button
              type="button"
              onClick={handleSave}
              disabled={!schedulerOn}
              className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52] disabled:opacity-50"
            >
              Save
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Working Hours">
          <p className="text-sm leading-relaxed text-[#6B6B80]">
            Slots are offered inside every panel member&apos;s working hours. Each person sets
            theirs in{' '}
            <Link
              to="/settings/recruiter-profile"
              className="font-medium text-[#2D2061] underline-offset-2 hover:underline"
              tabIndex={schedulerOn ? undefined : -1}
            >
              Recruiter Profile → Working hours
            </Link>
            ; people without them count as Mon–Fri 10:00–17:00.
          </p>
        </SectionCard>
      </div>
    </SettingsPanel>
  )
}

/** Gray section card — title `#2D2061`, surface `#F8F9FB` (design). */
function SectionCard({
  title,
  description,
  trailing,
  children,
}: {
  title: string
  description?: string
  trailing?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="rounded-[8px] bg-[#F8F9FB] px-5 py-4 sm:px-6 sm:py-5">
      <div
        className={cn(
          'flex flex-wrap items-start justify-between gap-3',
          children ? 'mb-3.5' : null,
        )}
      >
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
          {description ? (
            <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-[#8B8B9E]">
              {description}
            </p>
          ) : null}
        </div>
        {trailing}
      </div>
      {children}
    </div>
  )
}

function OptionCard({
  title,
  description,
  selected,
  disabled,
  onSelect,
}: {
  title: string
  description: string
  selected: boolean
  disabled?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'rounded-[8px] border px-4 py-3.5 text-left transition-colors',
        selected
          ? 'border-[#2D2061] bg-[#F5F3FB]'
          : 'border-[#E4E1EE] bg-white hover:border-[#2D2061]/40',
        disabled && 'cursor-not-allowed bg-[#F8F9FB] opacity-60 hover:border-[#E4E1EE]',
      )}
    >
      <p
        className={cn(
          'text-sm font-bold',
          disabled ? 'text-[#8B8B9E]' : 'text-[#2D2061]',
        )}
      >
        {title}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-[#8B8B9E]">{description}</p>
    </button>
  )
}
