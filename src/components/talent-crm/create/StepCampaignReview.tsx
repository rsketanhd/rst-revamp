import { useMemo, useState } from 'react'
import {
  ChevronDown,
  Monitor,
  Pencil,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { cn } from '../../../lib/cn'
import {
  DEFAULT_AUDIENCE_SUMMARY,
  formatCampaignReviewRule,
  formatCampaignSettingsSummary,
  parseCampaignFromAddress,
  type CampaignChannel,
  type CampaignSequenceMessage,
  type CreateCampaignFormState,
} from '../createCampaignData'

export type StepCampaignReviewProps = {
  value: CreateCampaignFormState
  onEditDetails: () => void
  onEditMessages: () => void
  onEditSettings: () => void
}

type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

function channelLabel(channel: CampaignChannel): string {
  switch (channel) {
    case 'email':
      return 'Email'
    case 'sms':
      return 'SMS'
    case 'telephonic':
      return 'Telephonic'
    case '':
      return '—'
    default: {
      const exhaustive: never = channel
      return exhaustive
    }
  }
}

const cardClass =
  'rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:p-5'
const labelClass = 'text-[11px] font-medium text-[#8B8B9E]'
const valueClass = 'mt-0.5 text-sm font-semibold text-[#2D2061]'

/**
 * Create Campaign — Review: summary cards + message preview.
 */
export function StepCampaignReview({
  value,
  onEditDetails,
  onEditMessages,
  onEditSettings,
}: StepCampaignReviewProps) {
  const messages = value.messages
  const [selectedMessageId, setSelectedMessageId] = useState(
    () => messages[0]?.id ?? '',
  )
  const [device, setDevice] = useState<PreviewDevice>('desktop')
  const [pickerOpen, setPickerOpen] = useState(false)

  const selectedIndex = Math.max(
    0,
    messages.findIndex((item) => item.id === selectedMessageId),
  )
  const selected =
    messages.find((item) => item.id === selectedMessageId) ??
    messages[0] ??
    null

  const sender = useMemo(
    () => parseCampaignFromAddress(value.fromAddress),
    [value.fromAddress],
  )
  const settingsSummary = formatCampaignSettingsSummary(value)
  const audienceCount = DEFAULT_AUDIENCE_SUMMARY.reachable

  return (
    <div className="flex w-full flex-col gap-4 pb-8">
      <header className="border-b border-[#ECEAF3] pb-3">
        <h2 className="text-lg font-bold text-[#2D2061]">Review</h2>
        <p className="mt-0.5 text-sm text-[#8B8B9E]">
          Confirm details and launch your campaign.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <section className={cardClass}>
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-[#2D2061]">
                Campaign Details
              </h3>
              <EditIconButton label="Edit campaign details" onClick={onEditDetails} />
            </div>
            <dl className="flex flex-col gap-3">
              <ReviewRow label="Name" value={value.name || '—'} />
              <ReviewRow
                label="Owner(s)"
                value={value.owners.length ? value.owners.join(', ') : '—'}
              />
              <ReviewRow label="Channel" value={channelLabel(value.channel)} />
            </dl>
            <div className="mt-4 border-t border-[#ECEAF3] pt-3">
              <p className="text-xs font-semibold text-[#2D2061]">
                Sender Configuration Details
              </p>
              <dl className="mt-2.5 flex flex-col gap-3">
                <ReviewRow label="Name" value={sender.name || '—'} />
                <ReviewRow label="From Address" value={sender.email || '—'} />
                <ReviewRow
                  label="Reply to Address"
                  value={value.replyToAddress || '—'}
                />
              </dl>
            </div>
          </section>

          <section className={cardClass}>
            <h3 className="mb-3 text-sm font-bold text-[#2D2061]">Audience</h3>
            <dl className="flex flex-col gap-3">
              <ReviewRow label="Talent Pool" value={value.talentPool || '—'} />
              <ReviewRow
                label="Audience Summary"
                value={String(audienceCount)}
              />
            </dl>
          </section>

          <section className={cardClass}>
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-[#2D2061]">Settings</h3>
              <EditIconButton label="Edit settings" onClick={onEditSettings} />
            </div>
            <p className="text-sm leading-relaxed text-[#5B6178]">
              {settingsSummary}
            </p>
          </section>
        </div>

        <section className={cn(cardClass, 'flex min-w-0 flex-col')}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#2D2061]">Message Preview</h3>
            <div className="relative flex items-center gap-1.5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPickerOpen((open) => !open)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D5D2E2] bg-white px-2.5 text-sm font-semibold text-[#2D2061]"
                  aria-haspopup="listbox"
                  aria-expanded={pickerOpen}
                >
                  Message {selectedIndex + 1}
                  <ChevronDown
                    className="size-3.5 text-[#8B8B9E]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
                {pickerOpen ? (
                  <ul
                    role="listbox"
                    className="absolute right-0 z-20 mt-1 min-w-[8.5rem] overflow-hidden rounded-lg border border-[#E4E1EE] bg-white py-1 shadow-lg"
                  >
                    {messages.map((message, index) => (
                      <li key={message.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={message.id === selected?.id}
                          className={cn(
                            'flex w-full px-3 py-2 text-left text-sm font-medium',
                            message.id === selected?.id
                              ? 'bg-[#F3F0FF] text-[#2D2061]'
                              : 'text-[#5B6178] hover:bg-[#F7F6FB]',
                          )}
                          onClick={() => {
                            setSelectedMessageId(message.id)
                            setPickerOpen(false)
                          }}
                        >
                          Message {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <EditIconButton
                label="Edit messages"
                onClick={onEditMessages}
              />
            </div>
          </div>

          <MessagePreviewBody
            message={selected}
            messageIndex={selectedIndex}
            device={device}
            onDeviceChange={setDevice}
          />
        </section>
      </div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={labelClass}>{label}</dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  )
}

function EditIconButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-8 items-center justify-center rounded-lg text-[#8B8B9E] transition-colors hover:bg-[#F7F6FB] hover:text-[#2D2061]"
    >
      <Pencil className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
    </button>
  )
}

function MessagePreviewBody({
  message,
  messageIndex,
  device,
  onDeviceChange,
}: {
  message: CampaignSequenceMessage | null
  messageIndex: number
  device: PreviewDevice
  onDeviceChange: (device: PreviewDevice) => void
}) {
  const template = message?.template
  const ruleText = formatCampaignReviewRule(message?.rule ?? null, messageIndex)

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-[#5B6178]">
          <span className="font-semibold text-[#2D2061]">Rule:</span> {ruleText}
        </p>
        <p className="text-xs text-[#5B6178]">
          <span className="font-semibold text-[#2D2061]">Template:</span>{' '}
          {template?.name || 'No template selected'}
        </p>
      </div>

      <div
        className="flex items-center justify-center gap-1"
        role="group"
        aria-label="Preview device"
      >
        {(
          [
            ['mobile', Smartphone, 'Mobile'],
            ['tablet', Tablet, 'Tablet'],
            ['desktop', Monitor, 'Desktop'],
          ] as const
        ).map(([id, Icon, label]) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={device === id}
            onClick={() => onDeviceChange(id)}
            className={cn(
              'inline-flex size-8 items-center justify-center rounded-md transition-colors',
              device === id
                ? 'bg-[#F3F0FF] text-[#2D2061]'
                : 'text-[#A0A0B2] hover:bg-[#F7F6FB] hover:text-[#2D2061]',
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="flex justify-center rounded-xl border border-[#E4E1EE] bg-[#F7F6FB] p-4 sm:p-5">
        <div
          className={cn(
            'w-full overflow-hidden rounded-lg border border-[#E4E1EE] bg-white shadow-sm transition-[max-width]',
            device === 'desktop' && 'max-w-full',
            device === 'tablet' && 'max-w-[28rem]',
            device === 'mobile' && 'max-w-[20rem]',
          )}
        >
          {template ? (
            <article className="px-5 py-6 sm:px-7">
              <div className="mb-5 flex items-center gap-2 border-b border-[#ECEAF3] pb-4">
                <span className="inline-flex size-8 items-center justify-center rounded-md bg-[#2D2061] text-[10px] font-bold tracking-wide text-white">
                  AI
                </span>
                <div>
                  <p className="text-xs font-bold text-[#2D2061]">
                    Recruitment SMART
                  </p>
                  <p className="text-[10px] text-[#8B8B9E]">Talent outreach</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {template.subject}
              </p>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#4A4A5C]">
                {template.body.map((paragraph, index) => (
                  <p key={`${template.id}-p-${index}`}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-5 text-sm text-[#4A4A5C]">
                Best regards,
                <br />
                Talent Acquisition Team
              </p>
            </article>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-[#8B8B9E]">
              Select a template in Messages to preview it here.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
