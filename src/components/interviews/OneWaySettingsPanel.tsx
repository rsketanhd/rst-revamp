import { useState, type ReactNode } from 'react'
import {
  ArrowDown,
  Bell,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Info,
  Monitor,
  Play,
  Plus,
  Settings2,
  Sparkles,
  Trash2,
  User,
  Volume2,
  X,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  Button,
  Checkbox,
  Select,
  SidePanel,
  Switch,
  Textarea,
  toast,
} from '../ui'

export type OneWaySettingsPanelProps = {
  open: boolean
  onClose: () => void
}

type SettingsTab = 'one-way' | 'audio' | 'email'

const TABS: Array<{ id: SettingsTab; label: string }> = [
  { id: 'one-way', label: '1 Way Config' },
  { id: 'audio', label: 'Audio Config' },
  { id: 'email', label: 'Email Config' },
]

/** Avatar library thumbnails (portrait mock headshots). */
const AVATARS = [
  {
    id: 'sarah',
    name: 'Sarah',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=300&fit=crop&crop=face',
  },
  {
    id: 'alex',
    name: 'Alex',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=300&fit=crop&crop=face',
  },
  {
    id: 'emma',
    name: 'Emma',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=300&fit=crop&crop=face',
  },
  {
    id: 'james',
    name: 'James',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=300&fit=crop&crop=face',
  },
  {
    id: 'mia',
    name: 'Mia',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=300&fit=crop&crop=face',
  },
]

/**
 * One-Way Interviews → 1 Way Settings side panel (3 tabs).
 * Width is 60% of the viewport for dense settings content.
 */
export function OneWaySettingsPanel({
  open,
  onClose,
}: OneWaySettingsPanelProps) {
  const [tab, setTab] = useState<SettingsTab>('one-way')

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="1Way Settings"
      width="60vw"
      widthClassName="w-[60vw] max-w-none min-w-[20rem]"
      bodyClassName="!p-0 bg-[#F5F5F8]"
    >
      <div
        role="tablist"
        aria-label="1 Way settings sections"
        className="sticky top-0 z-10 flex shrink-0 gap-6 border-b border-[#ECEAF3] bg-white px-5 sm:px-6"
      >
        {TABS.map((item) => {
          const active = item.id === tab
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={cn(
                'relative -mb-px py-3 text-xs font-bold uppercase tracking-[0.04em] transition-colors',
                active
                  ? 'text-[#C94B7C]'
                  : 'text-[#8B8B9E] hover:text-[#2D2061]',
              )}
            >
              {item.label}
              {active ? (
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#C94B7C]"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
        {tab === 'one-way' ? (
          <OneWayConfigTab />
        ) : tab === 'audio' ? (
          <AudioConfigTab />
        ) : (
          <EmailConfigTab />
        )}
      </div>
    </SidePanel>
  )
}

/* -------------------------------------------------------------------------- */
/* 1 Way Config                                                               */
/* -------------------------------------------------------------------------- */

function OneWayConfigTab() {
  const [skipSurvey, setSkipSurvey] = useState(true)
  const [audioAlerts, setAudioAlerts] = useState(true)
  const [restrictAltTab, setRestrictAltTab] = useState(false)
  const [yellowAlert, setYellowAlert] = useState('15 Seconds')
  const [retakes, setRetakes] = useState('3')
  const [redAlert, setRedAlert] = useState('50 Seconds')
  const [retakeTime, setRetakeTime] = useState('7 Seconds')

  const [smartNudge, setSmartNudge] = useState(true)
  const [warningTime, setWarningTime] = useState('5 seconds')
  const [autoSubmit, setAutoSubmit] = useState(true)
  /** Multi-select — design shows Visual + Sound selected together */
  const [nudgeTypes, setNudgeTypes] = useState<
    Record<'visual' | 'sound' | 'voice', boolean>
  >({
    visual: true,
    sound: true,
    voice: false,
  })
  const [aiNudges, setAiNudges] = useState(true)

  const [avatarEnabled, setAvatarEnabled] = useState(true)
  const [avatarId, setAvatarId] = useState('sarah')
  const [speakSpeed, setSpeakSpeed] = useState<'slow' | 'normal' | 'fast'>(
    'normal',
  )
  const [voiceTone, setVoiceTone] = useState<'formal' | 'friendly'>('formal')
  const [introEnabled, setIntroEnabled] = useState(true)
  const [outroEnabled, setOutroEnabled] = useState(true)
  const [introScript, setIntroScript] = useState(
    "Hi, welcome to your interview. I'll guide you through the process.",
  )
  const [outroScript, setOutroScript] = useState(
    "Thank you for completing your interview. We'll get back to you soon.",
  )

  function save(section: string) {
    toast.success(`${section} saved.`, { title: '1 Way Settings' })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Additional Settings */}
      <SectionCard
        title="Additional Settings"
        description="Configure real-time assistance and restriction protocols."
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Checkbox
              label="Enable Skip Answer Survey"
              checked={skipSurvey}
              onChange={(e) => setSkipSurvey(e.target.checked)}
              className="accent-checkbox"
            />
            <Checkbox
              label="Enable Audio Alerts by Avatar"
              checked={audioAlerts}
              onChange={(e) => setAudioAlerts(e.target.checked)}
            />
            <Checkbox
              label="Restrict Alt Tab"
              checked={restrictAltTab}
              onChange={(e) => setRestrictAltTab(e.target.checked)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="Yellow alert for Time Limit"
              options={['10 Seconds', '15 Seconds', '20 Seconds', '30 Seconds']}
              value={yellowAlert}
              onChange={(e) => setYellowAlert(e.target.value)}
            />
            <Select
              label="No. of Retakes"
              options={['1', '2', '3', '4', '5']}
              value={retakes}
              onChange={(e) => setRetakes(e.target.value)}
            />
            <Select
              label="Red Alert for Time"
              options={['30 Seconds', '40 Seconds', '50 Seconds', '60 Seconds']}
              value={redAlert}
              onChange={(e) => setRedAlert(e.target.value)}
            />
            <Select
              label="Time for Retake"
              options={['5 Seconds', '7 Seconds', '10 Seconds', '15 Seconds']}
              value={retakeTime}
              onChange={(e) => setRetakeTime(e.target.value)}
            />
          </div>
        </div>
      </SectionCard>

      {/* Smart Time Nudge — exact layout from design */}
      <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-sm sm:p-5">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-2xl">
            <h3 className="text-base font-bold text-[#2D2061]">
              Smart Time Nudge
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#8B8B9E]">
              Help candidates manage their time with automated, real-time
              reminders during recordings.
            </p>
          </div>
          <Switch checked={smartNudge} onCheckedChange={setSmartNudge} />
        </header>

        <div
          className={cn(
            'flex flex-col gap-3',
            !smartNudge && 'pointer-events-none opacity-50',
          )}
        >
          {/* Default Warning Time row card */}
          <div className="flex flex-col gap-3 rounded-xl border border-[#E8E6F0] bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#2D2061]">
                Default Warning Time
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
                Set the standard time remaining that triggers the first visual
                and/or audio nudge.
              </p>
            </div>
            <div className="w-full shrink-0 sm:w-40">
              <Select
                options={['3 seconds', '5 seconds', '10 seconds', '15 seconds']}
                value={warningTime}
                onChange={(e) => setWarningTime(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Auto Submit row card */}
          <div className="flex flex-col gap-3 rounded-xl border border-[#E8E6F0] bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#2D2061]">
                Auto Submit on Time End
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
                Automatically stop and submit recordings when the allocated time
                expires.
              </p>
            </div>
            <Switch checked={autoSubmit} onCheckedChange={setAutoSubmit} />
          </div>

          {/* Nudge Type Selection */}
          <div className="rounded-xl border border-[#E8E6F0] bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Bell
                className="size-4 text-[#2D2061]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <p className="text-sm font-bold text-[#2D2061]">
                Nudge Type Selection
              </p>
            </div>
            <div
              role="group"
              aria-label="Nudge types"
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <NudgeTypeCard
                active={nudgeTypes.visual}
                title="Visual Popup"
                description="Displays a visual banner or modal on screen."
                icon={<Monitor className="size-3.5" strokeWidth={1.75} />}
                onClick={() =>
                  setNudgeTypes((c) => ({ ...c, visual: !c.visual }))
                }
              />
              <NudgeTypeCard
                active={nudgeTypes.sound}
                title="Sound Alert"
                description="Plays a subtle chime at the warning time."
                icon={<Volume2 className="size-3.5" strokeWidth={1.75} />}
                onClick={() =>
                  setNudgeTypes((c) => ({ ...c, sound: !c.sound }))
                }
              />
              <NudgeTypeCard
                active={nudgeTypes.voice}
                title="Voice Prompt (Avatar)"
                description="An AI avatar provides a verbal wrap-up reminder."
                icon={<User className="size-3.5" strokeWidth={1.75} />}
                onClick={() =>
                  setNudgeTypes((c) => ({ ...c, voice: !c.voice }))
                }
              />
            </div>
          </div>

          {/* AI Nudges (Advanced Guidance) */}
          <div className="rounded-xl border border-[#D4DFF0] bg-[#EEF2F9] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles
                    className="size-4 text-[#2D2061]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-bold text-[#2D2061]">
                    AI Nudges (Advanced Guidance)
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-[#5A6A80]">
                  Leverage real-time AI to detect abnormal silence or early
                  completion. The avatar will automatically provide
                  context-aware prompts to keep candidates engaged and ensure
                  high-quality responses.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5DCE8] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#2D2061]">
                    <ArrowDown className="size-3" strokeWidth={2} aria-hidden="true" />
                    Silence Detection
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5DCE8] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#2D2061]">
                    <CheckCircle2 className="size-3" strokeWidth={2} aria-hidden="true" />
                    Completion Audit
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5DCE8] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#2D2061]">
                    <Bell className="size-3" strokeWidth={2} aria-hidden="true" />
                    Audio Monitoring
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  'inline-flex shrink-0 items-center gap-2.5 self-start rounded-full border bg-white px-3 py-1.5 shadow-sm',
                  aiNudges ? 'border-[#C8D4F0]' : 'border-[#E4E1EE]',
                )}
              >
                <Switch checked={aiNudges} onCheckedChange={setAiNudges} />
                <span
                  className={cn(
                    'text-[11px] font-bold uppercase tracking-[0.06em]',
                    aiNudges ? 'text-[#3B6FD4]' : 'text-[#8B8B9E]',
                  )}
                >
                  {aiNudges ? 'AI Active' : 'AI Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="button"
              onClick={() => save('Smart Time Nudge')}
              className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </section>

      {/* Avatar Configuration — exact layout from design */}
      <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-sm sm:p-5">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-2xl">
            <h3 className="text-base font-bold text-[#2D2061]">
              Avatar Configuration
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#8B8B9E]">
              Manage virtual interviewers and their behavior.
            </p>
          </div>
          <Switch checked={avatarEnabled} onCheckedChange={setAvatarEnabled} />
        </header>

        <div
          className={cn(
            'flex flex-col gap-5',
            !avatarEnabled && 'pointer-events-none opacity-50',
          )}
        >
          {/* Avatar Library */}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User
                  className="size-4 text-[#2D2061]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <p className="text-sm font-bold text-[#2D2061]">Avatar Library</p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#D5D2E0] bg-white px-3 text-xs font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
              >
                <Plus className="size-3.5" strokeWidth={2.25} />
                Create Custom Avatar
              </button>
            </div>
            <div
              role="listbox"
              aria-label="Avatar library"
              className="flex flex-wrap gap-2.5"
            >
              {AVATARS.map((avatar) => {
                const selected = avatar.id === avatarId
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    aria-label={avatar.name}
                    onClick={() => setAvatarId(avatar.id)}
                    className={cn(
                      'relative h-[5.5rem] w-[4.25rem] shrink-0 overflow-hidden rounded-lg bg-[#F0EEF5] transition-all sm:h-[6rem] sm:w-[4.75rem]',
                      selected
                        ? 'ring-2 ring-[#2D2061] ring-offset-1'
                        : 'ring-1 ring-[#E4E1EE] hover:ring-[#C8C0E0]',
                    )}
                  >
                    <img
                      src={avatar.image}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                      loading="lazy"
                    />
                    <span
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-1 pb-1.5 pt-5 text-center text-[10px] font-semibold leading-none text-white"
                      aria-hidden="true"
                    >
                      {avatar.name}
                    </span>
                    {selected ? (
                      <span className="absolute right-1 top-1 inline-flex size-4 items-center justify-center rounded-full bg-[#2D2061] text-white shadow-sm">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Global Voice Defaults */}
          <div className="rounded-xl bg-[#EEF1F6] px-4 py-3.5">
            <div className="mb-3 flex items-center gap-2">
              <Volume2
                className="size-4 text-[#2D2061]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <p className="text-sm font-bold text-[#2D2061]">
                Global Voice Defaults
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9AA0B0]">
                  Speaking Speed
                </p>
                <VoiceOptionGroup
                  value={speakSpeed}
                  options={[
                    { value: 'slow', label: 'Slow' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'fast', label: 'Fast' },
                  ]}
                  onChange={setSpeakSpeed}
                  aria-label="Speaking speed"
                />
              </div>
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9AA0B0]">
                  Voice Tone
                </p>
                <VoiceOptionGroup
                  value={voiceTone}
                  options={[
                    { value: 'formal', label: 'Formal' },
                    { value: 'friendly', label: 'Friendly' },
                  ]}
                  onChange={setVoiceTone}
                  aria-label="Voice tone"
                />
              </div>
            </div>
          </div>

          {/* Intro / Outro — two columns */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-[#E4E1EE] bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <Monitor
                  className="size-4 text-[#2D2061]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <p className="text-sm font-bold text-[#2D2061]">
                  Intro Experience
                </p>
              </div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#2D2061]">
                    Global Intro Enable
                  </p>
                  <p className="mt-0.5 text-xs text-[#8B8B9E]">
                    Auto-enable avatar for all intros
                  </p>
                </div>
                <Switch
                  checked={introEnabled}
                  onCheckedChange={setIntroEnabled}
                />
              </div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Default Greeting Script
              </p>
              <Textarea
                value={introScript}
                onChange={(e) => setIntroScript(e.target.value)}
                rows={4}
                disabled={!introEnabled}
                className="resize-y"
              />
            </div>

            <div className="rounded-xl border border-[#E4E1EE] bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <Play
                  className="size-4 text-[#2D2061]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <p className="text-sm font-bold text-[#2D2061]">
                  Outro Experience
                </p>
              </div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#2D2061]">
                    Global Outro Enable
                  </p>
                  <p className="mt-0.5 text-xs text-[#8B8B9E]">
                    Auto-enable avatar for all outcomes
                  </p>
                </div>
                <Switch
                  checked={outroEnabled}
                  onCheckedChange={setOutroEnabled}
                />
              </div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Default Closing Script
              </p>
              <Textarea
                value={outroScript}
                onChange={(e) => setOutroScript(e.target.value)}
                rows={4}
                disabled={!outroEnabled}
                className="resize-y"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => save('Avatar Configuration')}
              className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Audio Config                                                               */
/* -------------------------------------------------------------------------- */

function AudioConfigTab() {
  const [fromNumber, setFromNumber] = useState('+447414134527')
  const [botName, setBotName] = useState('Recruitment Assistant')
  const [speechIntro, setSpeechIntro] = useState(
    'Hello, I am calling on behalf of the recruitment team.',
  )
  const [voices, setVoices] = useState([
    {
      id: 'v1',
      region: 'North America (EN)',
      voice: 'English (US) - Female (Professional)',
    },
    {
      id: 'v2',
      region: 'Europe (EN)',
      voice: 'English (UK) - Female (Formal)',
    },
  ])
  const [speed, setSpeed] = useState(1)
  const [silenceTimeout, setSilenceTimeout] = useState('5')
  const [allowInterrupt, setAllowInterrupt] = useState(true)
  const [rephrase, setRephrase] = useState(true)

  const [followUpOn, setFollowUpOn] = useState(true)
  const [followUps, setFollowUps] = useState({
    examples: true,
    technical: false,
    contradictory: false,
    measurable: true,
    vague: true,
    star: true,
  })
  const [minWords, setMinWords] = useState('70')
  const [stopRules, setStopRules] = useState({
    sufficient: true,
    maxFollowUps: false,
    timeLimit: false,
  })

  const [behavior, setBehavior] = useState({
    abusive: true,
    warn: true,
    terminate: true,
    disinterest: true,
  })

  const [action, setAction] = useState('Trigger Call Automatically')
  const [maxAttempts, setMaxAttempts] = useState('3')
  const [retryDays, setRetryDays] = useState('2')
  const [retryStatusPick, setRetryStatusPick] = useState('')
  const [retryRules, setRetryRules] = useState([
    'In Progress',
    'No Answer',
    'Dropped',
    'Incomplete',
  ])
  const [exceptionPick, setExceptionPick] = useState('')
  const [exceptions, setExceptions] = useState(['Not Interested'])
  const [windowStart, setWindowStart] = useState('09:00')
  const [windowEnd, setWindowEnd] = useState('18:00')
  const [days, setDays] = useState<Record<(typeof WEEK_DAYS)[number], boolean>>(
    {
      Mon: true,
      Tue: true,
      Wed: true,
      Thu: true,
      Fri: true,
      Sat: false,
      Sun: false,
    },
  )

  function save() {
    toast.success('Audio configuration saved.', { title: '1 Way Settings' })
  }

  function addRetryRule() {
    if (!retryStatusPick || retryRules.includes(retryStatusPick)) return
    setRetryRules((c) => [...c, retryStatusPick])
    setRetryStatusPick('')
  }

  function addException() {
    if (!exceptionPick || exceptions.includes(exceptionPick)) return
    setExceptions((c) => [...c, exceptionPick])
    setExceptionPick('')
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title={
          <span className="inline-flex items-center gap-2">
            <Bot className="size-4 text-[#2D2061]" strokeWidth={2} />
            Bot Identity &amp; Voice
          </span>
        }
      >
        <div className="flex flex-col gap-4">
          <Field
            label="From Number"
            hint="The phone number from which calls will be triggered."
          >
            <input
              type="text"
              value={fromNumber}
              onChange={(e) => setFromNumber(e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field
              label="Bot Name"
              hint="The custom name candidates will hear during the introduction."
            >
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label="Speech Introduction"
              hint="The opening message the bot uses when a call connects."
            >
              <textarea
                value={speechIntro}
                onChange={(e) => setSpeechIntro(e.target.value)}
                rows={3}
                className={cn(inputClass, 'h-auto py-2.5')}
              />
            </Field>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#2D2061]">
              Default TTS Voices per Region / Language
            </p>
            <p className="mt-0.5 text-xs text-[#8B8B9E]">
              Assign a specific text-to-speech voice or persona for different
              regions and languages.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {voices.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <Select
                    options={[
                      'North America (EN)',
                      'Europe (EN)',
                      'Middle East (EN)',
                      'India (EN)',
                    ]}
                    value={row.region}
                    onChange={(e) =>
                      setVoices((current) =>
                        current.map((v) =>
                          v.id === row.id
                            ? { ...v, region: e.target.value }
                            : v,
                        ),
                      )
                    }
                  />
                  <Select
                    options={[
                      'English (US) - Female (Professional)',
                      'English (UK) - Female (Formal)',
                      'English (US) - Male (Neutral)',
                    ]}
                    value={row.voice}
                    onChange={(e) =>
                      setVoices((current) =>
                        current.map((v) =>
                          v.id === row.id ? { ...v, voice: e.target.value } : v,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    aria-label="Remove voice mapping"
                    onClick={() =>
                      setVoices((current) =>
                        current.filter((v) => v.id !== row.id),
                      )
                    }
                    className="inline-flex size-10 items-center justify-center rounded-md text-[#8B8B9E] hover:bg-[#F7F6FA] hover:text-[#E53935]"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setVoices((current) => [
                  ...current,
                  {
                    id: `v-${Date.now()}`,
                    region: 'North America (EN)',
                    voice: 'English (US) - Female (Professional)',
                  },
                ])
              }
              className="mt-2 text-xs font-semibold text-[#2D2061] hover:underline"
            >
              + Add Region/Language Voice
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-[#2D2061]">
                  Speaking Speed of Bot
                </span>
                <span className="text-xs font-semibold tabular-nums text-[#2D2061]">
                  {speed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.1}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-[#2D2061]"
              />
            </div>
            <div>
              <label className="mb-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#2D2061]">
                Silence Timeout
                <Info className="size-3.5 text-[#8B8B9E]" aria-hidden="true" />
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={silenceTimeout}
                  onChange={(e) => setSilenceTimeout(e.target.value)}
                  className={cn(inputClass, 'max-w-[5rem]')}
                />
                <span className="text-sm text-[#6B6B80]">seconds</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Checkbox
              label="Allow Interruptions"
              checked={allowInterrupt}
              onChange={(e) => setAllowInterrupt(e.target.checked)}
            />
            <Checkbox
              label="Rephrase Unanswered Questions"
              checked={rephrase}
              onChange={(e) => setRephrase(e.target.checked)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Dynamic Follow-Up Settings"
        headerRight={
          <Switch checked={followUpOn} onCheckedChange={setFollowUpOn} />
        }
      >
        <div className={cn('flex flex-col gap-4', !followUpOn && 'opacity-50 pointer-events-none')}>
          <p className="text-xs text-[#6B6B80]">
            Configuration for when follow-ups will trigger:
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Checkbox
              label="Ask for examples"
              checked={followUps.examples}
              onChange={(e) =>
                setFollowUps((c) => ({ ...c, examples: e.target.checked }))
              }
            />
            <Checkbox
              label="Ask for measurable achievements"
              checked={followUps.measurable}
              onChange={(e) =>
                setFollowUps((c) => ({ ...c, measurable: e.target.checked }))
              }
            />
            <Checkbox
              label="Probe technical depth"
              checked={followUps.technical}
              onChange={(e) =>
                setFollowUps((c) => ({ ...c, technical: e.target.checked }))
              }
            />
            <Checkbox
              label="Clarify vague answers"
              checked={followUps.vague}
              onChange={(e) =>
                setFollowUps((c) => ({ ...c, vague: e.target.checked }))
              }
            />
            <Checkbox
              label="Challenge contradictory answers"
              checked={followUps.contradictory}
              onChange={(e) =>
                setFollowUps((c) => ({
                  ...c,
                  contradictory: e.target.checked,
                }))
              }
            />
            <Checkbox
              label="Ask STAR follow ups"
              checked={followUps.star}
              onChange={(e) =>
                setFollowUps((c) => ({ ...c, star: e.target.checked }))
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-xs font-medium text-[#2D2061]">
                Minimum answer length before probing
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minWords}
                  onChange={(e) => setMinWords(e.target.value)}
                  className={cn(inputClass, 'max-w-[5rem]')}
                />
                <span className="text-sm text-[#6B6B80]">words</span>
              </div>
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-medium text-[#2D2061]">
                Stop probing after
              </span>
              <div className="flex flex-col gap-1.5">
                <Checkbox
                  label="Candidate answers sufficiently"
                  checked={stopRules.sufficient}
                  onChange={(e) =>
                    setStopRules((c) => ({
                      ...c,
                      sufficient: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Max follow-ups reached"
                  checked={stopRules.maxFollowUps}
                  onChange={(e) =>
                    setStopRules((c) => ({
                      ...c,
                      maxFollowUps: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Time limit reached"
                  checked={stopRules.timeLimit}
                  onChange={(e) =>
                    setStopRules((c) => ({
                      ...c,
                      timeLimit: e.target.checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Conversation Behavior">
        <ul className="divide-y divide-[#F0EEF5]">
          {(
            [
              ['abusive', 'Detect abusive language'] as const,
              ['warn', 'Warn candidate'] as const,
              ['terminate', 'Terminate abusive interview'] as const,
              [
                'disinterest',
                'End interview early if a candidate expresses disinterest',
              ] as const,
            ] as const
          ).map(([key, label]) => (
            <li
              key={key}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="text-sm text-[#2D2061]">{label}</span>
              <input
                type="checkbox"
                checked={behavior[key]}
                onChange={(e) =>
                  setBehavior((c) => ({ ...c, [key]: e.target.checked }))
                }
                className="size-4 rounded border-[#C8C5D6] accent-[#2D2061]"
                aria-label={label}
              />
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Automation Workflow — exact layout from design */}
      <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-sm sm:p-5">
        <h3 className="mb-4 text-base font-bold text-[#2D2061]">
          Automation Workflow
        </h3>

        <div className="mb-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#2D2061]">
            Action to Perform:
          </p>
          <Select
            options={[
              'Trigger Call Automatically',
              'Schedule for Review',
              'Manual Only',
            ]}
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5">
          {/* Max attempts + Retry window */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#2D2061]">
                Max Call Attempts:
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(e.target.value)}
                  className="h-10 w-16 rounded-md border border-[#ddd9e8] bg-white px-2.5 text-center text-sm font-medium text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                />
                <span className="text-xs text-[#8B8B9E]">(Range: 1-5)</span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-[#2D2061]">
                Retry Window (Days):
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="number"
                  min={2}
                  max={5}
                  value={retryDays}
                  onChange={(e) => setRetryDays(e.target.value)}
                  className="h-10 w-16 rounded-md border border-[#ddd9e8] bg-white px-2.5 text-center text-sm font-medium text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                />
                <span className="text-xs text-[#8B8B9E]">(Range: 2-5)</span>
              </div>
            </div>
          </div>

          {/* Retry Rules */}
          <div className="mt-5">
            <p className="mb-2.5 flex items-start gap-2 text-sm leading-snug text-[#2D2061]">
              <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#F5A524]">
                <Info className="size-2.5 text-white" strokeWidth={3} />
              </span>
              <span>
                <span className="font-bold">Retry Rules:</span>{' '}
                Select the call statuses that will trigger a retry (up to{' '}
                {retryDays || '2'} days, ending on the{' '}
                {ordinalDay(Number(retryDays) + 1 || 3)} day).
              </span>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <Select
                  options={RETRY_STATUS_OPTIONS.filter(
                    (s) => !retryRules.includes(s),
                  )}
                  value={retryStatusPick}
                  onChange={(e) => setRetryStatusPick(e.target.value)}
                  placeholder="Select a status..."
                  className="bg-white"
                />
              </div>
              <button
                type="button"
                onClick={addRetryRule}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
              >
                <Plus className="size-3.5" strokeWidth={2.5} />
                Add
              </button>
            </div>
            {retryRules.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {retryRules.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EAF8] px-3 py-1 text-xs font-semibold text-[#3D3F8F]"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove ${tag}`}
                      onClick={() =>
                        setRetryRules((c) => c.filter((t) => t !== tag))
                      }
                      className="inline-flex size-4 items-center justify-center rounded-full bg-[#5B5FC7]/15 text-[#5B5FC7] hover:bg-[#5B5FC7]/25"
                    >
                      <X className="size-2.5" strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Exceptions */}
          <div className="mt-5">
            <p className="mb-2.5 flex items-start gap-2 text-sm leading-snug text-[#2D2061]">
              <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#12B76A]">
                <Check className="size-2.5 text-white" strokeWidth={3} />
              </span>
              <span>
                <span className="font-bold">Exceptions:</span> Select candidate
                statuses that will immediately cancel the retry workflow.
              </span>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <Select
                  options={EXCEPTION_STATUS_OPTIONS.filter(
                    (s) => !exceptions.includes(s),
                  )}
                  value={exceptionPick}
                  onChange={(e) => setExceptionPick(e.target.value)}
                  placeholder="Select a status..."
                  className="bg-white"
                />
              </div>
              <button
                type="button"
                onClick={addException}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
              >
                <Plus className="size-3.5" strokeWidth={2.5} />
                Add
              </button>
            </div>
            {exceptions.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {exceptions.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#FDE8EA] px-3 py-1 text-xs font-semibold text-[#C23B4A]"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove ${tag}`}
                      onClick={() =>
                        setExceptions((c) => c.filter((t) => t !== tag))
                      }
                      className="inline-flex size-4 items-center justify-center rounded-full bg-[#E45C6A]/15 text-[#E45C6A] hover:bg-[#E45C6A]/25"
                    >
                      <X className="size-2.5" strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Calling Window & Schedule */}
          <div className="mt-6 border-t border-[#EEEDF3] pt-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock
                className="size-4 text-[#2D2061]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <p className="text-sm font-bold text-[#2D2061]">
                Calling Window &amp; Schedule
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#2D2061]">
                  Calling Window (Local Time):
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[7.5rem] flex-1">
                    <input
                      type="time"
                      value={windowStart}
                      onChange={(e) => setWindowStart(e.target.value)}
                      className={cn(inputClass, 'pr-9')}
                      aria-label="Calling window start"
                    />
                    <Clock
                      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#A0A0B2]"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm text-[#8B8B9E]">to</span>
                  <div className="relative min-w-[7.5rem] flex-1">
                    <input
                      type="time"
                      value={windowEnd}
                      onChange={(e) => setWindowEnd(e.target.value)}
                      className={cn(inputClass, 'pr-9')}
                      aria-label="Calling window end"
                    />
                    <Clock
                      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#A0A0B2]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-[#8B8B9E]">
                  Calls will only be placed during this window.
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-[#2D2061]">
                  Permitted Calling Days:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {WEEK_DAYS.map((day) => {
                    const on = days[day]
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() =>
                          setDays((c) => ({ ...c, [day]: !c[day] }))
                        }
                        className={cn(
                          'inline-flex h-9 min-w-[3.25rem] items-center justify-center rounded-full border px-2.5 text-xs font-semibold transition-colors',
                          on
                            ? 'border-[#A8A3E0] bg-[#EDEAF8] text-[#5B4F9E]'
                            : 'border-[#E0DDEA] bg-white text-[#A0A0B2]',
                        )}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-xs text-[#8B8B9E]">
                  Select which days of the week calls should be attempted.
                  Includes weekend configuration.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={save}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Save Audio Config
          </Button>
        </div>
      </section>
    </div>
  )
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

const RETRY_STATUS_OPTIONS = [
  'In Progress',
  'No Answer',
  'Dropped',
  'Incomplete',
  'Busy',
  'Voicemail',
]

const EXCEPTION_STATUS_OPTIONS = [
  'Not Interested',
  'Withdrawn',
  'Hired',
  'Do Not Call',
]

function ordinalDay(n: number): string {
  if (Number.isNaN(n) || n < 1) return '3rd'
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}

/* -------------------------------------------------------------------------- */
/* Email Config                                                               */
/* -------------------------------------------------------------------------- */

function EmailConfigTab() {
  const [templateType, setTemplateType] = useState('Interview Invite')
  const [subject, setSubject] = useState(
    'Your Next Step- Complete Your Video Interview Here',
  )
  const [body, setBody] = useState(
    `Hi there,

Thank you for your interest in the [JOB_TITLE] role.

Interview Details
Click Here to start your one-way video interview.
Please complete it within [EXPIRATION_DAYS] days.

Preparation Tips
• Ensure a stable internet connection and a quiet environment.
`,
  )

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title="Email Template Configuration"
        description="Configure global invitation templates for one-way interviews."
      >
        <div className="flex flex-col gap-4">
          <Select
            label="Template Type"
            options={[
              'Interview Invite',
              'Reminder',
              'Completion Confirmation',
            ]}
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
          />

          <Field label="Email Subject">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClass}
            />
          </Field>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-[#2D2061]">
              Email Body
            </span>
            <div className="overflow-hidden rounded-lg border border-[#E4E1EE] bg-white">
              <div className="flex items-center gap-1.5 border-b border-[#F0EEF5] bg-[#FAFAFC] px-3 py-2">
                <span className="size-2.5 rounded-full bg-[#FF5F57]" />
                <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="size-2.5 rounded-full bg-[#28C840]" />
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="w-full resize-y border-0 bg-white px-3 py-3 font-mono text-[13px] leading-relaxed text-[#2A2740] outline-none"
              />
              <div className="border-t border-[#F0EEF5] bg-[#FAFAFC] px-3 py-1.5 text-[11px] text-[#8B8B9E]">
                Body Editor (Variables Enabled)
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-[#F5D78E] bg-[#FFF8E8] px-3.5 py-3">
            <Settings2
              className="mt-0.5 size-4 shrink-0 text-[#D97706]"
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-[#5C4B1F]">
              <span className="font-bold uppercase tracking-[0.03em] text-[#B45309]">
                Variable Guide:
              </span>{' '}
              Keep variables like{' '}
              <span className="font-semibold text-[#9A3412]">[JOB_TITLE]</span> and{' '}
              <span className="font-semibold text-[#9A3412]">
                [EXPIRATION_DAYS]
              </span>{' '}
              intact. They are replaced automatically with real values.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() =>
                toast.success('Email template configuration saved.', {
                  title: '1 Way Settings',
                })
              }
              className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Save Template Config
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Shared layout helpers                                                      */
/* -------------------------------------------------------------------------- */

function SectionCard({
  title,
  description,
  headerRight,
  children,
}: {
  title: ReactNode
  description?: string
  headerRight?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-sm sm:p-5">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#2D2061] sm:text-base">
            {title}
          </h3>
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
              {description}
            </p>
          ) : null}
        </div>
        {headerRight}
      </header>
      {children}
    </section>
  )
}

function NudgeTypeCard({
  active,
  title,
  description,
  icon,
  onClick,
}: {
  active: boolean
  title: string
  description: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        'relative flex h-full min-h-[4.5rem] items-start gap-2.5 rounded-xl border p-3 text-left transition-all',
        active
          ? 'border-2 border-[#2D2061] bg-white'
          : 'border border-[#E4E1EE] bg-white opacity-70 hover:opacity-100 hover:border-[#C8C2DE]',
      )}
    >
      {/* Small square icon + text side by side (design) */}
      <span
        className={cn(
          'inline-flex size-7 shrink-0 items-center justify-center rounded-md',
          active
            ? 'bg-[#2D2061] text-white'
            : 'bg-[#D5D2E0] text-white',
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 pr-5">
        <p
          className={cn(
            'text-sm font-bold leading-tight',
            active ? 'text-[#2D2061]' : 'text-[#8B8B9E]',
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'mt-0.5 text-[11px] leading-snug',
            active ? 'text-[#8B8B9E]' : 'text-[#A8A8B8]',
          )}
        >
          {description}
        </p>
      </span>
      {/* Empty checkbox on unselected cards (design: Voice Prompt) */}
      {!active ? (
        <span
          className="absolute right-2.5 top-2.5 size-3.5 rounded border border-[#C8C5D6] bg-white"
          aria-hidden="true"
        />
      ) : null}
    </button>
  )
}

/** Design-matched option group for Global Voice Defaults (not pill SegmentedControl). */
function VoiceOptionGroup<T extends string>({
  value,
  options,
  onChange,
  'aria-label': ariaLabel,
}: {
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
  'aria-label'?: string
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex w-full overflow-hidden rounded-lg border border-[#D8DCE6] bg-white p-0.5"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'min-w-0 flex-1 rounded-md px-2 py-2 text-center text-xs font-semibold transition-colors',
              active
                ? 'bg-[#2D2061] text-white shadow-sm'
                : 'bg-transparent text-[#8B8B9E] hover:text-[#2D2061]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-[#2D2061]">{label}</span>
      {hint ? <span className="text-[11px] text-[#8B8B9E]">{hint}</span> : null}
      {children}
    </label>
  )
}

const inputClass =
  'h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'
