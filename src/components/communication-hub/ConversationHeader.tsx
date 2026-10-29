import { ArrowLeft, Plus, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { candidateProfilePath } from '../../data/candidateProfile'
import type { HubConversation } from '../../data/communicationHub'
import { Button, ThreeDotsMenu, toast } from '../ui'
import { HubAvatar } from './HubAvatar'

const OUTLINE_ACTION_CLASS =
  '!h-9 !rounded-md border-[#D5D2E2] px-3 text-[13px] font-semibold text-[#2D2061]'

export type ConversationHeaderProps = {
  conversation: HubConversation
  tagOptions: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  onResolveClose: () => void
  onAssignToMe: () => void
  onMarkUnread: () => void
  onReopen: () => void
  /** WhatsApp-style back to inbox (mobile / tablet). */
  onBack?: () => void
}

export function ConversationHeader({
  conversation,
  tagOptions,
  onAddTag,
  onRemoveTag,
  onResolveClose,
  onAssignToMe,
  onMarkUnread,
  onReopen,
  onBack,
}: ConversationHeaderProps) {
  const navigate = useNavigate()
  const availableTags = tagOptions.filter((tag) => !conversation.tags.includes(tag))
  const isClosed = conversation.status === 'closed'

  const moreItems = [
    {
      id: 'assign',
      label: conversation.assignedTo ? 'Reassign to me' : 'Assign to me',
      onSelect: onAssignToMe,
    },
    {
      id: 'unread',
      label: 'Mark as unread',
      onSelect: onMarkUnread,
    },
    {
      id: 'resolve',
      label: isClosed ? 'Reopen' : 'Resolve & Close',
      onSelect: isClosed ? onReopen : onResolveClose,
    },
    {
      id: 'profile',
      label: 'View profile',
      onSelect: () => navigate(candidateProfilePath(conversation.candidateId)),
    },
    {
      id: 'copy-topic',
      label: 'Copy topic title',
      onSelect: () => {
        void navigator.clipboard?.writeText(conversation.activeTopic)
        toast.success('Topic copied')
      },
    },
  ]

  return (
    <header className="shrink-0 border-b border-[#EEEAF5] bg-white">
      {/* Compact WhatsApp-style bar — mobile / tablet */}
      <div className="flex items-center gap-2 px-2 py-2.5 lg:hidden">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-[#2D2061] hover:bg-[#F4F2F8]"
          >
            <ArrowLeft className="size-5" strokeWidth={2} aria-hidden="true" />
          </button>
        ) : null}
        <HubAvatar name={conversation.candidateName} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-[15px] font-semibold text-[#1A1A2E]">
              {conversation.candidateName}
            </h2>
            {conversation.matchPercent != null ? (
              <span className="shrink-0 rounded-full bg-[#E7F8EE] px-1.5 py-0.5 text-[10px] font-bold text-[#178A45]">
                {conversation.matchPercent}%
              </span>
            ) : null}
          </div>
          <p className="truncate text-[12px] text-[#8B8B9E]">
            {conversation.assignedTo
              ? `Assigned to ${conversation.assignedTo}`
              : 'Unassigned'}
            {' · '}
            {conversation.jobTitle}
          </p>
        </div>
        <ThreeDotsMenu
          triggerLabel={`More actions for ${conversation.candidateName}`}
          side="left"
          align="end"
          items={moreItems}
        />
      </div>

      {/* Full desktop header */}
      <div className="hidden space-y-3 px-4 py-3.5 sm:px-5 lg:block">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <HubAvatar name={conversation.candidateName} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[16px] font-semibold tracking-tight text-[#1A1A2E]">
                  {conversation.candidateName}
                </h2>
                {conversation.matchPercent != null ? (
                  <span className="rounded-full bg-[#E7F8EE] px-2 py-0.5 text-[11px] font-bold text-[#178A45]">
                    {conversation.matchPercent}% match
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-[13px] text-[#5C5870]">
                {conversation.jobTitle}
                {conversation.company ? ` · ${conversation.company}` : ''}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start text-[12px] text-[#5C5870]">
            {conversation.assignedTo ? (
              <>
                <span>
                  Assigned to{' '}
                  <span className="font-semibold text-[#2D2061]">
                    {conversation.assignedTo}
                  </span>
                </span>
                <HubAvatar name={conversation.assignedTo} size="sm" />
              </>
            ) : (
              <span className="rounded-full bg-[#FFF1E6] px-2.5 py-1 text-[11px] font-semibold text-[#C2410C]">
                Unassigned
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TagRow
            tags={conversation.tags}
            availableTags={availableTags}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={isClosed ? onReopen : onResolveClose}
              className={OUTLINE_ACTION_CLASS}
            >
              {isClosed ? 'Reopen' : 'Resolve & Close'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(candidateProfilePath(conversation.candidateId))
              }
              className={OUTLINE_ACTION_CLASS}
            >
              <UserRound className="size-3.5" strokeWidth={2} aria-hidden="true" />
              Profile
            </Button>
            <ThreeDotsMenu
              triggerLabel={`More actions for ${conversation.candidateName}`}
              side="left"
              align="end"
              items={moreItems.filter(
                (item) => item.id !== 'resolve' && item.id !== 'profile',
              )}
            />
          </div>
        </div>
      </div>

      {/* Mobile tags strip */}
      <div className="border-t border-[#F3F1F8] px-3 py-2 lg:hidden">
        <TagRow
          tags={conversation.tags}
          availableTags={availableTags}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      </div>
    </header>
  )
}

function TagRow({
  tags,
  availableTags,
  onAddTag,
  onRemoveTag,
}: {
  tags: string[]
  availableTags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B9E]">
        Tags
      </span>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          title={`Remove ${tag}`}
          onClick={() => onRemoveTag(tag)}
          className="rounded-full bg-[#EEF0F8] px-2.5 py-1 text-[12px] font-medium text-[#2D2061] hover:bg-[#E4E1F2]"
        >
          {tag}
        </button>
      ))}
      {availableTags.length > 0 ? (
        <ThreeDotsMenu
          triggerLabel="Add tag"
          side="right"
          align="start"
          showCaret={false}
          items={availableTags.map((tag) => ({
            id: tag,
            label: tag,
            onSelect: () => onAddTag(tag),
          }))}
          triggerClassName="!size-auto !h-7 !rounded-full !px-2.5 !text-[12px] !font-semibold !text-[#2D2061] hover:!bg-[#F4F2F8]"
        >
          <span className="inline-flex items-center gap-1">
            <Plus className="size-3.5" strokeWidth={2} aria-hidden="true" />
            New Tag
          </span>
        </ThreeDotsMenu>
      ) : null}
    </div>
  )
}
