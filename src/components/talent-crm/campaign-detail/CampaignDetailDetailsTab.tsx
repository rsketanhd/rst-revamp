import { useState } from 'react'
import { ChevronDown, Pencil } from 'lucide-react'
import { cn } from '../../../lib/cn'
import type { CampaignDetail, CampaignDetailMessage } from '../../../data/campaignDetail'
import { toast } from '../../ui'

const TOAST_TITLE = 'Campaigns'
const cardClass =
  'rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:p-5'
const labelClass = 'text-[11px] font-medium text-[#8B8B9E]'
const valueClass = 'mt-0.5 text-sm font-semibold text-[#2D2061]'

export type CampaignDetailDetailsTabProps = {
  detail: CampaignDetail
}

/**
 * Campaign Details tab — summary cards + channel-aware message preview.
 */
export function CampaignDetailDetailsTab({ detail }: CampaignDetailDetailsTabProps) {
  const { campaign } = detail
  const [selectedId, setSelectedId] = useState(detail.messages[0]?.id ?? '')
  const [pickerOpen, setPickerOpen] = useState(false)
  const selectedIndex = Math.max(
    0,
    detail.messages.findIndex((item) => item.id === selectedId),
  )
  const selected =
    detail.messages.find((item) => item.id === selectedId) ??
    detail.messages[0] ??
    null
  const isSms = campaign.channel === 'SMS'

  function editSoon(field: string) {
    toast.success(`${field} editing coming soon.`, { title: TOAST_TITLE })
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="flex min-w-0 flex-col gap-3">
        <section className={cardClass}>
          <h3 className="mb-3 text-sm font-bold text-[#2D2061]">
            Campaign Details
          </h3>
          <dl className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <dt className={labelClass}>Name</dt>
                <dd className={valueClass}>{campaign.name}</dd>
              </div>
              <EditBtn label="Edit name" onClick={() => editSoon('Name')} />
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <dt className={labelClass}>Owner(s)</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {campaign.owners.map((owner) => (
                    <span
                      key={owner}
                      className="inline-flex rounded-full border border-[#E4E1EE] bg-[#F7F6FB] px-2.5 py-1 text-[12px] font-semibold text-[#2D2061]"
                    >
                      {owner}
                    </span>
                  ))}
                </dd>
              </div>
              <EditBtn label="Edit owners" onClick={() => editSoon('Owners')} />
            </div>
            <div>
              <dt className={labelClass}>Channel Type</dt>
              <dd className={valueClass}>{campaign.channel}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-[#ECEAF3] pt-3">
            <p className="text-xs font-semibold text-[#2D2061]">
              Sender Configuration Details
            </p>
            {isSms ? (
              <p className="mt-2 text-sm font-semibold text-[#2D2061]">
                From {detail.fromPhone}
              </p>
            ) : (
              <dl className="mt-2.5 flex flex-col gap-3">
                <Row label="Name" value={detail.senderName} />
                <Row label="From Address" value={detail.fromAddress} />
                <Row label="Reply to Address" value={detail.replyToAddress} />
              </dl>
            )}
          </div>
        </section>

        <section className={cardClass}>
          <h3 className="mb-3 text-sm font-bold text-[#2D2061]">Audience</h3>
          <dl className="flex flex-col gap-3">
            <Row label="Talent Pool" value={campaign.talentPool} />
            <Row
              label="Audience Summary"
              value={String(detail.audienceSummary)}
            />
          </dl>
        </section>

        <section className={cardClass}>
          <h3 className="mb-3 text-sm font-bold text-[#2D2061]">Settings</h3>
          <dl className="flex flex-col gap-3">
            <Row label="When to Send" value={detail.whenToSend} />
            <Row label="Recurrence Interval" value={detail.recurrenceInterval} />
          </dl>
        </section>
      </div>

      <section className={cn(cardClass, 'flex min-w-0 flex-col')}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#2D2061]">Message Preview</h3>
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
                {detail.messages.map((message, index) => (
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
                        setSelectedId(message.id)
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
        </div>

        {selected ? (
          <MessagePreview message={selected} isSms={isSms} />
        ) : (
          <p className="text-sm text-[#8B8B9E]">No messages in this campaign.</p>
        )}
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={labelClass}>{label}</dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  )
}

function EditBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[#8B8B9E] transition-colors hover:bg-[#F7F6FB] hover:text-[#2D2061]"
    >
      <Pencil className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
    </button>
  )
}

function MessagePreview({
  message,
  isSms,
}: {
  message: CampaignDetailMessage
  isSms: boolean
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-[#5B6178]">
          <span className="font-semibold text-[#2D2061]">Rule:</span>{' '}
          {message.rule}
        </p>
        <p className="text-xs text-[#5B6178]">
          <span className="font-semibold text-[#2D2061]">Template:</span>{' '}
          {message.templateName}
        </p>
      </div>

      {isSms ? (
        <div className="flex justify-center py-2">
          <SmsPhoneFrame
            title="Campaign Name"
            date="Monday 14 February 2022"
            text={message.smsText || message.body.join(' ')}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-[#E4E1EE] bg-[#F7F6FB] p-4">
          <article className="overflow-hidden rounded-lg border border-[#E4E1EE] bg-white px-5 py-6 shadow-sm">
            <p className="text-sm font-semibold text-[#1A1A2E]">
              {message.subject}
            </p>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#4A4A5C]">
              {message.body.map((paragraph, index) => (
                <p key={`${message.id}-p-${index}`}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      )}
    </div>
  )
}

function SmsPhoneFrame({
  title,
  date,
  text,
}: {
  title: string
  date: string
  text: string
}) {
  return (
    <div className="w-[17.5rem] overflow-hidden rounded-[1.75rem] border-[6px] border-[#1F1A33] bg-[#F3F2F7] shadow-[0_12px_32px_rgba(31,26,51,0.18)]">
      <div className="flex items-center justify-center bg-[#1F1A33] px-3 pb-2 pt-3">
        <div className="h-1.5 w-16 rounded-full bg-[#3A3454]" />
      </div>
      <div className="border-b border-[#E4E1EE] bg-white px-4 py-3 text-center">
        <p className="text-sm font-bold text-[#2D2061]">{title}</p>
      </div>
      <div className="min-h-[22rem] bg-[#ECEAF3] px-3 py-4">
        <p className="mb-3 text-center text-[10px] font-medium text-[#8B8B9E]">
          {date}
        </p>
        <div className="rounded-2xl rounded-tl-md bg-white px-3.5 py-3 text-[12px] leading-relaxed text-[#2D2061] shadow-sm">
          {text}
        </div>
      </div>
      <div className="flex justify-center bg-white py-2.5">
        <div className="h-1 w-24 rounded-full bg-[#D5D2E2]" />
      </div>
    </div>
  )
}
