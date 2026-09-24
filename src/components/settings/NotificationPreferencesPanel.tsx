import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { Switch, toast } from '../ui'
import { SettingsPanel } from './SettingsPanel'
import { SettingsPreferenceCard } from './SettingsPreferenceCard'

const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Never']

/**
 * Candidate Settings — notification preferences.
 */
export function NotificationPreferencesPanel() {
  const [applicationStatus, setApplicationStatus] = useState(false)
  const [messages, setMessages] = useState(true)
  const [jobMatchesFrequency, setJobMatchesFrequency] = useState('')
  const [generalUpdatesFrequency, setGeneralUpdatesFrequency] = useState('')

  function handleFrequencyChange(
    label: string,
    value: string,
    setter: (next: string) => void,
  ) {
    setter(value)
    if (value) {
      toast.success(`${label} set to ${value}.`, {
        title: 'Notification Preferences',
      })
    }
  }

  return (
    <SettingsPanel title="Notification Preferences">
      <SettingsPreferenceCard
        title="Application Status Changes"
        description="Get notified when application status change."
        action={
          <Switch
            checked={applicationStatus}
            onCheckedChange={setApplicationStatus}
          />
        }
      />

      <SettingsPreferenceCard
        title="Messages"
        description="Direct messages from recruiters and hiring managers"
        action={
          <Switch
            checked={messages}
            onCheckedChange={setMessages}
          />
        }
      />

      <SettingsPreferenceCard
        title="New Job Matches"
        description="Daily or weekly digest of jobs matching your preferences"
        action={
          <FrequencySelect
            value={jobMatchesFrequency}
            onChange={(value) =>
              handleFrequencyChange('New Job Matches', value, setJobMatchesFrequency)
            }
          />
        }
      />

      <SettingsPreferenceCard
        title="General Updates"
        description="New features, tips for job searching, and platform announcements"
        action={
          <FrequencySelect
            value={generalUpdatesFrequency}
            onChange={(value) =>
              handleFrequencyChange(
                'General Updates',
                value,
                setGeneralUpdatesFrequency,
              )
            }
          />
        }
      />
    </SettingsPanel>
  )
}

function FrequencySelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative min-w-[10.5rem]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Select frequency"
        className={cn(
          'h-9 w-full appearance-none rounded-md border border-[#E0DDEA] bg-white pl-3 pr-8 text-sm text-[#2D2061]',
          'transition-colors focus:border-[#2D2061] focus:outline-none focus:ring-2 focus:ring-[#2D2061]/10',
          !value && 'text-[#A0A0B2]',
        )}
      >
        <option value="">Select Frequency</option>
        {FREQUENCY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#8B8B9E]"
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  )
}
