import { Download, Eye, Lock, Paperclip } from 'lucide-react'
import type { HubMessage, HubMessageKind } from '../../data/communicationHub'
import { cn } from '../../lib/cn'
import { toast } from '../ui'

export type MessageBubbleProps = {
  message: HubMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        message.kind === 'system' && 'items-center',
      )}
    >
      {message.dateDivider ? <DateDivider label={message.dateDivider} /> : null}
      <MessageContent message={message} />
    </div>
  )
}

function MessageContent({ message }: { message: HubMessage }) {
  switch (message.kind) {
    case 'system':
      return (
        <span className="inline-flex max-w-[90%] items-center rounded-full bg-[#E7F8EE] px-3 py-1.5 text-center text-[12px] font-medium text-[#178A45]">
          {message.body}
        </span>
      )
    case 'candidate':
    case 'recruiter':
    case 'internal':
      return <ChatBubble message={message} kind={message.kind} />
    default: {
      const exhaustive: never = message.kind
      return exhaustive
    }
  }
}

function ChatBubble({
  message,
  kind,
}: {
  message: HubMessage
  kind: Exclude<HubMessageKind, 'system'>
}) {
  const isOutgoing = kind === 'recruiter' || kind === 'internal'

  return (
    <div
      className={cn(
        'flex w-full',
        isOutgoing ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'max-w-[min(92%,28rem)] rounded-2xl px-3 py-2.5 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:px-3.5 sm:py-3',
          bubbleSurfaceClass(kind),
        )}
      >
        <MessageMeta message={message} kind={kind} />

        <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
          {message.body}
        </p>

        {message.attachment ? (
          <AttachmentCard
            name={message.attachment.name}
            sizeLabel={message.attachment.sizeLabel}
            typeLabel={message.attachment.typeLabel}
          />
        ) : null}

        {kind === 'candidate' ? (
          <p className="mt-1.5 text-right text-[11px] text-[#8B8B9E]">
            {message.timestampLabel}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function MessageMeta({
  message,
  kind,
}: {
  message: HubMessage
  kind: Exclude<HubMessageKind, 'system'>
}) {
  switch (kind) {
    case 'internal':
      return (
        <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8A6A12]">
          <Lock className="size-3" strokeWidth={2} aria-hidden="true" />
          Internal note · {message.senderName} · {message.timestampLabel}
        </p>
      )
    case 'recruiter':
      return (
        <p className="mb-1 text-[11px] font-medium text-[#8B8B9E]">
          {message.senderName} · {message.timestampLabel}
        </p>
      )
    case 'candidate':
      return null
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

function bubbleSurfaceClass(kind: Exclude<HubMessageKind, 'system'>): string {
  switch (kind) {
    case 'internal':
      return 'rounded-br-md border border-[#F5E6B8] bg-[#FFF8E7]'
    case 'recruiter':
      return 'rounded-br-md bg-[#EEF0F5] text-[#1A1A2E]'
    case 'candidate':
      return 'rounded-bl-md border border-[#E8E6F0] bg-white text-[#1A1A2E]'
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

function AttachmentCard({
  name,
  sizeLabel,
  typeLabel,
}: {
  name: string
  sizeLabel: string
  typeLabel: string
}) {
  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#E8E6F0] bg-[#F8F7FC] px-3 py-2.5">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2D2061] shadow-sm">
        <Paperclip className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-semibold text-[#1A1A2E]">{name}</p>
        <p className="text-[11px] text-[#8B8B9E]">
          {sizeLabel} · {typeLabel}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`View ${name}`}
          onClick={() =>
            toast.success('Attachment opened', { description: name })
          }
          className="inline-flex size-8 items-center justify-center rounded-md text-[#5C5870] hover:bg-white hover:text-[#2D2061]"
        >
          <Eye className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={`Download ${name}`}
          onClick={() =>
            toast.success('Download started', { description: name })
          }
          className="inline-flex size-8 items-center justify-center rounded-md text-[#5C5870] hover:bg-white hover:text-[#2D2061]"
        >
          <Download className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center gap-3 py-1" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-[#E8E6F0]" />
      <span className="text-[11px] font-medium text-[#8B8B9E]">{label}</span>
      <span className="h-px flex-1 bg-[#E8E6F0]" />
    </div>
  )
}
