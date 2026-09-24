import { useState } from 'react'
import { Check, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { ConfirmDeleteModal, Switch, Textarea } from '../ui'
import { cn } from '../../lib/cn'
import allenAvatar from '../../assets/avatars/allen.jpg'
import maxAvatar from '../../assets/avatars/max.jpg'
import michaelAvatar from '../../assets/avatars/michael.jpg'
import sarahAvatar from '../../assets/avatars/sarah.jpg'
import { CreateCustomAvatarPanel } from './CreateCustomAvatarPanel'
import { FieldLabel, InfoHint, OneWayCard, OneWaySettingsShell } from './OneWaySettingsChrome'

type AvatarCard = {
  id: string
  name: string
  image: string
  custom: boolean
  consent?: boolean
}

type NudgeRule = {
  id: string
  type: string
  trigger: string
  token: string
  message: string
  priority: number
  active: boolean
}

const AVATARS: AvatarCard[] = [
  { id: 'sarah', name: 'Sarah', image: sarahAvatar, custom: false },
  { id: 'michael', name: 'Michael', image: michaelAvatar, custom: false },
  { id: 'allen', name: 'Allen', image: allenAvatar, custom: false },
  { id: 'max', name: 'Max', image: maxAvatar, custom: true },
  { id: 'max-consent', name: 'Max', image: maxAvatar, custom: true, consent: true },
]

const NUDGE_CHIPS = [
  'Silence',
  'Early Completion',
  'Wrap Up',
  'Low Audio',
  'Time Warning',
]

const INITIAL_NUDGES: NudgeRule[] = [
  {
    id: 'silence',
    type: 'Silence',
    trigger: 'Candidate silent for 10 seconds',
    token: '{silence_seconds=10}',
    message: "Take your time. Feel free to share your thoughts whenever you're ready.",
    priority: 1,
    active: true,
  },
  {
    id: 'early',
    type: 'Early Completion',
    trigger: 'Answer ends before 30% of answer time',
    token: '{min_answer_percent=30}',
    message:
      'Great start! If you have more to add, feel free to continue. You still have time remaining.',
    priority: 1,
    active: true,
  },
  {
    id: 'wrap',
    type: 'Wrap Up',
    trigger: 'Answer time left 30 seconds',
    token: '{remaining_seconds=30}',
    message:
      'Just a heads up: you have about 30 seconds left. Start wrapping up your answer.',
    priority: 1,
    active: false,
  },
  {
    id: 'audio',
    type: 'Low Audio',
    trigger: 'Audio level below -40 dB',
    token: '{db_threshold=-40}',
    message:
      "We're having trouble hearing you clearly. Please speak a little louder or move closer to your microphone.",
    priority: 2,
    active: true,
  },
  {
    id: 'time',
    type: 'Time Warning',
    trigger: 'Answer time left 60 seconds',
    token: '{remaining_seconds=60}',
    message: 'You have about one minute left for this question.',
    priority: 1,
    active: true,
  },
]

const GREETING =
  "Hello [CANDIDATE_NAME], I'm [AVATAR_NAME] your AI recruitment assistant. Thank you for taking the time to speak with us today. I'll guide you through a few questions to learn more about your experience and qualifications."

const CLOSING =
  'Thank you [CANDIDATE_NAME] for taking the time to complete your interview today. It was a pleasure learning more about your experience and background.'

/**
 * Settings → Module Configuration → 1 Way Interview → Avatar Settings.
 */
export function OneWayAvatarSettingsPanel() {
  const [nudgesOn, setNudgesOn] = useState(true)
  const [libraryOn, setLibraryOn] = useState(true)
  const [avatars, setAvatars] = useState(AVATARS)
  const [selectedAvatar, setSelectedAvatar] = useState('max')
  const [pendingAvatar, setPendingAvatar] = useState<AvatarCard | null>(null)
  const [speechSpeed, setSpeechSpeed] = useState('normal')
  const [voiceTone, setVoiceTone] = useState('formal')
  const [introOn, setIntroOn] = useState(true)
  const [greeting, setGreeting] = useState(GREETING)
  const [outroOn, setOutroOn] = useState(true)
  const [closing, setClosing] = useState(CLOSING)
  const [skipAnswer, setSkipAnswer] = useState(true)
  const [speaksNudges, setSpeaksNudges] = useState(true)
  const [focusOut, setFocusOut] = useState(true)
  const [amberTime, setAmberTime] = useState('10')
  const [redTime, setRedTime] = useState('5')
  const [focusResponse, setFocusResponse] = useState('warn')
  const [retakes, setRetakes] = useState('5')
  const [retakePrep, setRetakePrep] = useState('10')
  const [maxFocusOuts, setMaxFocusOuts] = useState('5')
  const [nudges, setNudges] = useState(INITIAL_NUDGES)
  const [pendingNudge, setPendingNudge] = useState<NudgeRule | null>(null)
  const [createAvatarOpen, setCreateAvatarOpen] = useState(false)

  function addCustomAvatar(name: string) {
    const next: AvatarCard = {
      id: `custom-${Date.now()}`,
      name,
      image: maxAvatar,
      custom: true,
    }
    setAvatars((current) => [...current, next])
    setSelectedAvatar(next.id)
    setLibraryOn(true)
  }

  return (
    <OneWaySettingsShell
      title="Avatar Settings"
      description="Choose the AI interviewer, what it says, how candidates are guided and which nudges it gives."
    >
      <OneWayCard
        title={
          <span className="inline-flex items-center gap-1.5">
            AI Nudges
            <InfoHint label="Detect long silences, very short answers and low audio, then guide the candidate with the messages in Nudge Rules." />
          </span>
        }
        description="Detect long silences, very short answers and low audio, then guide the candidate with the messages in Nudge Rules."
        trailing={
          <Switch
            checked={nudgesOn}
            onCheckedChange={setNudgesOn}
            aria-label="AI Nudges"
          />
        }
      >
        {nudgesOn ? (
          <div className="flex flex-wrap gap-2">
            {NUDGE_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-[#F3EEFF] px-2.5 py-1 text-[11px] font-semibold text-[#6D5BD0]"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </OneWayCard>

      <OneWayCard
        title="Avatar Library"
        description="The virtual interviewer who greets candidates and reads each question aloud."
        trailing={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCreateAvatarOpen(true)}
              className="h-9 rounded-lg bg-[#2D2061] px-3.5 text-[13px] font-semibold text-white hover:bg-[#241a4e]"
            >
              Create Custom Avatar
            </button>
            <Switch
              checked={libraryOn}
              onCheckedChange={setLibraryOn}
              aria-label="Avatar library"
            />
          </div>
        }
      >
        <div className={cn('flex flex-wrap items-start gap-3 pt-1', !libraryOn && 'opacity-50')}>
          {avatars.map((avatar) => (
            <AvatarTile
              key={avatar.id}
              avatar={avatar}
              selected={selectedAvatar === avatar.id}
              disabled={!libraryOn}
              onSelect={() => setSelectedAvatar(avatar.id)}
              onDelete={() => setPendingAvatar(avatar)}
            />
          ))}
        </div>
      </OneWayCard>

      <OneWayCard
        title="Default Global Audio Settings"
        description="How the avatar sounds in every interview."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DotChoice
            label="Speech Speed"
            name="speech-speed"
            value={speechSpeed}
            onChange={setSpeechSpeed}
            options={[
              { value: 'slow', label: 'Slow' },
              { value: 'normal', label: 'Normal' },
              { value: 'fast', label: 'Fast' },
            ]}
          />
          <DotChoice
            label="Voice Tone"
            name="voice-tone"
            value={voiceTone}
            onChange={setVoiceTone}
            options={[
              { value: 'formal', label: 'Formal' },
              { value: 'friendly', label: 'Friendly' },
            ]}
          />
        </div>
      </OneWayCard>

      <OneWayCard
        title="Intro Experience"
        description="Spoken by the avatar before the first question"
        trailing={
          <Switch
            checked={introOn}
            onCheckedChange={setIntroOn}
            aria-label="Intro Experience"
          />
        }
      >
        {introOn ? (
          <Textarea
            id="avatar-greeting"
            label="Default Greeting Script"
            rows={3}
            value={greeting}
            onChange={(event) => setGreeting(event.target.value)}
          />
        ) : null}
      </OneWayCard>

      <OneWayCard
        title="Outro Experience"
        description="Spoken by the avatar after the last question"
        trailing={
          <Switch
            checked={outroOn}
            onCheckedChange={setOutroOn}
            aria-label="Outro Experience"
          />
        }
      >
        {outroOn ? (
          <Textarea
            id="avatar-closing"
            label="Default Closing Script"
            rows={3}
            value={closing}
            onChange={(event) => setClosing(event.target.value)}
          />
        ) : null}
      </OneWayCard>

      <OneWayCard title="Interview Controls">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-3">
            <ToggleRow
              label="Enable Skip-Answer Button"
              hint="Let the candidate skip a question."
              checked={skipAnswer}
              onChange={setSkipAnswer}
            />
            <ToggleRow
              label="Avatar Speaks Nudges"
              hint="The avatar reads nudge messages aloud."
              checked={speaksNudges}
              onChange={setSpeaksNudges}
            />
            <ToggleRow
              label="Detect Focus Out or Tab Switch"
              hint="Notice when the candidate leaves the interview tab."
              checked={focusOut}
              onChange={setFocusOut}
            />
          </div>
          <div className="flex flex-col gap-3">
            <ControlSelect
              label="Amber Time Alert"
              hint="Warn the candidate when this much answer time is left."
              value={amberTime}
              onChange={setAmberTime}
              options={[
                { value: '5', label: '5 seconds' },
                { value: '10', label: '10 seconds' },
                { value: '15', label: '15 seconds' },
                { value: '30', label: '30 seconds' },
              ]}
            />
            <ControlSelect
              label="Red Time Alert"
              hint="Show a final warning when this much answer time is left."
              value={redTime}
              onChange={setRedTime}
              options={[
                { value: '5', label: '5 seconds' },
                { value: '10', label: '10 seconds' },
              ]}
            />
            <ControlSelect
              label="Focus Out Response"
              hint="What happens when the candidate leaves the tab."
              value={focusResponse}
              onChange={setFocusResponse}
              options={[
                { value: 'warn', label: 'Warn candidate' },
                { value: 'pause', label: 'Pause interview' },
                { value: 'end', label: 'End interview' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-3">
            <ControlSelect
              label="Retakes per Question"
              hint="How many times a candidate can re-record an answer."
              value={retakes}
              onChange={setRetakes}
              options={[
                { value: '1', label: '1' },
                { value: '3', label: '3' },
                { value: '5', label: '5' },
                { value: 'unlimited', label: 'Unlimited' },
              ]}
            />
            <ControlSelect
              label="Retake Preparation Time"
              hint="Preparation time given before a retake."
              value={retakePrep}
              onChange={setRetakePrep}
              options={[
                { value: '5', label: '5 seconds' },
                { value: '10', label: '10 seconds' },
                { value: '15', label: '15 seconds' },
              ]}
            />
            <label className="flex flex-col gap-1.5">
              <FieldLabel
                label="Max Focus Outs per Answer"
                hint="How many times a candidate can leave the tab during one answer."
              />
              <input
                type="number"
                min={0}
                value={maxFocusOuts}
                onChange={(event) => setMaxFocusOuts(event.target.value)}
                className="h-9 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061]"
              />
            </label>
          </div>
        </div>
      </OneWayCard>

      <OneWayCard title="Nudge Rules">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E8E6F0] text-[11px] font-semibold uppercase tracking-wide text-[#8B8B9E]">
                <th className="px-2 py-2 font-semibold">Nudge Type</th>
                <th className="px-2 py-2 font-semibold">Trigger Condition</th>
                <th className="px-2 py-2 font-semibold">Nudge Message</th>
                <th className="px-2 py-2 font-semibold">Priority</th>
                <th className="px-2 py-2 font-semibold">Active</th>
                <th className="px-2 py-2 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {nudges.map((rule) => (
                <tr key={rule.id} className="border-b border-[#F0EEF5] last:border-0">
                  <td className="px-2 py-3 align-top font-semibold text-[#2A2740]">
                    {rule.type}
                  </td>
                  <td className="px-2 py-3 align-top text-[#5C5870]">
                    <p>{rule.trigger}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-[#6D5BD0]">{rule.token}</p>
                  </td>
                  <td className="max-w-[16rem] px-2 py-3 align-top leading-relaxed text-[#3D3A52]">
                    {rule.message}
                  </td>
                  <td className="px-2 py-3 align-top text-[#2A2740]">{rule.priority}</td>
                  <td className="px-2 py-3 align-top">
                    <Switch
                      checked={rule.active}
                      onCheckedChange={(active) =>
                        setNudges((current) =>
                          current.map((item) =>
                            item.id === rule.id ? { ...item, active } : item,
                          ),
                        )
                      }
                      aria-label={`${rule.type} active`}
                    />
                  </td>
                  <td className="px-2 py-3 align-top">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${rule.type}`}
                        className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] hover:bg-white"
                      >
                        <Pencil className="size-3.5" strokeWidth={2} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${rule.type}`}
                        onClick={() => setPendingNudge(rule)}
                        className="inline-flex size-7 items-center justify-center rounded-md text-[#E53935] hover:bg-white"
                      >
                        <Trash2 className="size-3.5" strokeWidth={2} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OneWayCard>

      <CreateCustomAvatarPanel
        open={createAvatarOpen}
        onClose={() => setCreateAvatarOpen(false)}
        onCreate={(avatar) => addCustomAvatar(avatar.name)}
      />
      <ConfirmDeleteModal
        open={Boolean(pendingAvatar)}
        title="Delete Avatar"
        itemName={pendingAvatar?.name}
        onClose={() => setPendingAvatar(null)}
        onConfirm={() => {
          if (!pendingAvatar) return
          setAvatars((current) => current.filter((item) => item.id !== pendingAvatar.id))
          if (selectedAvatar === pendingAvatar.id) setSelectedAvatar('sarah')
          setPendingAvatar(null)
        }}
      />
      <ConfirmDeleteModal
        open={Boolean(pendingNudge)}
        title="Delete Nudge Rule"
        itemName={pendingNudge?.type}
        onClose={() => setPendingNudge(null)}
        onConfirm={() => {
          if (!pendingNudge) return
          setNudges((current) => current.filter((item) => item.id !== pendingNudge.id))
          setPendingNudge(null)
        }}
      />
    </OneWaySettingsShell>
  )
}

function AvatarTile({
  avatar,
  selected,
  disabled,
  onSelect,
  onDelete,
}: {
  avatar: AvatarCard
  selected: boolean
  disabled: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  return (
    <div className="relative shrink-0">
      {selected ? (
        <span className="absolute -top-2 -right-2 z-10 inline-flex size-5 items-center justify-center rounded-full bg-[#2D2061] text-white ring-2 ring-[#F7F8FB]">
          <Check className="size-3" strokeWidth={3} aria-hidden="true" />
        </span>
      ) : null}
      <button
        type="button"
        disabled={disabled}
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Select ${avatar.name}`}
        className={cn(
          'flex h-[4.5rem] items-center gap-2 rounded-xl border-2 bg-white py-1.5 pr-2 pl-1.5 text-left',
          avatar.custom ? 'w-[11.5rem]' : 'w-[9.25rem]',
          selected ? 'border-[#2D2061]' : 'border-[#E8E6F0]',
          disabled && 'cursor-not-allowed',
        )}
      >
        <img
          src={avatar.image}
          alt=""
          className="size-[3.25rem] shrink-0 rounded-lg object-cover"
        />
        {avatar.custom ? (
          <span
            className={cn(
              'flex h-full min-w-0 flex-1 flex-col items-start justify-center gap-1 pb-3.5',
              avatar.consent && 'pt-3.5',
            )}
          >
            <span className="rounded-full bg-[#2D2061] px-1.5 py-px text-[8px] font-bold leading-tight tracking-wide text-white uppercase">
              Custom
            </span>
            <span className="max-w-full truncate text-[13px] font-semibold leading-none text-[#1A1A2E]">
              {avatar.name}
            </span>
          </span>
        ) : (
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#1A1A2E]">
            {avatar.name}
          </span>
        )}
      </button>
      {avatar.consent ? (
        <span className="pointer-events-none absolute top-1.5 right-2 rounded-full bg-[#FDE8F0] px-1.5 py-px text-[9px] font-semibold leading-tight text-[#E25586]">
          Consent
        </span>
      ) : null}
      {avatar.custom ? (
        <div className="absolute right-2 bottom-1.5 flex items-center gap-1.5">
          <button
            type="button"
            aria-label={`Edit ${avatar.name}`}
            disabled={disabled}
            className="inline-flex text-[#A9A7B8] hover:text-[#2D2061] disabled:pointer-events-none"
          >
            <Pencil className="size-3.5" strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Delete ${avatar.name}`}
            disabled={disabled}
            onClick={onDelete}
            className="inline-flex text-[#A9A7B8] hover:text-[#E53935] disabled:pointer-events-none"
          >
            <Trash2 className="size-3.5" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

function DotChoice({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-[#2A2740]">{label}</legend>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        {options.map((option) => {
          const checked = value === option.value
          return (
            <label
              key={option.value}
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#2A2740]"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  'inline-flex size-4 items-center justify-center rounded-full border',
                  checked ? 'border-[#5B4DC7]' : 'border-[#C8C5D6]',
                )}
                aria-hidden="true"
              >
                {checked ? <span className="size-2 rounded-full bg-[#5B4DC7]" /> : null}
              </span>
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
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
    <div className="flex items-center justify-between gap-3">
      <FieldLabel label={label} hint={hint} />
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  )
}

function ControlSelect({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string
  hint: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <FieldLabel label={label} hint={hint} />
      <div className="relative">
        <select
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-[#ddd9e8] bg-white px-3 pr-8 text-sm text-[#2D2061] outline-none focus:border-[#2D2061]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-[#6B6B80]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>
    </label>
  )
}
