import { useState } from 'react'
import { Bell, Check, Mail } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button, toast } from '../ui'
import { SettingsPanel } from './SettingsPanel'

type NotificationTag = 'candidate' | 'jobs'
type FrequencyId = 'instant' | 'weekly'

type NotificationChannel = {
  appBell: boolean
  smtpEmail: boolean
}

type NotificationTrigger = {
  id: string
  title: string
  description: string
  tags: NotificationTag[]
  frequency: FrequencyId
  channels: NotificationChannel
}

type NotificationGroup = {
  id: string
  title: string
  triggers: NotificationTrigger[]
}

const TAG_META: Record<
  NotificationTag,
  { label: string; className: string }
> = {
  candidate: {
    label: 'Candidate',
    className: 'bg-[#EDE8F8] text-[#5B4B9E]',
  },
  jobs: {
    label: 'Jobs',
    className: 'bg-[#FFF0E0] text-[#D97706]',
  },
}

const FREQUENCY_META: Record<FrequencyId, string> = {
  instant: 'Instant (Live)',
  weekly: 'Weekly Roundup',
}

const INITIAL_GROUPS: NotificationGroup[] = [
  {
    id: 'recruitment-hub',
    title: 'Recruitment Hub',
    triggers: [
      {
        id: 'new-candidate-applied',
        title: 'New Candidate Applied',
        description:
          'Alert when a candidate submits an application to an open requisition.',
        tags: ['candidate'],
        frequency: 'instant',
        channels: { appBell: true, smtpEmail: true },
      },
      {
        id: 'ai-requisition-calibration',
        title: 'AI Requisition Calibration',
        description:
          'Notify when job scoring weights or analyzer criteria are recalibrated.',
        tags: ['jobs'],
        frequency: 'instant',
        channels: { appBell: false, smtpEmail: true },
      },
      {
        id: 'pipeline-status-progression',
        title: 'Pipeline Status Progression',
        description:
          'Track stage changes such as interview ready and client endorsement.',
        tags: ['candidate'],
        frequency: 'instant',
        channels: { appBell: true, smtpEmail: false },
      },
      {
        id: 'high-integrity-match',
        title: 'High Integrity Match Identified',
        description:
          'Surface high suitability matches across candidate and job mapping.',
        tags: ['candidate', 'jobs'],
        frequency: 'instant',
        channels: { appBell: true, smtpEmail: true },
      },
    ],
  },
  {
    id: 'talent-engagement',
    title: 'Talent Engagement',
    triggers: [
      {
        id: 'session-slot-bookings',
        title: 'Session & Slot Bookings Sync',
        description:
          'Summarize interview slots booked or updated over the week.',
        tags: ['candidate'],
        frequency: 'weekly',
        channels: { appBell: false, smtpEmail: true },
      },
      {
        id: 'one-way-audio-loop',
        title: 'One-Way Audio Loop Submission Receipt',
        description:
          'Confirm when a candidate completes a one-way interview submission.',
        tags: ['candidate'],
        frequency: 'instant',
        channels: { appBell: true, smtpEmail: true },
      },
      {
        id: 'cognitive-test-complete',
        title: 'Cognitive Test Complete Receipt',
        description:
          'Notify after a candidate finishes assigned assessment exercises.',
        tags: ['candidate'],
        frequency: 'instant',
        channels: { appBell: false, smtpEmail: true },
      },
      {
        id: 'interviewer-scribing',
        title: 'Interviewer Scribing Actions',
        description:
          'Weekly digest of interviewer notes and scribing events on jobs.',
        tags: ['jobs'],
        frequency: 'weekly',
        channels: { appBell: false, smtpEmail: false },
      },
    ],
  },
]

/**
 * Notification Config — operational recruitment triggers with channel toggles.
 */
export function NotificationConfigPanel() {
  const [groups, setGroups] = useState(INITIAL_GROUPS)

  function updateChannel(
    groupId: string,
    triggerId: string,
    channel: keyof NotificationChannel,
    checked: boolean,
  ) {
    setGroups((current) =>
      current.map((group) => {
        if (group.id !== groupId) return group
        return {
          ...group,
          triggers: group.triggers.map((trigger) => {
            if (trigger.id !== triggerId) return trigger
            return {
              ...trigger,
              channels: { ...trigger.channels, [channel]: checked },
            }
          }),
        }
      }),
    )
  }

  function handleSave() {
    toast.success('Notification preferences saved successfully.', {
      title: 'Success',
      description: 'Your App Bell and SMTP Email settings have been updated.',
    })
  }

  return (
    <SettingsPanel
      title="Notification Config"
      description="Operational Recruitment Trigger"
    >
      <div className="overflow-hidden rounded-xl border border-[#E4E1EE] bg-white">
        {/* Column headers */}
        <div className="hidden border-b border-[#ECEAF3] bg-white px-4 py-3 sm:grid sm:grid-cols-[minmax(0,1fr)_10rem_7.5rem] sm:items-end sm:gap-4 lg:grid-cols-[minmax(0,1fr)_11rem_8.5rem] lg:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
            Operational Recruitment Trigger
          </p>
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
            Preconfigured Frequency
          </p>
          <div className="grid grid-cols-2 gap-2">
            <ChannelHeader
              icon={<AppBellIcon />}
              label="App Bell"
            />
            <ChannelHeader
              icon={<SmtpEmailIcon />}
              label="SMTP Email"
            />
          </div>
        </div>

        {groups.map((group) => (
          <div key={group.id}>
            <div className="bg-[#F2F1F6] px-4 py-2.5 lg:px-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2D2061]">
                {group.title}
              </p>
            </div>

            <ul>
              {group.triggers.map((trigger, index) => (
                <li
                  key={trigger.id}
                  className={cn(
                    'border-b border-[#ECEAF3] px-4 py-4 last:border-b-0 lg:px-5',
                    index % 2 === 1 && 'bg-[#FAFAFC]',
                  )}
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_7.5rem] sm:items-center sm:gap-4 lg:grid-cols-[minmax(0,1fr)_11rem_8.5rem]">
                    {/* Trigger copy + tags */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#1A1A2E]">
                          {trigger.title}
                        </p>
                        {trigger.tags.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              'inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                              TAG_META[tag].className,
                            )}
                          >
                            {TAG_META[tag].label}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#8B8B9E]">
                        {trigger.description}
                      </p>
                    </div>

                    {/* Frequency */}
                    <div className="flex sm:justify-center">
                      <span className="inline-flex rounded-full bg-[#ECEAF3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#5C5878]">
                        {FREQUENCY_META[trigger.frequency]}
                      </span>
                    </div>

                    {/* Channel checkboxes */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-center gap-2 sm:justify-center">
                        <span className="text-xs text-[#6B6B80] sm:hidden">
                          App Bell
                        </span>
                        <ChannelCheckbox
                          checked={trigger.channels.appBell}
                          aria-label={`${trigger.title} — App Bell`}
                          onChange={(checked) =>
                            updateChannel(
                              group.id,
                              trigger.id,
                              'appBell',
                              checked,
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 sm:justify-center">
                        <span className="text-xs text-[#6B6B80] sm:hidden">
                          SMTP Email
                        </span>
                        <ChannelCheckbox
                          checked={trigger.channels.smtpEmail}
                          aria-label={`${trigger.title} — SMTP Email`}
                          onChange={(checked) =>
                            updateChannel(
                              group.id,
                              trigger.id,
                              'smtpEmail',
                              checked,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex justify-end border-t border-[#ECEAF3] px-4 py-4 lg:px-5">
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </SettingsPanel>
  )
}

function ChannelHeader({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="inline-flex size-7 items-center justify-center rounded-md bg-[#F2F1F6] text-[#2D2061]">
        {icon}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8B8B9E]">
        {label}
      </span>
    </div>
  )
}

function ChannelCheckbox({
  checked,
  onChange,
  'aria-label': ariaLabel,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  'aria-label': string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex size-5 items-center justify-center rounded border transition-colors',
        checked
          ? 'border-[#2D2061] bg-[#2D2061] text-white'
          : 'border-[#C8C5D6] bg-white text-transparent hover:border-[#2D2061]/50',
      )}
    >
      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
    </button>
  )
}

function AppBellIcon() {
  return (
    <span className="relative inline-flex">
      <Bell className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      <span className="absolute -right-1 -top-0.5 inline-flex size-2.5 items-center justify-center rounded-full bg-[#15803D]">
        <Check className="size-1.5 text-white" strokeWidth={4} aria-hidden="true" />
      </span>
    </span>
  )
}

function SmtpEmailIcon() {
  return <Mail className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
}
