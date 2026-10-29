import {
  hubStatusMeta,
  type HubConversation,
} from '../../data/communicationHub'
import { cn } from '../../lib/cn'
import { HubAvatar } from './HubAvatar'

export type ConversationListItemProps = {
  conversation: HubConversation
  selected: boolean
  onSelect: () => void
}

export function ConversationListItem({
  conversation,
  selected,
  onSelect,
}: ConversationListItemProps) {
  const status = hubStatusMeta(conversation.status, conversation.topicCount)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full gap-3 px-3 py-3.5 text-left transition-colors sm:px-4',
        selected
          ? 'bg-[#F5F3FB]'
          : 'bg-transparent hover:bg-[#F8F7FC]',
      )}
    >
      <HubAvatar name={conversation.candidateName} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#1A1A2E]">
              {conversation.candidateName}
            </p>
            <p className="truncate text-[12px] text-[#8B8B9E]">
              {conversation.jobTitle}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="text-[11px] text-[#8B8B9E]">
              {conversation.timestampLabel}
            </span>
            {conversation.unreadCount > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#2D2061] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {conversation.unreadCount}
              </span>
            ) : null}
          </div>
        </div>
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#5C5870]">
          {conversation.preview}
        </p>
        <p
          className={cn(
            'mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium',
            status.className,
          )}
        >
          <span
            className={cn('size-1.5 rounded-full', status.dotClassName)}
            aria-hidden="true"
          />
          {status.label}
        </p>
      </div>
    </button>
  )
}
