import { useState } from 'react'
import { cn } from '../../lib/cn'
import {
  Button,
  Checkbox,
  Input,
  PhoneInput,
  Select,
  Switch,
} from '../ui'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'

const DAYS = [
  { id: 'mon', label: 'Mon', full: 'Monday' },
  { id: 'tue', label: 'Tue', full: 'Tuesday' },
  { id: 'wed', label: 'Wed', full: 'Wednesday' },
  { id: 'thu', label: 'Thu', full: 'Thursday' },
  { id: 'fri', label: 'Fri', full: 'Friday' },
  { id: 'sat', label: 'Sat', full: 'Saturday' },
  { id: 'sun', label: 'Sun', full: 'Sunday' },
] as const

const TIME_OPTIONS = [
  '06:00 Hours',
  '07:00 Hours',
  '08:00 Hours',
  '09:00 Hours',
  '10:00 Hours',
  '11:00 Hours',
  '12:00 Hours',
  '13:00 Hours',
  '14:00 Hours',
  '15:00 Hours',
  '16:00 Hours',
  '17:00 Hours',
  '18:00 Hours',
  '19:00 Hours',
  '20:00 Hours',
]

const UTC_TIME_OPTIONS = [
  '06:00 UTC',
  '07:00 UTC',
  '08:00 UTC',
  '09:00 UTC',
  '10:00 UTC',
  '11:00 UTC',
  '12:00 UTC',
  '13:00 UTC',
  '14:00 UTC',
  '15:00 UTC',
  '16:00 UTC',
  '17:00 UTC',
  '18:00 UTC',
]

const TIMEZONE_OPTIONS = [
  '(GMT+05:30) Asia/Kolkata',
  '(GMT+00:00) UTC',
  '(GMT-05:00) America/New_York',
  '(GMT+01:00) Europe/London',
  '(GMT+08:00) Asia/Singapore',
]

const CANDIDATE_LIMIT_OPTIONS = [
  '5 Candidates',
  '10 Candidates',
  '15 Candidates',
  '20 Candidates',
  '25 Candidates',
]

/**
 * Recruiter Profile settings — credentials, daily digest, working hours, password.
 */
export function RecruiterProfilePanel() {
  const [profile, setProfile] = useState({
    fullName: 'Sarah Johnson',
    businessEmail: 'sarah.johnson@recruitmentsmart.com',
    companyName: 'Recruitment SMART',
    domain: 'recruitmentsmart.com',
    phone: '9876543210',
    countryCode: '+91',
  })

  const [digest, setDigest] = useState({
    enabled: true,
    frequency: 'Daily',
    type: 'Twice a Day',
    time1: '09:00 UTC',
    time2: '17:00 UTC',
    days: ['mon', 'tue', 'wed', 'thu'] as string[],
    candidateLimit: '10 Candidates',
    suitability: 65,
    leadRecruiter: true,
    supportRecruiter: true,
  })

  const [hours, setHours] = useState({
    days: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: false,
      sun: false,
    } as Record<string, boolean>,
    startTime: '09:00 Hours',
    endTime: '17:00 Hours',
    timezone: '(GMT+05:30) Asia/Kolkata',
  })

  const [password, setPassword] = useState({
    next: '',
    confirm: '',
  })

  function toggleDigestDay(dayId: string) {
    setDigest((current) => {
      const has = current.days.includes(dayId)
      return {
        ...current,
        days: has
          ? current.days.filter((d) => d !== dayId)
          : [...current.days, dayId],
      }
    })
  }

  function handleSaveProfile() {
    console.info('save recruiter profile', profile)
  }

  function handleSaveDigest() {
    console.info('save digest config', digest)
  }

  function handleSaveHours() {
    console.info('save working hours', hours)
  }

  function handleUpdatePassword() {
    console.info('update password')
  }

  return (
    <SettingsPanel
      title="Recruiter Profile"
      description="Manage your user registration credentials and customize active recruiter daily digest parameters."
    >
      {/* 1. Credentials */}
      <SettingsBlock
        title="Recruiter Credentials (from signup)"
        footer={
          <Button
            type="button"
            onClick={handleSaveProfile}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Save Profile
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input
            label="Full Name"
            requiredMark
            value={profile.fullName}
            onChange={(e) =>
              setProfile((p) => ({ ...p, fullName: e.target.value }))
            }
          />
          <Input
            label="Business Email"
            requiredMark
            type="email"
            value={profile.businessEmail}
            onChange={(e) =>
              setProfile((p) => ({ ...p, businessEmail: e.target.value }))
            }
          />
          <Input
            label="Company Name"
            requiredMark
            value={profile.companyName}
            onChange={(e) =>
              setProfile((p) => ({ ...p, companyName: e.target.value }))
            }
          />
          <Input
            label="Domain"
            requiredMark
            value={profile.domain}
            onChange={(e) =>
              setProfile((p) => ({ ...p, domain: e.target.value }))
            }
          />
          <PhoneInput
            label="Phone Number"
            requiredMark
            value={profile.phone}
            countryCode={profile.countryCode}
            onValueChange={(phone) => setProfile((p) => ({ ...p, phone }))}
            onCountryCodeChange={(countryCode) =>
              setProfile((p) => ({ ...p, countryCode }))
            }
          />
        </div>
      </SettingsBlock>

      {/* 2. Daily Digest */}
      <SettingsBlock
        title="Recruiter's Daily Digest Configuration"
        trailing={
          <div className="inline-flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[#333340]">
              Current Status
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2DAB8F] bg-[#E9F7F5] px-2.5 py-1">
              <span
                className="size-1.5 shrink-0 rounded-full bg-[#2DAB8F]"
                aria-hidden="true"
              />
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#2DAB8F]">
                Subscribed (Daily)
              </span>
            </span>
          </div>
        }
        footer={
          <Button
            type="button"
            onClick={handleSaveDigest}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Save Configurations
          </Button>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="max-w-md rounded-lg border border-[#E5E7EB] bg-white px-4 py-3">
            <Switch
              label="Enable Digest Email"
              checked={digest.enabled}
              onCheckedChange={(enabled) =>
                setDigest((d) => ({ ...d, enabled }))
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Email Frequency"
              options={['Daily', 'Weekly', 'Monthly']}
              value={digest.frequency}
              onChange={(e) =>
                setDigest((d) => ({ ...d, frequency: e.target.value }))
              }
            />
            <Select
              label="Type"
              options={['Once a Day', 'Twice a Day', 'Custom']}
              value={digest.type}
              onChange={(e) =>
                setDigest((d) => ({ ...d, type: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Time 1"
              options={UTC_TIME_OPTIONS}
              value={digest.time1}
              onChange={(e) =>
                setDigest((d) => ({ ...d, time1: e.target.value }))
              }
            />
            <Select
              label="Time 2"
              options={UTC_TIME_OPTIONS}
              value={digest.time2}
              onChange={(e) =>
                setDigest((d) => ({ ...d, time2: e.target.value }))
              }
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-[#2D2061]">
              Select Days
            </p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const active = digest.days.includes(day.id)
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDigestDay(day.id)}
                    aria-pressed={active}
                    className={cn(
                      'inline-flex min-w-[3.25rem] items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                      active
                        ? 'border-[#2D2061] bg-[#2D2061] text-white'
                        : 'border-[#E0DDEA] bg-white text-[#6B6B80] hover:border-[#2D2061]/40 hover:text-[#2D2061]',
                    )}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="max-w-xs">
            <Select
              label="Candidate Limit"
              options={CANDIDATE_LIMIT_OPTIONS}
              value={digest.candidateLimit}
              onChange={(e) =>
                setDigest((d) => ({ ...d, candidateLimit: e.target.value }))
              }
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-[#2D2061]">
              Suitability (Range)
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="min-w-0 flex-1">
                <input
                  type="range"
                  min={10}
                  max={95}
                  step={1}
                  value={digest.suitability}
                  onChange={(e) =>
                    setDigest((d) => ({
                      ...d,
                      suitability: Number(e.target.value),
                    }))
                  }
                  aria-label="Suitability threshold"
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E4E1EE] accent-[#2D2061]"
                />
                <div className="mt-1.5 flex justify-between text-[11px] text-[#8B8B9E]">
                  <span>10% Minimum suitability</span>
                  <span>95% Max matching threshold</span>
                </div>
              </div>
              <span className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-semibold tabular-nums text-[#2D2061]">
                {digest.suitability}%
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-[#2D2061]">
              Recruiter Assigned Role
            </p>
            <div className="flex flex-wrap gap-5">
              <Checkbox
                label="Lead Recruiter"
                checked={digest.leadRecruiter}
                onChange={(e) =>
                  setDigest((d) => ({
                    ...d,
                    leadRecruiter: e.target.checked,
                  }))
                }
              />
              <Checkbox
                label="Support Recruiter"
                checked={digest.supportRecruiter}
                onChange={(e) =>
                  setDigest((d) => ({
                    ...d,
                    supportRecruiter: e.target.checked,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </SettingsBlock>

      {/* 3. Working Hours */}
      <SettingsBlock
        title="Working Hours Configuration"
        footer={
          <Button
            type="button"
            onClick={handleSaveHours}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Save Working Hours
          </Button>
        }
      >
        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-xs font-medium text-[#2D2061]">
              Working Days
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {DAYS.map((day) => (
                <Checkbox
                  key={day.id}
                  label={day.full}
                  checked={hours.days[day.id]}
                  onChange={(e) =>
                    setHours((h) => ({
                      ...h,
                      days: { ...h.days, [day.id]: e.target.checked },
                    }))
                  }
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Start Time"
              options={TIME_OPTIONS}
              value={hours.startTime}
              onChange={(e) =>
                setHours((h) => ({ ...h, startTime: e.target.value }))
              }
            />
            <Select
              label="End Time"
              options={TIME_OPTIONS}
              value={hours.endTime}
              onChange={(e) =>
                setHours((h) => ({ ...h, endTime: e.target.value }))
              }
            />
            <Select
              label="Timezone"
              options={TIMEZONE_OPTIONS}
              value={hours.timezone}
              onChange={(e) =>
                setHours((h) => ({ ...h, timezone: e.target.value }))
              }
            />
          </div>

          <p className="text-xs text-[#8B8B9E]">
            * These working hours will only apply to new interview invitations.
          </p>
        </div>
      </SettingsBlock>

      {/* 4. Password */}
      <SettingsBlock
        title="Password & Credentials Security"
        footer={
          <div className="flex w-full flex-col items-end gap-3">
            <Button
              type="button"
              onClick={handleUpdatePassword}
              className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Update Password Code
            </Button>
            <p className="w-full text-left text-xs font-medium text-[#D97706]">
              Security Precaution: Passwords are fully hashed state parameters.
              Do not disclose credential sequences with sandbox environments.
            </p>
          </div>
        }
      >
        <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="New Password"
            requiredMark
            type="password"
            autoComplete="new-password"
            value={password.next}
            onChange={(e) =>
              setPassword((p) => ({ ...p, next: e.target.value }))
            }
            placeholder="••••••••"
          />
          <Input
            label="Confirm New Password"
            requiredMark
            type="password"
            autoComplete="new-password"
            value={password.confirm}
            onChange={(e) =>
              setPassword((p) => ({ ...p, confirm: e.target.value }))
            }
            placeholder="••••••••"
          />
        </div>
      </SettingsBlock>
    </SettingsPanel>
  )
}
